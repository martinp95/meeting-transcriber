import { Document, Packer, Paragraph, TextRun } from "docx";

export const fetchSampleFile = async (): Promise<File> => {
    const response = await fetch('https://storage.googleapis.com/generativeai-downloads/data/Apollo-11_Day-01-Highlights-10s.mp3', {
        mode: 'cors',
        credentials: 'omit'
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    return new File([blob], "Apollo-11_Day-01-Highlights.mp3", { type: "audio/mpeg" });
};

export const generateDocxBlob = async (transcription: string): Promise<Blob> => {
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

    return await Packer.toBlob(doc);
};
