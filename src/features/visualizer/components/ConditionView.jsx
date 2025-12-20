
import React, { useContext } from 'react';
import { FormulaContext } from '../FormulaContext';
import { flattenOp } from '../logic/pathExpansion';
import CleanValue from './CleanValue';
import NodeView from './NodeView';
import PortalTooltip from './PortalTooltip';

const ConditionView = ({ node }) => {
    const { onHoverNode } = useContext(FormulaContext);

    const handleEnter = (e) => {
        e.stopPropagation();
        if (node?.range) onHoverNode(node.range);
    };
    const handleLeave = () => onHoverNode(null);

    // 0. Synthetic Default (Else) -> "Catch All"
    if (node?.type === 'Default') {
        return (
            <PortalTooltip text="This is the OU that users go into if they don't fit anywhere else.">
                <span className="node-keyword node-catch-all">
                    Catch All
                    <span className="info-icon" aria-label="What is Catch All?">?</span>
                </span>
            </PortalTooltip>
        );
    }

    // 1. Top-Level AND: Stack them
    if (node?.type === 'CallExpression' && node.name === 'and') {
        const args = flattenOp(node, 'and');
        return (
            <div className="condition-block condition-and" role="group" aria-label="All conditions required" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <span className="logic-label">All Required:</span>
                <div className="condition-stack">
                    {args.map((arg, i) => <ConditionView key={i} node={arg} />)}
                </div>
            </div>
        );
    }

    // 2. OR Chains: Group as tags
    if (node?.type === 'CallExpression' && node.name === 'or') {
        const args = flattenOp(node, 'or');
        return (
            <div className="condition-block condition-or" role="group" aria-label="At least one condition required" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <span className="logic-label">Matches One Of:</span>
                <div className="condition-tags">
                    {args.map((arg, i) => <ConditionView key={i} node={arg} />)}
                </div>
            </div>
        );
    }

    // 3. Clean Equals: "Field = Value"
    if (node?.type === 'CallExpression' && node.name === 'equals') {
        return (
            <div className="condition-equals-inline" aria-label={`${node.arguments[0]?.value} equals ${node.arguments[1]?.value}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <span className="field-name">{node.arguments[0]?.value}</span>
                <span className="op">=</span>
                <CleanValue node={node.arguments[1]} />
            </div>
        );
    }

    // 4. Clean In/Contains: "Field IN List"
    if (node?.type === 'CallExpression' && (node.name === 'in' || node.name === 'contains')) {
        return (
            <div className="condition-equals-inline" style={{ maxWidth: '100%' }} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <span className="field-name">{node.arguments[0]?.value}</span>
                <span className="op" style={{ color: 'var(--accent-secondary)' }}>IN</span>
                <div style={{ display: 'inline-block', maxWidth: '150px', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <CleanValue node={node.arguments[1]} />
                </div>
            </div>
        );
    }

    // Fallback
    return <NodeView node={node} />;
};

export default ConditionView;
