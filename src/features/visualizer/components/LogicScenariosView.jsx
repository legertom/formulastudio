
import React from 'react';
import { expandLogicPaths } from '../logic/pathExpansion';
import { FormulaContext } from '../FormulaContext';
import ConditionView from './ConditionView';
import CleanValue from './CleanValue';

const groupPaths = (paths) => {
    const grouped = [];

    for (const path of paths) {
        // 1. Serialize Output for comparison (Strip unique IDs/Locs)
        const outputSig = JSON.stringify(path.valueParts.map(p => {
            if (p.type === 'StringLiteral') return { type: 'String', val: p.value };
            if (p.type === 'Identifier') return { type: 'Ident', val: p.value };
            // For complex nodes, we might still fail to group, but usually outputs are simple strings/concats
            const { range, loc, start, end, ...rest } = p;
            return rest;
        }));

        // 2. Analyze if this is a "Simple Equality" path (1 condition: equals field value)
        let simpleSubject = null;
        let simpleValue = null;
        let isSimple = false;

        // Path conditions are usually [cond] or [cond, parentCond...]
        // With expanded paths, we check if the leaf condition is the only one or if all conditions effectively map to one check?
        // Actually, simple grouping mainly applies when there IS only 1 condition in the stack (flat list) or distinct branches.
        // For the visualizer, grouping usually makes sense at the top level.
        if (path.conditions.length === 1) {
            const cond = path.conditions[0];
            if (cond.type === 'CallExpression' && cond.name === 'equals') {
                const [fieldNode, valNode] = cond.arguments;
                // Ensure Subject is an Identifier (field) and Value is a Literal (string/number)
                if (fieldNode?.type === 'Identifier') {
                    simpleSubject = fieldNode.value;
                    simpleValue = valNode;
                    isSimple = true;
                }
            }
        }

        const lastGroup = grouped[grouped.length - 1];

        // 3. Attempt Merge
        if (
            isSimple &&
            lastGroup &&
            lastGroup.type === 'merged' &&
            lastGroup.outputSig === outputSig &&
            lastGroup.subject === simpleSubject
        ) {
            lastGroup.values.push(simpleValue);
        } else if (isSimple) {
            // Start new Merged Group
            grouped.push({
                type: 'merged',
                outputSig,
                subject: simpleSubject,
                values: [simpleValue],
                valueParts: path.valueParts
            });
        } else {
            // Standard/Complex Path
            grouped.push({
                type: 'standard',
                rawPath: path,
                valueParts: path.valueParts
            });
        }
    }
    return grouped;
};

const LogicScenariosView = ({ node }) => {
    // 1. Calculate all possible outcomes
    const rawPaths = expandLogicPaths(node);

    // 2. Group adjacent paths
    const groups = groupPaths(rawPaths);

    // 3. Search Context & Target Label
    const { searchTerm, targetLabel = 'Target OU' } = React.useContext(FormulaContext);

    return (
        <div className="smart-table-wrapper">
            <table className="smart-table">
                <thead>
                    <tr>
                        <th style={{ width: '65%' }}>User Condition</th>
                        <th>{targetLabel}</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group, i) => {
                        const isEmpty = group.valueParts.every(p => p.type === 'StringLiteral' && !p.value);

                        return (
                            <tr key={i} className={isEmpty ? 'scenario-empty' : ''}>
                                <td>
                                    {group.type === 'merged' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span className="field-name">{group.subject}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '12px', borderLeft: '2px solid var(--glass-border)' }}>
                                                {group.values.map((val, vIdx) => {
                                                    // Highlighting Logic
                                                    const textVal = val.type === 'StringLiteral' ? val.value : '';
                                                    const isMatch = searchTerm && textVal.toLowerCase().includes(searchTerm.toLowerCase());

                                                    return (
                                                        <div key={vIdx} style={{
                                                            padding: '2px 4px',
                                                            borderRadius: '4px',
                                                            background: isMatch ? 'rgba(234, 179, 8, 0.4)' : 'transparent',
                                                            color: 'var(--text-secondary)',
                                                            fontSize: '0.9rem',
                                                            transition: 'background 0.2s'
                                                        }}>
                                                            <CleanValue node={val} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="scenario-reqs-list">
                                            {group.rawPath.conditions.length === 0 ? (
                                                <span style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.8em' }}>Always matches</span>
                                            ) : (
                                                group.rawPath.conditions.map((cond, cIdx) => {
                                                    if (cond.type === 'Default') return <span key={cIdx} className="sc-catch-all">No other rules matched</span>;
                                                    return <ConditionView key={cIdx} node={cond} />;
                                                })
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className="target-ou-box">
                                        {isEmpty ? (
                                            <span style={{ opacity: 0.5 }}>(Unique Empty Result)</span>
                                        ) : (
                                            group.valueParts.map((part, pIdx) => (
                                                <CleanValue key={pIdx} node={part} />
                                            ))
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div >
    );
};

export default LogicScenariosView;
