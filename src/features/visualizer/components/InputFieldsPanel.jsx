import React from 'react';
import { formatValue } from '../logic/dataFlowAnalysis';

/**
 * InputFieldsPanel
 *
 * Shows which fields from the test data were accessed by the formula
 */
const InputFieldsPanel = ({ fieldAccesses }) => {
    if (!fieldAccesses || fieldAccesses.length === 0) {
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
                    No input fields accessed (formula uses only literal values)
                </div>
            </div>
        );
    }

    // Separate existing and missing fields
    const existingFields = fieldAccesses.filter(f => f.exists);
    const missingFields = fieldAccesses.filter(f => !f.exists);

    return (
        <div className="data-flow-panel" style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderBottom: '1px solid var(--glass-border)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <span>📥</span>
                <span>Input Data</span>
                <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.75rem',
                    opacity: 0.7
                }}>
                    {existingFields.length} field{existingFields.length !== 1 ? 's' : ''} accessed
                </span>
            </div>

            <div style={{ padding: '0.75rem' }}>
                {/* Existing Fields */}
                {existingFields.map((field, idx) => (
                    <div key={idx} style={{
                        padding: '0.5rem 0.75rem',
                        marginBottom: idx < existingFields.length - 1 || missingFields.length > 0 ? '0.5rem' : 0,
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderLeft: '3px solid var(--success)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <span style={{ color: 'var(--success)', fontSize: '1rem' }}>✓</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '0.8rem',
                                fontFamily: 'monospace',
                                color: 'var(--text-primary)',
                                fontWeight: 500
                            }}>
                                {field.path}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--success)',
                                marginTop: '0.25rem',
                                fontFamily: 'monospace',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                = {formatValue(field.value)}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Missing Fields */}
                {missingFields.map((field, idx) => (
                    <div key={idx} style={{
                        padding: '0.5rem 0.75rem',
                        marginBottom: idx < missingFields.length - 1 ? '0.5rem' : 0,
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderLeft: '3px solid var(--danger)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <span style={{ color: 'var(--danger)', fontSize: '1rem' }}>✗</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '0.8rem',
                                fontFamily: 'monospace',
                                color: 'var(--text-primary)',
                                fontWeight: 500
                            }}>
                                {field.path}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--danger)',
                                marginTop: '0.25rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {field.error || 'Field not found in test data'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InputFieldsPanel;
