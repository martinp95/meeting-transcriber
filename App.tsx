import React, { useState, useCallback, DragEvent, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Document, Packer, Paragraph, TextRun } from "docx";

// --- Translations ---

const translations = {
    es: {
        title: "Transcriptor de Reuniones",
        subtitle: "Sube el audio o video de tu reunión y obtén una transcripción completa con IA.",
        dropzoneDefault: "Haz clic para subir",
        dropzoneDragging: "Suelta el archivo aquí",
        dropzoneOr: "o arrastra y suelta",
        dropzoneFormats: "Audio (MP3, WAV) o Video (MP4, MOV)",
        fileSelected: "Archivo seleccionado",
        removeFile: "Eliminar archivo",
        optDiarization: "Identificar Hablantes",
        optTimestamps: "Marcas de Tiempo",
        errorSelectFile: "Por favor, selecciona un archivo primero.",
        errorInvalidFile: "Por favor, sube un archivo de audio o video válido.",
        errorGeneric: "Ocurrió un error durante la transcripción. Por favor, inténtalo de nuevo.",
        btnTranscribe: "Transcribir Archivo",
        btnTranscribing: "Transcribiendo...",
        progressPreparing: "Preparando archivo...",
        progressUploading: "Procesando medios...",
        progressAnalyzing: "Analizando con Gemini AI...",
        progressComplete: "¡Transcripción completa!",
        placeholderReady: "Listo para transcribir",
        placeholderDesc: "Sube un archivo y configura las opciones para ver el resultado aquí.",
        copySuccess: "¡Copiado!",
        copyError: "Error al copiar",
        downloadTxt: "Como .txt",
        downloadMd: "Como .md",
        downloadDocx: "Como .docx",
        loadSample: "Cargar archivo de muestra (Apollo 11)",
        loadingSample: "Descargando archivo de muestra...",
        errorSample: "Error al descargar el archivo de muestra.",
        // Prompt Instructions
        promptRole: "Eres un transcriptor experto. Tu tarea es transcribir el siguiente archivo de reunión (audio o video) con alta fidelidad.",
        promptDiarization: "Identifica con precisión a cada hablante individual y asígnales una etiqueta única (ej: 'Hablante A', 'Hablante B').",
        promptNoDiarization: "No es necesario distinguir hablantes individuales, transcribe el texto de forma fluida.",
        promptTimestamps: "Incluye marcas de tiempo precisas al inicio de cada intervención en formato [MM:SS].",
        promptNoTimestamps: "No incluyas marcas de tiempo.",
        promptFormatLineDiarTime: "Formato requerido por línea: [MM:SS] Hablante X: Contenido",
        promptFormatLineDiar: "Formato requerido por línea: Hablante X: Contenido",
        promptFormatLineTime: "Formato requerido por línea: [MM:SS] Contenido",
        promptFormatPlain: "Formato requerido: Texto plano dividido en párrafos lógicos.",
        promptExampleDiarTime: "\nEjemplo:\n[00:05] Hablante A: Hola a todos.\n[00:12] Hablante B: Buenos días.",
        promptExampleDiar: "\nEjemplo:\nHablante A: Hola a todos.\nHablante B: Buenos días.",
        promptExampleTime: "\nEjemplo:\n[00:05] Hola a todos.\n[00:12] Buenos días.",
        promptEnd: "El resultado debe ser limpio, en el idioma original del audio, y capturar todos los detalles de la conversación."
    },
    en: {
        title: "Meeting Transcriber",
        subtitle: "Upload your meeting audio or video and get a full AI transcription.",
        dropzoneDefault: "Click to upload",
        dropzoneDragging: "Drop file here",
        dropzoneOr: "or drag and drop",
        dropzoneFormats: "Audio (MP3, WAV) or Video (MP4, MOV)",
        fileSelected: "File selected",
        removeFile: "Remove file",
        optDiarization: "Identify Speakers",
        optTimestamps: "Timestamps",
        errorSelectFile: "Please select a file first.",
        errorInvalidFile: "Please upload a valid audio or video file.",
        errorGeneric: "An error occurred during transcription. Please try again.",
        btnTranscribe: "Transcribe File",
        btnTranscribing: "Transcribing...",
        progressPreparing: "Preparing file...",
        progressUploading: "Processing media...",
        progressAnalyzing: "Analyzing with Gemini AI...",
        progressComplete: "Transcription complete!",
        placeholderReady: "Ready to transcribe",
        placeholderDesc: "Upload a file and configure options to see the result here.",
        copySuccess: "Copied!",
        copyError: "Copy failed",
        downloadTxt: "As .txt",
        downloadMd: "As .md",
        downloadDocx: "As .docx",
        loadSample: "Load sample file (Apollo 11)",
        loadingSample: "Downloading sample file...",
        errorSample: "Error downloading sample file.",
        // Prompt Instructions
        promptRole: "You are an expert transcriber. Your task is to transcribe the following meeting file (audio or video) with high fidelity.",
        promptDiarization: "Accurately identify each individual speaker and assign them a unique label (e.g., 'Speaker A', 'Speaker B').",
        promptNoDiarization: "No need to distinguish individual speakers, transcribe the text fluently.",
        promptTimestamps: "Include accurate timestamps at the start of each intervention in [MM:SS] format.",
        promptNoTimestamps: "Do not include timestamps.",
        promptFormatLineDiarTime: "Required format per line: [MM:SS] Speaker X: Content",
        promptFormatLineDiar: "Required format per line: Speaker X: Content",
        promptFormatLineTime: "Required format per line: [MM:SS] Content",
        promptFormatPlain: "Required format: Plain text divided into logical paragraphs.",
        promptExampleDiarTime: "\nExample:\n[00:05] Speaker A: Hello everyone.\n[00:12] Speaker B: Good morning.",
        promptExampleDiar: "\nExample:\nSpeaker A: Hello everyone.\nSpeaker B: Good morning.",
        promptExampleTime: "\nExample:\n[00:05] Hello everyone.\n[00:12] Good morning.",
        promptEnd: "The result must be clean, in the original language of the audio, and capture all details of the conversation."
    }
};

