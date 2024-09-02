import React from 'react';
import { MathJax } from 'better-react-mathjax';

const LatexRenderer = ({ children }) => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise([document.body]).catch((err) => 
        console.error('MathJax typesetting failed:', err)
      );
    }
  }, [children]);
  
  return (
    <MathJax>
      {children}
    </MathJax>
  );
};

export default LatexRenderer;