
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

const PortalTooltip = ({ children, text }) => {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position above the element centered
            setCoords({
                top: rect.top - 10, // 10px spacing
                left: rect.left + rect.width / 2
            });
            setVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setVisible(false);
    };

    return (
        <>
            <span
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="portal-tooltip-trigger"
            >
                {children}
            </span>
            {visible && createPortal(
                <div
                    className="portal-tooltip"
                    style={{
                        top: coords.top,
                        left: coords.left,
                    }}
                    role="tooltip"
                >
                    {text}
                </div>,
                document.body
            )}
        </>
    );
};

export default PortalTooltip;
