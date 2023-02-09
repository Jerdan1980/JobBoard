import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function Markdown({ contents }) {
	return (
		<ReactMarkdown children={contents} 
			remarkPlugins={[ [remarkGfm, {singleTilde: false}], [remarkMath] ]}
			rehypePlugins={[rehypeKatex]}
			/>
	)
}