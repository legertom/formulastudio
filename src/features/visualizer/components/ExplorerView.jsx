
import React, { useState, useEffect } from 'react';
import BlockNode from './BlockNode';
import JsonTreeEditor from './JsonTreeEditor';
import { evaluateAndTrace } from '../../../lib/interpreter';
import sampledata from '../../../sampledata.json';

const ExplorerView = ({ ast, showTestData, testData: externalTestData }) => {
    // Use external testData if provided, otherwise manage locally (for backward compatibility)
    const [localTestData, setLocalTestData] = useState(sampledata);
    const testData = externalTestData || localTestData;

    const [traceMap, setTraceMap] = useState(new Map());
    const [isTestPanelOpen, setIsTestPanelOpen] = useState(true);

    // Live Evaluation
    useEffect(() => {
        try {
            // Run Interpreter
            if (ast) {
                const { trace } = evaluateAndTrace(ast, testData);
                setTraceMap(trace);
            } else {
                setTraceMap(new Map());
            }
        } catch (e) {
            // Silently handle evaluation errors
            console.warn('Evaluation error:', e);
        }
    }, [ast, testData]);

    const handleDataChange = (newData) => {
        setLocalTestData(newData);
    };

    return (
        <div className="explorer-view-container" style={{ padding: '1rem' }}>
            {/* Test Input Panel */}
            {showTestData && (
                <div className="explorer-test-panel" style={{
                    marginBottom: '1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.2)',
                    overflow: 'hidden'
                }}>
                    <div
                        className="explorer-test-header"
                        onClick={() => setIsTestPanelOpen(!isTestPanelOpen)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <span>⚡ Live Wire (Test Data)</span>
                        <span>{isTestPanelOpen ? '▼' : '▶'}</span>
                    </div>

                    {isTestPanelOpen && (
                        <div className="explorer-test-body" style={{
                            padding: '0.75rem',
                            maxHeight: '350px',
                            overflow: 'auto'
                        }}>
                            <JsonTreeEditor
                                data={testData}
                                onChange={handleDataChange}
                            />
                        </div>
                    )}
                </div>
            )}

            <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                Exploring Formula Structure
            </div>
            <div className="explorer-root">
                <BlockNode node={ast} traceMap={traceMap} />
            </div>
        </div>
    );
};

export default ExplorerView;

