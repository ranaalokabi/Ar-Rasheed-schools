/**
 * Natural Audio Synthesis & Speech Utility
 * Designed for fluent, warm, human-like Arabic & English speech playback
 * Handles emoji stripping, markdown cleaning, table summarization, and audio playback.
 */

// Helper to sanitize text for speech synthesis
export function cleanTextForSpeech(rawText: string, lang: 'ar' | 'en' = 'ar'): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Remove image tags or placeholders
  text = text.replace(/\[OFFICIAL_FEES_SCHEDULE_IMAGE\]/gi, '');

  // 2. Convert markdown tables into a smooth spoken summary
  const tableRegex = /\|(.+)\|[\r\n]+\|[-:| ]+\|[\r\n]+((?:\|.+|[\r\n]+)+)/g;
  text = text.replace(tableRegex, () => {
    if (lang === 'ar') {
      return ' (موضح في الجدول الرسمي أعلاه تفاصيل الرسوم بالتفصيل والأقساط الميسرة) ';
    }
    return ' (As shown in the official detailed fee schedule above) ';
  });

  // 3. Remove single table rows if any left
  text = text.replace(/^\|.*\|$/gm, '');

  // 4. Remove Markdown headers, bold, italics, links, blockquotes
  text = text.replace(/#{1,6}\s+/g, '');
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/\*(.*?)\*/g, '$1');
  text = text.replace(/__(.*?)__/g, '$1');
  text = text.replace(/_(.*?)_/g, '$1');
  text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
  text = text.replace(/https?:\/\/[^\s]+/g, 'عبر الرابط الرسمي');
  text = text.replace(/^>\s+/gm, '');
  text = text.replace(/`{1,3}.*?`{1,3}/gs, '');

  // 5. Remove bullet point markers
  text = text.replace(/^[-*•]\s+/gm, ' ');

  // 6. Strip all emojis gracefully (ranges including modern emojis, pictographs, symbols)
  // This prevents the speech synthesizer from saying "وجه مبتسم بعينين مغمضتين" or robotic letter sequences!
  text = text.replace(/[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]/gu, '');

  // 7. Clean up currency symbols for natural Arabic pronunciation
  if (lang === 'ar') {
    text = text.replace(/\$(\d+[\d,]*)/g, '$1 دولار أمريكي ');
    text = text.replace(/(\d+[\d,]*)(\s*)YER/gi, '$1 ريال يمني ');
    text = text.replace(/(\d+)\s*%/g, '$1 بالمائة ');
  }

  // 8. Collapse whitespace and linebreaks
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

// Client-side Web Speech synthesis manager
class NaturalVoiceManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isSpeaking = false;
  private onStateChangeCallbacks: Set<(speaking: boolean) => void> = new Set();

  public subscribe(cb: (speaking: boolean) => void): () => void {
    this.onStateChangeCallbacks.add(cb);
    return () => {
      this.onStateChangeCallbacks.delete(cb);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onStateChangeCallbacks.forEach((cb) => cb(speaking));
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    this.currentUtterance = null;
    this.notify(false);
  }

  public async speak(rawText: string, lang: 'ar' | 'en' = 'ar'): Promise<void> {
    this.stop();

    const cleaned = cleanTextForSpeech(rawText, lang);
    if (!cleaned) return;

    // First attempt: Server-side high quality Gemini TTS if available
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleaned.slice(0, 800), lang }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.audioBase64) {
          const mime = data.mimeType || 'audio/mp3';
          const audio = new Audio(`data:${mime};base64,${data.audioBase64}`);
          this.currentAudioElement = audio;
          this.notify(true);

          audio.onended = () => {
            this.notify(false);
            this.currentAudioElement = null;
          };
          audio.onerror = () => {
            this.fallbackWebSpeech(cleaned, lang);
          };

          await audio.play();
          return;
        }
      }
    } catch {
      // Fallback silently to client-side Web Speech API
    }

    // High quality Web Speech fallback
    this.fallbackWebSpeech(cleaned, lang);
  }

  private fallbackWebSpeech(cleanedText: string, lang: 'ar' | 'en') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.notify(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    this.currentUtterance = utterance;

    const voices = window.speechSynthesis.getVoices();

    if (lang === 'ar') {
      utterance.lang = 'ar-SA';
      // Pick best natural Arabic voice
      const arabicVoice = voices.find(
        (v) =>
          v.lang.startsWith('ar') &&
          (v.name.includes('Natural') ||
            v.name.includes('Maged') ||
            v.name.includes('Tariq') ||
            v.name.includes('Laila') ||
            v.name.includes('Salma') ||
            v.name.includes('Naayf') ||
            v.name.includes('Google'))
      ) || voices.find((v) => v.lang.startsWith('ar'));

      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      utterance.rate = 0.95; // Warm, steady, clear pacing
      utterance.pitch = 1.05; // Friendly and welcoming
    } else {
      utterance.lang = 'en-US';
      const englishVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this.notify(false);
      this.currentUtterance = null;
    };

    window.speechSynthesis.speak(utterance);
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const naturalVoice = new NaturalVoiceManager();