// --- SVG Icon Components ---

const UploadIcon = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const FileAudioIcon = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="8" y1="15" x2="16" y2="15"></line>
        <line x1="8" y1="19" x2="16" y2="19"></line>
    </svg>
);

const FileVideoIcon = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
        <line x1="7" y1="2" x2="7" y2="22"></line>
        <line x1="17" y1="2" x2="17" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="2" y1="7" x2="7" y2="7"></line>
        <line x1="2" y1="17" x2="7" y2="17"></line>
        <line x1="17" y1="17" x2="22" y2="17"></line>
        <line x1="17" y1="7" x2="22" y2="7"></line>
    </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// --- Helper Functions ---

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

// --- Main App Component ---

const TranscriptionViewer = ({ text }: { text: string }) => {
    const lines = text.split('\n');
    return (
        <div className="w-full h-full bg-slate-800 rounded-lg p-4 overflow-y-auto text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
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
                            {timestamp && <span className="text-slate-500 mr-2 select-none">{timestamp}</span>}
                            {speakerLabel && <span className="font-bold text-teal-400 mr-1">{speakerLabel}</span>}
                            <span>{content}</span>
                        </p>
                    );
                }
                return <p key={index} className="mb-1">{line || '\u00A0'}</p>;
            })}
        </div>
    );
};

