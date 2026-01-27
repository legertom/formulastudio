import React from 'react';
import { formatValue } from '../logic/dataFlowAnalysis';

/**
 * TransformationPipeline
 *
 * Shows the step-by-step transformations that the formula performs
 */
const TransformationPipeline = ({ steps, finalResult }) => {
    if (!steps || steps.length === 0) {
        return (
            <div className="data-flow-panel" style={{
                padding: '1rem',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
            }}>
                <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic'
                }}>
                    No operations to display
                </div>
            </div>
        );
    }

    // Show all executed steps (they're already in execution order from the analysis)
    const topLevelSteps = steps.filter(s => s.executed !== false);

    // Get function category color
    const getFunctionColor = (funcName) => {
        const name = funcName.toLowerCase();

        // Control flow
        if (['if', 'switch', 'foreach'].includes(name)) {
            return {
                bg: 'rgba(168, 85, 247, 0.1)',
                border: '#a855f7',
                text: '#c084fc'
            };
        }

        // Logic operations
        if (['and', 'or', 'not', 'equals', 'greater', 'less', 'geq', 'leq', 'contains', 'in'].includes(name)) {
            return {
                bg: 'rgba(245, 158, 11, 0.1)',
                border: '#f59e0b',
                text: '#fbbf24'
            };
        }

        // String operations
        if (['concat', 'upper', 'lower', 'substr', 'trim', 'trimleft', 'replace', 'initials', 'tolower', 'toupper'].includes(name)) {
            return {
                bg: 'rgba(34, 197, 94, 0.1)',
                border: '#22c55e',
                text: '#4ade80'
            };
        }

        // Math operations
        if (['add', 'subtract', 'length'].includes(name)) {
            return {
                bg: 'rgba(59, 130, 246, 0.1)',
                border: '#3b82f6',
                text: '#60a5fa'
            };
        }

        // Default
        return {
            bg: 'rgba(100, 100, 100, 0.1)',
            border: '#666',
            text: '#999'
        };
    };

    return (
        <div className="data-flow-panel" style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(168, 85, 247, 0.1)',
                borderBottom: '1px solid var(--glass-border)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <span>Logic</span>
                <span>Operations</span>
                <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.75rem',
                    opacity: 0.7
                }}>
                    {topLevelSteps.length} step{topLevelSteps.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div style={{ padding: '0.75rem' }}>
                {topLevelSteps.map((step, idx) => {
                    const colors = step.type === 'function'
                        ? getFunctionColor(step.name)
                        : { bg: 'rgba(100, 100, 100, 0.1)', border: '#666', text: '#999' };

                    return (
                        <React.Fragment key={idx}>
                            <div style={{
                                padding: '0.75rem',
                                background: colors.bg,
                                borderLeft: `3px solid ${colors.border}`,
                                borderRadius: '4px',
                                marginBottom: idx < topLevelSteps.length - 1 ? '0.5rem' : 0
                            }}>
                                {/* Step Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: step.inputs && step.inputs.length > 0 ? '0.5rem' : 0
                                }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        minWidth: '1.5rem'
                                    }}>
                                        {idx + 1}.
                                    </span>
                                    <span style={{
                                        fontSize: '0.85rem',
                                        fontFamily: 'monospace',
                                        fontWeight: 600,
                                        color: colors.text
                                    }}>
                                        {step.name}
                                    </span>
                                </div>

                                {/* Inputs (if any) */}
                                {step.inputs && step.inputs.length > 0 && (
                                    <div style={{
                                        paddingLeft: '2rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.25rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Inputs
                                        </div>
                                        {step.inputs.map((input, i) => (
                                            <div key={i} style={{
                                                fontSize: '0.75rem',
                                                fontFamily: 'monospace',
                                                color: 'var(--text-secondary)',
                                                padding: '0.25rem 0'
                                            }}>
                                                • {formatValue(input)}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Output */}
                                {step.output !== undefined && step.output !== null && (
                                    <div style={{
                                        paddingLeft: '2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)'
                                        }}>
                                            →
                                        </span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            fontFamily: 'monospace',
                                            color: 'var(--text-primary)',
                                            fontWeight: 500
                                        }}>
                                            {formatValue(step.output)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Flow Arrow */}
                            {idx < topLevelSteps.length - 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    padding: '0.25rem 0',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.9rem'
                                }}>
                                    ↓
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default TransformationPipeline;
