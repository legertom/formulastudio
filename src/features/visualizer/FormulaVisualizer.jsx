
import React from 'react';
import { FormulaContext } from './FormulaContext';
import './Visualizer.css';
import GroupLogicView from './components/GroupLogicView';
import NodeView from './components/NodeView';
import ExplorerView from './components/ExplorerView';

export default function FormulaVisualizer({ ast, error, mode = 'OU', onHoverNode = () => { }, searchTerm = '' }) {
    if (error) {
        return (
            <div className="visualizer-error" role="alert">
                <h3>Parse Error</h3>
                <p>{error.message}</p>
            </div>
        );
    }

    if (!ast) {
        return <div className="visualizer-empty">No Formula Parsed</div>;
    }

    if (mode === 'EXPLORER') {
        return (
            <div className="visualizer-container">
                <FormulaContext.Provider value={{ loopVariable: null, onHoverNode, searchTerm, mode: 'EXPLORER' }}>
                    <div className="visualizer-scroll">
                        <div className="visualizer-content">
                            <ExplorerView ast={ast} />
                        </div>
                    </div>
                </FormulaContext.Provider>
            </div>
        );
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
