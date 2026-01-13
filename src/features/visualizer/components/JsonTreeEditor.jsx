import React, { useState, useCallback } from 'react';

/**
 * JsonTreeEditor - A collapsible tree view with inline editing for JSON data
 * Supports editing both keys and values
 */

const TreeNode = ({ keyName, value, path, onValueChange, onKeyChange, expandedPaths, toggleExpand, isLast }) => {
    const [isEditingValue, setIsEditingValue] = useState(false);
    const [isEditingKey, setIsEditingKey] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [editKey, setEditKey] = useState('');
    const pathString = path.join('.');
    const isExpanded = expandedPaths.has(pathString);

    // Value editing
    const handleStartEditValue = () => {
        if (typeof value !== 'object' || value === null) {
            setEditValue(String(value));
            setIsEditingValue(true);
        }
    };

    const handleSaveEditValue = () => {
        setIsEditingValue(false);
        // Try to preserve type
        let newValue = editValue;
        if (editValue === 'true') newValue = true;
        else if (editValue === 'false') newValue = false;
        else if (!isNaN(Number(editValue)) && editValue.trim() !== '') newValue = Number(editValue);
        onValueChange(path, newValue);
    };

    const handleKeyDownValue = (e) => {
        if (e.key === 'Enter') handleSaveEditValue();
        if (e.key === 'Escape') setIsEditingValue(false);
    };

    // Key editing
    const handleStartEditKey = () => {
        setEditKey(keyName);
        setIsEditingKey(true);
    };

    const handleSaveEditKey = () => {
        setIsEditingKey(false);
        if (editKey && editKey !== keyName) {
            onKeyChange(path, editKey);
        }
    };

    const handleKeyDownKey = (e) => {
        if (e.key === 'Enter') handleSaveEditKey();
        if (e.key === 'Escape') setIsEditingKey(false);
    };

    // Render value based on type
    const renderValue = () => {
        if (isEditingValue) {
            return (
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEditValue}
                    onKeyDown={handleKeyDownValue}
                    onFocus={(e) => e.target.select()}
                    autoFocus
                    className="tree-edit-input"
                />
            );
        }

        if (value === null) return <span className="tree-value tree-null">null</span>;
        if (typeof value === 'boolean') return <span className="tree-value tree-boolean">{String(value)}</span>;
        if (typeof value === 'number') return <span className="tree-value tree-number">{value}</span>;
        if (typeof value === 'string') return <span className="tree-value tree-string">"{value}"</span>;
        return null;
    };

    // Render key (editable or display)
    const renderKey = () => {
        if (isEditingKey) {
            return (
                <input
                    type="text"
                    value={editKey}
                    onChange={(e) => setEditKey(e.target.value)}
                    onBlur={handleSaveEditKey}
                    onKeyDown={handleKeyDownKey}
                    onFocus={(e) => e.target.select()}
                    autoFocus
                    className="tree-edit-input tree-edit-key"
                />
            );
        }
        return (
            <span
                className="tree-key"
                onClick={handleStartEditKey}
                title="Click to rename key"
            >
                {keyName}
            </span>
        );
    };

    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);
    const childCount = isObject ? Object.keys(value).length : 0;

    return (
        <div className="tree-node">
            <div className="tree-node-row">
                {/* Tree connector */}
                <span className="tree-connector">{isLast ? '└─' : '├─'}</span>

                {/* Expand/collapse toggle for objects/arrays */}
                {isObject ? (
                    <button
                        className="tree-toggle"
                        onClick={() => toggleExpand(pathString)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? '▼' : '▶'}
                    </button>
                ) : (
                    <span className="tree-toggle-placeholder" />
                )}

                {/* Key name (editable) */}
                {renderKey()}
                <span className="tree-colon">:</span>

                {/* Value or type indicator */}
                {isObject ? (
                    <span className="tree-type-badge">
                        {isArray ? `Array(${childCount})` : `{${childCount}}`}
                    </span>
                ) : (
                    <span
                        className="tree-value-wrapper"
                        onClick={handleStartEditValue}
                        title="Click to edit value"
                    >
                        {renderValue()}
                    </span>
                )}
            </div>

            {/* Children (if expanded) */}
            {isObject && isExpanded && (
                <div className="tree-children">
                    {Object.entries(value).map(([childKey, childValue], index, arr) => (
                        <TreeNode
                            key={childKey}
                            keyName={childKey}
                            value={childValue}
                            path={[...path, childKey]}
                            onValueChange={onValueChange}
                            onKeyChange={onKeyChange}
                            expandedPaths={expandedPaths}
                            toggleExpand={toggleExpand}
                            isLast={index === arr.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const JsonTreeEditor = ({ data, onChange }) => {
    const [expandedPaths, setExpandedPaths] = useState(() => {
        // Expand top-level by default
        const initial = new Set(['']);
        Object.keys(data || {}).forEach(key => initial.add(key));
        return initial;
    });

    const toggleExpand = useCallback((path) => {
        setExpandedPaths(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    }, []);

    const expandAll = useCallback(() => {
        const allPaths = new Set(['']);
        const collectPaths = (obj, prefix = '') => {
            if (typeof obj === 'object' && obj !== null) {
                Object.entries(obj).forEach(([key, value]) => {
                    const path = prefix ? `${prefix}.${key}` : key;
                    allPaths.add(path);
                    collectPaths(value, path);
                });
            }
        };
        collectPaths(data);
        setExpandedPaths(allPaths);
    }, [data]);

    const collapseAll = useCallback(() => {
        setExpandedPaths(new Set(['']));
    }, []);

    const handleValueChange = useCallback((path, newValue) => {
        // Deep clone and update
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = newValue;
        onChange(newData);
    }, [data, onChange]);

    const handleKeyChange = useCallback((path, newKey) => {
        // Deep clone and rename key
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        const oldKey = path[path.length - 1];
        if (oldKey !== newKey && !current.hasOwnProperty(newKey)) {
            // Rename: copy value to new key, delete old key
            current[newKey] = current[oldKey];
            delete current[oldKey];
            onChange(newData);
        }
    }, [data, onChange]);

    if (!data || typeof data !== 'object') {
        return <div className="tree-empty">No data to display</div>;
    }

    return (
        <div className="json-tree-editor">
            <div className="tree-controls">
                <button onClick={expandAll} className="tree-btn">Expand All</button>
                <button onClick={collapseAll} className="tree-btn">Collapse All</button>
            </div>
            <div className="tree-root">
                {Object.entries(data).map(([key, value], index, arr) => (
                    <TreeNode
                        key={key}
                        keyName={key}
                        value={value}
                        path={[key]}
                        onValueChange={handleValueChange}
                        onKeyChange={handleKeyChange}
                        expandedPaths={expandedPaths}
                        toggleExpand={toggleExpand}
                        isLast={index === arr.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default JsonTreeEditor;

