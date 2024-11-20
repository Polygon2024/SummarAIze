export default interface WriteEntry {
  timestamp: number;
  title: string;
  prompt: string;
  tone: Tone;
  format: Format;
  length: Length;
  output: string;
  rewriteOutput?: string;
}

export type Tone = 'formal' | 'neutral' | 'casual';
export type Format = 'plain-text' | 'markdown';
export type Length = 'short' | 'medium' | 'long';