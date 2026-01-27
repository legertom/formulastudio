
import React, { useState, useEffect } from 'react';
import BlockNode from './BlockNode';
import JsonTreeEditor from './JsonTreeEditor';
import InputFieldsPanel from './InputFieldsPanel';
import TransformationPipeline from './TransformationPipeline';
import OutputPanel from './OutputPanel';
import { evaluateAndTrace } from '../../../lib/interpreter';
import { extractFieldAccesses, buildTransformationPipeline, classifyFormula } from '../logic/dataFlowAnalysis';
import sampledata from '../../../sampledata.json';

const ExplorerView = ({ ast, showTestData, testData: externalTestData }) => {
    // Use external testData if provided, otherwise manage locally (for backward compatibility)
    const [localTestData, setLocalTestData] = useState(sampledata);
    const testData = externalTestData || localTestData;

    const [traceMap, setTraceMap] = useState(new Map());
    const [result, setResult] = useState('');
    const [error, setError] = useState(null);
    const [isTestPanelOpen, setIsTestPanelOpen] = useState(true);
    const [viewMode, setViewMode] = useState('dataflow'); // 'dataflow' or 'tree'

    // Live Evaluation
    useEffect(() => {
        try {
            // Run Interpreter
            if (ast) {
                const { result: evalResult, trace } = evaluateAndTrace(ast, testData);
                setTraceMap(trace);
                setResult(evalResult);
                setError(null);
            } else {
                setTraceMap(new Map());
                setResult('');
                setError(null);
            }
        } catch (e) {
            // Handle evaluation errors
            console.warn('Evaluation error:', e);
            setError(e.message);
            setTraceMap(new Map());
        }
    }, [ast, testData]);

    const handleDataChange = (newData) => {
        setLocalTestData(newData);
    };

    // Extract data flow information
    const fieldAccesses = ast ? extractFieldAccesses(ast, testData, traceMap) : [];
    const transformationSteps = ast ? buildTransformationPipeline(ast, traceMap) : [];
    const formulaType = ast ? classifyFormula(ast) : null;

    return (
        <div className="explorer-view-container" style={{ padding: '1rem' }}>
            {/* View Mode Toggle */}
            <div style={{
                marginBottom: '1rem',
                display: 'flex',
                gap: '0.5rem',
                padding: '0.25rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                width: 'fit-content'
            }}>
                <button
                    onClick={() => setViewMode('dataflow')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: viewMode === 'dataflow' ? 'var(--accent-primary)' : 'transparent',
                        color: viewMode === 'dataflow' ? 'white' : 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease'
                    }}
                >
                    Data Flow
                </button>
                <button
                    onClick={() => setViewMode('tree')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: viewMode === 'tree' ? 'var(--accent-primary)' : 'transparent',
                        color: viewMode === 'tree' ? 'white' : 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease'
                    }}
                >
                    Tree View
                </button>
            </div>

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
                        <span>Live Wire (Test Data)</span>
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

            {/* Data Flow View */}
            {viewMode === 'dataflow' && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <InputFieldsPanel fieldAccesses={fieldAccesses} />
                    <TransformationPipeline steps={transformationSteps} finalResult={result} />
                    <OutputPanel result={result} error={error} formulaType={formulaType} />
                </div>
            )}

            {/* Tree View (Original BlockNode) */}
            {viewMode === 'tree' && (
                <div>
                    <div style={{
                        marginBottom: '1rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontStyle: 'italic'
                    }}>
                        Exploring Formula Structure
                    </div>
                    <div className="explorer-root">
                        <BlockNode node={ast} traceMap={traceMap} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExplorerView;

