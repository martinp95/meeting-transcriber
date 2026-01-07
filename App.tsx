import React, { useState, useCallback, DragEvent, useRef, useEffect } from 'react';

// Components
import { UploadIcon, FileAudioIcon, FileVideoIcon, TrashIcon, CopyIcon, DownloadIcon, GlobeIcon, SunIcon, MoonIcon, HistoryIcon, LoadingSpinner } from './components/Icons';
import TranscriptionViewer from './components/TranscriptionViewer';
import ToggleOption from './components/ToggleOption';
import HistoryDrawer from './components/HistoryDrawer';

// Services & Constants
import { translations } from './constants/translations';
import { constructTranscriptionPrompt, transcribeFileWithGemini } from './services/geminiService';
import { fetchSampleFile, generateDocxBlob } from './services/fileService';
import { HistoryItem } from './types';

declare const document: any;
declare const navigator: any;

export default function App() {
    const [language, setLanguage] = useState<'es' | 'en'>('es');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const t = translations[language];

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    
    // Configuration Options
    const [includeDiarization, setIncludeDiarization] = useState(false);
    const [includeTimestamps, setIncludeTimestamps] = useState(false);

    // History State
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const downloadRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const historyRef = useRef<HTMLDivElement>(null);

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('transcriptionHistory');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Error loading history", e);
            }
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const toggleHistory = () => {
        setShowHistory(prev => !prev);
    };

    const saveToHistory = (text: string, currentFile: File) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            fileName: currentFile.name,
            date: new Date().toLocaleString(),
            preview: text.substring(0, 100) + "...",
            fullText: text
        };
        
        const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10 items
        setHistory(updatedHistory);
        localStorage.setItem('transcriptionHistory', JSON.stringify(updatedHistory));
    };

    const removeFromHistory = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedHistory = history.filter(item => item.id !== id);
        setHistory(updatedHistory);
        localStorage.setItem('transcriptionHistory', JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('transcriptionHistory');
    };

    const loadFromHistory = (item: HistoryItem) => {
        setTranscription(item.fullText);
        setShowHistory(false);
    };

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const selectedFile = files[0];
            const isMkv = selectedFile.name.toLowerCase().endsWith('.mkv');
            if (selectedFile.type.startsWith('audio/') || selectedFile.type.startsWith('video/') || isMkv) {
                setFile(selectedFile);
                setError('');
                setTranscription('');
                setProgress(0);
                setProgressMessage('');
            } else {
                setError(t.errorInvalidFile);
            }
        }
    };

    const handleUseSampleFile = async () => {
        setIsLoading(true);
        setError('');
        setProgress(0);
        setProgressMessage(t.loadingSample);

        try {
            const sampleFile = await fetchSampleFile();
            setFile(sampleFile);
            setError('');
            setTranscription('');
        } catch (error) {
            console.error("Error loading sample:", error);
            setError(t.errorSample);
        } finally {
            setIsLoading(false);
            setProgressMessage('');
        }
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange((e.dataTransfer as any).files);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setTranscription('');
        setError('');
        setProgress(0);
        setProgressMessage('');
        if (fileInputRef.current) {
            (fileInputRef.current as any).value = "";
        }
    };

    const handleTranscribe = useCallback(async () => {
        if (!file) {
            setError(t.errorSelectFile);
            return;
        }

        setIsLoading(true);
        setError('');
        setTranscription('');
        setProgress(0);
        setProgressMessage(t.progressPreparing);

        try {
            const prompt = constructTranscriptionPrompt(t, {
                includeDiarization,
                includeTimestamps
            });

            setProgressMessage(t.progressAnalyzing);

            const text = await transcribeFileWithGemini(file, prompt, (percentage) => {
                setProgress(percentage);
                if (percentage === 50) setProgressMessage(t.progressAnalyzing);
            });

            if (text) {
                setTranscription(text);
                saveToHistory(text, file);
            }
            setProgress(100);
            setProgressMessage(t.progressComplete);

        } catch (err) {
            console.error(err);
            setError(t.errorGeneric);
            setProgress(0);
            setProgressMessage('');
        } finally {
            setIsLoading(false);
        }
    }, [file, includeDiarization, includeTimestamps, t, history]);

    const handleCopy = () => {
        if (transcription) {
            (navigator as any).clipboard.writeText(transcription)
                .then(() => {
                    setCopySuccess(t.copySuccess);
                    setTimeout(() => setCopySuccess(''), 2000);
                })
                .catch((err: any) => {
                    console.error('Failed to copy: ', err);
                    setCopySuccess(t.copyError);
                    setTimeout(() => setCopySuccess(''), 2000);
                });
        }
    };

    const handleDownload = async (format: 'txt' | 'md' | 'docx') => {
        if (!transcription) return;

        try {
            let blob: Blob;
            let extension = format;

            if (format === 'docx') {
                blob = await generateDocxBlob(transcription);
            } else {
                blob = new Blob([transcription], { type: format === 'txt' ? 'text/plain' : 'text/markdown' });
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transcription.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Error generating file", e);
            setError(t.errorGeneric);
        }
        setShowDownloadOptions(false);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadRef.current && !(downloadRef.current as any).contains(event.target as any)) {
                setShowDownloadOptions(false);
            }
            if (historyRef.current && !(historyRef.current as any).contains(event.target as any) && showHistory) {
                setShowHistory(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showHistory]);

    return (
        <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 relative transition-colors duration-300 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-x-hidden">
            
            {/* Header Controls */}
            <div className="w-full max-w-4xl flex justify-end mb-2 gap-2 relative z-30">
                 <button 
                    onClick={toggleHistory}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    title={t.historyTitle}
                >
                    <HistoryIcon className="w-5 h-5" />
                </button>
                 <button 
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
                 <button 
                    onClick={toggleLanguage} 
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
                    title="Switch Language / Cambiar Idioma"
                >
                    <GlobeIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className={language === 'es' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}>ES</span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span className={language === 'en' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}>EN</span>
                </button>
            </div>

            <HistoryDrawer 
                showHistory={showHistory}
                onClose={() => setShowHistory(false)}
                history={history}
                onLoad={loadFromHistory}
                onRemove={removeFromHistory}
                onClear={clearHistory}
                t={t}
            />

            <div className="w-full max-w-4xl mx-auto z-10">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100">Meeting Transcriber <span className="text-teal-600 dark:text-teal-400">AI</span></h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">{t.subtitle}</p>
                </header>

                <main className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm transition-colors duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Left Column: File Upload and Controls */}
                        <div className="flex flex-col space-y-4">
                            {!file ? (
                                <div
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => (fileInputRef.current as any)?.click()}
                                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-teal-500 bg-teal-50 dark:bg-slate-700/50' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                        <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
                                        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400"><span className="font-semibold text-teal-600 dark:text-teal-400">{t.dropzoneDefault}</span> {t.dropzoneOr}</p>
                                        <p className="text-xs text-slate-500">{t.dropzoneFormats}</p>
                                        
                                        <div className="mt-4 z-10">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUseSampleFile();
                                                }}
                                                className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 text-sm underline font-medium transition-colors"
                                            >
                                                {t.loadSample}
                                            </button>
                                        </div>
                                    </div>
                                    <input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" accept="audio/*,video/*,.mkv" onChange={(e) => handleFileChange((e.target as any).files)} />
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-600">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        {file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mkv') ? (
                                            <FileVideoIcon className="w-8 h-8 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                                        ) : (
                                            <FileAudioIcon className="w-8 h-8 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                                        )}
                                        <span className="text-sm font-medium truncate text-slate-700 dark:text-slate-200">{file.name}</span>
                                    </div>
                                    <button onClick={handleRemoveFile} title={t.removeFile} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-white transition-colors flex-shrink-0">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {file && !isLoading && (
                                <div className="grid grid-cols-2 gap-3">
                                    <ToggleOption 
                                        label={t.optDiarization}
                                        checked={includeDiarization} 
                                        onChange={setIncludeDiarization} 
                                    />
                                    <ToggleOption 
                                        label={t.optTimestamps}
                                        checked={includeTimestamps} 
                                        onChange={setIncludeTimestamps} 
                                    />
                                </div>
                            )}

                            {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

                            <button
                                onClick={handleTranscribe}
                                disabled={!file || isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-500 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
                            >
                                {isLoading ? <LoadingSpinner /> : t.btnTranscribe}
                            </button>
                            
                            {(isLoading || progress > 0) && (
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                     <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                     <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2 animate-pulse">{progressMessage}</p>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Transcription Output */}
                        <div className="relative h-[500px] flex flex-col bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner transition-colors">
                           {transcription ? (
                                <>
                                    <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
                                        {copySuccess && <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded transition-opacity duration-300">{copySuccess}</span>}
                                        <button onClick={handleCopy} title="Copy to clipboard" className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-colors shadow-sm">
                                            <CopyIcon className="w-4 h-4" />
                                        </button>
                                         <div ref={downloadRef} className="relative">
                                            <button onClick={() => setShowDownloadOptions(!showDownloadOptions)} title="Download transcription" className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-colors shadow-sm">
                                                <DownloadIcon className="w-4 h-4" />
                                            </button>
                                            {showDownloadOptions && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md shadow-xl py-1 z-20">
                                                    <button onClick={() => handleDownload('txt')} className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white">
                                                        {t.downloadTxt}
                                                    </button>
                                                    <button onClick={() => handleDownload('md')} className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white">
                                                        {t.downloadMd}
                                                    </button>
                                                    <button onClick={() => handleDownload('docx')} className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white">
                                                        {t.downloadDocx}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <TranscriptionViewer text={transcription} />
                                    <div className="absolute bottom-3 right-6 pointer-events-none z-10">
                                        <span className="bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-md text-slate-500 dark:text-slate-400 text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-600 font-mono shadow-sm">
                                            {transcription.length.toLocaleString()} {t.charCount}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-500 p-8 space-y-3">
                                    <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded-full mb-2">
                                        <svg className="w-8 h-8 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                    </div>
                                    <p className="font-medium text-slate-400">{t.placeholderReady}</p>
                                    <p className="text-sm text-slate-400 dark:text-slate-600 max-w-xs">{t.placeholderDesc}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}