"""Gera o PACOTE ORIGINAL do MOD STUDIO (/mod) a partir do projeto do jogo.

Só LÊ o projeto do FUTIBA. Escreve em mod/base/:
  base.json               dados do site (+ "group" e caminhos das imagens, para o estúdio mostrar)
  img/crests|coaches|players/*.png
  FUTIBA_ORIGINAL.json    o PACOTE ORIGINAL: um JSON solto, sem imagens (vai em mod/ ao lado do exe)

Uso: python tools/build_mod_base.py [caminho do projeto FUTIBA_ML]
"""
import io
import json
import os
import shutil
import sys

from PIL import Image

GAME = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
    "~/Downloads/futiba/projeto/FUTIBA_ML")
SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(SITE, "mod", "base")
MOD_ID = "FUTIBA_ORIGINAL"
SIZES = {"crests": (24, 24), "coaches": (48, 64), "players": (32, 32)}
ATTRS = ["pace", "shooting", "passing", "dribbling", "defense", "heading",
         "goalkeeping", "stamina", "strength"]


def jload(rel):
    with open(os.path.join(GAME, rel), encoding="utf-8") as f:
        return json.load(f)


def group_of(t):
    if t.get("wc_only"):
        return "wc"
    if t.get("ml_only"):
        return "ml"
    if t.get("brazuca"):
        return "futsal"
    if t.get("beach"):
        return "beach"
    if t.get("desafio"):
        return "desafio"
    if t.get("unlockable"):
        return "secret"
    return "field"


def copy_img(res_path, kind, name, files):
    """Copia o PNG do jogo para img/<kind>/<name>.png no tamanho exato."""
    if not res_path or not res_path.startswith("res://"):
        return ""
    src = os.path.join(GAME, res_path[len("res://"):])
    if not os.path.isfile(src):
        return ""
    im = Image.open(src).convert("RGBA")
    if im.size != SIZES[kind]:
        im = im.resize(SIZES[kind], Image.NEAREST)
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    rel = "img/%s/%s.png" % (kind, name)
    files[rel] = buf.getvalue()
    return rel


def main():
    index = jload("data/teams/_index.json") + jload("data/teams/_ml_index.json")
    # 29/out: as 40 seleções da COPA DO MUNDO (só existem nesse modo do jogo)
    if os.path.isfile(os.path.join(GAME, "data/teams/_wc_index.json")):
        index += jload("data/teams/_wc_index.json")
    files = {}
    teams = []
    for tid in index:
        t = jload("data/teams/%s.json" % tid)
        coach = {}
        cpath = "data/coaches/%s.json" % t.get("coach_id", "")
        if os.path.isfile(os.path.join(GAME, cpath)):
            c = jload(cpath)
            coach = {"name": c.get("name", ""), "nationality": c.get("nationality", ""),
                     "photo": copy_img(c.get("portrait_asset", ""), "coaches", tid, files)}
        players = []
        for pid in t.get("roster", []):
            ppath = "data/players/%s.json" % pid
            if not os.path.isfile(os.path.join(GAME, ppath)):
                continue
            p = jload(ppath)
            ap = p.get("appearance", {})
            players.append({
                "id": pid,
                "name": p.get("name", ""),
                "short_name": p.get("short_name", ""),
                "shirt_number": p.get("shirt_number", -1),
                "position": p.get("position", "MF"),
                "foot": p.get("foot", "R"),
                "trait": p.get("trait", ""),
                "attributes": {k: int(p.get("attributes", {}).get(k, 50)) for k in ATTRS},
                # facial dos dados é ignorado pelo jogo (só IDs fixos têm barba):
                # o pacote original vai com 0 para não mudar ninguém.
                "appearance": {"skin": int(ap.get("skin", 2)), "hair_style": int(ap.get("hair_style", 0)),
                               "hair_color": int(ap.get("hair_color", 0)), "facial": 0,
                               "body_type": ap.get("body_type", "standard") or "standard"},
                "photo": copy_img(p.get("portrait_asset", ""), "players", pid, files),
            })
        teams.append({
            "id": tid,
            "group": group_of(t),
            "name": t.get("name", ""),
            "short_name": t.get("short_name", ""),
            "country": t.get("country", ""),
            "primary_color": t.get("primary_color", "#787878"),
            "secondary_color": t.get("secondary_color", "#101010"),
            "kit_color3": t.get("kit_color3", "#141416"),
            "kit_pattern": t.get("kit_pattern", "solid"),
            "crest": copy_img(t.get("crest_asset", ""), "crests", tid, files),
            "coach": coach,
            "players": players,
        })

    mod = {"format": "futiba-mod", "version": 1, "id": MOD_ID, "name": "FUTIBA ORIGINAL",
           "author": "FUTIBA", "created": "2026-10-26", "teams": teams}

    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    for rel, data in files.items():
        dst = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(dst, "wb") as f:
            f.write(data)
    with open(os.path.join(OUT, "base.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(mod, f, ensure_ascii=False, separators=(",", ":"))

    # PACOTE ORIGINAL = um JSON solto, sem pasta e sem imagens: o jogo usa
    # as imagens que já tem e só troca nomes, siglas, cores e técnicos.
    # Atributos e aparência ficam de fora: override só mexe no que vem, então
    # nada de gameplay ou sprite (barbas fixas por ID) muda ao importar.
    game_mod = json.loads(json.dumps(mod))
    for t in game_mod["teams"]:
        t.pop("group", None)
        t.pop("crest", None)
        t["coach"].pop("photo", None)
        t["players"] = [{"id": p["id"], "name": p["name"], "short_name": p["short_name"]}
                        for p in t["players"]]
    jpath = os.path.join(OUT, MOD_ID + ".json")
    with open(jpath, "w", encoding="utf-8", newline="\n") as f:
        json.dump(game_mod, f, ensure_ascii=False, indent=1)
    print("times %d, jogadores %d, imagens %d, json %.2f MB" % (
        len(teams), sum(len(t["players"]) for t in teams), len(files),
        os.path.getsize(jpath) / 1e6))


if __name__ == "__main__":
    main()
