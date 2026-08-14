# PROGRESSO

Log honesto do estado do projeto. Projeto **pessoal e privado**.

## O que foi validado de verdade

- **Build de produção roda**: `npm run build` (type-check `tsc --noEmit` + `vite build`) conclui sem erros. Bundle ~110 KB JS gzip, ~6,5 KB CSS gzip.
- **Executado em navegador real (Chromium headless via Playwright)** sobre o build servido em `vite preview`:
  - Todas as seções renderizam: hero, perfil, projetos, skills, jornada, contato, footer.
  - Gamificação funciona: XP acumula, níveis sobem, "level up" aparece, conquistas disparam como toasts.
  - **Cena de captura** ao abrir um projeto e **modal** com fechamento por `Esc`.
  - **Mini-game "Caça-Bugs"** abre (3 cliques no logo), inicia, os bugs caem, a rede responde ao mouse e o placar/tempo funcionam.
  - Troca de tema (Retro → Cyber) aplica corretamente.
  - **Zero erros de console e zero `pageerror`** no fluxo completo.
  - **Zero overflow horizontal** no mobile (390px) e no desktop.
  - Screenshots em [`docs/screenshots/`](docs/screenshots/).
- **Acessibilidade**: contraste AA, foco visível, foco preso no modal, skip-link, `aria-label`/`role`, `aria-live` em toasts e erros, `prefers-reduced-motion` respeitado (inclui pular a cena de captura).
- **Sistema de assets pessoais** implementado: avatar, companheiro e efeitos sonoros podem ser trocados por arquivos próprios via `src/data/assets.ts`, com fallback para a arte/som autorais.

## O que NÃO foi validado

- **Não testado em navegadores além do Chromium headless** (sem Firefox/Safari/mobile físico nesta sessão).
- **Envio real do formulário não foi exercitado ponta a ponta**: o código está pronto para Formspree (com honeypot e parsing de erro), mas nenhum `VITE_CONTACT_ENDPOINT` real foi configurado ainda — só o caminho de validação/UX foi verificado.
- **Som não foi ouvido** (headless não reproduz áudio); apenas a lógica (ligar/desligar, seleção de amostra) e a ausência de erros.

## Decisões pendentes (do Ronaldo)

- **ID do Formspree**: criar um formulário em formspree.io e colar a URL em `.env` (`VITE_CONTACT_ENDPOINT`) para o contato enviar direto ao e-mail. Sem isso, usa `mailto`.
- **Assets próprios**: se quiser trocar sprites/sons pelos seus, é só colocar em `public/assets/` e apontar em `src/data/assets.ts` (ver `public/assets/README.md`).
- **Links reais dos projetos**: hoje apontam para o perfil do GitHub; preencher `links.repo`/`links.demo` em `src/data/content.ts` quando houver.
- **Números de skills e "poder" dos projetos**: vieram do brief; revisar se refletem a realidade.

## Notas

- Repositório **privado** em `ronaldoribeirosm/ronaldo-portfolio`; o GitHub Pages foi removido (não é mais público). O workflow em `.github/workflows/` faz só um build-check.
