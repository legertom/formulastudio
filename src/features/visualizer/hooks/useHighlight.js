import { useContext } from 'react';
import { FormulaContext } from '../FormulaContext';

export const useHighlight = (textValue) => {
    const { searchTerm } = useContext(FormulaContext);

    if (!textValue || !searchTerm) {
        return { isMatch: false, highlightClass: '' };
    }

    const isMatch = String(textValue).toLowerCase().includes(searchTerm.toLowerCase());

    return {
        isMatch,
        highlightClass: isMatch ? 'highlight-match' : ''
    };
};
