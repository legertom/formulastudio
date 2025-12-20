import React, { useRef, useEffect } from 'react';

export default function LogicEditor({ value, onChange, highlightRange, placeholder }) {
    const textareaRef = useRef(null);
    const backdropRef = useRef(null);

    // Sync scroll
    const handleScroll = (e) => {
        if (backdropRef.current) {
            backdropRef.current.scrollTop = e.target.scrollTop;
            backdropRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    // Construct highlighted content
    const renderBackdrop = () => {
        if (!highlightRange) {
            return <div className="editor-text-layer">{value}</div>;
        }

        const [start, end] = highlightRange;
        // Ensure bounds validation
        const validStart = Math.max(0, Math.min(start, value.length));
        const validEnd = Math.max(validStart, Math.min(end, value.length));

        const before = value.substring(0, validStart);
        const highlighted = value.substring(validStart, validEnd);
        const after = value.substring(validEnd);

        return (
            <div className="editor-text-layer">
                {before}
                <span className="editor-highlight">{highlighted}</span>
                {after}
                {/* Ensure a trailing break if the text ends in newline to match textarea behavior */}
                {value.endsWith('\n') && <br />}
            </div>
        );
    };

    return (
        <div className="logic-editor-container">
            <div className="backdrop" ref={backdropRef} aria-hidden="true">
                {renderBackdrop()}
            </div>
            <textarea
                ref={textareaRef}
                className="editor-textarea"
                value={value}
                onChange={onChange}
                onScroll={handleScroll}
                placeholder={placeholder}
                spellCheck="false"
            />
        </div>
    );
}
