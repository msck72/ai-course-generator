import React from 'react';

export default function ParagraphBlock({ block }) {
    return (
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed my-3">
            {block.text}
        </p>
    );
}