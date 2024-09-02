import React from 'react';
import { MathJax } from 'better-react-mathjax';

const LatexRenderer = ({ children }) => {
  return (
    <MathJax>
      {children}
    </MathJax>
  );
};

export default LatexRenderer;