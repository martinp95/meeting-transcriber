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
    outputLanguage: string;
}

export type Language = 'es' | 'en';
export type Theme = 'dark' | 'light';
export type ModelType = 'pro' | 'flash';
