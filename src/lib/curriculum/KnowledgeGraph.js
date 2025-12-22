/**
 * The Knowledge Graph
 * 
 * Defines the universe of concepts and their dependencies.
 * Used by the Curriculum Architect to build learning paths.
 */

export const conceptGraph = {
    // --- FUNDAMENTALS ---
    "wrapper": {
        title: "The Formula Wrapper",
        description: "The double curly braces {{ }} that wrap all code.",
        dependencies: []
    },
    "string_literal": {
        title: "String Literals",
        description: "Text wrapped in double quotes.",
        dependencies: ["wrapper"]
    },
    "number_literal": {
        title: "Numbers",
        description: "Digits, which IDM treats as text.",
        dependencies: ["wrapper"]
    },
    "dot_notation": {
        title: "Dot Notation",
        description: "Accessing data properties (e.g., name.first).",
        dependencies: ["wrapper"]
    },
    "function_basics": {
        title: "Function Basics",
        description: "Using 'verbs' to transform data.",
        dependencies: ["string_literal"]
    },

    // --- ARITY CONCEPTS ---
    "arity_1": {
        title: "Concept: Arity 1",
        description: "Functions that take exactly one input.",
        dependencies: ["function_basics"]
    },
    "arity_2": {
        title: "Concept: Arity 2",
        description: "Functions that take exactly two inputs.",
        dependencies: ["function_basics"]
    },
    "arity_3": {
        title: "Concept: Arity 3",
        description: "Functions that take exactly three inputs.",
        dependencies: ["function_basics"]
    },

    // --- STRING FUNCTIONS (BASIC) ---
    "toUpper": {
        title: "toUpper",
        description: "Converts text to Uppercase.",
        dependencies: ["arity_1", "string_literal"]
    },
    "toLower": {
        title: "toLower",
        description: "Converts text to Lowercase.",
        dependencies: ["arity_1", "string_literal"]
    },
    "len": {
        title: "len",
        description: "Counts characters.",
        dependencies: ["arity_1"]
    },
    "concat": {
        title: "concat",
        description: "Joins two strings together.",
        dependencies: ["arity_2", "string_literal"]
    },
    "initials": {
        title: "initials",
        description: "Extracts first letter of words.",
        dependencies: ["arity_1", "toUpper"]
    },

    // --- STRING FUNCTIONS (ADVANCED) ---
    "substr": {
        title: "substr",
        description: "Extracts a portion of text by position.",
        dependencies: ["arity_3", "number_literal"]
    },
    "replace": {
        title: "replace",
        description: "Swaps one piece of text for another.",
        dependencies: ["arity_3", "string_literal"]
    },
    "trimLeft": {
        title: "trimLeft",
        description: "Removes leading whitespace.",
        dependencies: ["arity_1"]
    },
    "alphanumeric": {
        title: "alphanumeric",
        description: "Removes special characters.",
        dependencies: ["arity_1"]
    },
    "ignoreIfNull": {
        title: "ignoreIfNull",
        description: "Safely accesses a field, returning empty string if missing.",
        dependencies: ["arity_1", "dot_notation"]
    },
    "textBefore": {
        title: "textBefore",
        description: "Extracts text occurring before a delimiter.",
        dependencies: ["arity_2", "string_literal"]
    },
    "textAfter": {
        title: "textAfter",
        description: "Extracts text occurring after a delimiter.",
        dependencies: ["arity_2", "string_literal"]
    },
    "textAfterLast": {
        title: "textAfterLast",
        description: "Extracts text after the last occurrence of a delimiter.",
        dependencies: ["arity_2", "string_literal"]
    },
    "formatDate": {
        title: "formatDate",
        description: "Formats a date string into a specific layout.",
        dependencies: ["arity_2", "string_literal"]
    },

    // --- MATH & DATES ---
    "add": {
        title: "add",
        description: "Adds two numbers together.",
        dependencies: ["arity_2", "number_literal"]
    },
    "subtract": {
        title: "subtract",
        description: "Subtracts number B from number A.",
        dependencies: ["arity_2", "number_literal"]
    },
    // --- LOGIC (THE GAP) ---
    "boolean_logic": {
        title: "Concept: Boolean Logic",
        description: "True/False values.",
        dependencies: ["function_basics"]
    },
    "equals": {
        title: "equals",
        description: "Checks if two values are identical.",
        dependencies: ["arity_2", "boolean_logic"]
    },
    "greater": {
        title: "greater",
        description: "Checks if A > B.",
        dependencies: ["arity_2", "number_literal", "boolean_logic"]
    },
    "less": {
        title: "less",
        description: "Checks if A < B.",
        dependencies: ["arity_2", "number_literal", "boolean_logic"]
    },
    "geq": {
        title: "geq",
        description: "Checks if A >= B.",
        dependencies: ["arity_2", "number_literal", "boolean_logic"]
    },
    "leq": {
        title: "leq",
        description: "Checks if A <= B.",
        dependencies: ["arity_2", "number_literal", "boolean_logic"]
    },
    "if": {
        title: "if",
        description: "Conditional logic: If X, then Y, else Z.",
        dependencies: ["arity_3", "boolean_logic"]
    },
    // --- ADVANCED LOGIC (CHAPTER 6) ---
    "and": {
        title: "and",
        description: "Returns true if BOTH are true.",
        dependencies: ["arity_2", "boolean_logic"]
    },
    "or": {
        title: "or",
        description: "Returns true if EITHER is true.",
        dependencies: ["arity_2", "boolean_logic"]
    },
    "not": {
        title: "not",
        description: "Inverts a boolean value.",
        dependencies: ["arity_1", "boolean_logic"]
    },
    "contains": {
        title: "contains",
        description: "Checks if a string has a substring.",
        dependencies: ["arity_2", "boolean_logic"] // Returns boolean
    }
};

/**
 * Returns true if the function exists in the graph.
 */
export const isKnownConcept = (key) => !!conceptGraph[key];
