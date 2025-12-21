import React from 'react';
import FunctionCategoryPage from './FunctionCategoryPage';
import { TEXT_TRANSFORM_OPS } from '../data';

const DocsTextTransform = () => (
    <FunctionCategoryPage
        title="Text Transformation"
        description="Functions to change casing, extract characters, or clean up text."
        ops={TEXT_TRANSFORM_OPS}
    />
);

export default DocsTextTransform;
