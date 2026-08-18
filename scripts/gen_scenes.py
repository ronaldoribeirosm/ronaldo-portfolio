"""
Gera TODAS as cenas de fundo do portfolio em pixel art da Serra da Mantiqueira.

Cada cena = ceu (dia/noite, ditherado) + frente (montanhas/arvores, com ceu
transparente p/ sol e lua passarem atras). Rode:  python scripts/gen_scenes.py
Saidas em public/assets/bg/.
"""
from __future__ import annotations
import os
from pixel import (
    Canvas, sky, mist, mountains, pedra_do_bau, araucaria, pine, cabin,
    moon_sprite, sun_sprite, stars, milky_way,
    smoke, pousada, hydrangea, building, observatory, constellation,
    trail, flag, campfire, bench, signpost,
)

W, H = 256, 144
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "bg")

# ------------------------------------------------------------- ceus ---------
SKY_DAY = [(0.0, (72, 136, 196)), (0.42, (122, 180, 214)),
           (0.70, (188, 220, 224)), (1.0, (234, 222, 192))]
SKY_NIGHT = [(0.0, (11, 13, 28)), (0.48, (26, 24, 58)),
             (0.82, (46, 32, 64)), (1.0, (62, 44, 74))]


def sky_day():
    cv = Canvas(W, H)
    sky(cv, SKY_DAY)
    # nuvens ditheradas leves
    for (x0, y0, w) in [(40, 26, 34), (150, 20, 40), (200, 40, 26)]:
        for i in range(w):
            for j in range(4):
                from pixel import _th
                if _th(x0 + i, y0 + j) < 0.4 * (1 - j / 4):
                    cv.put(x0 + i, y0 + j, (236, 244, 248))
    return cv


def sky_night():
    cv = Canvas(W, H)
    sky(cv, SKY_NIGHT)
    milky_way(cv, 44, thickness=12, density=0.06)
    stars(cv, 96)
    return cv


# -------------------------------------------------- frente (montanhas) ------
FAR = [(-4, 78), (24, 68), (52, 74), (84, 63), (116, 72),
       (150, 65), (186, 72), (214, 62), (244, 72), (260, 76)]
MID2 = [(-4, 92), (30, 82), (64, 88), (100, 79), (140, 88),
        (178, 80), (212, 90), (248, 82), (260, 88)]
MID = [(-4, 104), (34, 95), (72, 103), (110, 93), (150, 104),
       (190, 95), (230, 104), (260, 101)]
NEAR = [(-4, 116), (40, 108), (88, 116), (140, 107), (196, 117), (240, 109), (260, 116)]
FORE = [(-4, 124), (60, 120), (130, 126), (200, 121), (260, 125)]

