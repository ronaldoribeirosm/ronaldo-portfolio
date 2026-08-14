# PROGRESSO

Log honesto do estado do projeto.

## O que foi validado de verdade

- **Build de produção roda**: `npm run build` (type-check `tsc --noEmit` + `vite build`) conclui sem erros. Bundle final ~108 KB JS gzip, ~6 KB CSS gzip.
- **Executado em navegador real (Chromium headless via Playwright)** sobre o build de produção servido em `vite preview`:
  - Todas as seções renderizam: hero, perfil, projetos, skills, jornada, contato, footer.
  - Gamificação funciona: XP acumula, níveis sobem, aviso de "level up" aparece, conquistas ("Insira a Ficha", "Desafiante", "Explorador") disparam como toasts.
  - Modal de projeto abre com backdrop e fecha por `Esc`.
  - Troca de tema (Retro → Cyber) aplica corretamente.
  - **Zero erros de console e zero `pageerror`** durante o fluxo completo.
  - **Zero overflow horizontal no mobile (viewport 390px).**
  - Screenshots das telas em [`docs/screenshots/`](docs/screenshots/).
- **Acessibilidade** implementada e revisada: contraste AA no texto, foco visível, foco preso no modal, skip-link, `aria-label`/`role` nos controles, `aria-live` nos toasts e erros de formulário, e `prefers-reduced-motion` respeitado globalmente.

## O que NÃO foi validado

- **Não testado em navegadores reais além do Chromium headless** (sem Firefox/Safari/mobile físico nesta sessão).
- **Envio real do formulário de contato não foi exercitado ponta a ponta**: nenhum `VITE_CONTACT_ENDPOINT` real foi configurado, então só o caminho de validação/UX foi verificado (o caminho de rede depende do endpoint que o Ronaldo escolher).
- **Som não foi verificado com áudio real** (headless não reproduz), apenas a lógica de ligar/desligar e a ausência de erros.
- **Não publicado**: sem repositório remoto no GitHub e sem deploy — aguardando decisão (ver abaixo).

## Decisões pendentes (do Ronaldo)

- **Publicar no GitHub / fazer deploy?** O repositório está pronto localmente com commit inicial, mas nada foi enviado para fora.
- **Links reais dos projetos**: hoje todos os cards apontam para o perfil do GitHub. Se algum projeto tiver repositório público ou demo, dá para preencher `links.repo` / `links.demo` em `src/data/content.ts`.
- **Endpoint de contato**: definir um serviço (Formspree/Web3Forms) ou manter o `mailto`.
- **Números de skills e "poder" dos projetos**: os valores vieram do brief; revisar se refletem bem a realidade atual.
