import { profile, heroStats, ui } from '@/data/content';
import { useT } from '@/lib/i18n';
import Section from '@/components/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import StatBar from '@/components/ui/StatBar';

export default function About() {
  const { t } = useT();

  const facts: { label: string; value: string }[] = [
    { label: 'RANK', value: 'Técnico em TI · ADS (IFSP)' },
    { label: 'LOCAL', value: t(profile.location) },
    { label: 'QUEST', value: t({ pt: 'Automação & Full Stack', en: 'Automation & Full Stack' }) },
    { label: 'STATUS', value: t(ui.about.ready) },
  ];

  return (
    <Section id="about">
      <SectionHeading index="01" title={t(ui.about.title)} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Bio + fatos */}
        <div className="panel scanlines p-6 sm:p-8">
          <p className="text-[15px] leading-relaxed text-ink">{t(profile.bio)}</p>

          <dl className="mt-7 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="font-pixel text-[0.5rem] uppercase tracking-widest text-primary">{f.label}</dt>
                <dd className="mt-1 text-sm text-dim">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Atributos */}
        <div className="panel p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
            <span className="font-pixel text-[0.6rem] text-dim">{t(ui.about.stats)}</span>
            <span className="font-pixel text-[0.6rem] text-accent">LV.{profile.level}</span>
          </div>
          <div className="flex flex-col gap-4">
            {heroStats.map((s, i) => (
              <StatBar
                key={s.key}
                label={t(s.label)}
                value={s.value}
                color={(['primary', 'secondary', 'accent', 'violet'] as const)[i % 4]}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 border border-grass/40 bg-grass/5 px-3 py-2 text-sm text-grass">
            <span className="animate-blink">◆</span>
            {t(ui.about.ready)}
          </div>
        </div>
      </div>
    </Section>
  );
}
