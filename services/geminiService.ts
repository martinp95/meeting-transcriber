import { GoogleGenAI } from "@google/genai";
import { TranscriptionOptions } from '../types';

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

export const constructTranscriptionPrompt = (t: any, options: TranscriptionOptions) => {
    const { includeDiarization, includeTimestamps } = options;
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

    return `${instructions}\n\n${formatting}${example}\n\n${t.promptEnd}`;
};

export const transcribeFileWithGemini = async (
    file: File, 
    prompt: string, 
    onProgress: (percentage: number) => void
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    onProgress(25);
    const mediaPart = await fileToGenerativePart(file);
    onProgress(50);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [prompt, mediaPart]
    });

    return response.text || "";
};
