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
    startMusic();
  } else {
    stopMusic();
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

/* ------------------------------------------------------------------ música ---
 * Trilha chiptune AUTORAL, tranquila e num volume de fundo (bem abaixo dos
 * efeitos). Progressão gentil Am–F–C–G com melodia pentatônica em triângulo,
 * arpejo suave (seno) e um baixo macio. Tudo sintetizado — nada de arquivos.
 * Toca em loop enquanto o som está ligado. */
const N = {
  F2: 87.31, G2: 98.0, A2: 110.0, C3: 130.81,
  A3: 220.0, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33,
};
const BAR = 2.0; // s por compasso (~120bpm, sensação calma pela textura esparsa)

interface MNote { t: number; freq: number; dur: number; type: Voice; gain: number }

const MUSIC_LOOP: { notes: MNote[]; length: number } = (() => {
  const notes: MNote[] = [];
  const bass = [N.A2, N.F2, N.C3, N.G2, N.A2, N.F2, N.C3, N.G2]; // Am F C G x2
  bass.forEach((f, bar) =>
    notes.push({ t: bar * BAR, freq: f, dur: BAR * 0.95, type: 'triangle', gain: 0.09 }),
  );
  // arpejo suave (seno) — tônicas dos acordes, evitando notas ásperas
  const arp = [
    [N.A3, N.C4, N.E4, N.C4], [N.A3, N.C4, N.F4, N.C4],
    [N.C4, N.E4, N.G4, N.E4], [N.G4, N.D4, N.G4, N.D4],
  ];
  for (let bar = 0; bar < 8; bar++) {
    arp[bar % 4].forEach((f, i) =>
      notes.push({ t: bar * BAR + i * (BAR / 4), freq: f, dur: 0.5, type: 'sine', gain: 0.05 }),
    );
  }
  // melodia pentatônica (triângulo), esparsa e cantável
  const mel: [number, number, number, number][] = [ // [compasso, offset(s), freq, dur]
    [0, 0, N.E4, 0.5], [0, 0.5, N.A4, 0.5], [0, 1.0, N.C5, 0.75],
    [1, 0, N.C5, 0.5], [1, 0.5, N.A4, 0.5], [1, 1.0, N.F4, 0.9],
    [2, 0, N.E4, 0.5], [2, 0.5, N.G4, 0.5], [2, 1.0, N.C5, 0.9],
    [3, 0, N.D5, 0.5], [3, 0.5, N.G4, 0.5], [3, 1.0, N.D4, 0.9],
    [4, 0, N.A4, 0.75], [4, 0.75, N.E4, 0.5], [4, 1.25, N.D4, 0.5],
    [5, 0, N.C4, 0.5], [5, 0.5, N.F4, 0.5], [5, 1.0, N.A4, 0.9],
    [6, 0, N.G4, 0.5], [6, 0.5, N.E4, 0.5], [6, 1.0, N.C4, 0.9],
    [7, 0, N.D4, 0.5], [7, 0.5, N.G4, 0.5], [7, 1.0, N.E4, 1.1],
  ];
  for (const [bar, off, freq, dur] of mel) {
    notes.push({ t: bar * BAR + off, freq, dur, type: 'triangle', gain: 0.085 });
  }
  return { notes, length: 8 * BAR };
})();

let musicGain: GainNode | null = null;
let musicOn = false;
let musicTimer: number | null = null;
let nextLoopAt = 0;
const MUSIC_LEVEL = 0.55;

function scheduleLoop(c: AudioContext, at: number) {
  if (!musicGain) return;
  for (const n of MUSIC_LOOP.notes) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = n.type;
    osc.frequency.value = n.freq;
    const t0 = at + n.t;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(n.gain, t0 + 0.03); // ataque macio
    g.gain.setValueAtTime(n.gain, t0 + Math.max(0.05, n.dur - 0.15));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.dur);
    osc.connect(g);
    g.connect(musicGain);
    osc.start(t0);
    osc.stop(t0 + n.dur + 0.05);
  }
}

export function startMusic() {
  const c = ensureContext();
  if (!c || !master) return;
  if (!musicGain) {
    musicGain = c.createGain();
    musicGain.gain.value = 0;
    musicGain.connect(master);
  }
  if (c.state === 'suspended') void c.resume();
  // fade-in suave para o volume de fundo
  musicGain.gain.cancelScheduledValues(c.currentTime);
  musicGain.gain.setValueAtTime(musicGain.gain.value, c.currentTime);
  musicGain.gain.linearRampToValueAtTime(MUSIC_LEVEL, c.currentTime + 1.0);
  if (musicOn) return;
  musicOn = true;
  nextLoopAt = c.currentTime + 0.2;
  const pump = () => {
    if (!musicOn || !ctx) return;
    if (ctx.state === 'running') {
      // ressincroniza se o relógio ficou parado (contexto suspenso antes)
      if (nextLoopAt < ctx.currentTime + 0.2) nextLoopAt = ctx.currentTime + 0.2;
      while (nextLoopAt < ctx.currentTime + MUSIC_LOOP.length * 1.5) {
        scheduleLoop(ctx, nextLoopAt);
        nextLoopAt += MUSIC_LOOP.length;
      }
    }
    musicTimer = window.setTimeout(pump, MUSIC_LOOP.length * 500);
  };
  pump();
}

export function stopMusic() {
  musicOn = false;
  if (musicTimer) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
  if (musicGain && ctx) {
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setValueAtTime(musicGain.gain.value, ctx.currentTime);
    musicGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4); // fade-out
  }
}
