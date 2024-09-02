import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const MathJax = dynamic(() => import('better-react-mathjax').then((mod) => mod.MathJax), {
  ssr: false,
});

const MathJaxContext = dynamic(() => import('better-react-mathjax').then((mod) => mod.MathJaxContext), {
  ssr: false,
});

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
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
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && window.MathJax) {
      window.MathJax.typesetPromise([contentRef.current]).catch((err) => console.error('MathJax typesetting failed:', err));
    }
  }, [children])
  return (
    <MathJaxContext config={config}>
      <MathJax>
        <div ref={contentRef}>{children}</div>
      </MathJax>
    </MathJaxContext>
  );
};

export default dynamic(() => Promise.resolve(LatexRenderer), {
  ssr: false,
});