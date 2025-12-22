
import React, { useContext } from 'react';
import { FormulaContext } from '../FormulaContext';
import ConditionView from './ConditionView';
import CleanValue from './CleanValue';
import NodeView from './NodeView';

const RuleCard = ({ row, targetLabel = "Target OU" }) => {
    const isCatchAll = row.condition.type === 'Default';
    const { searchTerm } = useContext(FormulaContext);

    // Simple highlighting check for card view
    // We check the value representation for now
    // TODO: Deep check of condition logic if needed
    const valNode = row.condition.arguments?.[1];
    const textVal = valNode?.type === 'StringLiteral' ? valNode.value : '';
    const isMatch = searchTerm && textVal.toLowerCase().includes(searchTerm.toLowerCase());

    return (
        <article className="rule-card" style={{
            border: isMatch ? '1px solid var(--warning)' : undefined,
            background: isMatch ? 'rgba(234, 179, 8, 0.1)' : undefined
        }}>
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
    const { searchTerm } = useContext(FormulaContext);

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

                            // Highlighting Logic for Table Row
                            const valNode = row.condition.arguments[1];
                            const textVal = valNode?.type === 'StringLiteral' ? valNode.value : '';
                            const isMatch = searchTerm && textVal.toLowerCase().includes(searchTerm.toLowerCase());

                            return (
                                <tr key={idx}>
                                    <td>
                                        <div style={{
                                            width: 'fit-content',
                                            padding: '2px 4px',
                                            borderRadius: '4px',
                                            background: isMatch ? 'rgba(234, 179, 8, 0.4)' : 'transparent',
                                            color: isMatch ? '#fff' : 'inherit',
                                            fontSize: '0.9rem',
                                            transition: 'all 0.2s'
                                        }}>
                                            <CleanValue node={valNode} />
                                        </div>
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
