# Internationalization (i18n)

This document explains how the translation system works and how to add new languages to Meeting Transcriber AI.

## Translation Structure

Translations are stored in JSON files located in `public/locales/`:

```
public/
  locales/
    es.json    # Spanish translations
    en.json    # English translations
```

Each JSON file contains key-value pairs for all UI strings used in the application.

## How It Works

The translation system is implemented through:

1. **translationService.ts** (`src/services/translationService.ts`):
   - Loads JSON translation files dynamically on app startup
   - Provides `getTranslations(language)` function to access current language strings
   - Handles loading errors gracefully with fallbacks

2. **App.tsx**:
   - Calls `loadTranslations()` on component mount
   - Uses `getTranslations(language)` to get current language translations
   - All UI strings are accessed via the `t` object (e.g., `t.title`, `t.subtitle`)

## Adding a New Language

Follow these steps to add support for a new language:

### Step 1: Create Translation File

Create a new JSON file in `public/locales/` with the language code as filename (e.g., `fr.json` for French).

Copy the structure from an existing file and translate all values:

```json
{
  "title": "Transcripteur de Réunion",
  "subtitle": "Téléchargez votre audio ou vidéo de réunion...",
  ...
}
```

### Step 2: Update translationService.ts

Modify `src/services/translationService.ts`:

```typescript
// 1. Update the Language type
export type Language = 'es' | 'en' | 'fr';

// 2. Add the new language to the translations object
const translations: Record<Language, Translations> = {
  es: {},
  en: {},
  fr: {}  // New language
};

// 3. Update the loadTranslations function
export async function loadTranslations(): Promise<void> {
  if (loaded) return;

  try {
    const [esResponse, enResponse, frResponse] = await Promise.all([
      fetch('/locales/es.json'),
      fetch('/locales/en.json'),
      fetch('/locales/fr.json')  // Add this line
    ]);

    if (!esResponse.ok || !enResponse.ok || !frResponse.ok) {
      throw new Error('Failed to load translation files');
    }

    translations.es = await esResponse.json();
    translations.en = await enResponse.json();
    translations.fr = await frResponse.json();  // Add this line
    loaded = true;
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}
```

### Step 3: Update App.tsx (Optional)

If you want this language to be available in the UI, the language toggle will automatically include it. The current implementation allows users to toggle between languages, so you may want to extend the `toggleLanguage()` function to cycle through all available languages.

## Translation Keys

All available translation keys are documented in the JSON files. Common categories include:

- **UI Labels**: `title`, `subtitle`, `btnTranscribe`, etc.
- **Messages**: `errorSelectFile`, `errorInvalidFile`, `copySuccess`, etc.
- **Placeholders**: `placeholderReady`, `placeholderDesc`, etc.
- **History**: `historyTitle`, `historyEmpty`, `historyClear`, etc.
- **Prompt Instructions**: `promptRole`, `promptDiarization`, etc.

## Best Practices

1. **Consistency**: Keep terminology consistent across all translation keys
2. **Length**: Consider that different languages have different lengths (e.g., German is typically longer than English)
3. **Context**: Provide context when translating - some English words have multiple meanings in other languages
4. **Testing**: Always test the UI with the new language to ensure text doesn't overflow
5. **RTL Support**: If adding a right-to-left language (Arabic, Hebrew), additional CSS changes may be needed

## Loading Mechanism

Translations are loaded asynchronously when the app mounts:

```typescript
useEffect(() => {
  loadTranslations().then(() => setTranslationsLoaded(true));
}, []);
```

This ensures all translations are available before the UI is fully rendered. If loading fails, empty objects are used as fallbacks, so the app won't crash.

## File Structure Example

```json
{
  "title": "Meeting Transcriber",
  "subtitle": "Upload your meeting audio or video...",
  "dropzoneDefault": "Click to upload",
  "dropzoneDragging": "Drop file here",
  "errorSelectFile": "Please select a file first.",
  "btnTranscribe": "Transcribe File",
  ...
}
```

---

For questions or to contribute new languages, please submit a pull request!