export default function App() {
    const [language, setLanguage] = useState<'es' | 'en'>('es');
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

    const downloadRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const selectedFile = files[0];
            if (selectedFile.type.startsWith('audio/') || selectedFile.type.startsWith('video/')) {
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
            const response = await fetch('https://storage.googleapis.com/generativeai-downloads/data/Apollo-11_Day-01-Highlights-10s.mp3', {
                mode: 'cors',
                credentials: 'omit'
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob();
            const sampleFile = new File([blob], "Apollo-11_Day-01-Highlights.mp3", { type: "audio/mpeg" });
            
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
        handleFileChange(e.dataTransfer.files);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setTranscription('');
        setError('');
        setProgress(0);
        setProgressMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            setProgress(25);
            const mediaPart = await fileToGenerativePart(file);
            setProgress(50);
            setProgressMessage(t.progressAnalyzing);
            
            // Dynamic Prompt Construction based on user options and language
            let instructions = t.promptRole;
            let formatting = "";
            let example = "";

            if (includeDiarization) {
                instructions += " " + t.promptDiarization;
            } else {
                instructions += " " + t.promptNoDiarization;
            }

            if (includeTimestamps) {
                instructions += " " + t.promptTimestamps;
            } else {
                instructions += " " + t.promptNoTimestamps;
            }

            // Generate Format Examples
            if (includeDiarization && includeTimestamps) {
                formatting = t.promptFormatLineDiarTime;
                example = t.promptExampleDiarTime;
            } else if (includeDiarization && !includeTimestamps) {
                formatting = t.promptFormatLineDiar;
                example = t.promptExampleDiar;
            } else if (!includeDiarization && includeTimestamps) {
                formatting = t.promptFormatLineTime;
                example = t.promptExampleTime;
            } else {
                formatting = t.promptFormatPlain;
            }

            const prompt = `${instructions}\n\n${formatting}${example}\n\n${t.promptEnd}`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: [prompt, mediaPart]
            });

            const text = response.text;
            setTranscription(text);
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
    }, [file, includeDiarization, includeTimestamps, t]);

    const handleCopy = () => {
        if (transcription) {
            navigator.clipboard.writeText(transcription)
                .then(() => {
                    setCopySuccess(t.copySuccess);
                    setTimeout(() => setCopySuccess(''), 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    setCopySuccess(t.copyError);
                    setTimeout(() => setCopySuccess(''), 2000);
                });
        }
    };

    const handleDownload = async (format: 'txt' | 'md' | 'docx') => {
        if (!transcription) return;

        if (format === 'docx') {
            // Generate DOCX with formatting
            const lines = transcription.split('\n');
            const docChildren = lines.map(line => {
                const regex = /^(\[\d{1,2}:\d{2}(?::\d{2})?\])?\s*(Hablante [A-Z0-9 ]+:|Speaker [A-Z0-9 ]+:)?\s*(.*)$/i;
                const match = line.match(regex);

                if (match) {
                    const timestamp = match[1];
                    const speakerLabel = match[2];
                    const content = match[3];

                    const runs = [];
                    if (timestamp) {
                        runs.push(new TextRun({ text: timestamp + " ", color: "64748B" })); // Slate-500
                    }
                    if (speakerLabel) {
                        runs.push(new TextRun({ text: speakerLabel + " ", bold: true, color: "2DD4BF" })); // Teal-400 (Approx)
                    }
                    if (content) {
                         runs.push(new TextRun({ text: content }));
                    }
                     // Fallback if regex matches but empty groups (newlines)
                    if (runs.length === 0) {
                         runs.push(new TextRun({ text: line }));
                    }

                    return new Paragraph({
                        children: runs,
                        spacing: { after: 200 }
                    });
                } else {
                     // Plain paragraph for lines not matching the pattern
                    return new Paragraph({
                        children: [new TextRun(line)],
                        spacing: { after: 200 }
                    });
                }
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: docChildren,
                }],
            });

            try {
                const blob = await Packer.toBlob(doc);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transcription.docx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (e) {
                console.error("Error generating docx", e);
                setError(t.errorGeneric);
            }

        } else {
            // Existing Text/MD logic
            const blob = new Blob([transcription], { type: format === 'txt' ? 'text/plain' : 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transcription.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        setShowDownloadOptions(false);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
                setShowDownloadOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Custom Checkbox Component for consistent styling
    const ToggleOption = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
        <div 
            onClick={() => onChange(!checked)} 
            className="flex items-center justify-between p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors border border-slate-600 hover:border-teal-500/50"
        >
            <span className="text-sm text-slate-200">{label}</span>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked ? 'bg-teal-500 border-teal-500' : 'bg-transparent border-slate-400'}`}>
                {checked && <CheckIcon className="w-3.5 h-3.5 text-white" />}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen text-white flex flex-col items-center p-4 sm:p-6 md:p-8 relative">
            
            {/* Language Toggle - Absolute positioned or in a header row */}
            <div className="w-full max-w-4xl flex justify-end mb-2">
                 <button 
                    onClick={toggleLanguage} 
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-600 transition-colors text-sm font-medium text-slate-300"
                    title="Switch Language / Cambiar Idioma"
                >
                    <GlobeIcon className="w-4 h-4 text-teal-400" />
                    <span className={language === 'es' ? 'text-teal-400' : 'text-slate-400'}>ES</span>
                    <span className="text-slate-600">|</span>
                    <span className={language === 'en' ? 'text-teal-400' : 'text-slate-400'}>EN</span>
                </button>
            </div>

            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-100">Meeting Transcriber <span className="text-teal-400">AI</span></h1>
                    <p className="text-slate-400 mt-2 text-lg">{t.subtitle}</p>
                </header>

                <main className="bg-slate-800/50 p-6 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Left Column: File Upload and Controls */}
                        <div className="flex flex-col space-y-4">
                            {!file ? (
                                <div
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-teal-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'}`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                        <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
                                        <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-teal-400">{t.dropzoneDefault}</span> {t.dropzoneOr}</p>
                                        <p className="text-xs text-slate-500">{t.dropzoneFormats}</p>
                                        
                                        <div className="mt-4 z-10">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUseSampleFile();
                                                }}
                                                className="text-teal-400 hover:text-teal-300 text-sm underline font-medium transition-colors"
                                            >
                                                {t.loadSample}
                                            </button>
                                        </div>
                                    </div>
                                    <input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" accept="audio/*,video/*" onChange={(e) => handleFileChange(e.target.files)} />
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-700 rounded-lg flex items-center justify-between border border-slate-600">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        {file.type.startsWith('video/') ? (
                                            <FileVideoIcon className="w-8 h-8 text-teal-400 flex-shrink-0" />
                                        ) : (
                                            <FileAudioIcon className="w-8 h-8 text-teal-400 flex-shrink-0" />
                                        )}
                                        <span className="text-sm font-medium truncate text-slate-200">{file.name}</span>
                                    </div>
                                    <button onClick={handleRemoveFile} title={t.removeFile} className="p-2 rounded-full text-slate-400 hover:bg-slate-600 hover:text-white transition-colors flex-shrink-0">
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

                            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                            <button
                                onClick={handleTranscribe}
                                disabled={!file || isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
                            >
                                {isLoading ? <LoadingSpinner /> : t.btnTranscribe}
                            </button>
                            
                            {(isLoading || progress > 0) && (
                                <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                     <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                     <p className="text-center text-sm text-slate-400 mt-2 animate-pulse">{progressMessage}</p>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Transcription Output */}
                        <div className="relative h-[500px] flex flex-col bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-inner">
                           {transcription ? (
                                <>
                                    <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
                                        {copySuccess && <span className="text-xs text-teal-400 font-semibold bg-slate-800 px-2 py-1 rounded transition-opacity duration-300">{copySuccess}</span>}
                                        <button onClick={handleCopy} title="Copy to clipboard" className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors shadow-sm">
                                            <CopyIcon className="w-4 h-4" />
                                        </button>
                                         <div ref={downloadRef} className="relative">
                                            <button onClick={() => setShowDownloadOptions(!showDownloadOptions)} title="Download transcription" className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors shadow-sm">
                                                <DownloadIcon className="w-4 h-4" />
                                            </button>
                                            {showDownloadOptions && (
                                                <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-600 rounded-md shadow-xl py-1 z-20">
                                                    <button onClick={() => handleDownload('txt')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                                                        {t.downloadTxt}
                                                    </button>
                                                    <button onClick={() => handleDownload('md')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                                                        {t.downloadMd}
                                                    </button>
                                                    <button onClick={() => handleDownload('docx')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                                                        {t.downloadDocx}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <TranscriptionViewer text={transcription} />
                                </>
                            ) : (
                                <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500 p-8 space-y-3">
                                    <div className="p-4 bg-slate-800 rounded-full mb-2">
                                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                    </div>
                                    <p className="font-medium text-slate-400">{t.placeholderReady}</p>
                                    <p className="text-sm text-slate-600 max-w-xs">{t.placeholderDesc}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}