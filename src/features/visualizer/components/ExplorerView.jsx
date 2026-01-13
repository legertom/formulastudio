
import React, { useState, useEffect } from 'react';
import BlockNode from './BlockNode';
import { evaluateAndTrace } from '../../../lib/interpreter';
import sampledata from '../../../sampledata.json';

const ExplorerView = ({ ast }) => {
    // Default test data
    const [testDataInput, setTestDataInput] = useState(JSON.stringify(sampledata, null, 2));
    const [testData, setTestData] = useState(sampledata);
    const [traceMap, setTraceMap] = useState(new Map());
    const [isTestPanelOpen, setIsTestPanelOpen] = useState(true);
    const [jsonError, setJsonError] = useState(null);

    // Live Evaluation
    useEffect(() => {
        try {
            const data = JSON.parse(testDataInput);
            setTestData(data);
            setJsonError(null);

            // Run Interpreter
            const { trace } = evaluateAndTrace(ast, data);
            setTraceMap(trace);

        } catch (e) {
            setJsonError(e.message);
        }
    }, [ast, testDataInput]);

    return (
        <div className="explorer-view-container" style={{ padding: '1rem' }}>
            {/* Test Input Panel */}
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
                    <div className="explorer-test-body" style={{ padding: '0.5rem' }}>
                        <textarea
                            value={testDataInput}
                            onChange={(e) => setTestDataInput(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '80px',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                resize: 'vertical',
                                outline: 'none'
                            }}
                        />
                        {jsonError && (
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--error)',
                                marginTop: '4px',
                                paddingTop: '4px',
                                borderTop: '1px solid var(--glass-border)'
                            }}>
                                Invalid JSON: {jsonError}
                            </div>
                        )}
                    </div>
                )}
            </div>

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
