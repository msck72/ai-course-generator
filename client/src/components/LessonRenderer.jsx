import React from 'react';
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CodeBlock from './blocks/CodeBlock';
import MCQBlock from './blocks/MCQBlock';

export default function LessonRenderer({ content }) {
    if (!Array.isArray(content) || content.length == 0) {
        return (
            <div className="py-8 text-center text-slate-500 text-sm">
                No content blocks available for this lesson yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {content.map((block, idx) => {
                switch (block.type) {
                    case 'heading':
                        return <HeadingBlock key={idx} block={block} />;
                    case 'paragraph':
                        return <ParagraphBlock key={idx} block={block} />;
                    case 'code':
                        return <CodeBlock key={idx} block={block} />;
                    case 'mcq':
                        return <MCQBlock key={idx} block={block} />;
                    default:
                        return null;
                }
            })}
        </div>
    );

}