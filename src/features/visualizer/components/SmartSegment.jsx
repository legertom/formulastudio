
import React from 'react';
import ConditionView from './ConditionView';
import CleanValue from './CleanValue';
import NodeView from './NodeView';

const RuleCard = ({ row, targetLabel = "Target OU" }) => {
    const isCatchAll = row.condition.type === 'Default';

    return (
        <article className="rule-card">
            <header className="rule-card-header">
                <span className="rule-label">{targetLabel}</span>
                <div className="rule-result">
                    <CleanValue node={row.value} />
                </div>
                {isCatchAll && <ConditionView node={row.condition} />}
            </header>
            {!isCatchAll && (
                <div className="rule-card-body">
                    <div className="rule-conditions-label">Requires:</div>
                    <div className="rule-conditions-content">
                        <ConditionView node={row.condition} />
                    </div>
                </div>
            )}
        </article>
    );
};

const SmartSegment = ({ segment, index, targetLabel = "Target OU" }) => {
    if (segment.type === 'tree') {
        return (
            <section className="segment-wrapper" aria-label={`Logic Segment ${index + 1}`}>
                <header className="segment-header">
                    <span className="segment-index">#{index + 1}</span>
                    <span>Processing Rule</span>
                </header>
                <div className="segment-tree">
                    <NodeView node={segment.node} />
                </div>
            </section>
        );
    }

    const { rows, commonField } = segment;

    // Case A: Clean Table (Common Field detected)
    if (commonField) {
        return (
            <section className="smart-table-wrapper segment-table" aria-label={`Mapping Table for ${commonField}`}>
                <header className="segment-header">
                    <span className="segment-index">#{index + 1}</span>
                    <span>Mapping by <span className="header-field">{commonField}</span></span>
                </header>
                <table className="smart-table">
                    <thead>
                        <tr>
                            <th scope="col"><span className="header-label">If {commonField} is...</span></th>
                            <th scope="col">{targetLabel}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => {
                            if (row.condition.type === 'Default') {
                                return (
                                    <tr key={idx}>
                                        <td><ConditionView node={row.condition} /></td>
                                        <td><CleanValue node={row.value} /></td>
                                    </tr>
                                );
                            }
                            return (
                                <tr key={idx}>
                                    <td>
                                        <CleanValue node={row.condition.arguments[1]} />
                                    </td>
                                    <td><CleanValue node={row.value} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
        );
    }

    // Case B: Complex Logic -> Card List
    return (
        <section className="smart-card-list segment-cards" aria-label={`Complex Rules Segment ${index + 1}`}>
            <header className="segment-header">
                <span className="segment-index">#{index + 1}</span>
                <span>Complex Rules</span>
            </header>
            <div className="cards-container">
                {rows.map((row, idx) => (
                    <RuleCard key={idx} row={row} targetLabel={targetLabel} />
                ))}
            </div>
        </section>
    );
};

export default SmartSegment;
