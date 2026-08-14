# Seus assets pessoais

Coloque aqui os sprites e sons que **você** quiser usar. Depois é só apontar os
caminhos em [`src/data/assets.ts`](../../src/data/assets.ts).

Arquivos nesta pasta são servidos a partir da raiz. Ex.: `public/assets/hero.png`
vira `/assets/hero.png`.

## Slots disponíveis

| O quê | Onde apontar | Formato sugerido |
| --- | --- | --- |
| Avatar do jogador (cartão do hero) | `heroAvatar` | PNG pixel, ~64×64 |
| Companheiro que segue o cursor | `companion` | PNG pixel, ~32×32 |
| Efeitos sonoros | `sfx.<nome>` | MP3/OGG curtos |

Nomes de efeitos disponíveis: `select`, `hover`, `coin`, `levelup`, `achievement`,
`open`, `error`, `victory`, `secret`.

Exemplo de `src/data/assets.ts`:

```ts
export const customAssets: CustomAssets = {
  heroAvatar: '/assets/hero.png',
  companion: '/assets/companion.png',
  sfx: {
    coin: '/assets/coin.mp3',
    levelup: '/assets/levelup.mp3',
  },
};
```

Onde ficar em branco, o site usa a arte e o som autorais que já vêm no projeto.

## O que já vem incluído

- `sprites/` — personagens do **Kenney Pixel Platformer** (CC0): `hero.png`, `companion.png` e `bug1..4.png` (mini-game).
- `audio/` — efeitos do **Kenney Interface Sounds / Digital Audio** (CC0), nomeados por função (`select`, `coin`, `levelup`, …).

Tudo CC0 (domínio público) — pode trocar, remover ou substituir pelos seus arquivos à vontade.
Se limpar os caminhos em `src/data/assets.ts`, o site volta à arte e ao som autorais (chiptune sintetizado).

> Projeto pessoal e privado: os assets são sua escolha.
