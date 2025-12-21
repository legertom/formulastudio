import React from 'react';
import FunctionCategoryPage from './FunctionCategoryPage';
import { UTILITY_OPS } from '../data';

const DocsUtilities = () => (
    <FunctionCategoryPage
        title="Utilities"
        description="Combine fields, handle empty data, and other helper functions."
        ops={UTILITY_OPS}
    />
);

export default DocsUtilities;
