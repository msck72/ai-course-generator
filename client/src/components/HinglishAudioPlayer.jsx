import React, { useState, useEffect, useRef } from 'react';
import { getHinglishNarration } from '../services/api';
import { Volume2, Play, Pause, RotateCcw, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';

export default function HinglishAudioPlayer({ lessonId, title, content }) {
    const [script, setScript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [showTranscript, setShowTranscript] = useState(false);
    const [error, setError] = useState('');
    const utteranceRef = useRef(null);

    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const fetchScript = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await getHinglishNarration({ lessonId, title, content });
            if (res.success && res.data?.script) {
                setScript(res.data.script);
                return res.data.script;
            } else {
                throw new Error('No narration script returned');
            }
        } catch (err) {
            console.error('Failed to load narration: ', err);
            setError('Could not generate Hinglish narration.');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const speakText = (textToSpeak, playbackSpeed = speed) => {
        if (!('speechSynthesis' in window)) {
            setError('Your browser does not support text-to-speech.');
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = playbackSpeed;

        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(
            (v) =>
                v.lang.includes('hi') ||
                v.lang.includes('IN') ||
                v.name.toLowerCase().includes('india')
        );
        if (indianVoice) utterance.voice = indianVoice;

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onerror = (e) => {
            console.error('Speech error: ', e);
            setIsPlaying(false);
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
    };

    const handlePlayPause = async () => {
        if (!('speechSynthesis' in window)) {
            setError('Web Speech is not supported in this browser.');
            return;
        }

        if (isPlaying && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            return;
        }

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            return;
        }

        let currentScript = script;
        if (!currentScript) {
            currentScript = await fetchScript();
        }

        if (currentScript) {
            speakText(currentScript, speed);
        }
    };

    const handleStop = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
        setIsPaused(false);
    };

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed);
        if (isPlaying && script) {
            speakText(script, newSpeed);
        }
    };

    return (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-200">
                                AI Hinglish Audio Explainer
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 uppercase">
                                Hindi + English
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Listen to a quick conversational breakdown of this lesson
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-lg bg-slate-800/80 border border-slate-700 p-0.5 text-xs font-medium text-slate-300">
                        {[1, 1.25, 1.5].map((s) => (
                            <button
                                key={s}
                                onClick={() => handleSpeedChange(s)}
                                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                                    speed === s
                                        ? 'bg-indigo-600 text-white font-bold'
                                        : 'hover:text-white'
                                }`}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handlePlayPause}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating...</span>
                            </>
                        ) : isPlaying && !isPaused ? (
                            <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Pause</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>{isPaused ? 'Resume' : 'Listen'}</span>
                            </>
                        )}
                    </button>

                    {(isPlaying || isPaused) && (
                        <button
                            onClick={handleStop}
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                            title="Stop audio"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-lg p-2">
                    {error}
                </p>
            )}

            {script && (
                <div className="pt-2 border-t border-slate-800/80">
                    <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                        <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            {showTranscript ? 'Hide Hinglish Transcript' : 'Read Hinglish Transcript'}
                        </span>
                        {showTranscript ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                        )}
                    </button>

                    {showTranscript && (
                        <p className="mt-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                            {script}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
