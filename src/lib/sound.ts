/**
 * Motor de som chiptune sintetizado via Web Audio API.
 * Nada de arquivos externos: todos os efeitos são gerados por osciladores,
 * mantendo o bundle leve e o áreo autoral.
 */

type Voice = 'square' | 'triangle' | 'sawtooth' | 'sine';

interface Note {
  freq: number;
  start: number; // segundos, relativo ao gatilho
  dur: number;
  type?: Voice;
  gain?: number;
}

const SFX: Record<string, Note[]> = {
  // clique/confirmação curto
  select: [{ freq: 660, start: 0, dur: 0.06, type: 'square', gain: 0.18 }],
  // hover suave
  hover: [{ freq: 880, start: 0, dur: 0.04, type: 'triangle', gain: 0.08 }],
  // moeda/coleta
  coin: [
    { freq: 988, start: 0, dur: 0.07, type: 'square', gain: 0.16 },
    { freq: 1319, start: 0.07, dur: 0.12, type: 'square', gain: 0.16 },
  ],
  // subir de nível
  levelup: [
    { freq: 523, start: 0, dur: 0.09, type: 'square', gain: 0.16 },
    { freq: 659, start: 0.09, dur: 0.09, type: 'square', gain: 0.16 },
    { freq: 784, start: 0.18, dur: 0.09, type: 'square', gain: 0.16 },
    { freq: 1047, start: 0.27, dur: 0.18, type: 'square', gain: 0.18 },
  ],
  // conquista
  achievement: [
    { freq: 784, start: 0, dur: 0.08, type: 'triangle', gain: 0.16 },
    { freq: 1047, start: 0.08, dur: 0.08, type: 'triangle', gain: 0.16 },
    { freq: 1319, start: 0.16, dur: 0.16, type: 'triangle', gain: 0.18 },
  ],
  // abrir card
  open: [
    { freq: 440, start: 0, dur: 0.05, type: 'square', gain: 0.14 },
    { freq: 880, start: 0.05, dur: 0.1, type: 'square', gain: 0.14 },
  ],
  // erro
  error: [
    { freq: 220, start: 0, dur: 0.08, type: 'sawtooth', gain: 0.16 },
    { freq: 160, start: 0.08, dur: 0.14, type: 'sawtooth', gain: 0.16 },
  ],
  // vitória (envio de mensagem)
  victory: [
    { freq: 523, start: 0, dur: 0.1, type: 'square', gain: 0.16 },
    { freq: 659, start: 0.1, dur: 0.1, type: 'square', gain: 0.16 },
    { freq: 784, start: 0.2, dur: 0.1, type: 'square', gain: 0.16 },
    { freq: 1047, start: 0.3, dur: 0.1, type: 'square', gain: 0.16 },
    { freq: 1319, start: 0.4, dur: 0.28, type: 'square', gain: 0.18 },
  ],
  // easter egg secreto
  secret: [
    { freq: 1047, start: 0, dur: 0.08, type: 'square', gain: 0.16 },
    { freq: 831, start: 0.08, dur: 0.08, type: 'square', gain: 0.16 },
    { freq: 1245, start: 0.16, dur: 0.08, type: 'square', gain: 0.16 },
    { freq: 1568, start: 0.24, dur: 0.24, type: 'square', gain: 0.18 },
  ],
};

export type SfxName = keyof typeof SFX;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (value) {
    const c = ensureContext();
    // navegadores exigem retomar o contexto após um gesto do usuário
    if (c && c.state === 'suspended') void c.resume();
  }
}

export function isSoundEnabled() {
  return enabled;
}

// Amostras de áudio personalizadas (opcionais), registradas em runtime.
const samples: Partial<Record<SfxName, string>> = {};
const audioCache = new Map<string, HTMLAudioElement>();

/** Registra arquivos de áudio para substituir os efeitos sintetizados. */
export function registerSamples(map: Partial<Record<SfxName, string>>) {
  for (const [key, value] of Object.entries(map)) {
    if (value) samples[key as SfxName] = value;
  }
}

function playSample(src: string) {
  let base = audioCache.get(src);
  if (!base) {
    base = new Audio(src);
    base.preload = 'auto';
    audioCache.set(src, base);
  }
  // clona para permitir sobreposição de disparos rápidos
  const node = base.cloneNode(true) as HTMLAudioElement;
  node.volume = 0.6;
  void node.play().catch(() => {});
}

export function playSfx(name: SfxName) {
  if (!enabled) return;

  // usa a amostra personalizada, se houver
  const sample = samples[name];
  if (sample) {
    playSample(sample);
    return;
  }

  const c = ensureContext();
  if (!c || !master) return;
  if (c.state === 'suspended') void c.resume();

  const notes = SFX[name];
  const now = c.currentTime;

  for (const note of notes) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = note.type ?? 'square';
    osc.frequency.value = note.freq;

    const t0 = now + note.start;
    const peak = note.gain ?? 0.15;
    // envelope curto para o típico "pluck" de chip
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + note.dur);

    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + note.dur + 0.02);
  }
}
