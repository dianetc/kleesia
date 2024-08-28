import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax'

const config = {
  loader: { load: ["input/tex", "output/svg"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)']
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]']
    ]
  }
};

const LatexRenderer = ({ children }) => {
  return (
    <MathJaxContext config={config}>
      <MathJax>{children}</MathJax>
    </MathJaxContext>
  );
};

export default LatexRenderer;