import { useRef, useState, type FormEvent } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { profile, ui } from '@/data/content';
import { useT } from '@/lib/i18n';
import { useGame } from '@/store/game';
import { playSfx } from '@/lib/sound';
import { usePrefersReducedMotion } from '@/lib/hooks';
import Section from '@/components/Section';
import SectionHeading from '@/components/ui/SectionHeading';

interface Fields {
  name: string;
  email: string;
  subject: string;
  message: string;
}
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: '', email: '', subject: '', message: '' };
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { t } = useT();
  const reduced = usePrefersReducedMotion();
  const unlock = useGame((s) => s.unlock);

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const honeypot = useRef<HTMLInputElement>(null); // armadilha anti-bot (campo oculto)

  const validate = (f: Fields): Errors => {
    const e: Errors = {};
    if (!f.name.trim()) e.name = t(ui.contact.errName);
    if (!emailRe.test(f.email)) e.email = t(ui.contact.errEmail);
    if (f.message.trim().length < 10) e.message = t(ui.contact.errMessage);
    return e;
  };

  const set = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate(fields);
    if (Object.keys(e).length) {
      setErrors(e);
      playSfx('error');
      const first = document.querySelector<HTMLElement>('[data-invalid="true"]');
      first?.focus();
      return;
    }

    // bot preencheu o campo oculto: finge sucesso e não envia nada
    if (honeypot.current?.value) {
      setStatus('done');
      return;
    }

    setStatus('sending');
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: fields.name,
            email: fields.email,
            subject: fields.subject,
            message: fields.message,
            // campos especiais reconhecidos pelo Formspree
            _subject: fields.subject || `Contato de ${fields.name}`,
            _replyto: fields.email,
          }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { errors?: { message: string }[] } | null;
          throw new Error(data?.errors?.[0]?.message ?? 'request failed');
        }
      } else {
        // Sem backend configurado: compõe um e-mail no cliente de e-mail do usuário.
        const subject = encodeURIComponent(fields.subject || `Contato de ${fields.name}`);
        const body = encodeURIComponent(`${fields.message}\n\n— ${fields.name} (${fields.email})`);
        window.location.href = `mailto:${profile.links.email}?subject=${subject}&body=${body}`;
      }
      setStatus('done');
      playSfx('victory');
      unlock('sender');
    } catch {
      setStatus('idle');
      playSfx('error');
      setErrors({ message: t({ pt: 'Falha ao enviar. Tente o e-mail direto abaixo.', en: 'Send failed. Try the direct email below.' }) });
    }
  };

  const reset = () => {
    setFields(EMPTY);
    setErrors({});
    setStatus('idle');
    playSfx('select');
  };

  return (
    <Section id="contact" scene="contact">
      <SectionHeading index="05" title={t(ui.contact.title)} subtitle={t(ui.contact.subtitle)} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* console/formulário */}
        <div className="scanlines panel relative min-h-[24rem] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-2 border-b border-line pb-3 text-dim">
            <span className="h-2 w-2 bg-danger" />
            <span className="h-2 w-2 bg-accent" />
            <span className="h-2 w-2 bg-grass" />
            <span className="ml-2 font-crt text-lg leading-none text-primary">~/contato.exe</span>
          </div>

          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div
                key="done"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="grid place-items-center py-14 text-center"
              >
                <div className="mb-4 font-pixel text-3xl text-accent neon">★</div>
                <h3 className="font-pixel text-sm text-grass">{t(ui.contact.successTitle)}</h3>
                <p className="mt-3 max-w-[40ch] text-sm text-dim">{t(ui.contact.successBody)}</p>
                <button className="btn btn-ghost mt-6" onClick={reset}>
                  ↻ {t(ui.contact.again)}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                initial={false}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {/* honeypot: invisível para humanos, atrai bots */}
                <input
                  ref={honeypot}
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    id="name"
                    label={t(ui.contact.name)}
                    value={fields.name}
                    error={errors.name}
                    onChange={(v) => set('name', v)}
                    autoComplete="name"
                  />
                  <Field
                    id="email"
                    label={t(ui.contact.email)}
                    type="email"
                    value={fields.email}
                    error={errors.email}
                    onChange={(v) => set('email', v)}
                    autoComplete="email"
                  />
                </div>
                <Field
                  id="subject"
                  label={t(ui.contact.subject)}
                  value={fields.subject}
                  onChange={(v) => set('subject', v)}
                />
                <Field
                  id="message"
                  label={t(ui.contact.message)}
                  value={fields.message}
                  error={errors.message}
                  onChange={(v) => set('message', v)}
                  textarea
                />

                <div className="mt-1 flex flex-wrap gap-3">
                  <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                    {status === 'sending' ? t(ui.contact.sending) : `▶ ${t(ui.contact.send)}`}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={reset}>
                    ⊘ {t(ui.contact.clear)}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* caminhos alternativos */}
        <div className="panel flex flex-col justify-center gap-3 p-5 sm:p-7">
          <span className="font-pixel text-[0.6rem] uppercase tracking-widest text-dim">{t(ui.contact.orReach)}</span>
          <ContactLink
            href={`mailto:${profile.links.email}`}
            label="E-mail"
            value={profile.links.email}
            onGo={() => unlock('linked')}
          />
          <ContactLink
            href={profile.links.github}
            label="GitHub"
            value="github.com/ronaldoribeirosm"
            external
            onGo={() => unlock('linked')}
          />
          <ContactLink
            href={profile.links.linkedin}
            label="LinkedIn"
            value="in/ronaldo-ribeiro"
            external
            onGo={() => unlock('linked')}
          />
        </div>
      </div>
    </Section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  textarea,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const invalid = Boolean(error);
  const base = clsx(
    'w-full border-2 bg-bg/60 px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-line',
    invalid ? 'border-danger' : 'border-line focus:border-primary',
  );
  return (
    <div className={textarea ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1.5 block font-pixel text-[0.5rem] uppercase tracking-widest text-dim">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className={clsx(base, 'resize-y')}
          aria-invalid={invalid}
          data-invalid={invalid}
          aria-describedby={invalid ? `${id}-err` : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={base}
          aria-invalid={invalid}
          data-invalid={invalid}
          aria-describedby={invalid ? `${id}-err` : undefined}
        />
      )}
      {invalid && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-danger">
          <span aria-hidden>✕</span>
          {error}
        </p>
      )}
    </div>
  );
}

function ContactLink({
  href,
  label,
  value,
  external,
  onGo,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
  onGo: () => void;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={() => {
        onGo();
        playSfx('coin');
      }}
      className="group flex items-center justify-between gap-3 border-2 border-line px-4 py-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary"
    >
      <span>
        <span className="block font-pixel text-[0.55rem] uppercase tracking-wider text-primary">{label}</span>
        <span className="mt-0.5 block truncate text-sm text-dim">{value}</span>
      </span>
      <span className="text-dim transition-transform duration-150 group-hover:translate-x-1 group-hover:text-primary" aria-hidden>
        →
      </span>
    </a>
  );
}
