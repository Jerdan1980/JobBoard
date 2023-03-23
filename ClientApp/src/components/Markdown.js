import 'katex/dist/katex.min.css';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export default function Markdown({ contents }) {
	return (
		<ReactMarkdown children={contents} 
			remarkPlugins={[ [remarkGfm, {singleTilde: false}], [remarkMath] ]}
			rehypePlugins={[rehypeKatex]}
			/>
	)
}