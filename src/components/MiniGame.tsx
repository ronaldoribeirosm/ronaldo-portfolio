import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ui } from '@/data/content';
import { bugSprites, asset } from '@/data/assets';
import { useT } from '@/lib/i18n';
import { useGame } from '@/store/game';
import { playSfx } from '@/lib/sound';

const W = 320;
const H = 440;
const CATCHER_W = 56;
const CATCHER_H = 12;
const GAME_SECONDS = 30;

interface Bug {
  x: number;
  y: number;
  vy: number;
  hue: number;
  wob: number;
  sprite: number;
}

type Phase = 'ready' | 'playing' | 'over';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Mini-game autoral "Caça-Bugs" em canvas. Easter egg: 3 cliques no logo. */
export default function MiniGame({ open, onClose }: Props) {
  const { t } = useT();
  const addXp = useGame((s) => s.addXp);

  const [phase, setPhase] = useState<Phase>('ready');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_SECONDS);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const catcherX = useRef(W / 2);
  const bugs = useRef<Bug[]>([]);
  const raf = useRef<number>();
  const running = useRef(false);
  const keys = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const scoreRef = useRef(0);
  const bugImgs = useRef<HTMLImageElement[]>([]);

  // pré-carrega os sprites de bug (se houver)
  useEffect(() => {
    bugImgs.current = bugSprites.map((src) => {
      const img = new Image();
      img.src = asset(src) ?? src;
      return img;
    });
  }, []);

  const stopLoop = useCallback(() => {
    running.current = false;
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const endGame = useCallback(() => {
    stopLoop();
    setPhase('over');
    playSfx('victory');
    addXp(Math.max(10, scoreRef.current * 15));
  }, [addXp, stopLoop]);

  const start = useCallback(() => {
    bugs.current = [];
    catcherX.current = W / 2;
    scoreRef.current = 0;
    setScore(0);
    setTime(GAME_SECONDS);
    setPhase('playing');
    running.current = true;
  }, []);

  // timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const id = window.setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, endGame]);

  // loop de jogo
  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let last = performance.now();
    let spawnAcc = 0;
    let spawnEvery = 700; // ms

    const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const ink = `rgb(${cssVar('--c-ink')})`;
    const surface = `rgb(${cssVar('--c-surface')})`;
    const line = `rgb(${cssVar('--c-line')})`;
    const primary = `rgb(${cssVar('--c-primary')})`;
    const accent = `rgb(${cssVar('--c-accent')})`;

    const frame = (now: number) => {
      if (!running.current) return;
      const dt = Math.min(48, now - last);
      last = now;

      // spawn
      spawnAcc += dt;
      spawnEvery = Math.max(320, 700 - scoreRef.current * 12);
      if (spawnAcc >= spawnEvery) {
        spawnAcc = 0;
        bugs.current.push({
          x: 16 + Math.random() * (W - 32),
          y: -12,
          vy: 0.06 + Math.random() * 0.05 + scoreRef.current * 0.002,
          hue: [0, 45, 160, 285][Math.floor(Math.random() * 4)],
          wob: Math.random() * Math.PI * 2,
          sprite: Math.floor(Math.random() * Math.max(1, bugImgs.current.length)),
        });
      }

      // catcher via teclado
      if (keys.current.left) catcherX.current -= dt * 0.35;
      if (keys.current.right) catcherX.current += dt * 0.35;
      catcherX.current = Math.max(CATCHER_W / 2, Math.min(W - CATCHER_W / 2, catcherX.current));

      // update bugs
      const catcherY = H - 26;
      const remaining: Bug[] = [];
      for (const b of bugs.current) {
        b.y += b.vy * dt;
        b.wob += dt * 0.01;
        const bx = b.x + Math.sin(b.wob) * 6;
        const caught =
          b.y + 6 >= catcherY &&
          b.y <= catcherY + CATCHER_H &&
          bx >= catcherX.current - CATCHER_W / 2 - 6 &&
          bx <= catcherX.current + CATCHER_W / 2 + 6;
        if (caught) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          playSfx('coin');
          continue;
        }
        if (b.y < H + 12) remaining.push(b);
      }
      bugs.current = remaining;

      // render
      ctx.fillStyle = surface;
      ctx.fillRect(0, 0, W, H);
      // grid sutil
      ctx.strokeStyle = line;
      ctx.globalAlpha = 0.25;
      for (let x = 0; x <= W; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // bugs: usa sprite do Kenney se carregado, senão desenho autoral
      ctx.imageSmoothingEnabled = false;
      for (const b of bugs.current) {
        const bx = b.x + Math.sin(b.wob) * 6;
        const img = bugImgs.current[b.sprite];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, Math.round(bx - 11), Math.round(b.y - 11), 22, 22);
        } else {
          ctx.fillStyle = `hsl(${b.hue} 85% 62%)`;
          ctx.fillRect(bx - 6, b.y - 6, 12, 12);
          ctx.fillStyle = ink;
          ctx.fillRect(bx - 3, b.y - 3, 2, 2);
          ctx.fillRect(bx + 1, b.y - 3, 2, 2);
          ctx.fillStyle = `hsl(${b.hue} 85% 62%)`;
          ctx.fillRect(bx - 9, b.y - 2, 3, 2);
          ctx.fillRect(bx + 6, b.y - 2, 3, 2);
        }
      }

      // catcher (rede)
      ctx.fillStyle = primary;
      ctx.fillRect(catcherX.current - CATCHER_W / 2, catcherY, CATCHER_W, CATCHER_H);
      ctx.fillStyle = accent;
      ctx.fillRect(catcherX.current - CATCHER_W / 2, catcherY, CATCHER_W, 3);

      raf.current = requestAnimationFrame(frame);
    };

    raf.current = requestAnimationFrame(frame);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [phase]);

  // controles: mouse e teclado
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const onMove = (e: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      catcherX.current = Math.max(CATCHER_W / 2, Math.min(W - CATCHER_W / 2, x));
    };
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === 'ArrowLeft') keys.current.left = down;
      if (e.key === 'ArrowRight') keys.current.right = down;
      if (e.key === 'Escape' && down) onClose();
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    canvas?.addEventListener('pointermove', onMove);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      canvas?.removeEventListener('pointermove', onMove);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [open, onClose]);

  // reset ao abrir/fechar
  useEffect(() => {
    if (open) {
      setPhase('ready');
      setScore(0);
      setTime(GAME_SECONDS);
    } else {
      stopLoop();
    }
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, stopLoop]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[58] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={t(ui.minigame.title)}
        >
          <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="scanlines panel relative z-10 w-full max-w-[360px] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-pixel text-[0.65rem] text-primary">{t(ui.minigame.title)}</span>
              <button
                onClick={onClose}
                aria-label={t(ui.minigame.close)}
                className="grid h-7 w-7 place-items-center border-2 border-line text-dim transition-colors hover:border-danger hover:text-danger active:scale-95"
              >
                ✕
              </button>
            </div>

            <div className="mb-3 flex items-center justify-between font-crt text-xl leading-none">
              <span className="text-dim">
                {t(ui.minigame.score)}: <span className="text-accent">{score}</span>
              </span>
              <span className="text-dim">
                {t(ui.minigame.time)}: <span className={time <= 5 ? 'text-danger' : 'text-primary'}>{time}s</span>
              </span>
            </div>

            <div className="relative overflow-hidden border-2 border-line" style={{ aspectRatio: `${W} / ${H}` }}>
              <canvas ref={canvasRef} width={W} height={H} className="h-full w-full touch-none [image-rendering:pixelated]" />

              {phase !== 'playing' && (
                <div className="absolute inset-0 grid place-items-center bg-bg/80 p-5 text-center backdrop-blur-sm">
                  {phase === 'ready' ? (
                    <div>
                      <p className="mb-4 text-sm text-dim">{t(ui.minigame.intro)}</p>
                      <button className="btn btn-primary" onClick={start}>
                        ▶ {t(ui.minigame.start)}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-pixel text-sm text-accent neon">{t(ui.minigame.result)}</p>
                      <p className="my-3 font-pixel text-3xl text-ink">{score}</p>
                      <p className="mb-4 text-xs text-grass">
                        {t(ui.minigame.reward)}: +{Math.max(10, score * 15)} XP
                      </p>
                      <div className="flex justify-center gap-2">
                        <button className="btn btn-primary" onClick={start}>
                          ↻ {t(ui.minigame.replay)}
                        </button>
                        <button className="btn btn-ghost" onClick={onClose}>
                          {t(ui.minigame.close)}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
