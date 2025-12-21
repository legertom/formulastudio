import React from 'react';
import FunctionCategoryPage from './FunctionCategoryPage';
import { TEXT_EXTRACTION_OPS } from '../data';

const DocsTextExtraction = () => (
    <FunctionCategoryPage
        title="Text Extraction"
        description="Functions to pull specific parts of a string based on delimiters."
        ops={TEXT_EXTRACTION_OPS}
    />
);

export default DocsTextExtraction;
