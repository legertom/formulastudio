import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

// Basic localized styles to avoid polluting global CSS
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // High z-index to sit on top of everything
    },
    modal: {
        backgroundColor: '#1E1E1E', // Dark mode background
        color: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        width: '800px', // Wider for canvas
        maxWidth: '95vw',
        maxHeight: '90vh',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden', // Contain the scroll
    },
    title: {
        marginTop: 0,
        marginBottom: '0.25rem',
        fontSize: '1.25rem',
        fontWeight: '600',
    },
    canvasContainer: {
        border: '1px solid #333',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
        flex: 1, // Take available height
        minHeight: '200px',
        cursor: 'crosshair',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto' // Allow scrolling if screenshot is huge
    },
    textarea: {
        width: '100%',
        height: '80px',
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #333',
        backgroundColor: '#2A2A2A',
        color: '#fff',
        fontFamily: 'inherit',
        resize: 'none',
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        marginTop: '0.5rem',
    },
    toolbar: {
        display: 'flex',
        gap: '0.5rem',
    },
    button: {
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'opacity 0.2s',
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        color: '#aaa',
        border: '1px solid #444',
    },
    submitBtn: {
        backgroundColor: '#646cff', // Vite purple or brand color
        color: '#fff',
    },
    toolBtn: {
        backgroundColor: '#333',
        color: '#fff',
        border: '1px solid #555',
        fontSize: '0.9rem',
    },
    triggerBtn: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '0.75rem 1.25rem',
        backgroundColor: '#333',
        color: '#fff',
        border: '1px solid #444',
        borderRadius: '50px',
        cursor: 'pointer',
        zIndex: 9000,
        fontWeight: '500',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s, background-color 0.2s',
    },
};

const FeedbackWidget = ({ location = 'Unknown' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Canvas Refs
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const screenshotImageRef = useRef(null); // Keep reference to original image

    // Function to grab screenshot
    const handleOpen = async () => {
        setIsCapturing(true);
        try {
            // We hide the button temporarily so it doesn't show up in the screenshot
            const btn = document.getElementById('feedback-trigger-btn');
            if (btn) btn.style.visibility = 'hidden';

            // CAPTURE FIX: window.scrollY correction
            const canvas = await html2canvas(document.body, {
                scale: window.devicePixelRatio,
                useCORS: true,
                logging: false,
                // These options often fix viewport alignment issues
                scrollX: 0,
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight,
            });

            if (btn) btn.style.visibility = 'visible';

            // Store the screenshot temporarily to load into our drawing canvas
            const base64Image = canvas.toDataURL('image/png');
            setIsOpen(true);

            // Wait for modal to render, then init canvas
            setTimeout(() => initCanvas(base64Image), 50);

        } catch (error) {
            console.error('Screenshot failed:', error);
            alert('Could not capture screenshot. You can still submit text feedback.');
            setIsOpen(true);
        } finally {
            setIsCapturing(false);
        }
    };

    const initCanvas = (dataUrl) => {
        const img = new Image();
        img.onload = () => {
            screenshotImageRef.current = img;
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                // Limit max height to avoid massive canvases
                const MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                // Scale down if huge (for retina displays) to fit easier in view
                // Or just keep original resolution? Let's keep resolution but display smaller via CSS

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0);
            }
        };
        img.src = dataUrl;
    };

    const handleClose = () => {
        setIsOpen(false);
        setFeedback('');
        setIsSubmitting(false);
    };

    // Drawing Logic
    const getMousePos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        isDrawing.current = true;
        lastPos.current = getMousePos(e);
    };

    const draw = (e) => {
        if (!isDrawing.current || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        const pos = getMousePos(e);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        lastPos.current = pos;
    };

    const stopDrawing = () => {
        isDrawing.current = false;
    };

    const handleClear = () => {
        if (!canvasRef.current || !screenshotImageRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(screenshotImageRef.current, 0, 0);
    };

    const handleSubmit = async () => {
        if (!feedback.trim()) return;

        setIsSubmitting(true);
        try {
            // Get final image from canvas
            const finalScreenshot = canvasRef.current.toDataURL('image/png');

            const payload = {
                feedback,
                screenshot: finalScreenshot,
                location: `${location} | URL: ${window.location.href}`,
            };

            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                // Check if we're in local dev (API not available)
                if (res.status === 404) {
                    console.log('📋 FEEDBACK (Local Dev Mode - API not available):');
                    console.log('Location:', payload.location);
                    console.log('Message:', payload.feedback);
                    console.log('Screenshot:', payload.screenshot.substring(0, 100) + '...');
                    alert('⚠️ Local dev mode: Feedback logged to console (not sent to Discord)');
                    handleClose();
                    return;
                }
                throw new Error('Failed to submit');
            }

            alert('✅ Feedback sent! Thanks for your help.');
            handleClose();
        } catch (error) {
            console.error(error);
            alert('Failed to send feedback. Check console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            {!isOpen && (
                <button
                    id="feedback-trigger-btn"
                    style={styles.triggerBtn}
                    onClick={handleOpen}
                    disabled={isCapturing}
                >
                    {isCapturing ? 'Capturing...' : 'Feedback'}
                </button>
            )}

            {/* Modal */}
            {isOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal} role="dialog" aria-modal="true">
                        <h3 style={styles.title}>Send Feedback</h3>

                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>
                            Draw on the screen to highlight the issue.
                        </p>

                        <div style={styles.canvasContainer}>
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                style={{ maxWidth: '100%', display: 'block' }}
                            />
                        </div>

                        <div style={styles.buttonRow}>
                            <div style={styles.toolbar}>
                                <button style={{ ...styles.button, ...styles.toolBtn }} onClick={handleClear}>
                                    Clear Drawing
                                </button>
                            </div>
                        </div>

                        <textarea
                            style={styles.textarea}
                            placeholder="Describe what happened..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            disabled={isSubmitting}
                            autoFocus
                        />

                        <div style={styles.buttonRow}>
                            <button
                                style={{ ...styles.button, ...styles.cancelBtn }}
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                style={{ ...styles.button, ...styles.submitBtn, opacity: isSubmitting || !feedback.trim() ? 0.5 : 1 }}
                                onClick={handleSubmit}
                                disabled={isSubmitting || !feedback.trim()}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Feedback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackWidget;
