
import React from 'react';
import { FormulaContext } from './FormulaContext';
import './Visualizer.css';
import GroupLogicView from './components/GroupLogicView';
import NodeView from './components/NodeView';
import ExplorerView from './components/ExplorerView';
import { translateError } from '../../lib/errorMessages';

export default function FormulaVisualizer({ ast, error, mode = 'OU', onHoverNode = () => { }, searchTerm = '', showTestData = true, testData = null }) {
    if (error) {
        const friendly = translateError(error);
        return (
            <div className="visualizer-error-friendly" role="alert">
                <div className="error-header">
                    <span className="error-icon">{friendly.icon}</span>
                    <h3 className="error-title">{friendly.title}</h3>
                </div>
                <p className="error-message">{friendly.message}</p>
                {friendly.suggestions && friendly.suggestions.length > 0 && (
                    <div className="error-suggestions">
                        <span className="suggestions-label">Try this:</span>
                        <ul>
                            {friendly.suggestions.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <details className="error-details">
                    <summary>Technical details</summary>
                    <code>{friendly.original}</code>
                </details>
            </div>
        );
    }

    if (mode === 'EXPLORER') {
        return (
            <div className="visualizer-container">
                <FormulaContext.Provider value={{ loopVariable: null, onHoverNode, searchTerm, mode: 'EXPLORER' }}>
                    <div className="visualizer-scroll">
                        <div className="visualizer-content">
                            <ExplorerView ast={ast} showTestData={showTestData} testData={testData} />
                        </div>
                    </div>
                </FormulaContext.Provider>
            </div>
        );
    }

    if (!ast) {
        return <div className="visualizer-empty">No Formula Parsed</div>;
    }

    if (mode === 'GROUP') {
        // GroupLogicView manages its own Context Provider because of the loop variable
        return (
            <div className="visualizer-container">
                <FormulaContext.Provider value={{ loopVariable: null, onHoverNode, searchTerm }}>
                    <GroupLogicView ast={ast} error={error} />
                </FormulaContext.Provider>
            </div>
        );
    }

    // Default: OU Mode (Raw Logic Tree / Scenario View)
    return (
        <FormulaContext.Provider value={{ loopVariable: null, onHoverNode, searchTerm, targetLabel: 'Target OU' }}>
            <div className="visualizer-container">
                <div className="visualizer-scroll">
                    <div className="visualizer-content">
                        <NodeView node={ast} />
                    </div>
                </div>
            </div>
        </FormulaContext.Provider>
    );
}
