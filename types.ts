export interface HistoryItem {
    id: string;
    fileName: string;
    date: string;
    preview: string;
    fullText: string;
}

export interface TranscriptionOptions {
    includeDiarization: boolean;
    includeTimestamps: boolean;
}

export type Language = 'es' | 'en';
export type Theme = 'dark' | 'light';
