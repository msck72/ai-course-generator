import React, { useState, useEffect } from 'react';
import { searchYoutube } from '../../services/api';
import { Video, ExternalLink, Loader2 } from 'lucide-react';

export default function VideoBlock({ block }) {
    const [videoData, setVideoData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const query = block.query || 'Tutorial video';

    useEffect(() => {
        let isMounted = true;

        const fetchVideo = async () => {
            try {
                setIsLoading(true);
                const res = await searchYoutube(query);
                if (isMounted) {
                    setVideoData(res.data);
                }
            } catch (err) {
                console.warn('Failed to load video embed, using link fallback: ', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchVideo();
        return () => {
            isMounted = false;
        }
    }, [query]);

    if (isLoading) {
        return (
            <div className="my-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Finding relevant video tutorial...</span>
            </div>
        );
    }
    if (videoData?.videoId) {
        return (
            <div className="my-8 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                        <Video className="w-4 h-4 text-red-400" />
                        <span className="line-clamp-1">{videoData.title}</span>
                    </div>
                    <a
                        href={`https://www.youtube.com/watch?v=${videoData.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors shrink-0"
                    >
                        <span>Open in YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
                <div className="relative w-full aspect-video">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoData.videoId}`}
                        title={videoData.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full border-0"
                    />
                </div>
            </div>
        );
    }
    const fallbackUrl =
        videoData?.fallbackUrl ||
        `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    return (
        <div className="my-6 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Recommended Video Tutorial
                    </span>
                    <p className="text-sm font-semibold text-slate-200 mt-0.5">
                        "{query}"
                    </p>
                </div>
            </div>
            <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition-colors shrink-0"
            >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
            </a>
        </div>
    );
}