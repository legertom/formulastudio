# IDM Formula Syntax Guide

IDM (Identity Management) formulas use a logic template system similar to Handlebars but with a specific **Polish Notation (Prefix)** syntax model for logical expressions.

## Core Rules

1.  **Wrapper**: All formulas must be wrapped in double curly braces: `{{ ... }}`.
2.  **No Parentheses**: The syntax does **not** support parentheses `()` for grouping or nesting.
3.  **Prefix Notation**: Functions appear *before* their arguments.
    *   Format: `function arg1 arg2`
    *   Example: `equals a b` (Is `a` equal to `b`?)
4.  **Strict Argument Consumption**: Functions consume a fixed number of arguments (arity). If an argument is itself a function call, the parser evaluates it first (recursively) before passing the result to the parent function.

## Supported Functions

### Logic Control
| Function | Arity | Arguments | Description |
| :--- | :--- | :--- | :--- |
| `if` | 3 | `condition`, `true_val`, `false_val` | Checks `condition`. If true, returns `true_val`, else `false_val`. |
| `equals` | 2 | `val1`, `val2` | Returns `true` if `val1` equals `val2`. |
| `and` | 2 | `val1`, `val2` | Returns `true` if both are truthy. |
| `or` | 2 | `val1`, `val2` | Returns `true` if either is truthy. |
| `not` | 1 | `val` | Inverts boolean value (Implied support). |
| `greater` | 2 | `val1`, `val2` | Returns `true` if `val1 > val2`. |

### String Manipulation
| Function | Arity | Arguments | Description |
| :--- | :--- | :--- | :--- |
| `concat` | 2 | `str1`, `str2` | Joins two strings. |
| `substr` | 3 | `str`, `start`, `len` | Extracts substring. |
| `replace`| 3 | `str`, `find`, `replace` | Replaces occurrences of `find` with `replace`. |
| `len` | 1 | `str` | Returns character count of `str`. |
| `contains`| 2 | `str`, `needle` | Checks if `str` contains `needle`. |
| `ignoreIfNull` | 1 | `val` | Returns `val` if not null, else empty string. |

## Variables & Literals

*   **Variables**: Access JSON fields using dot notation.
    *   `name.first`
    *   `student.graduation_year`
*   **Strings**: Double-quoted text.
    *   `"Admin"`
    *   `"Long name"`
*   **Numbers**: (Implementation dependent, strictly treated as Identifiers or needing quotes in current parser).

## Examples

### Conditional Logic
**Goal**: Return "Business" if title is "SECRETARY", else "Unknown".
```handlebars
{{if equals staff.title "SECRETARY" "Business" "Unknown"}}
```

### Nested Logic (No Parentheses)
**Goal**: If `a == b` return "c", else if `d == e` return "f", else "g".
```handlebars
{{if equals a "b" "c" if equals d "e" "f" "g"}}
```
*How it parses:*
1.  Outer `if` takes 3 args:
    1.  `equals a "b"` (Condition)
    2.  `"c"` (True Branch)
    3.  `if equals d "e" "f" "g"` (False Branch - recursively parsed)

### Length Check (Question 5)
**Goal**: "Long name" if length > 5, else "Short name".
```handlebars
{{if greater len name.first 5 "Long name" "Short name"}}
```
*How it parses:*
1.  `if` takes 3 args:
    1.  `greater len name.first 5` (Condition)
        *   `greater` takes 2 args:
            1.  `len name.first`
            2.  `5`
    2.  `"Long name"` (True Branch)
    3.  `"Short name"` (False Branch)
