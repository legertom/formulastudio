import React, { useRef, useEffect } from 'react';
import { tokenize } from '../../lib/parser';

export default function LogicEditor({ value, onChange, highlightRange, placeholder, showSyntax = false, className = '' }) {
    const textareaRef = useRef(null);
    const backdropRef = useRef(null);

    // Sync scroll
    const handleScroll = (e) => {
        if (backdropRef.current) {
            backdropRef.current.scrollTop = e.target.scrollTop;
            backdropRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    // Construct highlighted content
    const renderBackdrop = () => {
        // Highlighting Logic
        const children = [];
        let currentIdx = 0;

        // Optimized Tokenization for Syntax Highlighting
        // We only tokenize if the toggle is ON
        if (showSyntax) {
            try {
                const tokens = tokenize(value);
                // We must fill gaps between tokens (whitespace)
                for (const token of tokens) {
                    if (token.start > currentIdx) {
                        children.push(<span key={currentIdx} className="syntax-plain">{value.substring(currentIdx, token.start)}</span>);
                    }

                    let className = 'syntax-plain';
                    if (token.type === 'StringLiteral') className = 'syntax-string';
                    else if (token.type === 'NumberLiteral') className = 'syntax-number';
                    else if (token.type === 'Identifier') className = 'syntax-ident';
                    else if (token.type === 'CallExpression') className = 'syntax-keyword'; // Parser calls them Identifiers until parsed, but tokenizer distinguishes?
                    // Actually tokenizer just emits IDENT, STRING, NUMBER, PAREN, BRACE.
                    // We need to guess simple keywords if we want better highlighting without full parsing.
                    // Tokenizer produced: { type, value, start, end }

                    if (token.type === 'Identifier') {
                        if (['if', 'and', 'or', 'not', 'equals', 'greater', 'less', 'contains', 'concat', 'substr', 'len', 'forEach'].includes(token.value)) {
                            className = 'syntax-keyword';
                        } else if (['true', 'false', 'null'].includes(token.value.toLowerCase())) {
                            className = 'syntax-bool';
                        }
                    }

                    // Check for Hover Highlight intersection
                    let style = {};
                    if (highlightRange) {
                        const [hStart, hEnd] = highlightRange;
                        // Simple overlay check: if token is inside range
                        if (token.start >= hStart && token.end <= hEnd) {
                            style.backgroundColor = 'rgba(234, 179, 8, 0.2)';
                        }
                    }

                    children.push(<span key={token.start} className={className} style={style}>{value.substring(token.start, token.end)}</span>);
                    currentIdx = token.end;
                }
            } catch (e) {
                // If tokenization fails (invalid syntax), fall back to plain text
                // or just render what we have
            }
        }

        // Render remaining text (or all text if syntax off/failed)
        if (children.length === 0) {
            if (highlightRange) {
                const [start, end] = highlightRange;
                const validStart = Math.max(0, Math.min(start, value.length));
                const validEnd = Math.max(validStart, Math.min(end, value.length));
                return (
                    <div className="editor-text-layer">
                        {value.substring(0, validStart)}
                        <span className="editor-highlight">{value.substring(validStart, validEnd)}</span>
                        {value.substring(validEnd)}
                        {value.endsWith('\n') && <br />}
                    </div>
                );
            }
            return <div className="editor-text-layer">{value}{value.endsWith('\n') && <br />}</div>;
        }

        // Append tail
        if (currentIdx < value.length) {
            children.push(<span key={currentIdx}>{value.substring(currentIdx)}</span>);
        }

        // Add newline support
        if (value.endsWith('\n')) {
            children.push(<br key="eof-br" />);
        }

        return <div className="editor-text-layer">{children}</div>;
    };

    return (
        <div className={`logic-editor-container ${className}`}>
            <div className="backdrop" ref={backdropRef} aria-hidden="true">
                {renderBackdrop()}
            </div>
            <textarea
                ref={textareaRef}
                className="editor-textarea"
                value={value}
                onChange={onChange}
                onScroll={handleScroll}
                placeholder={placeholder}
                spellCheck="false"
            />
        </div>
    );
}
