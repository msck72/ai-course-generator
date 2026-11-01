import React from 'react';

export default function HeadingBlock({ block }) {
    return (
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-8 mb-3 pb-2 border-b border-slate-800">
            {block.text}
        </h2>
    );
}