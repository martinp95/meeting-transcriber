
import { GoogleGenAI } from "@google/genai";
import { TranscriptionOptions, ModelType } from '../types';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });

    let mimeType = file.type;
    // Handle MKV files where browser might not detect mime type
    if (!mimeType && file.name.toLowerCase().endsWith('.mkv')) {
        mimeType = 'video/x-matroska';
    }

    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: mimeType || file.type },
    };
};

export const constructTranscriptionPrompt = (t: any, options: TranscriptionOptions) => {
    const { includeDiarization, includeTimestamps, outputLanguage } = options;
    let instructions = t.promptRole;
    let formatting = "";
    let example = "";
    let translationInstruction = "";
    let endInstruction = t.promptEndOriginal || t.promptEnd;

    if (outputLanguage !== 'original') {
        translationInstruction = `\n\n${t.promptOutputLang} ${outputLanguage}.`;
        endInstruction = t.promptEndTranslated;
    }

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

    return `${instructions}${translationInstruction}\n\n${formatting}${example}\n\n${endInstruction}`;
};

export const transcribeFileWithGemini = async (
    file: File, 
    prompt: string, 
    onProgress: (percentage: number) => void,
    modelType: ModelType
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    onProgress(25);
    const mediaPart = await fileToGenerativePart(file);
    onProgress(50);
    
    // Updated to use 2.5 versions as requested
    const modelName = modelType === 'pro' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

    const response = await ai.models.generateContent({
        model: modelName,
        contents: {
            parts: [
                mediaPart,
                { text: prompt }
            ]
        }
    });

    return response.text || "";
};
