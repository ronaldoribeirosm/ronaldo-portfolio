# Ronaldo Ribeiro — Portfolio Arcade

Portfolio pessoal de **Ronaldo Ribeiro**, desenvolvedor full stack, apresentado como uma
experiência interativa em estética arcade retrô. Projetos, skills e trajetória são
mostrados através de uma camada de gamificação — XP, níveis, conquistas e alguns
segredos escondidos — mantendo o conteúdo profissional em primeiro plano.

A identidade visual é totalmente autoral: pixel art, tipografia de fliperama e uma paleta
neon disciplinada, sem usar marcas ou personagens de terceiros.

## Destaques

- **Experiência gamificada** — sistema de XP, níveis e conquistas persistidos no navegador (localStorage).
- **Bilíngue** — português e inglês com troca instantânea.
- **Dois temas** — `Retro` (azul-noite) e `Cyber` (roxo neon).
- **Som chiptune sintetizado** — todos os efeitos são gerados via Web Audio API, sem arquivos de áudio (desligado por padrão).
- **Movimento com propósito** — parallax, efeito de digitação, barras animadas e um companheiro pixel que segue o cursor.
- **Segredo clássico** — o código de arcade tradicional libera um modo especial.
- **Acessível** — contraste AA, navegação por teclado, foco visível, `prefers-reduced-motion` e rótulos ARIA.
- **Rápido** — SPA leve, sem dependências pesadas de mídia.

## Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build e dev server)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (animações)
- [Zustand](https://github.com/pmndrs/zustand) (estado + persistência)

## Como rodar

Requisitos: Node.js 18+.

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento (http://localhost:5173)
npm run dev

# build de produção (gera /dist)
npm run build

# pré-visualizar o build de produção
npm run preview
```

## Configuração

### Formulário de contato

Por padrão, o formulário compõe um e-mail no cliente do visitante (`mailto:`).
Para receber os envios diretamente, defina um endpoint em um arquivo `.env`
(veja `.env.example`):

```bash
VITE_CONTACT_ENDPOINT="https://formspree.io/f/seu-id"
```

Serviços como [Formspree](https://formspree.io/) ou [Web3Forms](https://web3forms.com/)
funcionam sem backend próprio.

### Editar o conteúdo

Todo o texto, projetos, skills e experiência ficam centralizados em
[`src/data/content.ts`](src/data/content.ts) — inclusive as traduções (PT/EN). Não é
preciso mexer nos componentes para atualizar o conteúdo.

Links pessoais ficam no objeto `profile.links` no mesmo arquivo.

## Deploy

O projeto é estático e pode ser publicado em qualquer host de sites estáticos.

- **Vercel / Netlify** — importe o repositório; o comando de build é `npm run build` e a pasta de saída é `dist`.
- **GitHub Pages** — publique o conteúdo de `dist` (defina `base` em `vite.config.ts` se o site não estiver na raiz do domínio).

## Estrutura

```
src/
├── components/      # seções e componentes de UI
│   ├── effects/     # parallax, companheiro, código secreto
│   ├── hud/         # conquistas e aviso de level up
│   └── ui/          # primitivos reutilizáveis
├── data/            # conteúdo e traduções
├── lib/             # hooks, i18n, som, estilos compartilhados
├── store/           # estado do jogo (XP, níveis, tema, idioma)
├── App.tsx
└── main.tsx
```

## Licença

[MIT](LICENSE) © Ronaldo Ribeiro
