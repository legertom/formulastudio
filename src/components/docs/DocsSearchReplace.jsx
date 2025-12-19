import React from 'react';
import FunctionCategoryPage from './FunctionCategoryPage';
import { SEARCH_REPLACE_OPS } from './functionData';

const DocsSearchReplace = () => (
    <FunctionCategoryPage
        title="Search & Replace"
        description="Find and modify specific content within a field."
        ops={SEARCH_REPLACE_OPS}
    />
);

export default DocsSearchReplace;
