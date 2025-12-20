
import React from 'react';
import { expandLogicPaths } from '../logic/pathExpansion';
import ConditionView from './ConditionView';
import CleanValue from './CleanValue';

const LogicScenariosView = ({ node }) => {
    // 1. Calculate all possible outcomes
    const paths = expandLogicPaths(node);

    return (
        <div className="scenarios-container">
            {paths.map((path, i) => {
                // Check if purely empty
                const isEmpty = path.valueParts.every(p => p.type === 'StringLiteral' && !p.value);
                // "Otherwise" condition is present if we hit an explicit else
                // const isDefault = path.conditions.some(c => c.type === 'Default');

                return (
                    <div key={i} className={`scenario-card ${isEmpty ? 'scenario-empty' : ''}`}>
                        <header className="scenario-header">
                            <span className="scenario-label">Group Name Pattern</span>
                            <div className="scenario-result-stream">
                                {isEmpty ? (
                                    <span style={{ opacity: 0.5 }}>(Unique Empty Result)</span>
                                ) : (
                                    path.valueParts.map((part, pIdx) => (
                                        <CleanValue key={pIdx} node={part} />
                                    ))
                                )}
                            </div>
                        </header>
                        <div className="scenario-body">
                            <div className="reqs-label">Requires:</div>
                            <div className="scenario-reqs-list">
                                {path.conditions.length === 0 ? (
                                    <span style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.8em' }}>Always matches</span>
                                ) : (
                                    path.conditions.map((cond, cIdx) => {
                                        if (cond.type === 'Default') return <span key={cIdx} className="sc-catch-all">No other rules matched</span>;
                                        return <ConditionView key={cIdx} node={cond} />;
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LogicScenariosView;
