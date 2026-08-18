import { motion } from 'framer-motion';
import { experience, ui } from '@/data/content';
import { useT } from '@/lib/i18n';
import { usePrefersReducedMotion } from '@/lib/hooks';
import Section from '@/components/Section';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Experience() {
  const { t } = useT();
  const reduced = usePrefersReducedMotion();

  return (
    <Section id="experience" scene="experience">
      <SectionHeading index="04" title={t(ui.experience.title)} subtitle={t(ui.experience.subtitle)} />

      <ol className="relative ml-3 border-l-2 border-line sm:ml-4">
        {experience.map((entry, i) => (
          <motion.li
            key={entry.id}
            initial={reduced ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: reduced ? 0 : i * 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="relative mb-8 pl-6 last:mb-0 sm:pl-8"
          >
            {/* checkpoint */}
            <span
              className={`absolute -left-[9px] top-1 h-4 w-4 border-2 ${
                entry.current ? 'border-grass bg-grass/30' : 'border-primary bg-bg'
              }`}
              aria-hidden
            >
              {entry.current && <span className="absolute inset-0 animate-ping bg-grass/40" />}
            </span>

            <div className="panel p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-pixel text-[0.55rem] text-accent">{t(entry.period)}</span>
                {entry.current && (
                  <span className="border border-grass/50 px-1.5 py-0.5 font-pixel text-[0.5rem] text-grass">
                    {t(ui.experience.now)}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-ink">{t(entry.role)}</h3>
              <p className="text-sm text-primary">{entry.place}</p>
              <p className="mt-2 text-sm text-dim">{t(entry.summary)}</p>

              <ul className="mt-3 flex flex-col gap-1.5">
                {entry.highlights.map((h, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-ink/90">
                    <span className="mt-1 text-grass" aria-hidden>
                      ✓
                    </span>
                    {t(h)}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
