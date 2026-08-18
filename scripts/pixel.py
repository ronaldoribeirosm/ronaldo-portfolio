"""
Toolkit de PIXEL ART autoral da Serra da Mantiqueira (estetica 16-bit).

Peças reutilizaveis: dithering ordenado (Bayer), ceus com bruma, cordilheiras
com perspectiva atmosferica, araucarias (arvore-simbolo da regiao), uma Pedra
do Bau estilizada, casinha, lua e sol em pixel, estrelas e via-lactea.

Usado por gen_scenes.py para compor todas as cenas do site. Resolucao baixa de
proposito (pixels grossos = cara de jogo retro quando escalado com
image-rendering: pixelated).
"""
from __future__ import annotations
from PIL import Image

# Bayer 4x4 (0..15) para dithering ordenado
BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
]


def _th(x: int, y: int) -> float:
    return (BAYER4[y & 3][x & 3] + 0.5) / 16.0


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))


class Canvas:
    def __init__(self, w: int, h: int):
        self.w, self.h = w, h
        self.img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        self.px = self.img.load()

    def put(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            if len(c) == 3:
                c = c + (255,)
            self.px[x, y] = c

    def hline(self, x0, x1, y, c):
        for x in range(min(x0, x1), max(x0, x1) + 1):
            self.put(x, y, c)

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            self.hline(x0, x1, y, c)

    def save(self, path):
        self.img.save(path)


# ---------------------------------------------------------------- ceu -------
def sky(cv: Canvas, stops, y0=0, y1=None):
    """Preenche um ceu com gradiente DITHERADO entre stops [(yfrac,color)]."""
    y1 = cv.h if y1 is None else y1
    span = max(1, y1 - y0)
    for y in range(y0, y1):
        f = (y - y0) / span
        # acha o par de stops que cerca f
        for i in range(len(stops) - 1):
            fa, ca = stops[i]
            fb, cb = stops[i + 1]
            if fa <= f <= fb:
                local = (f - fa) / max(1e-6, (fb - fa))
                for x in range(cv.w):
                    c = cb if _th(x, y) < local else ca
                    cv.put(x, y, c)
                break


def mist(cv: Canvas, y, color, height=3, density=0.7):
    """Faixa de bruma ditherada (a 'nevoa' entre as montanhas)."""
    for dy in range(height):
        yy = y + dy
        edge = 1 - dy / max(1, height)  # mais densa embaixo
        for x in range(cv.w):
            if _th(x, yy) < density * edge:
                cv.put(x, yy, color)


# --------------------------------------------------------- montanhas --------
def _ridge_y(peaks, x):
    """Interpola a altura da crista em x a partir de pontos (px,py)."""
    for i in range(len(peaks) - 1):
        x0, y0 = peaks[i]
        x1, y1 = peaks[i + 1]
        if x0 <= x <= x1:
            t = (x - x0) / max(1, (x1 - x0))
            return y0 + (y1 - y0) * t
    return peaks[-1][1]


def mountains(cv: Canvas, peaks, base_y, body, rim=None, shade=None):
    """Cordilheira preenchida com rim-light no topo e face sombreada dithered."""
    for x in range(cv.w):
        ry = int(round(_ridge_y(peaks, x)))
        for y in range(ry, base_y):
            c = body
            if shade is not None:
                # encosta leste (direita do pico) levemente sombreada, dithered
                if y > ry + 2 and _th(x, y) < 0.35:
                    c = shade
            cv.put(x, y, c)
        if rim is not None:
            cv.put(x, ry, rim)  # fio de luz na crista


# ------------------------------------------------------- pedra do bau -------
def pedra_do_bau(cv: Canvas, cx, base_y, h, body, rim, shade):
    """Torre de rocha vertical, inspirada na Pedra do Bau (Campos do Jordao)."""
    top = base_y - h
    for y in range(top, base_y):
        f = (y - top) / max(1, h)
        half = int(3 + f * 7)  # afina no topo
        for x in range(cx - half, cx + half + 1):
            c = body
            if x > cx + 1 and _th(x, y) < 0.4:
                c = shade
            cv.put(x, y, c)
        cv.put(cx - half, y, rim)
    # topo arredondado
    cv.hline(cx - 2, cx + 2, top, rim)


# --------------------------------------------------------- araucaria --------
def araucaria(cv: Canvas, x, base_y, h, trunk, crown, crownlo):
    """Araucaria: tronco alto e fino + copa em candelabro (umbela achatada).

    Silhueta-simbolo da Mantiqueira — larga no topo, quase plana."""
    trunk_h = int(h * 0.62)
    top = base_y - h
    # tronco
    cv.rect(x, base_y - trunk_h, x, base_y, trunk)
    cv.put(x - 1, base_y - trunk_h + 2, trunk)
    # copa em tiers horizontais, mais larga em cima (candelabro)
    crown_h = h - trunk_h
    tiers = max(3, crown_h // 3)
    for i in range(tiers):
        ty = top + i * (crown_h // tiers)
        # largura cresce ate perto do topo e afina so na pontinha
        f = i / (tiers - 1)
        w = int(2 + (1 - abs(f - 0.82) * 1.1) * (h * 0.42))
        w = max(2, w)
        for xx in range(x - w // 2, x - w // 2 + w + 1):
            c = crown if _th(xx, ty) > 0.25 else crownlo
            cv.put(xx, ty, c)
            cv.put(xx, ty + 1, crownlo if _th(xx, ty + 1) < 0.5 else crown)
    # ponta
    cv.put(x, top - 1, crown)


def pine(cv: Canvas, x, base_y, h, body, dark):
    """Conifera triangular simples (mata de fundo)."""
    for i, y in enumerate(range(base_y - h, base_y)):
        half = int((i / h) * h * 0.34) + 1
        for xx in range(x - half, x + half + 1):
            c = body if xx <= x else dark
            cv.put(xx, y, c)
    cv.rect(x, base_y, x, base_y + 1, dark)


# ------------------------------------------------------------- casa ---------
def cabin(cv: Canvas, x, y, wall, roof, door, win, warm=False):
    """Casinha de montanha: parede, telhado de duas aguas, porta e janela."""
    bw, bh = 15, 11
    cv.rect(x, y, x + bw, y + bh, wall)
    for i in range(9):  # telhado triangular
        cv.hline(x - 2 + i, x + bw + 2 - i, y - i, roof)
    cv.rect(x + 2, y + bh - 5, x + 4, y + bh, door)          # porta
    cv.rect(x + 9, y + 3, x + 11, y + 5, win)                # janela
    if warm:
        cv.put(x + 10, y + 4, (255, 236, 170))


# ------------------------------------------------------------ astros --------
def moon_sprite(size=28):
    """Lua cheia em pixel: corpo palido, crateras e halo ditherado."""
    cv = Canvas(size, size)
    c = size / 2
    r = size * 0.34
    body, hi, lo = (238, 240, 220), (250, 250, 236), (200, 202, 178)
    craters = [(0.62, 0.40, 0.09), (0.42, 0.60, 0.12), (0.58, 0.66, 0.07)]
    for y in range(size):
        for x in range(size):
            d = ((x + 0.5 - c) ** 2 + (y + 0.5 - c) ** 2) ** 0.5
            if d <= r:
                col = body
                if (x - c) + (y - c) < -r * 0.4:
                    col = hi
                for cxf, cyf, cr in craters:
                    if ((x - cxf * size) ** 2 + (y - cyf * size) ** 2) ** 0.5 <= cr * size:
                        col = lo
                cv.put(x, y, col)
            elif d <= r + 3:  # halo
                a = max(0, 1 - (d - r) / 3)
                if _th(x, y) < a * 0.5:
                    cv.put(x, y, (226, 230, 210, 150))
    return cv.img


def sun_sprite(size=30):
    """Sol em pixel: nucleo quente e halo de raios ditherado."""
    cv = Canvas(size, size)
    c = size / 2
    r = size * 0.30
    core, body, edge = (255, 244, 200), (255, 210, 90), (255, 158, 66)
    for y in range(size):
        for x in range(size):
            d = ((x + 0.5 - c) ** 2 + (y + 0.5 - c) ** 2) ** 0.5
            if d <= r:
                col = core if d < r * 0.45 else (body if d < r * 0.8 else edge)
                cv.put(x, y, col)
            elif d <= r + 5:  # coroa/halo
                a = max(0, 1 - (d - r) / 5)
                if _th(x, y) < a * 0.6:
                    cv.put(x, y, (255, 186, 84, 160))
    return cv.img


def stars(cv: Canvas, y_max, seed_mul=1, count=70):
    """Estrelas pontuais + algumas mais brilhantes."""
    for i in range(count):
        x = int((i * 73 * seed_mul + i * i * 17) % cv.w)
        y = int((i * 31 + i * i * 13) % y_max)
        if i % 9 == 0:
            cv.rect(x, y, x + 1, y, (255, 255, 250))
            cv.put(x, y + 1, (210, 214, 240))
        else:
            cv.put(x, y, (232, 236, 255) if i % 3 else (200, 206, 236))


def smoke(cv: Canvas, x, y, color):
    """Fumaça da chaminé subindo em baforadas ditheradas."""
    for i, dy in enumerate(range(0, 14, 2)):
        px = x + (1 if (i % 2) else -1) * (i // 2)
        for ox in range(-1, 2):
            if _th(px + ox, y - dy) < 0.5 - i * 0.05:
                cv.put(px + ox, y - dy, color)


def pousada(cv: Canvas, x, y, wall, roof, door, win, chim, warm=False):
    """Pousada da serra: maior que a cabana, com chaminé e várias janelas."""
    bw, bh = 26, 15
    cv.rect(x, y, x + bw, y + bh, wall)
    for i in range(11):
        cv.hline(x - 3 + i, x + bw + 3 - i, y - i, roof)
    cv.rect(x + bw - 6, y - 16, x + bw - 3, y - 6, chim)  # chaminé
    cv.rect(x + 3, y + bh - 6, x + 6, y + bh, door)       # porta
    for wx in (x + 11, x + 18):                            # janelas
        cv.rect(wx, y + 4, wx + 3, y + 7, win)
        if warm:
            cv.rect(wx, y + 4, wx + 3, y + 7, (255, 232, 160))


def hydrangea(cv: Canvas, x, y, flower, leaf):
    """Arbusto de hortênsia (flor de Campos do Jordão): folhas + bola de flores."""
    cv.rect(x - 2, y, x + 2, y + 2, leaf)
    for dx, dy in [(0, -2), (-2, -1), (2, -1), (-1, -3), (1, -3), (0, -4)]:
        cv.put(x + dx, y + dy, flower)
        if _th(x + dx, y + dy) > 0.6:
            cv.put(x + dx, y + dy, (min(flower[0] + 30, 255), min(flower[1] + 30, 255), min(flower[2] + 20, 255)))


def building(cv: Canvas, x, base_y, w, h, body, win, roof, antenna=False):
    """Prédio pixel com janelas iluminadas (um 'build' do vilarejo)."""
    top = base_y - h
    cv.rect(x, top, x + w, base_y, body)
    cv.hline(x, x + w, top, roof)
    for wy in range(top + 3, base_y - 2, 4):
        for wx in range(x + 2, x + w - 1, 4):
            cv.rect(wx, wy, wx + 1, wy + 1, win)
    if antenna:
        cv.rect(x + w // 2, top - 5, x + w // 2, top, body)
        cv.put(x + w // 2, top - 5, (255, 90, 80))


def observatory(cv: Canvas, x, base_y, wall, dome, slit):
    """Observatório: base + cúpula com fresta."""
    cv.rect(x, base_y - 7, x + 14, base_y, wall)
    for i in range(6):  # cúpula
        cv.hline(x + 1 + i, x + 13 - i, base_y - 7 - i, dome)
    cv.rect(x + 6, base_y - 13, x + 7, base_y - 8, slit)  # fresta


def constellation(cv: Canvas, pts, star=(255, 255, 245), line=(150, 160, 210, 120)):
    """Liga estrelas com linhas ditheradas (mapa de habilidades)."""
    for i in range(len(pts) - 1):
        x0, y0 = pts[i]
        x1, y1 = pts[i + 1]
        steps = max(abs(x1 - x0), abs(y1 - y0))
        for s in range(steps + 1):
            t = s / max(1, steps)
            xx = round(x0 + (x1 - x0) * t)
            yy = round(y0 + (y1 - y0) * t)
            if _th(xx, yy) < 0.45:
                cv.put(xx, yy, line)
    for (x, y) in pts:
        cv.rect(x - 1, y, x + 1, y, star)
        cv.rect(x, y - 1, x, y + 1, star)


def trail(cv: Canvas, pts, path, edge):
    """Trilha ziguezague ligando marcos (pontos px,py)."""
    for i in range(len(pts) - 1):
        x0, y0 = pts[i]
        x1, y1 = pts[i + 1]
        steps = max(abs(x1 - x0), abs(y1 - y0))
        for s in range(steps + 1):
            t = s / max(1, steps)
            xx = round(x0 + (x1 - x0) * t)
            yy = round(y0 + (y1 - y0) * t)
            cv.hline(xx - 1, xx + 1, yy, path)
            cv.put(xx - 2, yy, edge)
            cv.put(xx + 2, yy, edge)


def flag(cv: Canvas, x, y, pole, cloth):
    """Bandeirinha de marco na trilha."""
    cv.rect(x, y - 7, x, y, pole)
    cv.rect(x + 1, y - 7, x + 4, y - 4, cloth)


def campfire(cv: Canvas, x, y, log, flame, hot, glow):
    """Fogueira com lenha, chama e brilho ditherado ao redor."""
    for dx in range(-6, 7):  # brilho no chão
        for dy in range(-2, 4):
            d = (dx * dx + dy * dy * 3) ** 0.5
            if d < 6 and _th(x + dx, y + dy) < (1 - d / 6) * 0.5:
                cv.put(x + dx, y + dy, glow)
    cv.hline(x - 4, x + 4, y, log)                 # lenha
    cv.hline(x - 3, x + 3, y + 1, (60, 42, 34))
    for i, dy in enumerate(range(1, 8)):           # chama
        half = max(0, 3 - i // 2)
        col = hot if dy > 4 else flame
        cv.hline(x - half, x + half, y - dy, col)
    cv.put(x, y - 8, hot)


def bench(cv: Canvas, x, y, c):
    cv.hline(x, x + 8, y, c)
    cv.put(x, y + 1, c); cv.put(x, y + 2, c)
    cv.put(x + 8, y + 1, c); cv.put(x + 8, y + 2, c)


def signpost(cv: Canvas, x, y, post, board, warm=False):
    cv.rect(x, y - 10, x, y, post)
    cv.rect(x - 5, y - 10, x + 2, y - 7, board)
    cv.rect(x - 4, y - 6, x + 3, y - 3, board)
    if warm:
        cv.put(x - 2, y - 9, (255, 220, 150))


def milky_way(cv: Canvas, cy, thickness=16, density=0.12):
    """Faixa diagonal tenue da via-lactea (Mantiqueira = ceu escuro)."""
    for x in range(cv.w):
        base = cy + int((x - cv.w / 2) * 0.14)
        for dy in range(-thickness, thickness):
            y = base + dy
            fall = 1 - abs(dy) / thickness
            if _th(x + 2, y + 1) < density * fall:
                cv.put(x, y, (150, 150, 200, 90))