DAY = dict(
    far=(170, 198, 208), far_rim=(198, 218, 222),
    mid2=(124, 164, 152),
    mid=(88, 134, 106), mid_sh=(74, 118, 92), mid_rim=(122, 166, 134),
    near=(58, 102, 74), near_sh=(46, 86, 62), near_rim=(88, 140, 100),
    fore=(34, 64, 46), fore_sh=(26, 52, 38),
    a_trunk=(42, 34, 30), a_crown=(26, 52, 34), a_crownlo=(18, 40, 26),
    mist=(216, 232, 234),
    pedra=(154, 150, 142), pedra_rim=(190, 186, 178), pedra_sh=(120, 116, 108),
    wall=(224, 212, 182), roof=(196, 104, 74), door=(96, 64, 52), win=(150, 196, 210),
    chim=(120, 96, 80),
    hy_flower=(150, 140, 220), hy_leaf=(60, 110, 70),
    bld=(150, 150, 168), bld_win=(255, 224, 140), bld_roof=(110, 110, 130),
    obs_wall=(202, 202, 212), obs_dome=(150, 158, 178), obs_slit=(40, 44, 60),
    path=(208, 190, 152), path_edge=(150, 134, 104),
    flag_pole=(90, 70, 54), flag_cloth=(214, 96, 72),
    log=(92, 64, 44), flame=(255, 150, 60), hot=(255, 214, 120), glow=(255, 184, 92),
    bench=(92, 70, 54), board=(150, 110, 74),
)
NIGHT = dict(
    far=(52, 48, 80), far_rim=(72, 66, 100),
    mid2=(40, 36, 64),
    mid=(32, 28, 52), mid_sh=(24, 20, 42), mid_rim=(54, 48, 78),
    near=(22, 18, 40), near_sh=(16, 12, 30), near_rim=(40, 34, 60),
    fore=(12, 9, 22), fore_sh=(8, 6, 16),
    a_trunk=(10, 8, 18), a_crown=(11, 11, 24), a_crownlo=(6, 6, 14),
    mist=(58, 52, 84),
    pedra=(60, 56, 80), pedra_rim=(86, 80, 108), pedra_sh=(44, 40, 62),
    wall=(46, 34, 58), roof=(60, 32, 54), door=(18, 12, 24), win=(255, 214, 120),
    chim=(30, 24, 32),
    hy_flower=(120, 110, 190), hy_leaf=(24, 42, 32),
    bld=(30, 28, 50), bld_win=(255, 214, 120), bld_roof=(20, 18, 36),
    obs_wall=(44, 42, 66), obs_dome=(34, 34, 54), obs_slit=(120, 182, 222),
    path=(92, 84, 74), path_edge=(50, 44, 40),
    flag_pole=(30, 24, 20), flag_cloth=(150, 60, 54),
    log=(30, 22, 18), flame=(255, 150, 60), hot=(255, 220, 130), glow=(255, 172, 90),
    bench=(26, 20, 18), board=(60, 44, 30),
)

# ---------------------------------------------- fundos das secoes -----------
S_FAR = [(-4, 100), (40, 90), (90, 98), (140, 88), (190, 98), (240, 90), (260, 98)]
S_MID = [(-4, 112), (50, 104), (110, 112), (170, 104), (230, 112), (260, 110)]
S_GND = [(-4, 124), (80, 122), (160, 125), (240, 122), (260, 124)]


def backdrop(cv, p):
    """Serra baixa e enevoada, comum a todas as secoes (nao briga com o texto)."""
    mountains(cv, S_FAR, H, p["far"], rim=p["far_rim"])
    mist(cv, 96, p["mist"], height=3, density=0.5)
    mountains(cv, S_MID, H, p["mid2"])
    mist(cv, 108, p["mist"], height=2, density=0.4)
    mountains(cv, S_GND, H, p["near"], rim=p["near_rim"], shade=p["near_sh"])


def sec_about(p, night):
    cv = Canvas(W, H); backdrop(cv, p)
    pousada(cv, 30, 122, p["wall"], p["roof"], p["door"], p["win"], p["chim"], warm=night)
    if night:
        smoke(cv, 50, 108, (120, 110, 130))
    for x in (24, 66, 200, 224):
        hydrangea(cv, x, 138, p["hy_flower"], p["hy_leaf"])
    araucaria(cv, 210, 138, 24, p["a_trunk"], p["a_crown"], p["a_crownlo"])
    araucaria(cv, 236, 136, 20, p["a_trunk"], p["a_crown"], p["a_crownlo"])
    return cv


def sec_projects(p, night):
    cv = Canvas(W, H); backdrop(cv, p)
    for x, w, h, ant in [(18, 16, 20, True), (40, 12, 14, False), (60, 14, 24, True),
                          (176, 13, 16, False), (196, 17, 26, True), (220, 12, 18, False),
                          (238, 15, 22, True)]:
        building(cv, x, 138, w, h, p["bld"], p["bld_win"] if night else p["win"], p["bld_roof"], antenna=ant)
    araucaria(cv, 128, 138, 22, p["a_trunk"], p["a_crown"], p["a_crownlo"])
    return cv


