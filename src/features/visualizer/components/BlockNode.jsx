
import React, { useContext } from 'react';
import { FormulaContext } from '../FormulaContext';
import CleanValue from './CleanValue';
import InFunctionView from './InFunctionView';
import EqualsFunctionView from './EqualsFunctionView';
import IfFunctionView from './IfFunctionView';
import ReplaceFunctionView from './ReplaceFunctionView';
import TextTransformView from './TextTransformView';


const BlockNode = ({ node, isArg = false, argLabel = null, traceMap = null }) => {
    const { onHoverNode, searchTerm } = useContext(FormulaContext);

    const handleEnter = (e) => {
        e.stopPropagation();
        if (node?.range) onHoverNode(node.range);
    };

    const handleLeave = () => {
        onHoverNode(null);
    };

    if (!node) return null;

    // Trace Lookup
    let traceData = null;
    let isExecuted = true;
    if (traceMap && traceMap.has(node)) {
        traceData = traceMap.get(node);
        isExecuted = traceData.executed;
    } else if (traceMap && node.type === 'CallExpression') {
        // If map exists but node not in it, it wasn't executed (e.g. untaken if branch)
        isExecuted = false;
    }

    // Styles for execution state
    const executionStyle = {
        opacity: isExecuted ? 1 : 0.3,
        filter: isExecuted ? 'none' : 'grayscale(100%)',
        transition: 'opacity 0.3s ease'
    };

    // Helper to render Trace Pill
    const TracePill = () => {
        if (!traceData || !isExecuted) return null;
        let valDisplay = String(traceData.value);
        if (valDisplay.length > 30) valDisplay = valDisplay.substring(0, 27) + '...';
        if (traceData.value === true) valDisplay = 'true';
        if (traceData.value === false) valDisplay = 'false';

        let pillColor = 'var(--text-muted)';
        let pillBg = 'rgba(0,0,0,0.3)';
        if (traceData.value === true) {
            pillColor = 'var(--success)';
            pillBg = 'rgba(34, 197, 94, 0.15)';
        }
        if (traceData.value === false) {
            pillColor = 'var(--warning)';
            pillBg = 'rgba(245, 158, 11, 0.15)';
        }

        return (
            <span className="block-trace-pill" style={{
                fontSize: '0.85em',
                background: pillBg,
                padding: '3px 10px',
                borderRadius: '6px',
                marginLeft: 'auto',
                borderLeft: `3px solid ${pillColor}`,
                color: pillColor,
                fontFamily: 'monospace',
                fontWeight: 600
            }}>
                → {valDisplay}
            </span>
        );
    };

    // String / Literal / Identifier (Leaf Nodes)
    if (node.type === 'StringLiteral' || node.type === 'Identifier') {
        const textVal = node.type === 'StringLiteral' ? node.value : node.value;
        const isMatch = searchTerm && textVal.toLowerCase().includes(searchTerm.toLowerCase());

        return (
            <div className={`block-leaf ${isArg ? 'block-leaf-arg' : ''}`}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                style={{
                    backgroundColor: isMatch ? 'rgba(234, 179, 8, 0.4)' : undefined,
                    borderColor: isMatch ? 'var(--warning)' : undefined,
                    ...executionStyle
                }}
            >
                {argLabel && <span className="block-arg-label">{argLabel}</span>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CleanValue node={node} />
                    {/* Leaf nodes usually don't need pills unless they are identifiers */}
                    {node.type === 'Identifier' && <TracePill />}
                </div>
            </div>
        );
    }

    // Call Expression (Function Blocks)
    if (node.type === 'CallExpression') {
        const funcName = node.name.toLowerCase();

        // Special handling for 'in' function - use enhanced visualization
        if (funcName === 'in' && node.arguments.length >= 2) {
            return (
                <div style={executionStyle}>
                    {argLabel && <span className="block-arg-label-top">{argLabel}</span>}
                    <InFunctionView node={node} traceMap={traceMap} onHoverNode={onHoverNode} />
                </div>
            );
        }

        // Special handling for 'equals' function - use enhanced visualization
        if (funcName === 'equals' && node.arguments.length >= 2) {
            return (
                <div style={executionStyle}>
                    {argLabel && <span className="block-arg-label-top">{argLabel}</span>}
                    <EqualsFunctionView node={node} traceMap={traceMap} onHoverNode={onHoverNode} />
                </div>
            );
        }

        // Special handling for 'if' function - use enhanced visualization
        if (funcName === 'if' && node.arguments.length >= 2) {
            return (
                <div style={executionStyle}>
                    {argLabel && <span className="block-arg-label-top">{argLabel}</span>}
                    <IfFunctionView node={node} traceMap={traceMap} onHoverNode={onHoverNode} />
                </div>
            );
        }

        // Special handling for 'replace' function - use enhanced visualization
        if (funcName === 'replace' && node.arguments.length >= 3) {
            return (
                <div style={executionStyle}>
                    {argLabel && <span className="block-arg-label-top">{argLabel}</span>}
                    <ReplaceFunctionView node={node} traceMap={traceMap} onHoverNode={onHoverNode} />
                </div>
            );
        }

        // Special handling for text transform functions - use enhanced visualization
        const textTransformFuncs = ['tolower', 'toupper', 'upper', 'lower', 'trim', 'initials', 'alphanumeric'];
        if (textTransformFuncs.includes(funcName) && node.arguments.length >= 1) {
            return (
                <div style={executionStyle}>
                    {argLabel && <span className="block-arg-label-top">{argLabel}</span>}
                    <TextTransformView node={node} traceMap={traceMap} onHoverNode={onHoverNode} funcName={funcName} />
                </div>
            );
        }

        // Simple Function Check (Inline)
        const isSimple = ['len', 'not', 'contains'].includes(funcName) &&
            node.arguments.every(arg => arg.type === 'StringLiteral' || arg.type === 'Identifier' || arg.type === 'NumberLiteral');

        if (isSimple) {
            return (
                <div className="block-inline-func"
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                    style={executionStyle}
                >
                    {argLabel && <span className="block-arg-label-inline">{argLabel}</span>}
                    <span className="block-func-name-inline">{node.name}</span>
                    <span className="block-paren">(</span>
                    {node.arguments.map((arg, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <span className="block-comma">, </span>}
                            <BlockNode node={arg} traceMap={traceMap} /> {/* Pass traceMap recursively even to inline leaf args? actually leaves handle themselves */}
                            {/* But CleanValue was used before... need to swap to BlockNode for trace? Or just pass value? */}
                            {/* Let's keep it simple: Inline blocks just show result at end. */}
                        </React.Fragment>
                    ))}
                    <span className="block-paren">)</span>
                    <TracePill />
                </div>
            );
        }

        // Categorize for styling (Standard Blocks)
        let categoryClass = 'block-func-generic';
        if (['if', 'switch', 'foreach'].includes(funcName)) categoryClass = 'block-func-control';
        else if (['and', 'or', 'not', 'equals', 'greater', 'less', 'contains'].includes(funcName)) categoryClass = 'block-func-logic';
        else if (['concat', 'upper', 'lower', 'substr'].includes(funcName)) categoryClass = 'block-func-string';

        // Determine labels
        const getArgLabel = (index, totalArgs) => {
            if (funcName === 'if') {
                if (index === 0) return 'Condition';
                if (index === 1) return 'Then';
                if (index === 2) return 'Else';
            }
            if (funcName === 'equals' || funcName === 'greater' || funcName === 'less' || funcName === 'contains') {
                if (index === 0) return 'Input A';
                if (index === 1) return 'Input B';
            }
            if (funcName === 'replace') {
                if (index === 0) return 'Source';
                if (index === 1) return 'Find';
                if (index === 2) return 'Replace With';
            }
            return null;
        };

        return (
            <div className={`block-container ${categoryClass}`}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                style={executionStyle}
            >
                <div className="block-header">
                    {argLabel && <span className="block-arg-label-top">{argLabel}</span>}
                    <span className="block-func-name">{node.name}</span>
                    <TracePill />
                </div>
                <div className="block-args-list">
                    {node.arguments.map((arg, i) => (
                        <div key={i} className="block-arg-wrapper">
                            <BlockNode
                                node={arg}
                                isArg={true}
                                argLabel={getArgLabel(i, node.arguments.length)}
                                traceMap={traceMap}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return <div className="block-unknown">Unknown Node</div>;
};

export default BlockNode;
