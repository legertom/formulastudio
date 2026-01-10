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
const highlightFormula = (code, highlightRange, enableSyntax = true) => {
    if (!code) return '';

    let highlighted = '';
    let i = 0;

    const [hStart, hEnd] = highlightRange || [-1, -1];

    while (i < code.length) {
        // Create helper for range highlighting
        const isHighlighted = i >= hStart && i < hEnd;
        const highlightClass = isHighlighted ? ' range-highlight' : '';

        // Check for formula wrappers {{ }}
        if (enableSyntax && code[i] === '{' && code[i + 1] === '{') {
            highlighted += `<span class="token-wrapper${highlightClass}">{{</span>`;
            i += 2;
            continue;
        }
        if (enableSyntax && code[i] === '}' && code[i + 1] === '}') {
            highlighted += `<span class="token-wrapper${highlightClass}">}}</span>`;
            i += 2;
            continue;
        }

        // Check for strings
        if (enableSyntax && code[i] === '"') {
            let str = '"';
            let strStart = i;
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

            const strHighlighted = strStart >= hStart && strStart < hEnd;
            const strClass = strHighlighted ? ' range-highlight' : '';

            highlighted += `<span class="token-string${strClass}">${escapeHtml(str)}</span>`;
            continue;
        }

        // Check for identifiers/functions
        if (enableSyntax && /[a-zA-Z_]/.test(code[i])) {
            let word = '';
            let wordStart = i;
            while (i < code.length && /[a-zA-Z0-9_.]/.test(code[i])) {
                word += code[i];
                i++;
            }

            const isFunctionName = FUNCTIONS_SET.has(word);
            const wordHighlighted = wordStart >= hStart && wordStart < hEnd;
            const wordClass = wordHighlighted ? ' range-highlight' : '';

            if (isFunctionName) {
                highlighted += `<span class="token-function${wordClass}">${escapeHtml(word)}</span>`;
            } else {
                highlighted += `<span class="token-field${wordClass}">${escapeHtml(word)}</span>`;
            }
            continue;
        }

        // Check for numbers
        if (enableSyntax && /[0-9]/.test(code[i])) {
            let num = '';
            let numStart = i;
            while (i < code.length && /[0-9]/.test(code[i])) {
                num += code[i];
                i++;
            }
            const numHighlighted = numStart >= hStart && numStart < hEnd;
            const numClass = numHighlighted ? ' range-highlight' : '';
            highlighted += `<span class="token-number${numClass}">${num}</span>`;
            continue;
        }

        // Regular character
        const charHighlighted = i >= hStart && i < hEnd;
        if (charHighlighted) {
            highlighted += `<span class="range-highlight">${escapeHtml(code[i])}</span>`;
        } else {
            highlighted += escapeHtml(code[i]);
        }
        i++;
    }

    return highlighted + '\n';
};

const escapeHtml = (text) => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

const resolvePath = (data, path) => {
    if (!data || !path) return undefined;
    const parts = path.split('.');
    let current = data;
    for (const part of parts) {
        if (current === undefined || current === null) return undefined;
        current = current[part];
    }
    return current;
};

const SyntaxHighlightedEditor = ({ value, onChange, placeholder, highlightRange, enableSyntax = true, dataContext = {}, exampleName = 'Example', className = '' }) => {
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
        if (!enableSyntax) return;
        if (!textareaRef.current || !highlightRef.current) return;

        // Use elementsFromPoint to "pierce" through the textarea and find the underlying syntax span
        // We temporarily enable pointer-events on the highlight layer so elementsFromPoint can see it
        highlightRef.current.style.pointerEvents = 'auto';
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        highlightRef.current.style.pointerEvents = 'none';

        const targetSpan = elements.find(el => el.tagName === 'SPAN' && highlightRef.current.contains(el));

        if (!targetSpan) {
            setTooltip(null);
            return;
        }

        const tokenText = targetSpan.textContent;
        const classes = targetSpan.className;
        let tokenType = 'unknown';

        if (classes.includes('token-function')) tokenType = 'function';
        else if (classes.includes('token-field')) tokenType = 'variable';
        else if (classes.includes('token-string')) tokenType = 'string';
        else if (classes.includes('token-number')) tokenType = 'number';
        else {
            setTooltip(null);
            return;
        }

        // Smart Tooltip Positioning
        const viewportWidth = window.innerWidth;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const hThreshold = 250;
        let valX = '-50%';
        if (mouseX < hThreshold) valX = '0%';
        else if (mouseX > viewportWidth - hThreshold) valX = '-100%';

        // Vertical Logic
        const vThreshold = 300;
        const isTop = mouseY < vThreshold;
        let valY = isTop ? '0%' : '-100%';
        let offY = isTop ? '24px' : '-12px';

        const transform = `translate(${valX}, ${valY}) translateY(${offY})`;

        if (tokenType === 'function') {
            const word = tokenText;
            const funcData = FUNCTION_MAP[word];
            if (!funcData) return;

            setTooltip({
                x: e.clientX,
                y: e.clientY,
                transform,
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
        } else if (tokenType === 'variable') {
            // Resolve Type only (don't show value)
            const val = resolvePath(dataContext, tokenText);
            const valType = val === undefined ? 'Unknown' : (typeof val === 'object' ? 'Object' : typeof val);

            setTooltip({
                x: e.clientX,
                y: e.clientY,
                transform,
                content: (
                    <div className="editor-tooltip">
                        <div className="tooltip-header">
                            <span className="tooltip-title" style={{ color: '#60a5fa' }}>{tokenText}</span>
                            <span className="tooltip-arity">Variable</span>
                        </div>
                        <div className="tooltip-section" style={{ flexDirection: 'row', gap: '1rem' }}>
                            <div className="tooltip-label">PART OF SPEECH: <span style={{ color: '#e2e8f0', fontWeight: 400 }}>Variable ({valType})</span></div>
                        </div>
                    </div>
                )
            });
        } else if (tokenType === 'string') {
            const cleanText = tokenText.replace(/^"|"$/g, '');
            setTooltip({
                x: e.clientX,
                y: e.clientY,
                transform,
                content: (
                    <div className="editor-tooltip">
                        <div className="tooltip-header">
                            <span className="tooltip-title" style={{ color: '#fbbf24' }}>String Literal</span>
                        </div>
                        <div className="tooltip-desc">{tokenText}</div>
                        <div className="tooltip-section">
                            <div className="tooltip-label">METADATA</div>
                            <div className="tooltip-row" style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                                Length: {cleanText.length} characters
                            </div>
                        </div>
                    </div>
                )
            });
        } else if (tokenType === 'number') {
            setTooltip({
                x: e.clientX,
                y: e.clientY,
                transform,
                content: (
                    <div className="editor-tooltip">
                        <div className="tooltip-header">
                            <span className="tooltip-title" style={{ color: '#34d399' }}>Number Literal</span>
                        </div>
                        <div className="tooltip-section">
                            <div className="tooltip-label">VALUE</div>
                            <div className="tooltip-code">{tokenText}</div>
                        </div>
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

    const highlightedCode = highlightFormula(value || '', highlightRange, enableSyntax);

    return (
        <div
            className={`syntax-editor-wrapper ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Hidden measurement element - can remove if unnecessary now, but keeping for safety hooks */}
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
                        left: tooltip.x,
                        transform: tooltip.transform
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default SyntaxHighlightedEditor;
