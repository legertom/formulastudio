import React, { useContext } from 'react';
import { FormulaContext } from '../FormulaContext';
import { hasNestedLogic } from '../logic/pathExpansion';
import LogicScenariosView from './LogicScenariosView';
import ConcatView from './ConcatView';
import { useHighlight } from '../hooks/useHighlight';

const NodeView = ({ node }) => {
    const { loopVariable, onHoverNode } = useContext(FormulaContext);

    // We compute highlighting based on the node text value
    const textValue = node?.type === 'StringLiteral' || node?.type === 'Identifier' ? node.value : null;
    const { highlightClass } = useHighlight(textValue);

    const handleEnter = (e) => {
        e.stopPropagation();
        if (node?.range) onHoverNode(node.range);
    };
    const handleLeave = () => {
        // e.stopPropagation(); 
        onHoverNode(null);
    };

    if (!node) return null;

    if (node.type === 'StringLiteral') {
        return <span className={`node-string ${highlightClass}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>"{node.value}"</span>;
    }

    if (node.type === 'Identifier') {
        const isLoopVar = loopVariable && (node.value === loopVariable || node.value.startsWith(`${loopVariable}.`));
        return (
            <span className={`node-ident ${isLoopVar ? 'node-loop-var' : ''} ${highlightClass}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                {node.value}
            </span>
        );
    }

    if (node.type === 'CallExpression') {
        // Smart Switching:
        // If it's a Concat AND it has nested IFs, use the Flattened Scenario View
        if (node.name === 'concat' && hasNestedLogic(node)) {
            return <LogicScenariosView node={node} />;
        }

        if (node.name === 'concat') {
            return <ConcatView node={node} />; // Standard stream for simple concats
        }
        if (node.name === 'if') {
            return <LogicScenariosView node={node} />;
        }

        return (
            <div className={`node-call node-${node.name}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <div className="node-header">{node.name}</div>
                <div className="node-args">
                    {node.arguments.map((arg, i) => (
                        <div key={i} className="node-arg-wrapper">
                            <NodeView node={arg} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return <div className="node-unknown">Unknown Node</div>;
};

export default NodeView;
