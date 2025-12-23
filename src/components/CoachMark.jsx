import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const CoachMark = ({ targetSelector, message, placement = 'top' }) => {
    const [position, setPosition] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const updatePosition = () => {
            const target = document.querySelector(targetSelector);
            if (!target) {
                setVisible(false);
                return;
            }

            const rect = target.getBoundingClientRect();
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            let top = 0;
            let left = 0;

            // Basic positioning logic - can be expanded
            if (placement === 'top') {
                top = rect.top + scrollY - 10; // 10px gap
                left = rect.left + scrollX + (rect.width / 2);
            } else if (placement === 'bottom') {
                top = rect.bottom + scrollY + 10;
                left = rect.left + scrollX + (rect.width / 2);
            } else if (placement === 'left') {
                top = rect.top + scrollY + (rect.height / 2);
                left = rect.left + scrollX - 10;
            } else if (placement === 'right') {
                top = rect.top + scrollY + (rect.height / 2);
                left = rect.right + scrollX + 10;
            }

            setPosition({ top, left });
            setVisible(true);
        };

        // Check immediately and on resize/scroll
        updatePosition();
        // Retry a few times in case of animation
        const interval = setInterval(updatePosition, 100);
        const timeout = setTimeout(() => clearInterval(interval), 2000);

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [targetSelector, placement]);

    if (!visible || !position) return null;

    const style = {
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: placement === 'top' ? 'translate(-50%, -100%)' :
            placement === 'bottom' ? 'translate(-50%, 0)' :
                placement === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
        backgroundColor: '#6c5ce7', // Purple accent
        color: 'white',
        padding: '0.8rem 1.2rem',
        borderRadius: '8px',
        maxWidth: '300px',
        zIndex: 9999,
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        fontSize: '0.95rem',
        pointerEvents: 'none', // Let clicks pass through if needed? Maybe not.
        animation: 'fadeIn 0.3s ease-out'
    };

    const arrowStyle = {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
    };

    if (placement === 'top') {
        arrowStyle.borderWidth = '10px 10px 0 10px';
        arrowStyle.borderColor = '#6c5ce7 transparent transparent transparent';
        arrowStyle.bottom = '-10px';
        arrowStyle.left = '50%';
        arrowStyle.transform = 'translateX(-50%)';
    } else if (placement === 'bottom') {
        arrowStyle.borderWidth = '0 10px 10px 10px';
        arrowStyle.borderColor = 'transparent transparent #6c5ce7 transparent';
        arrowStyle.top = '-10px';
        arrowStyle.left = '50%';
        arrowStyle.transform = 'translateX(-50%)';
    }

    return createPortal(
        <div style={style} className="coach-mark">
            {message}
            <div style={arrowStyle} />
        </div>,
        document.body
    );
};

export default CoachMark;
