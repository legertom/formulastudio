import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TEXT_TRANSFORM_OPS } from '../features/docs/data/textTransform';
import { TEXT_EXTRACTION_OPS } from '../features/docs/data/textExtraction';
import { SEARCH_REPLACE_OPS } from '../features/docs/data/searchReplace';
import { LOGIC_OPS } from '../features/docs/data/logic';
import { MATH_DATE_OPS } from '../features/docs/data/mathDate';
import { UTILITY_OPS } from '../features/docs/data/utility';

const ALL_DOCS = [
    ...TEXT_TRANSFORM_OPS,
    ...TEXT_EXTRACTION_OPS,
    ...SEARCH_REPLACE_OPS,
    ...LOGIC_OPS,
    ...MATH_DATE_OPS,
    ...UTILITY_OPS
];

export const FUNCTION_MAP = ALL_DOCS.reduce((acc, fn) => {
    acc[fn.name] = fn;
    return acc;
}, {});

export const FUNCTIONS_SET = new Set(Object.keys(FUNCTION_MAP));

const FunctionTooltip = ({ name, children, inline = false }) => {
    const [tooltip, setTooltip] = useState(null);
    const ref = useRef(null);

    const funcData = FUNCTION_MAP[name];
    if (!funcData) return children;

    const handleMouseEnter = (e) => {
        const viewportWidth = window.innerWidth;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const hThreshold = 250;
        let valX = '-50%';
        if (mouseX < hThreshold) valX = '0%';
        else if (mouseX > viewportWidth - hThreshold) valX = '-100%';

        const vThreshold = 300;
        const isTop = mouseY < vThreshold;
        const valY = isTop ? '0%' : '-100%';
        const offY = isTop ? '24px' : '-12px';

        const transform = `translate(${valX}, ${valY}) translateY(${offY})`;

        setTooltip({
            x: mouseX,
            y: mouseY,
            transform,
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    const Tag = inline ? 'span' : 'code';

    return (
        <>
            <Tag
                ref={ref}
                className={inline ? 'fn-inline' : 'fn-tooltip-trigger'}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </Tag>
            {tooltip && createPortal(
                <div
                    className="syntax-tooltip"
                    style={{
                        top: tooltip.y,
                        left: tooltip.x,
                        transform: tooltip.transform
                    }}
                >
                    <div className="editor-tooltip">
                        <div className="tooltip-header">
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                                <span className="tooltip-title">{funcData.name}</span>
                                <span className="tooltip-arity">({funcData.arity} arguments)</span>
                            </div>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                                <span style={{ color: '#94a3b8' }}>Returns</span>
                                <span style={{ color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>{funcData.returns || 'String'}</span>
                            </div>
                        </div>
                        <div className="tooltip-desc">{funcData.desc}</div>
                        <div className="tooltip-section">
                            <div className="tooltip-label">SYNTAX</div>
                            <div className="tooltip-code">{funcData.syntax}</div>
                        </div>
                        {funcData.args && funcData.args.length > 0 && (
                            <div className="tooltip-section">
                                <div className="tooltip-label">ARGUMENTS</div>
                                <div className="tooltip-args">
                                    {funcData.args.map((arg, i) => (
                                        <div key={i} className="tooltip-arg-row">
                                            <span className="tooltip-arg-tag">{arg.name}</span>
                                            <span className="tooltip-arg-desc">{arg.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default FunctionTooltip;
