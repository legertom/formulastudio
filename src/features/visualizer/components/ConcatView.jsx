
import React from 'react';
import { flattenConcat } from '../logic/pathExpansion';
import CleanValue from './CleanValue';

const ConcatView = ({ node }) => {
    const parts = flattenConcat(node);

    return (
        <div className="concat-stream">
            {parts.map((part, i) => (
                <div key={i} className="stream-part-wrapper">
                    {i > 0 && <span className="stream-plus">+</span>}
                    <CleanValue node={part} />
                </div>
            ))}
        </div>
    );
};

export default ConcatView;
