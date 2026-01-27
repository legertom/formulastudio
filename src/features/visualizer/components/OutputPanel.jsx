import React from 'react';
import { formatValue } from '../logic/dataFlowAnalysis';

/**
 * OutputPanel
 *
 * Shows the final result of the formula evaluation
 */
const OutputPanel = ({ result, error, formulaType }) => {
    const hasError = error !== null && error !== undefined;

    return (
        <div className="data-flow-panel" style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '0.75rem 1rem',
                background: hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                borderBottom: '1px solid var(--glass-border)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: hasError ? 'var(--danger)' : 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <span>{hasError ? 'Alert' : 'Result'}</span>
                <span>{hasError ? 'Error' : 'Output'}</span>
                {formulaType && !hasError && (
                    <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.7rem',
                        opacity: 0.8,
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '999px'
                    }}>
                        {formulaType.icon} {formulaType.label}
                    </span>
                )}
            </div>

            <div style={{ padding: '1rem' }}>
                {hasError ? (
                    // Error State
                    <div style={{
                        padding: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderLeft: '3px solid var(--danger)',
                        borderRadius: '4px'
                    }}>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--danger)',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Evaluation Failed
                        </div>
                        <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            fontFamily: 'monospace',
                            lineHeight: 1.5
                        }}>
                            {String(error)}
                        </div>
                    </div>
                ) : (
                    // Success State
                    <div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Final Result
                        </div>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(34, 197, 94, 0.1)',
                            borderLeft: '3px solid var(--success)',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            wordBreak: 'break-word'
                        }}>
                            {result === '' ? (
                                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    (empty string)
                                </span>
                            ) : result === null ? (
                                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    null
                                </span>
                            ) : result === undefined ? (
                                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    undefined
                                </span>
                            ) : result === true ? (
                                <span style={{ color: 'var(--success)' }}>true</span>
                            ) : result === false ? (
                                <span style={{ color: 'var(--warning)' }}>false</span>
                            ) : (
                                String(result)
                            )}
                        </div>

                        {/* Type Info */}
                        <div style={{
                            marginTop: '0.75rem',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <div>
                                <span style={{ opacity: 0.7 }}>Type:</span>{' '}
                                <span style={{ fontWeight: 600 }}>
                                    {typeof result}
                                </span>
                            </div>
                            {typeof result === 'string' && (
                                <div>
                                    <span style={{ opacity: 0.7 }}>Length:</span>{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        {result.length}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Formula Type Description */}
                        {formulaType && formulaType.description && (
                            <div style={{
                                marginTop: '0.75rem',
                                padding: '0.5rem 0.75rem',
                                background: 'rgba(59, 130, 246, 0.05)',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                fontStyle: 'italic',
                                lineHeight: 1.5
                            }}>
                                {formulaType.description}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutputPanel;
