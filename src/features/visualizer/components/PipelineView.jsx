import React from 'react';

/**
 * PipelineView - Shows formula as a top-to-bottom step-by-step flow
 * Instead of nested boxes, this "unrolls" the evaluation into readable steps
 */
const PipelineView = ({ ast, traceMap, onHoverNode }) => {
    if (!ast) return null;

    // Unroll nested function calls into a flat pipeline
    const unrollPipeline = (node, depth = 0) => {
        const steps = [];

        if (node.type === 'CallExpression') {
            // First, check if the first argument is also a function call (chained)
            const firstArg = node.arguments[0];
            if (firstArg?.type === 'CallExpression') {
                // Recursively unroll the nested call first
                steps.push(...unrollPipeline(firstArg, depth + 1));
            }

            // Add this function as a step
            steps.push({
                node,
                funcName: node.name,
                depth,
                // For display purposes, get the "input" - either the first arg's result or the field
                input: firstArg,
                // Additional arguments (for replace: find/replace, for if: conditions, etc.)
                extraArgs: node.arguments.slice(1)
            });
        }

        return steps;
    };

    // Get the pipeline steps
    const steps = unrollPipeline(ast);

    // Find the root input (the deepest identifier/string)
    const findRootInput = (node) => {
        if (node.type === 'Identifier' || node.type === 'StringLiteral') {
            return node;
        }
        if (node.type === 'CallExpression' && node.arguments[0]) {
            return findRootInput(node.arguments[0]);
        }
        return null;
    };

    const rootInput = findRootInput(ast);
    const rootInputTrace = traceMap?.get(rootInput);

    // Get trace helper
    const getTraceValue = (node) => {
        const trace = traceMap?.get(node);
        return trace?.value;
    };

    // Hover handlers
    const handleHover = (node) => (e) => {
        e.stopPropagation();
        if (node?.range && onHoverNode) onHoverNode(node.range);
    };
    const handleLeave = () => onHoverNode?.(null);

    // Render a single step
    const renderStep = (step, index, isLast) => {
        const { node, funcName } = step;
        const result = getTraceValue(node);
        const funcLower = funcName.toLowerCase();

        // Color based on function type
        let color = 'var(--primary)';
        if (['tolower', 'lower', 'toupper', 'upper', 'trim', 'initials'].includes(funcLower)) {
            color = '#60a5fa'; // blue for text transforms
        } else if (['replace'].includes(funcLower)) {
            color = '#a78bfa'; // purple for replace
        } else if (['if'].includes(funcLower)) {
            color = '#fbbf24'; // yellow for conditionals
        } else if (['in', 'equals', 'contains'].includes(funcLower)) {
            color = '#4ade80'; // green for comparisons
        }

        // Format the step description
        let description = funcName;
        if (funcLower === 'replace' && step.extraArgs.length >= 2) {
            const find = step.extraArgs[0]?.value || '?';
            const replace = step.extraArgs[1]?.value || '?';
            description = `replace "${find}" → "${replace}"`;
        } else if (['tolower', 'lower'].includes(funcLower)) {
            description = 'toLower (make lowercase)';
        } else if (['toupper', 'upper'].includes(funcLower)) {
            description = 'toUpper (MAKE UPPERCASE)';
        } else if (funcLower === 'trim') {
            description = 'trim (remove extra spaces)';
        }

        let resultDisplay = result !== undefined ? String(result) : '?';
        if (resultDisplay.length > 40) resultDisplay = resultDisplay.substring(0, 37) + '...';
        if (result === true) resultDisplay = 'true';
        if (result === false) resultDisplay = 'false';

        return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Step card */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                    onMouseEnter={handleHover(node)}
                    onMouseLeave={handleLeave}
                >
                    {/* Step number */}
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1.5rem',
                        height: '1.5rem',
                        borderRadius: '50%',
                        background: `${color}22`,
                        border: `1px solid ${color}`,
                        color: color,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        flexShrink: 0
                    }}>
                        {index + 1}
                    </span>

                    {/* Function description */}
                    <span style={{
                        color: color,
                        fontWeight: 600,
                        flex: 1
                    }}>
                        {description}
                    </span>

                    {/* Result */}
                    <span style={{
                        padding: '0.2rem 0.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono, monospace)',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        "{resultDisplay}"
                    </span>
                </div>

                {/* Arrow to next step */}
                {!isLast && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '1.5rem',
                        color: 'var(--text-muted)'
                    }}>
                        ↓
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="pipeline-view" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.9rem'
        }}>
            {/* Start: Show the root input */}
            {rootInput && (
                <>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(125, 211, 252, 0.1)',
                            border: '1px solid rgba(125, 211, 252, 0.3)',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={handleHover(rootInput)}
                        onMouseLeave={handleLeave}
                    >
                        <span style={{
                            color: '#7dd3fc',
                            fontWeight: 600
                        }}>
                            {rootInput.type === 'Identifier' ? rootInput.value : `"${rootInput.value}"`}
                        </span>
                        {rootInputTrace?.value !== undefined && (
                            <>
                                <span style={{ color: 'var(--text-muted)' }}>=</span>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    "{String(rootInputTrace.value)}"
                                </span>
                            </>
                        )}
                    </div>
                    {steps.length > 0 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '1.5rem',
                            color: 'var(--text-muted)'
                        }}>
                            ↓
                        </div>
                    )}
                </>
            )}

            {/* Pipeline steps */}
            {steps.map((step, i) => renderStep(step, i, i === steps.length - 1))}

            {/* Final result */}
            {steps.length > 0 && (
                <>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '1.5rem',
                        color: 'var(--text-muted)'
                    }}>
                        ↓
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.6rem 1rem',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        borderRadius: '8px',
                        color: '#4ade80',
                        fontWeight: 600,
                        fontSize: '1rem'
                    }}>
                        Final Result: "{String(getTraceValue(ast) ?? '?')}"
                    </div>
                </>
            )}
        </div>
    );
};

export default PipelineView;
