import React from 'react';

interface TranscriptionViewerProps {
    text: string;
    onSeek?: (seconds: number) => void;
}

const parseTimestampToSeconds = (timestamp: string): number => {
    try {
        const clean = timestamp.replace(/[\[\]]/g, '');
        const parts = clean.split(':').map(p => parseInt(p, 10));
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        }
    } catch (e) {
        return 0;
    }
    return 0;
};

const TranscriptionViewer = ({ text, onSeek }: TranscriptionViewerProps) => {
    const lines = text.split('\n');
    return (
        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-lg p-4 pb-12 overflow-y-auto text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {lines.map((line, index) => {
                // Regex matches: Optional timestamp [00:00] + Optional Speaker Label + Content
                // Groups: 1=Timestamp, 2=SpeakerLabel, 3=Content
                const regex = /^(\[\d{1,2}:\d{2}(?::\d{2})?\])?\s*(Hablante [A-Z0-9 ]+:|Speaker [A-Z0-9 ]+:)?\s*(.*)$/i;
                const match = line.match(regex);

                if (match) {
                    const timestamp = match[1];
                    const speakerLabel = match[2];
                    const content = match[3];

                    // If it's just an empty line or failed match that results in empty content (unlikely with .*), render simple line
                    if (!timestamp && !speakerLabel && !content) {
                         return <p key={index} className="mb-1">{line || '\u00A0'}</p>;
                    }

                    return (
                        <p key={index} className="mb-2">
                            {timestamp && (
                                <span 
                                    onClick={() => {
                                        if (onSeek) {
                                            onSeek(parseTimestampToSeconds(timestamp));
                                        }
                                    }}
                                    title={onSeek ? "Seek to this time" : undefined}
                                    className={`text-slate-500 dark:text-slate-500 mr-2 select-none ${onSeek ? 'cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 hover:underline' : ''}`}
                                >
                                    {timestamp}
                                </span>
                            )}
                            {speakerLabel && <span className="font-bold text-teal-600 dark:text-teal-400 mr-1">{speakerLabel}</span>}
                            <span>{content}</span>
                        </p>
                    );
                }
                return <p key={index} className="mb-1">{line || '\u00A0'}</p>;
            })}
        </div>
    );
};

export default TranscriptionViewer;