def sec_skills(p, night):
    cv = Canvas(W, H); backdrop(cv, p)
    observatory(cv, 120, 126, p["obs_wall"], p["obs_dome"], p["obs_slit"])
    if night:
        constellation(cv, [(30, 30), (44, 44), (66, 38), (80, 54), (60, 62)])
        constellation(cv, [(196, 28), (214, 40), (234, 30), (228, 50), (208, 46)])
    for x, base, h in [(24, 138, 22), (232, 136, 24)]:
        araucaria(cv, x, base, h, p["a_trunk"], p["a_crown"], p["a_crownlo"])
    return cv


def sec_experience(p, night):
    cv = Canvas(W, H); backdrop(cv, p)
    pts = [(6, 140), (60, 132), (110, 138), (168, 128), (214, 134), (252, 122)]
    trail(cv, pts, p["path"], p["path_edge"])
    for (x, y) in pts[1:]:
        flag(cv, x, y - 2, p["flag_pole"], p["flag_cloth"])
    araucaria(cv, 90, 140, 20, p["a_trunk"], p["a_crown"], p["a_crownlo"])
    return cv


def sec_contact(p, night):
    cv = Canvas(W, H); backdrop(cv, p)
    campfire(cv, 60, 136, p["log"], p["flame"], p["hot"], p["glow"])
    bench(cv, 78, 134, p["bench"])
    signpost(cv, 210, 138, p["flag_pole"], p["board"], warm=night)
    for x, base, h in [(30, 140, 20), (236, 138, 22)]:
        araucaria(cv, x, base, h, p["a_trunk"], p["a_crown"], p["a_crownlo"])
    return cv


SECTIONS = {
    "about": sec_about, "projects": sec_projects, "skills": sec_skills,
    "experience": sec_experience, "contact": sec_contact,
}


def foreground(p, warm_window):
    cv = Canvas(W, H)
    mountains(cv, FAR, H, p["far"], rim=p["far_rim"])
    mist(cv, 76, p["mist"], height=3, density=0.6)
    mountains(cv, MID2, H, p["mid2"])
    mist(cv, 88, p["mist"], height=3, density=0.5)
    mountains(cv, MID, H, p["mid"], rim=p["mid_rim"], shade=p["mid_sh"])
    # Pedra do Bau — marco da regiao, na crista media a direita
    pedra_do_bau(cv, 206, 104, 48, p["pedra"], p["pedra_rim"], p["pedra_sh"])
    mist(cv, 101, p["mist"], height=2, density=0.4)
    mountains(cv, NEAR, H, p["near"], rim=p["near_rim"], shade=p["near_sh"])
    mountains(cv, FORE, H, p["fore"], shade=p["fore_sh"])
    # mata de fundo + araucarias na frente
    for x, h in [(16, 12), (100, 13), (168, 11), (250, 12)]:
        pine(cv, x, 132, h, p["fore"], p["fore_sh"])
    cabin(cv, 60, 120, p["wall"], p["roof"], p["door"], p["win"], warm=warm_window)
    for x, base, h in [(30, 134, 24), (206, 136, 26), (232, 132, 20), (128, 138, 22)]:
        araucaria(cv, x, base, h, p["a_trunk"], p["a_crown"], p["a_crownlo"])
    return cv


def main():
    os.makedirs(OUT, exist_ok=True)
    sky_day().save(os.path.join(OUT, "hero-sky-day.png"))
    sky_night().save(os.path.join(OUT, "hero-sky-night.png"))
    foreground(DAY, warm_window=False).save(os.path.join(OUT, "hero-fg-day.png"))
    foreground(NIGHT, warm_window=True).save(os.path.join(OUT, "hero-fg-night.png"))
    sun_sprite(30).save(os.path.join(OUT, "sun.png"))
    moon_sprite(28).save(os.path.join(OUT, "moon.png"))
    for name, fn in SECTIONS.items():
        fn(DAY, night=False).save(os.path.join(OUT, f"{name}-fg-day.png"))
        fn(NIGHT, night=True).save(os.path.join(OUT, f"{name}-fg-night.png"))
    print("ok: hero + secoes (" + ", ".join(SECTIONS) + ") + sun/moon")


if __name__ == "__main__":
    main()
