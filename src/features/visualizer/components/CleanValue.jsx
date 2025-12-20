
import React, { useContext } from 'react';
import { FormulaContext } from '../FormulaContext';
import NodeView from './NodeView';

const CleanValue = ({ node }) => {
    const { onHoverNode } = useContext(FormulaContext);

    const handleEnter = (e) => {
        e.stopPropagation();
        if (node?.range) onHoverNode(node.range);
    };
    const handleLeave = () => onHoverNode(null);

    if (node?.type === 'StringLiteral') {
        if (!node.value) {
            return <span className="clean-string empty" style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.85em' }} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>(Empty)</span>;
        }
        return <span className="clean-string" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>{node.value}</span>;
    }
    return <NodeView node={node} />;
};

export default CleanValue;
