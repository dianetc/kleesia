import dynamic from 'next/dynamic';
import React from 'react';

const MathJax = dynamic(() => import('better-react-mathjax').then((mod) => mod.MathJax), {
  ssr: false,
});

const MathJaxContext = dynamic(() => import('better-react-mathjax').then((mod) => mod.MathJaxContext), {
  ssr: false,
});

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

export default dynamic(() => Promise.resolve(LatexRenderer), {
  ssr: false,
});