import React from 'react';
import FunctionCategoryPage from './FunctionCategoryPage';
import { MATH_DATE_OPS } from '../data';

const DocsMathDates = () => (
    <FunctionCategoryPage
        title="Math & Dates"
        description="Perform calculations or reformat dates."
        ops={MATH_DATE_OPS}
    />
);

export default DocsMathDates;
