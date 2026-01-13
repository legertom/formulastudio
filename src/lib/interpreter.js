
/**
 * Traceable Interpreter for IDM Formulas.
 * 
 * Unlike the simple evaluator in quizUtils, this one records the input, output, 
 * and execution status of every node in the AST.
 */

// We use a Map to store trace results keyed by the Node object reference.
// This is robust against duplicate ranges or missing IDs.
// Result Format: { value: any, executed: boolean }

export const evaluateAndTrace = (ast, data) => {
    const trace = new Map();
    if (!ast) return { result: "", trace };

    const evalNode = (node) => {
        if (!node) return "";

        // Mark as executed immediately
        // We update the value later
        let result = "";

        // 1. Array (Implicit Concatenation)
        if (Array.isArray(node)) {
            result = node.map(evalNode).join('');
            // Arrays aren't single nodes, so we don't trace the array itself usually,
            // but we could if we wanted to show the "Group" result.
            return result;
        }

        try {
            if (node.type === 'StringLiteral') {
                result = node.value;
            }
            else if (node.type === 'NumberLiteral') { // Parser might not have this yet, but good for future
                result = Number(node.value);
            }
            else if (node.type === 'Identifier') {
                // Handle "dot.notation" and array indexing like "schools[0].name"
                // Also handle "true"/"false"/"null" keywords if they are parsed as Identifiers
                const val = node.value;
                if (val === 'true') result = true;
                else if (val === 'false') result = false;
                else if (val === 'null') result = null;
                else {
                    // Data Lookup with support for array indexing
                    // Parse path: "student.schools[0].name" -> ["student", "schools", 0, "name"]
                    const segments = [];
                    const pathParts = val.split('.');

                    for (const part of pathParts) {
                        // Check if part contains array indexing like "schools[0]"
                        const bracketMatch = part.match(/^([a-zA-Z_][a-zA-Z0-9_]*)(\[(\d+)\])?$/);
                        if (bracketMatch) {
                            segments.push(bracketMatch[1]); // property name
                            if (bracketMatch[3] !== undefined) {
                                segments.push(parseInt(bracketMatch[3], 10)); // array index
                            }
                        } else {
                            segments.push(part);
                        }
                    }

                    let current = data;
                    for (let i = 0; i < segments.length; i++) {
                        const key = segments[i];
                        if (current === null || current === undefined) {
                            throw new Error(`Cannot access property '${key}' of ${current}`);
                        }
                        if (typeof key === 'number') {
                            // Array index access
                            if (!Array.isArray(current)) {
                                throw new Error(`Cannot use index [${key}] on non-array`);
                            }
                            if (key >= current.length) {
                                throw new Error(`Array index [${key}] out of bounds (length: ${current.length})`);
                            }
                            current = current[key];
                        } else {
                            // Property access
                            if (!(key in current)) {
                                const pathSoFar = segments.slice(0, i + 1).map(s => typeof s === 'number' ? `[${s}]` : s).join('.');
                                throw new Error(`Field '${pathSoFar}' does not exist in data`);
                            }
                            current = current[key];
                        }
                    }

                    result = current ?? "";
                }
            }
            else if (node.type === 'CallExpression') {
                const funcName = node.name.toLowerCase();
                const args = node.arguments;

                // SPECIAL HANDLING FOR CONTROL FLOW (IF)
                // We only evaluate the branch that runs!
                if (funcName === 'if') {
                    const condition = evalNode(args[0]);

                    // Mark condition as executed (already done inside recursive call)

                    if (condition) {
                        result = evalNode(args[1]);
                        // The else branch (args[2]) is NOT called, so it won't be in the trace map!
                        // This allows the UI to dim it as "Unexecuted".
                    } else {
                        result = evalNode(args[2]);
                    }
                }
                // SPECIAL HANDLING FOR ignoreIfNull
                // We need to catch errors from missing fields
                else if (funcName === 'ignoreifnull') {
                    try {
                        result = evalNode(args[0]);
                    } catch (error) {
                        // Field doesn't exist - return empty string
                        result = "";
                    }
                }
                // SPECIAL HANDLING FOR forEach
                // forEach "varName" list logicExpression
                else if (funcName === 'foreach') {
                    // args[0] = variable name (StringLiteral)
                    // args[1] = list path (Identifier)
                    // args[2] = logic to evaluate for each item (any expression)

                    const varName = args[0]?.value || 'item';
                    const listValue = evalNode(args[1]); // Evaluate the list path

                    if (!Array.isArray(listValue)) {
                        throw new Error(`forEach expects an array, got: ${typeof listValue}`);
                    }

                    // For each item in the list, we need to evaluate args[2] with the loop variable bound
                    const results = [];
                    for (const item of listValue) {
                        // Create a modified data context with the loop variable
                        // We need to recursively evaluate args[2] with item bound to varName
                        // This requires a modified evalNode that has access to the loop variable

                        // Simple approach: temporarily add the variable to data
                        const originalValue = data[varName];
                        data[varName] = item;

                        try {
                            const itemResult = evalNode(args[2]);
                            results.push(String(itemResult));
                        } finally {
                            // Restore original value (or delete if it wasn't there)
                            if (originalValue === undefined) {
                                delete data[varName];
                            } else {
                                data[varName] = originalValue;
                            }
                        }
                    }

                    result = results.join('');
                }
                else if (funcName === 'switch') {
                    // TODO: Implement switch tracing if needed
                    // stick to standard eval for now to avoid complexity
                    const evaluatedArgs = args.map(evalNode);
                    // ... switch implementation ... 
                    // actually, let's keep it simple and just eval all args for non-IF functions for now
                    // because standard functions evaluate all arguments.
                }
                else {
                    // Standard Functions (Eager Evaluation)
                    const evalArgs = args.map(evalNode);

                    switch (funcName) {
                        // String Ops
                        case 'concat': result = evalArgs.join(''); break;
                        case 'upper': result = String(evalArgs[0]).toUpperCase(); break;
                        case 'lower': result = String(evalArgs[0]).toLowerCase(); break;
                        case 'length': result = String(evalArgs[0]).length; break;
                        case 'contains': result = String(evalArgs[0]).includes(String(evalArgs[1])); break;
                        case 'replace': result = String(evalArgs[0]).replaceAll(String(evalArgs[1]), String(evalArgs[2])); break;
                        case 'substr': result = String(evalArgs[0]).substring(Number(evalArgs[1]), Number(evalArgs[2])); break;
                        case 'trim': result = String(evalArgs[0]).trim(); break;
                        case 'trimleft': result = String(evalArgs[0]).trimStart(); break; // Added trimLeft

                        // Logic Ops
                        case 'equals': result = evalArgs[0] == evalArgs[1]; break; // Loose equality for "5" == 5 ease
                        case 'greater': result = Number(evalArgs[0]) > Number(evalArgs[1]); break;
                        case 'less': result = Number(evalArgs[0]) < Number(evalArgs[1]); break;
                        case 'geq': result = Number(evalArgs[0]) >= Number(evalArgs[1]); break; // Greater or Equal
                        case 'leq': result = Number(evalArgs[0]) <= Number(evalArgs[1]); break; // Less or Equal
                        case 'and': result = evalArgs[0] && evalArgs[1]; break; // JS short-circuits, but we eval'd eagerness above.
                        case 'or': result = evalArgs[0] || evalArgs[1]; break;
                        case 'in': result = String(evalArgs[1]).split(' ').includes(String(evalArgs[0])); break; // Check if arg0 is IN list (space separated)
                        case 'not': result = !evalArgs[0]; break;

                        // Math
                        case 'add': result = Number(evalArgs[0]) + Number(evalArgs[1]); break;
                        case 'subtract': result = Number(evalArgs[0]) - Number(evalArgs[1]); break;

                        // Advanced String Ops (Chapter 7 & 9 & 10)
                        case 'delimitercapitalize': {
                            // Capitalize first letter of words separated by space or hyphen
                            result = String(evalArgs[0]).replace(/(^|[\s-])\S/g, match => match.toUpperCase());
                            break;
                        }
                        case 'alphanumeric': {
                            // Check if string contains only letters and numbers
                            result = /^[a-z0-9]+$/i.test(String(evalArgs[0]));
                            break;
                        }
                        case 'initials': {
                            // "Tom Leger" -> "TL"
                            // "Mary-Anne" -> "MA" (if we treat hyphen as separator)
                            // Simple version: split by space, take first char
                            result = String(evalArgs[0]).split(' ').map(w => w[0] || '').join('').toUpperCase();
                            break;
                        }
                        case 'tolower': result = String(evalArgs[0]).toLowerCase(); break;
                        case 'toupper': result = String(evalArgs[0]).toUpperCase(); break;
                        case 'textbefore': {
                            const h = String(evalArgs[0]);
                            const n = String(evalArgs[1]);
                            const i = h.indexOf(n);
                            result = i === -1 ? h : h.substring(0, i);
                            break;
                        }
                        case 'textafter': {
                            const h = String(evalArgs[0]);
                            const n = String(evalArgs[1]);
                            const i = h.indexOf(n);
                            result = i === -1 ? "" : h.substring(i + n.length);
                            break;
                        }
                        case 'textafterlast': {
                            const h = String(evalArgs[0]);
                            const n = String(evalArgs[1]);
                            const i = h.lastIndexOf(n);
                            result = i === -1 ? "" : h.substring(i + n.length);
                            break;
                        }
                        case 'formatdate': {
                            const date = new Date(String(evalArgs[0]));
                            if (isNaN(date.getTime())) {
                                result = "Invalid Date";
                            } else {
                                let fmt = String(evalArgs[1]);
                                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                const day = date.getDate(); // 1-31 (using local time as simple ISO parsing usually implies generic dates here)
                                // Note: new Date("2023-12-21") is UTC. new Date("2023-12-21T00:00") is Local.
                                // If input is "2023-12-21", it is treated as UTC? in JS `new Date("YYYY-MM-DD")` is UTC.
                                // But `getDate()` uses local timezone. This might cause "Dec 20th" depending on timezone.
                                // FIX: Use getUTCDate() family methods for "YYYY-MM-DD" strings to be safe with off-by-one.
                                const uDay = date.getUTCDate();
                                const uMonth = date.getUTCMonth();
                                const uYear = date.getUTCFullYear();

                                let suffix = "th";
                                if (uDay % 10 === 1 && uDay !== 11) suffix = "st";
                                else if (uDay % 10 === 2 && uDay !== 12) suffix = "nd";
                                else if (uDay % 10 === 3 && uDay !== 13) suffix = "rd";

                                result = fmt
                                    .replaceAll("YYYY", uYear)
                                    .replaceAll("MMM", months[uMonth])
                                    .replaceAll("Do", uDay + suffix)
                                    .replaceAll("DD", String(uDay).padStart(2, '0'))
                                    .replaceAll("MM", String(uMonth + 1).padStart(2, '0'));
                            }
                            break;
                        }

                        default: result = "";
                    }
                }
            }
        } catch (e) {
            // Re-throw the error so functions like ignoreIfNull can catch it
            throw e;
        }

        // RECORD TRACE
        trace.set(node, { value: result, executed: true });
        return result;
    };

    const finalResult = evalNode(ast);
    return { result: finalResult, trace };
};
