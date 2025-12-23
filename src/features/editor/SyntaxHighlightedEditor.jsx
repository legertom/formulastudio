import React, { useRef, useEffect, useState, useMemo } from 'react';
import './SyntaxHighlightedEditor.css';
import { TEXT_TRANSFORM_OPS } from '../docs/data/textTransform';
import { TEXT_EXTRACTION_OPS } from '../docs/data/textExtraction';
import { SEARCH_REPLACE_OPS } from '../docs/data/searchReplace';
import { LOGIC_OPS } from '../docs/data/logic';
import { MATH_DATE_OPS } from '../docs/data/mathDate';
import { UTILITY_OPS } from '../docs/data/utility';

const ALL_DOCS = [
    ...TEXT_TRANSFORM_OPS,
    ...TEXT_EXTRACTION_OPS,
    ...SEARCH_REPLACE_OPS,
    ...LOGIC_OPS,
    ...MATH_DATE_OPS,
    ...UTILITY_OPS
];

const FUNCTION_MAP = ALL_DOCS.reduce((acc, fn) => {
    acc[fn.name] = fn;
    return acc;
}, {});

const FUNCTIONS_SET = new Set(Object.keys(FUNCTION_MAP));

/**
 * Syntax highlighter for IDM formulas
 * Highlights: {{ }}, strings, function names, field identifiers
 */
const highlightFormula = (code) => {
    if (!code) return '';

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

            const isFunctionName = FUNCTIONS_SET.has(word);

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
    const measureRef = useRef(null);
    const [tooltip, setTooltip] = useState(null);

    // Sync scroll between textarea and highlight layer
    const handleScroll = () => {
        if (textareaRef.current && highlightRef.current) {
            highlightRef.current.scrollTop = textareaRef.current.scrollTop;
            highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
            setTooltip(null); // Hide tooltip on scroll
        }
    };

    useEffect(() => {
        handleScroll();
    }, [value]);

    const handleMouseMove = (e) => {
        if (!textareaRef.current || !measureRef.current) return;

        // Measure char size
        const charWidth = measureRef.current.getBoundingClientRect().width;
        // Assume Line height is roughly 1.6 * 19.2 (1.2rem * 16px base)
        // Better: measure a "line" div. But for now, let's use computed style or approximate.
        const style = window.getComputedStyle(textareaRef.current);
        const lineHeight = parseFloat(style.lineHeight) || (parseFloat(style.fontSize) * 1.6);
        const padding = parseFloat(style.paddingLeft); // 1.5rem ~ 24px

        // Get mouse pos relative to text content area (ignoring padding for now if we subtract it)
        const rect = textareaRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - padding + textareaRef.current.scrollLeft;
        const y = e.clientY - rect.top - padding + textareaRef.current.scrollTop;

        if (x < 0 || y < 0) {
            setTooltip(null);
            return;
        }

        const col = Math.floor(x / charWidth);
        const row = Math.floor(y / lineHeight);

        // Map row/col to token
        // Use a simple scanner again? Or split lines?
        // Let's split lines.
        const lines = (value || '').split('\n');
        if (row >= lines.length) {
            setTooltip(null);
            return;
        }

        const line = lines[row];
        if (col >= line.length) {
            setTooltip(null);
            return;
        }

        // Find word at col
        // Scan backwards
        let start = col;
        while (start > 0 && /[a-zA-Z0-9_.]/.test(line[start - 1])) {
            start--;
        }
        // Scan forwards
        let end = col;
        while (end < line.length && /[a-zA-Z0-9_.]/.test(line[end])) {
            end++;
        }

        const word = line.slice(start, end);
        if (FUNCTIONS_SET.has(word)) {
            const funcData = FUNCTION_MAP[word];
            // Format arguments
            const argsText = funcData.args.map(a => `${a.name}${a.type ? ': ' + a.type : ''}`).join(', ');

            setTooltip({
                x: e.clientX,
                y: e.clientY - 20, // Slightly closer to cursor
                content: (
                    <div className="editor-tooltip">
                        <div className="tooltip-header">
                            <span className="tooltip-title">{funcData.name}</span>
                            <span className="tooltip-arity">({funcData.arity} arguments)</span>
                        </div>

                        <div className="tooltip-desc">{funcData.desc}</div>

                        <div className="tooltip-section">
                            <div className="tooltip-label">SYNTAX</div>
                            <div className="tooltip-code">{funcData.syntax}</div>
                        </div>

                        {funcData.args && funcData.args.length > 0 && (
                            <div className="tooltip-section">
                                <div className="tooltip-label">ARGUMENTS</div>
                                <div className="tooltip-args">
                                    {funcData.args.map((arg, i) => (
                                        <div key={i} className="tooltip-arg-row">
                                            <span className="tooltip-arg-tag">{arg.name}</span>
                                            <span className="tooltip-arg-desc">{arg.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            });
        } else {
            setTooltip(null);
        }
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    const highlightedCode = highlightFormula(value || '');

    return (
        <div
            className={`syntax-editor-wrapper ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Hidden measurement element */}
            <span ref={measureRef} className="measurement-char" aria-hidden="true" style={{
                position: 'absolute',
                visibility: 'hidden',
                zIndex: -1,
                fontFamily: 'var(--font-mono)',
                fontSize: '1.2rem'
            }}>M</span>

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

            {tooltip && (
                <div
                    className="syntax-tooltip"
                    style={{
                        top: tooltip.y,
                        left: tooltip.x
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default SyntaxHighlightedEditor;
