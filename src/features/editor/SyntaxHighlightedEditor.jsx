import React, { useRef, useEffect } from 'react';
import './SyntaxHighlightedEditor.css';

/**
 * Syntax highlighter for IDM formulas
 * Highlights: {{ }}, strings, function names, field identifiers
 */
const highlightFormula = (code) => {
    if (!code) return '';

    // All documented IDM functions from /docs
    const functions = new Set([
        // Text Transform
        'toLower', 'toUpper', 'substr', 'alphanumeric', 'initials', 'trimLeft', 'delimiterCapitalize',
        // Text Extraction
        'textBefore', 'textAfter', 'textAfterLast',
        // Search & Replace
        'replace',
        // Math & Dates
        'add', 'subtract', 'formatDate',
        // Logic
        'if', 'equals', 'greater', 'less', 'geq', 'leq', 'contains', 'in', 'not', 'and', 'or',
        // Utilities
        'concat', 'ignoreIfNull', 'len'
    ]);

    let highlighted = '';
    let i = 0;

    while (i < code.length) {
        // Check for formula wrappers {{ }}
        if (code[i] === '{' && code[i + 1] === '{') {
            highlighted += '<span class="token-wrapper">{{</span>';
            i += 2;
            continue;
        }
        if (code[i] === '}' && code[i + 1] === '}') {
            highlighted += '<span class="token-wrapper">}}</span>';
            i += 2;
            continue;
        }

        // Check for strings
        if (code[i] === '"') {
            let str = '"';
            i++;
            while (i < code.length && code[i] !== '"') {
                if (code[i] === '\\' && i + 1 < code.length) {
                    str += code[i] + code[i + 1];
                    i += 2;
                } else {
                    str += code[i];
                    i++;
                }
            }
            if (i < code.length) {
                str += '"';
                i++;
            }
            highlighted += `<span class="token-string">${escapeHtml(str)}</span>`;
            continue;
        }

        // Check for identifiers/functions
        if (/[a-zA-Z_]/.test(code[i])) {
            let word = '';
            while (i < code.length && /[a-zA-Z0-9_.]/.test(code[i])) {
                word += code[i];
                i++;
            }

            const isFunctionName = functions.has(word);

            if (isFunctionName) {
                highlighted += `<span class="token-function">${escapeHtml(word)}</span>`;
            } else {
                highlighted += `<span class="token-field">${escapeHtml(word)}</span>`;
            }
            continue;
        }

        // Check for numbers
        if (/[0-9]/.test(code[i])) {
            let num = '';
            while (i < code.length && /[0-9]/.test(code[i])) {
                num += code[i];
                i++;
            }
            highlighted += `<span class="token-number">${num}</span>`;
            continue;
        }

        // Regular character - escape and add directly
        highlighted += escapeHtml(code[i]);
        i++;
    }

    // Add a trailing newline to match textarea behavior
    return highlighted + '\n';
};

const escapeHtml = (text) => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

const SyntaxHighlightedEditor = ({ value, onChange, placeholder, className = '' }) => {
    const textareaRef = useRef(null);
    const highlightRef = useRef(null);

    // Sync scroll between textarea and highlight layer
    const handleScroll = () => {
        if (textareaRef.current && highlightRef.current) {
            highlightRef.current.scrollTop = textareaRef.current.scrollTop;
            highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    useEffect(() => {
        handleScroll();
    }, [value]);

    const highlightedCode = highlightFormula(value || '');

    return (
        <div className={`syntax-editor-wrapper ${className}`}>
            {/* Highlighted background layer - using div instead of pre/code */}
            <div
                ref={highlightRef}
                className="syntax-highlight-layer"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />

            {/* Actual editable textarea */}
            <textarea
                ref={textareaRef}
                className="syntax-editor-input"
                value={value}
                onChange={onChange}
                onScroll={handleScroll}
                spellCheck="false"
                placeholder={placeholder}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
            />
        </div>
    );
};

export default SyntaxHighlightedEditor;
