import React from 'react';

// Helper to render text with basic markdown (bold **text**, code `text`)
// plus a tiny amount of "IDM-ish" token highlighting for {{ and }}.
export const renderMarkdownText = (text) => {
    if (!text) return null;

    const renderInlineTokens = (segment) => {
        if (typeof segment !== 'string' || segment.length === 0) return segment;
        return segment.split(/(\{\{|\}\})/g).map((piece, i) => {
            if (piece === '{{' || piece === '}}') {
                return <code key={i}>{piece}</code>;
            }
            return piece;
        });
    };

    // Helper for inline markdown (bold/code)
    const renderInlineMarkdown = (inlineText, baseKey) => {
        return inlineText.split('`').map((part, j) => {
            if (j % 2 === 1) {
                return <code key={`${baseKey}-${j}`}>{part}</code>;
            }
            return part.split('**').map((subPart, k) => {
                if (k % 2 === 1) {
                    return (
                        <strong key={`${baseKey}-${j}-${k}`} style={{ color: 'var(--primary)' }}>
                            {renderInlineTokens(subPart)}
                        </strong>
                    );
                }
                return <React.Fragment key={`${baseKey}-${j}-${k}`}>{renderInlineTokens(subPart)}</React.Fragment>;
            });
        });
    };

    // Helper to render a markdown table (matches docs diagram style)
    const renderTable = (tableText, tableKey) => {
        const lines = tableText.trim().split('\n').filter(line => line.trim());
        if (lines.length < 2) return null;

        const parseRow = (row) => row.split('|').map(cell => cell.trim()).filter(cell => cell);
        const headerCells = parseRow(lines[0]);
        const bodyRows = lines.slice(2).map(parseRow); // Skip header and separator

        return (
            <table key={tableKey} style={{
                borderCollapse: 'collapse',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                margin: '1rem 0'
            }}>
                <thead>
                    <tr>
                        <td style={{
                            padding: '0.25rem 0.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem'
                        }}>{headerCells[0]}:</td>
                        {headerCells.slice(1).map((cell, idx) => (
                            <td key={idx} style={{
                                padding: '0.25rem 0.75rem',
                                textAlign: 'center',
                                color: 'var(--accent-secondary)',
                                fontWeight: 600
                            }}>{cell}</td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {bodyRows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                            <td style={{
                                padding: '0.25rem 0.5rem',
                                color: 'var(--text-muted)',
                                fontSize: '0.7rem'
                            }}>{row[0]}:</td>
                            {row.slice(1).map((cell, cellIdx) => (
                                <td key={cellIdx} style={{
                                    padding: '0.5rem 0.75rem',
                                    textAlign: 'center',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--glass-border)',
                                    fontWeight: 600
                                }}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // Check if text contains a markdown table
    const isMarkdownTable = (text) => {
        const lines = text.trim().split('\n');
        return lines.length >= 2 && lines[1].match(/^\|?[\s-:|]+\|?$/);
    };

    // 1. Split by triple backticks for code blocks
    return text.split('```').map((block, i) => {
        if (i % 2 === 1) {
            // CODE BLOCK
            return (
                <pre key={`block-${i}`} style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    border: '1px solid var(--glass-border)',
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    color: 'var(--text-secondary)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    margin: '1.5rem 0'
                }}>
                    {block.trim()}
                </pre>
            );
        }

        // TEXT BLOCK:
        // 1. Trim leading/trailing whitespace from the block (removes the newlines that border the code block)
        // 2. Split by double-newlines to find distinct paragraphs
        const cleanBlock = block.trim();
        if (!cleanBlock) return null;

        return cleanBlock.split(/\n\s*\n/).map((para, paraIdx) => {
            // Check if this paragraph is a table
            if (isMarkdownTable(para)) {
                return renderTable(para, `table-${i}-${paraIdx}`);
            }
            return (
                <p key={`text-${i}-${paraIdx}`} style={{ lineHeight: '1.6', margin: '0 0 1rem 0', whiteSpace: 'pre-wrap' }}>
                    {renderInlineMarkdown(para, `inline-${i}-${paraIdx}`)}
                </p>
            );
        });
    });
};

import { evaluateAndTrace } from './interpreter';

// Helper to evaluate AST against data (Simplified)
export const evaluateAst = (ast, data) => {
    const { result } = evaluateAndTrace(ast, data);
    return result;
};
