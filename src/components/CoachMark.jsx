import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const CoachMark = ({ targetSelector, message, placement = 'top' }) => {
    const [position, setPosition] = useState(null);
    const [visible, setVisible] = useState(false);
    const dismissed = useRef(false);

    const dismiss = () => {
        dismissed.current = true;
        setVisible(false);
    };

    useEffect(() => {
        // Reset dismissed state when coach mark changes
        dismissed.current = false;

        const updatePosition = () => {
            // Don't show again if user dismissed it
            if (dismissed.current) return;

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
                top = rect.top + scrollY - 15;
                left = rect.left + scrollX + (rect.width / 2);
            } else if (placement === 'bottom') {
                top = rect.bottom + scrollY + 15;
                left = rect.left + scrollX + (rect.width / 2);
            } else if (placement === 'left') {
                top = rect.top + scrollY + (rect.height / 2);
                left = rect.left + scrollX - 15;
            } else if (placement === 'right') {
                top = rect.top + scrollY + (rect.height / 2);
                left = rect.right + scrollX + 15;
            }

            setPosition({ top, left });
            setVisible(true);
        };

        // Check immediately and on resize/scroll
        updatePosition();
        const interval = setInterval(updatePosition, 100);

        // Auto-dismiss logic: Add click listener to the target element
        const targetEl = document.querySelector(targetSelector);
        const handleTargetClick = () => {
            dismiss();
        };

        if (targetEl) {
            targetEl.addEventListener('click', handleTargetClick);
        }

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            clearInterval(interval);
            if (targetEl) {
                targetEl.removeEventListener('click', handleTargetClick);
            }
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [targetSelector, placement, message]);

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
        maxWidth: '250px',
        zIndex: 9999,
        boxShadow: '0 0 20px rgba(108, 92, 231, 0.6), 0 4px 15px rgba(0,0,0,0.3)',
        fontSize: '0.9rem',
        fontWeight: 500,
        pointerEvents: 'none', // Critical: Let clicks pass through so user can actually click the target!
        animation: 'coachMarkPulse 2s ease-in-out infinite',
        whiteSpace: 'normal',
        textAlign: 'center',
        lineHeight: '1.4'
    };

    const arrowStyle = {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
    };

    if (placement === 'top') {
        arrowStyle.borderWidth = '8px 8px 0 8px';
        arrowStyle.borderColor = '#6c5ce7 transparent transparent transparent';
        arrowStyle.bottom = '-8px';
        arrowStyle.left = '50%';
        arrowStyle.transform = 'translateX(-50%)';
    } else if (placement === 'bottom') {
        arrowStyle.borderWidth = '0 8px 8px 8px';
        arrowStyle.borderColor = 'transparent transparent #6c5ce7 transparent';
        arrowStyle.top = '-8px';
        arrowStyle.left = '50%';
        arrowStyle.transform = 'translateX(-50%)';
    } else if (placement === 'left') {
        arrowStyle.borderWidth = '8px 0 8px 8px'; // Pointing right (displayed on left)
        arrowStyle.borderColor = 'transparent transparent transparent #6c5ce7';
        arrowStyle.right = '-8px';
        arrowStyle.top = '50%';
        arrowStyle.transform = 'translateY(-50%)';
    } else if (placement === 'right') {
        arrowStyle.borderWidth = '8px 8px 8px 0'; // Pointing left (displayed on right)
        arrowStyle.borderColor = 'transparent #6c5ce7 transparent transparent';
        arrowStyle.left = '-8px';
        arrowStyle.top = '50%';
        arrowStyle.transform = 'translateY(-50%)';
    }



    const closeButtonStyle = {
        position: 'absolute',
        top: '4px',
        right: '6px',
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        color: 'white',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        lineHeight: 1,
        padding: 0,
        transition: 'background 0.15s ease',
    };

    return createPortal(
        <div
            style={{ ...style, pointerEvents: 'auto', cursor: 'pointer', paddingTop: '1.2rem' }}
            className="coach-mark"
            onClick={dismiss}
        >
            <button
                style={closeButtonStyle}
                onClick={(e) => { e.stopPropagation(); dismiss(); }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.35)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                aria-label="Close"
            >
                ×
            </button>
            {message}
            <div style={arrowStyle} />
        </div>,
        document.body
    );
};

export default CoachMark;
