import React from 'react';
import FunctionCategoryPage from './FunctionCategoryPage';
import { LOGIC_OPS } from './functionData';

const DocsLogic = () => (
    <FunctionCategoryPage
        title="Logic & Comparison"
        description="Operators for conditional logic, comparisons, and boolean operations."
        ops={LOGIC_OPS}
    />
);

export default DocsLogic;
