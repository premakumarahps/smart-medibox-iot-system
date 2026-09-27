import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  latex: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ latex, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (e) {
      console.error('KaTeX rendering error:', latex, e);
      return `<span class="text-rose-400 font-mono text-xs">${latex}</span>`;
    }
  }, [latex, block]);

  if (block) {
    return (
      <div
        className={`overflow-x-auto py-2 my-1 text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block text-slate-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
