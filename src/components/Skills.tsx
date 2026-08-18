import clsx from 'clsx';
import { skillGroups, ui } from '@/data/content';
import { useT } from '@/lib/i18n';
import Section from '@/components/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import StatBar from '@/components/ui/StatBar';

const dotColor: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  violet: 'bg-violet',
  grass: 'bg-grass',
};
const labelColor: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  violet: 'text-violet',
  grass: 'text-grass',
};

export default function Skills() {
  const { t } = useT();

  return (
    <Section id="skills" scene="skills">
      <SectionHeading index="03" title={t(ui.skills.title)} subtitle={t(ui.skills.subtitle)} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.key} className="panel p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-line pb-3">
              <span className={clsx('h-2.5 w-2.5', dotColor[group.color])} />
              <span className={clsx('font-pixel text-[0.65rem] uppercase tracking-wider', labelColor[group.color])}>
                {t(group.label)}
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              {group.skills.map((s) => (
                <StatBar key={s.name} label={s.name} value={s.value} color={group.color} size="sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
