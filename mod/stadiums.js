/* FUTIBA MOD STUDIO: ESTÁDIOS (31/out, teste isolado e removível).
 *
 * LIGA/DESLIGA: troque ENABLED abaixo para false (ou tire a linha
 * <script src="/mod/stadiums.js"> do index.html). Desligado, o menu ESTÁDIOS
 * some e o resto do /mod segue igual; mods já exportados continuam valendo.
 *
 * Tudo roda no navegador: ajuste das imagens, validação, prévia, GIF e o
 * arquivo do mod. Nada é enviado para servidor nenhum (só lê as imagens fixas
 * de /mod/img/stadium/, como qualquer imagem da página).
 *
 * No jogo: 5 vagas (ghost1..ghost5) que só aparecem quando ganham nome aqui.
 * Arte no tamanho dos estádios do jogo: céu, estádio, torcida e placas em
 * 920x482 (aparecem a 1/3 na tela 320x240), torcida de costas 490x470,
 * miniatura 50x34. Ver scripts/core/ghost_stadiums.gd no projeto do jogo.
 */
(function () {
  "use strict";
  var ENABLED = true;
  if (!ENABLED || !window.FutibaMod) return;
  var M = window.FutibaMod;
  var IMG = "/mod/img/stadium/";
  var SLOTS = ["ghost1", "ghost2", "ghost3", "ghost4", "ghost5"];
  var GRASS = ["padrao", "africa", "barcelona", "manchester", "milao", "terrao", "tokio"];
  var TRACKS = ["concreto", "saibro", "cinza", "terra", "grama"];
  var LAYER = [920, 482], BACKS = [490, 470], THUMB = [50, 34];
  var MAX_PNG = 1024 * 1024;
  var NAME_MAX = 24;
  var GEN_CROWD_Y = 270;            // mesma faixa do jogo (GhostStadiums.GENERIC_CROWD_Y)
  var TILE_X0 = 6.333, TILE_W = 306.667, TILE_H = 160.667, TRACK_Y = 161;   // medidos no jogo

  var L = {
    sky: { size: LAYER, key: false },
    stand: { size: LAYER, key: true },
    crowd: { size: LAYER, key: true, modes: true },
    boards: { size: LAYER, key: true, modes: true },
    backs: { size: BACKS, key: false },
    thumb: { size: THUMB, key: true, contain: true }
  };
  var ORDER = ["sky", "stand", "crowd", "boards", "backs", "thumb"];

  // ---------- textos (3 línguas, para quem não é técnico) ----------
  var TX = {
    pt: {
      menu: "ESTÁDIOS", title: "ESTÁDIOS (TESTE)",
      intro: "CRIE ATÉ 5 ESTÁDIOS NOVOS. CADA UM SÓ APARECE NO JOGO DEPOIS QUE GANHA UM NOME AQUI E O MOD É INSTALADO. A ARTE VOCÊ GERA NA SUA IA: COPIE O PROMPT DE CADA PARTE, PEÇA A IMAGEM E ENVIE AQUI. O ESTÚDIO ACERTA O TAMANHO SOZINHO E TE AVISA SE ALGO NÃO SERVIR.",
      slot: "ESTÁDIO {n}", name: "NOME DO ESTÁDIO", noname: "SEM NOME: ESTE ESTÁDIO NÃO VAI PARA O JOGO.",
      grass: "GRAMADO", track: "PISTA (ENTRE AS PLACAS E O CAMPO)",
      g_padrao: "PADRÃO", g_africa: "ÁFRICA", g_barcelona: "BARCELONA", g_manchester: "MANCHESTER", g_milao: "MILÃO", g_terrao: "TERRÃO", g_tokio: "TÓQUIO",
      t_concreto: "CONCRETO", t_saibro: "SAIBRO", t_cinza: "CINZA", t_terra: "TERRA", t_grama: "GRAMA",
      l_sky: "1. CÉU", l_stand: "2. ESTÁDIO", l_crowd: "3. TORCIDA", l_boards: "4. PLACAS", l_backs: "5. TORCIDA DE COSTAS", l_thumb: "6. MINIATURA",
      d_sky: "O QUE FICA LÁ NO ALTO, ATRÁS DE TUDO. UMA IMAGEM INTEIRA, SEM PARTES VAZIAS. UMA ARTE SÓ: DE TARDE E DE NOITE O JOGO ESCURECE SOZINHO.",
      d_stand: "A ARQUIBANCADA, OS PRÉDIOS, AS ÁRVORES E OS REFLETORES. ONDE FOR CÉU, A IMAGEM TEM QUE SER ROSA-CHOQUE (#FF00FF): O ESTÚDIO APAGA ESSA COR E O CÉU APARECE ALI. SE QUISER, PODE DESENHAR A TORCIDA E AS PLACAS AQUI MESMO.",
      d_crowd: "SÓ AS PESSOAS, COM TUDO EM VOLTA EM ROSA-CHOQUE. SE NÃO ENVIAR, ENTRA A TORCIDA DO JOGO NUMA FAIXA NO MEIO DA ARQUIBANCADA (VEJA NA PRÉVIA). SE VOCÊ JÁ DESENHOU A TORCIDA NO ESTÁDIO, ESCOLHA \"JÁ ESTÁ NO DESENHO\".",
      d_boards: "UMA FILEIRA DE PLACAS DE PROPAGANDA EMBAIXO, O RESTO ROSA-CHOQUE. SE NÃO ENVIAR, ENTRAM AS PLACAS DO JOGO. JÁ DESENHOU NO ESTÁDIO? ESCOLHA \"JÁ ESTÁ NO DESENHO\".",
      d_backs: "A TORCIDA DO LADO DE CÁ, DE COSTAS PARA VOCÊ. APARECE EMBAIXO DA TELA QUANDO A BOLA DESCE. A IMAGEM INTEIRA É GENTE DE COSTAS. SE NÃO ENVIAR, ENTRA A DO JOGO. (ELA NÃO APARECE NA PRÉVIA, QUE MOSTRA O ALTO DO CAMPO.)",
      d_thumb: "O DESENHO PEQUENO QUE APARECE NA TELA DO PRÉ-JOGO (ONDE VOCÊ ESCOLHE MANDANTE, ESTÁDIO E HORÁRIO): O ESTÁDIO INTEIRO VISTO DO ALTO, DE LADO, IGUAL AOS DO JOGO (VEJA O EXEMPLO). FUNDO ROSA-CHOQUE. NÃO É FOTO. SE NÃO ENVIAR, ENTRA UMA MINIATURA PADRÃO.",
      m_gen: "DO JOGO", m_own: "MINHA (ENVIAR)", m_none: "JÁ ESTÁ NO DESENHO",
      up: "ENVIAR IMAGEM", rm: "TIRAR", copy: "COPIAR PROMPT", ex: "VER EXEMPLO", copied: "PROMPT COPIADO. COLE NA SUA IA (MANDE O EXEMPLO JUNTO).",
      ok: "OK: {w}X{h}, {c} CORES.", none_up: "NADA ENVIADO.",
      e_read: "NÃO CONSEGUI ABRIR ESTA IMAGEM. ENVIE PNG, JPG OU WEBP.",
      e_ratio: "FORMATO ERRADO: ESTA PARTE É {want} (LARGURA X ALTURA) E A SUA IMAGEM É {got}. PEÇA À IA UMA IMAGEM DESTE FORMATO.",
      e_sky_holes: "O CÉU TEM PARTES TRANSPARENTES. ELE PRECISA SER UMA IMAGEM INTEIRA.",
      w_stand_nosky: "AVISO: NENHUMA PARTE ROSA-CHOQUE. O CÉU NÃO VAI APARECER (TUDO BEM SE VOCÊ DESENHOU O CÉU AQUI).",
      e_cover: "ESTA IMAGEM COBRE O ESTÁDIO TODO. PINTE DE ROSA-CHOQUE (#FF00FF) TUDO QUE NÃO FOR {what}.",
      w_crowd: "TORCIDA", w_boards: "PLACA",
      e_thumb_bg: "A MINIATURA PRECISA DO FUNDO ROSA-CHOQUE (#FF00FF) EM VOLTA DO ESTÁDIO. NÃO É FOTO: É O DESENHO DO ESTÁDIO VISTO DO ALTO.",
      e_big: "A IMAGEM FICOU PESADA DEMAIS (MAIS DE 1 MB). USE MENOS DETALHES OU MENOS CORES.",
      prev: "PRÉVIA (COMO FICA NO JOGO, TELA 320X240)", gif: "BAIXAR GIF DA PRÉVIA",
      p_missing: "FALTA O CÉU OU O ESTÁDIO: NO JOGO ELE USA O ESTÁDIO PADRÃO ATÉ VOCÊ ENVIAR OS DOIS.",
      export_hint: "PRONTO? SALVE O MOD NO BOTÃO \"BAIXAR MOD\" (OS TIMES DO RASCUNHO VÃO JUNTO).",
      e_export: "O ESTÁDIO {n} TEM UMA IMAGEM QUE NÃO SERVE. CORRIJA OU TIRE ANTES DE BAIXAR."
    },
    en: {
      menu: "STADIUMS", title: "STADIUMS (TEST)",
      intro: "CREATE UP TO 5 NEW STADIUMS. EACH ONE ONLY SHOWS UP IN THE GAME AFTER IT GETS A NAME HERE AND THE MOD IS INSTALLED. YOU MAKE THE ART WITH YOUR AI: COPY THE PROMPT OF EACH PART, ASK FOR THE IMAGE AND UPLOAD IT HERE. THE STUDIO FIXES THE SIZE BY ITSELF AND TELLS YOU IF SOMETHING DOESN'T WORK.",
      slot: "STADIUM {n}", name: "STADIUM NAME", noname: "NO NAME: THIS STADIUM WON'T GO INTO THE GAME.",
      grass: "PITCH GRASS", track: "TRACK (BETWEEN THE BOARDS AND THE PITCH)",
      g_padrao: "DEFAULT", g_africa: "AFRICA", g_barcelona: "BARCELONA", g_manchester: "MANCHESTER", g_milao: "MILAN", g_terrao: "DIRT", g_tokio: "TOKYO",
      t_concreto: "CONCRETE", t_saibro: "CLAY", t_cinza: "GRAY", t_terra: "DIRT", t_grama: "GRASS",
      l_sky: "1. SKY", l_stand: "2. STADIUM", l_crowd: "3. CROWD", l_boards: "4. BOARDS", l_backs: "5. CROWD FROM BEHIND", l_thumb: "6. THUMBNAIL",
      d_sky: "WHAT IS UP HIGH, BEHIND EVERYTHING. ONE FULL IMAGE, NO EMPTY PARTS. ONE ART ONLY: IN THE AFTERNOON AND AT NIGHT THE GAME MAKES IT DARKER BY ITSELF.",
      d_stand: "THE STANDS, BUILDINGS, TREES AND FLOODLIGHTS. WHERE THE SKY GOES, THE IMAGE MUST BE HOT PINK (#FF00FF): THE STUDIO ERASES THAT COLOR AND THE SKY SHOWS THERE. IF YOU WANT, YOU CAN DRAW THE CROWD AND THE BOARDS HERE TOO.",
      d_crowd: "ONLY THE PEOPLE, WITH EVERYTHING AROUND THEM IN HOT PINK. IF YOU DON'T UPLOAD IT, THE GAME'S CROWD FILLS A BAND IN THE MIDDLE OF THE STANDS (SEE THE PREVIEW). ALREADY DREW THE CROWD IN THE STADIUM? PICK \"ALREADY IN THE DRAWING\".",
      d_boards: "ONE ROW OF ADVERTISING BOARDS AT THE BOTTOM, THE REST HOT PINK. IF YOU DON'T UPLOAD IT, THE GAME'S BOARDS ARE USED. ALREADY DREW THEM IN THE STADIUM? PICK \"ALREADY IN THE DRAWING\".",
      d_backs: "THE CROWD ON THIS SIDE, WITH THEIR BACKS TO YOU. IT SHOWS AT THE BOTTOM OF THE SCREEN WHEN THE BALL GOES DOWN. THE WHOLE IMAGE IS PEOPLE FROM BEHIND. IF YOU DON'T UPLOAD IT, THE GAME'S ONE IS USED. (IT IS NOT IN THE PREVIEW, WHICH SHOWS THE TOP OF THE PITCH.)",
      d_thumb: "THE SMALL DRAWING SHOWN ON THE PRE-MATCH SCREEN (WHERE YOU PICK HOME/AWAY, STADIUM AND TIME): THE WHOLE STADIUM SEEN FROM ABOVE, AT AN ANGLE, LIKE THE GAME'S ONES (SEE THE EXAMPLE). HOT PINK BACKGROUND. NOT A PHOTO. IF YOU DON'T UPLOAD IT, A DEFAULT ONE IS USED.",
      m_gen: "FROM THE GAME", m_own: "MINE (UPLOAD)", m_none: "ALREADY IN THE DRAWING",
      up: "UPLOAD IMAGE", rm: "REMOVE", copy: "COPY PROMPT", ex: "SEE EXAMPLE", copied: "PROMPT COPIED. PASTE IT IN YOUR AI (SEND THE EXAMPLE WITH IT).",
      ok: "OK: {w}X{h}, {c} COLORS.", none_up: "NOTHING UPLOADED.",
      e_read: "I COULDN'T OPEN THIS IMAGE. UPLOAD PNG, JPG OR WEBP.",
      e_ratio: "WRONG SHAPE: THIS PART IS {want} (WIDTH X HEIGHT) AND YOUR IMAGE IS {got}. ASK YOUR AI FOR AN IMAGE WITH THIS SHAPE.",
      e_sky_holes: "THE SKY HAS SEE-THROUGH PARTS. IT MUST BE ONE FULL IMAGE.",
      w_stand_nosky: "HEADS UP: NO HOT PINK PART. THE SKY WON'T SHOW (FINE IF YOU DREW THE SKY HERE).",
      e_cover: "THIS IMAGE COVERS THE WHOLE STADIUM. PAINT EVERYTHING THAT IS NOT {what} HOT PINK (#FF00FF).",
      w_crowd: "CROWD", w_boards: "A BOARD",
      e_thumb_bg: "THE THUMBNAIL NEEDS THE HOT PINK BACKGROUND (#FF00FF) AROUND THE STADIUM. IT IS NOT A PHOTO: IT IS A DRAWING OF THE STADIUM SEEN FROM ABOVE.",
      e_big: "THE IMAGE GOT TOO HEAVY (OVER 1 MB). USE LESS DETAIL OR FEWER COLORS.",
      prev: "PREVIEW (HOW IT LOOKS IN THE GAME, 320X240 SCREEN)", gif: "DOWNLOAD PREVIEW GIF",
      p_missing: "THE SKY OR THE STADIUM IS MISSING: IN THE GAME IT USES THE DEFAULT STADIUM UNTIL YOU UPLOAD BOTH.",
      export_hint: "DONE? SAVE THE MOD WITH \"DOWNLOAD MOD\" (THE TEAMS IN YOUR DRAFT GO WITH IT).",
      e_export: "STADIUM {n} HAS AN IMAGE THAT DOESN'T WORK. FIX IT OR REMOVE IT BEFORE DOWNLOADING."
    },
    es: {
      menu: "ESTADIOS", title: "ESTADIOS (PRUEBA)",
      intro: "CREA HASTA 5 ESTADIOS NUEVOS. CADA UNO SOLO APARECE EN EL JUEGO DESPUÉS DE TENER UN NOMBRE AQUÍ Y DE INSTALAR EL MOD. EL ARTE LO HACES CON TU IA: COPIA EL PROMPT DE CADA PARTE, PIDE LA IMAGEN Y SÚBELA AQUÍ. EL ESTUDIO AJUSTA EL TAMAÑO SOLO Y TE AVISA SI ALGO NO SIRVE.",
      slot: "ESTADIO {n}", name: "NOMBRE DEL ESTADIO", noname: "SIN NOMBRE: ESTE ESTADIO NO VA AL JUEGO.",
      grass: "CÉSPED", track: "PISTA (ENTRE LAS VALLAS Y EL CAMPO)",
      g_padrao: "ESTÁNDAR", g_africa: "ÁFRICA", g_barcelona: "BARCELONA", g_manchester: "MÁNCHESTER", g_milao: "MILÁN", g_terrao: "TIERRA", g_tokio: "TOKIO",
      t_concreto: "CEMENTO", t_saibro: "ARCILLA", t_cinza: "GRIS", t_terra: "TIERRA", t_grama: "CÉSPED",
      l_sky: "1. CIELO", l_stand: "2. ESTADIO", l_crowd: "3. HINCHADA", l_boards: "4. VALLAS", l_backs: "5. HINCHADA DE ESPALDAS", l_thumb: "6. MINIATURA",
      d_sky: "LO QUE ESTÁ ARRIBA, DETRÁS DE TODO. UNA IMAGEN ENTERA, SIN PARTES VACÍAS. UN SOLO ARTE: DE TARDE Y DE NOCHE EL JUEGO LO OSCURECE SOLO.",
      d_stand: "LA TRIBUNA, LOS EDIFICIOS, LOS ÁRBOLES Y LOS FOCOS. DONDE VA EL CIELO, LA IMAGEN TIENE QUE SER ROSA FUERTE (#FF00FF): EL ESTUDIO BORRA ESE COLOR Y AHÍ APARECE EL CIELO. SI QUIERES, PUEDES DIBUJAR LA HINCHADA Y LAS VALLAS AQUÍ MISMO.",
      d_crowd: "SOLO LAS PERSONAS, CON TODO ALREDEDOR EN ROSA FUERTE. SI NO LA SUBES, ENTRA LA HINCHADA DEL JUEGO EN UNA FRANJA EN EL MEDIO DE LA TRIBUNA (MIRA LA VISTA PREVIA). ¿YA LA DIBUJASTE EN EL ESTADIO? ELIGE \"YA ESTÁ EN EL DIBUJO\".",
      d_boards: "UNA FILA DE VALLAS PUBLICITARIAS ABAJO, EL RESTO EN ROSA FUERTE. SI NO LAS SUBES, ENTRAN LAS DEL JUEGO. ¿YA LAS DIBUJASTE EN EL ESTADIO? ELIGE \"YA ESTÁ EN EL DIBUJO\".",
      d_backs: "LA HINCHADA DE ESTE LADO, DE ESPALDAS A TI. APARECE ABAJO EN LA PANTALLA CUANDO EL BALÓN BAJA. LA IMAGEN ENTERA ES GENTE DE ESPALDAS. SI NO LA SUBES, ENTRA LA DEL JUEGO. (NO APARECE EN LA VISTA PREVIA, QUE MUESTRA LA PARTE DE ARRIBA DEL CAMPO.)",
      d_thumb: "EL DIBUJO PEQUEÑO QUE APARECE EN LA PANTALLA DEL PREVIO (DONDE ELIGES LOCAL/VISITANTE, ESTADIO Y HORARIO): EL ESTADIO ENTERO VISTO DESDE ARRIBA, EN DIAGONAL, COMO LOS DEL JUEGO (MIRA EL EJEMPLO). FONDO ROSA FUERTE. NO ES UNA FOTO. SI NO LO SUBES, ENTRA UNA MINIATURA ESTÁNDAR.",
      m_gen: "DEL JUEGO", m_own: "MÍA (SUBIR)", m_none: "YA ESTÁ EN EL DIBUJO",
      up: "SUBIR IMAGEN", rm: "QUITAR", copy: "COPIAR PROMPT", ex: "VER EJEMPLO", copied: "PROMPT COPIADO. PÉGALO EN TU IA (MANDA EL EJEMPLO JUNTO).",
      ok: "OK: {w}X{h}, {c} COLORES.", none_up: "NADA SUBIDO.",
      e_read: "NO PUDE ABRIR ESTA IMAGEN. SUBE PNG, JPG O WEBP.",
      e_ratio: "FORMATO EQUIVOCADO: ESTA PARTE ES {want} (ANCHO X ALTO) Y TU IMAGEN ES {got}. PIDE A LA IA UNA IMAGEN DE ESTE FORMATO.",
      e_sky_holes: "EL CIELO TIENE PARTES TRANSPARENTES. TIENE QUE SER UNA IMAGEN ENTERA.",
      w_stand_nosky: "AVISO: NINGUNA PARTE EN ROSA FUERTE. EL CIELO NO VA A APARECER (ESTÁ BIEN SI DIBUJASTE EL CIELO AQUÍ).",
      e_cover: "ESTA IMAGEN TAPA TODO EL ESTADIO. PINTA DE ROSA FUERTE (#FF00FF) TODO LO QUE NO SEA {what}.",
      w_crowd: "HINCHADA", w_boards: "VALLA",
      e_thumb_bg: "LA MINIATURA NECESITA EL FONDO ROSA FUERTE (#FF00FF) ALREDEDOR DEL ESTADIO. NO ES UNA FOTO: ES EL DIBUJO DEL ESTADIO VISTO DESDE ARRIBA.",
      e_big: "LA IMAGEN QUEDÓ MUY PESADA (MÁS DE 1 MB). USA MENOS DETALLES O MENOS COLORES.",
      prev: "VISTA PREVIA (CÓMO QUEDA EN EL JUEGO, PANTALLA 320X240)", gif: "BAJAR GIF DE LA VISTA PREVIA",
      p_missing: "FALTA EL CIELO O EL ESTADIO: EN EL JUEGO USA EL ESTADIO ESTÁNDAR HASTA QUE SUBAS LOS DOS.",
      export_hint: "¿LISTO? GUARDA EL MOD CON \"BAJAR MOD\" (LOS EQUIPOS DEL BORRADOR VAN JUNTOS).",
      e_export: "EL ESTADIO {n} TIENE UNA IMAGEN QUE NO SIRVE. CORRÍGELA O QUÍTALA ANTES DE BAJAR."
    }
  };
  function tx(k, v) {
    var s = (TX[M.lang()] || TX.pt)[k] || TX.pt[k] || k;
    if (v) Object.keys(v).forEach(function (n) { s = s.split("{" + n + "}").join(v[n]); });
    return s;
  }

  // ---------- prompts para a IA (em inglês, como os outros do /mod) ----------
  var STYLE = "16-bit retro arcade pixel art, like Neo Geo and Super Nintendo football games (use the attached example only as a style reference): " +
    "square crisp pixels, dark outlines, flat colors with block shading, at most 64 colors, no gradients, no blur, no photo textures. ";
  var P = {
    sky: "Draw the SKY behind a football stadium, as a wide image with exactly 920x482 proportions (width x height, about 1.9:1). " + STYLE +
      "Only sky: clouds, sun or stars, and far away landscape at the very bottom if you want (city skyline, hills, sea). No stadium, no people. " +
      "The whole image must be filled, no transparent parts. Daytime light: the game darkens it by itself for the afternoon and the night.",
    stand: "Draw the long side of a football stadium seen from the pitch, as a wide image with exactly 920x482 proportions (width x height, about 1.9:1). " + STYLE +
      "Stands, roof or terraces, buildings, trees and floodlights. The bottom of the stands must touch the bottom edge of the image. " +
      "Everything that would be SKY must be ONE flat solid hot pink color #FF00FF (it will be cut out). Leave the stands empty if you will send a separate crowd image. " +
      "Keep the bottom 10% of the image simple (a wall or a fence): the advertising boards go there.",
    crowd: "Draw a wide band of football fans standing shoulder to shoulder in many rows, seen from the pitch, as a wide image with exactly 920x482 proportions (width x height, about 1.9:1). " + STYLE +
      "The fans fill the whole width, between 55% and 90% of the image height (from the top). Arms up, flags and scarves in the club colors: [CLUB COLORS]. " +
      "Everything that is not a person must be ONE flat solid hot pink color #FF00FF (it will be cut out).",
    boards: "Draw one row of pitchside advertising boards, as a wide image with exactly 920x482 proportions (width x height, about 1.9:1). " + STYLE +
      "6 to 8 boards side by side, filling the whole width, in the bottom 10% of the image only (from 90% to 100% of the height). Bold colors, a simple pictogram and at most 2 short words on each: [YOUR BRANDS OR WORDS]. " +
      "Everything above the boards must be ONE flat solid hot pink color #FF00FF (it will be cut out).",
    backs: "Draw football fans seen FROM BEHIND (backs of heads and shoulders), many rows, filling the whole image, with exactly 490x470 proportions (almost square). " + STYLE +
      "Seen from above and behind, looking at the pitch. Shirts and scarves in the club colors: [CLUB COLORS]. The whole image is people, no empty parts.",
    thumb: "Draw a small icon of a WHOLE football stadium seen from above at a 3/4 angle (isometric-like), like the attached examples: the oval or rectangular stands around a green pitch, a few floodlight towers. " + STYLE +
      "The stadium fills the image, about 1.5:1 (wider than tall). Background: ONE flat solid hot pink color #FF00FF (it will be cut out). No sky, no ground around it, no text. It will be shrunk to 50x34 pixels, so keep it bold and simple."
  };

  // ---------- estado (vai no mesmo rascunho do estúdio) ----------
  var cur = 0;
  var errs = {};        // "slot|camada" -> texto do erro (não salvo)
  var notes = {};       // "slot|camada" -> texto do ok/aviso (não salvo)
  function st() {
    var S = M.state();
    if (!S.stadiums) S.stadiums = {};
    SLOTS.forEach(function (s) {
      if (!S.stadiums[s]) S.stadiums[s] = { name: "", grass: "padrao", track: "concreto", crowd: "gen", boards: "gen", img: {} };
    });
    return S.stadiums;
  }
  function count() { var d = st(); return SLOTS.filter(function (s) { return d[s].name; }).length; }

  // ---------- imagens fixas ----------
  var cache = {};
  function img(src) {
    if (!cache[src]) cache[src] = new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; });
    return cache[src];
  }
  function fromData(d) { return d ? img(d) : Promise.resolve(null); }

  // ---------- ajuste e validação de um upload ----------
  function fit(file, layer) {
    var want = L[layer].size;
    return createImageBitmap(file).then(function (bm) {
      if (L[layer].contain) return containFit(bm, want);
      var r = bm.width / bm.height, rw = want[0] / want[1];
      if (Math.abs(r / rw - 1) > 0.30) {
        throw { msg: tx("e_ratio", { want: want[0] + "X" + want[1], got: bm.width + "X" + bm.height }) };
      }
      // corta o excesso no centro e reduz para o tamanho certo
      var sw = bm.width, sh = bm.height;
      if (r > rw) sw = Math.round(bm.height * rw); else sh = Math.round(bm.width / rw);
      var c = document.createElement("canvas"); c.width = want[0]; c.height = want[1];
      var g = c.getContext("2d");
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
      g.drawImage(bm, (bm.width - sw) / 2, (bm.height - sh) / 2, sw, sh, 0, 0, want[0], want[1]);
      var d = g.getImageData(0, 0, want[0], want[1]);
      var px = d.data, n = want[0] * want[1], clear = 0;
      if (L[layer].key) {
        for (var i = 0; i < n; i++) {   // rosa-choque (com a margem da IA) vira transparente
          var q = i * 4;
          if (px[q] > 190 && px[q + 1] < 90 && px[q + 2] > 190) px[q + 3] = 0;
        }
      }
      for (var j = 0; j < n; j++) {
        if (px[j * 4 + 3] < 128) { px[j * 4 + 3] = 0; clear++; } else px[j * 4 + 3] = 255;
      }
      var colors = quantize(px, n, 64);
      g.putImageData(d, 0, 0);
      var frac = clear / n, warn = "";
      if (layer === "sky" && frac > 0.02) throw { msg: tx("e_sky_holes") };
      if ((layer === "crowd" || layer === "boards") && frac < 0.30) throw { msg: tx("e_cover", { what: tx(layer === "crowd" ? "w_crowd" : "w_boards") }) };
      if (layer === "stand" && frac < 0.03) warn = tx("w_stand_nosky");
      var url = c.toDataURL("image/png");
      if ((url.length - 22) * 0.75 > MAX_PNG) throw { msg: tx("e_big") };
      return { url: url, note: (warn ? warn + " " : "") + tx("ok", { w: want[0], h: want[1], c: colors }) };
    }, function (e) { if (e && e.msg) throw e; throw { msg: tx("e_read") }; });
  }
  // miniatura: tira o rosa-choque, corta no desenho e encaixa inteiro (sem cortar)
  function containFit(bm, want) {
    var a = document.createElement("canvas"); a.width = bm.width; a.height = bm.height;
    var ga = a.getContext("2d"); ga.drawImage(bm, 0, 0);
    var d = ga.getImageData(0, 0, a.width, a.height), px = d.data;
    var x0 = a.width, y0 = a.height, x1 = -1, y1 = -1;
    for (var y = 0; y < a.height; y++) for (var x = 0; x < a.width; x++) {
      var q = (y * a.width + x) * 4;
      if (px[q] > 190 && px[q + 1] < 90 && px[q + 2] > 190) px[q + 3] = 0;
      if (px[q + 3] > 128) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
    }
    ga.putImageData(d, 0, 0);
    var bw = x1 - x0 + 1, bh = y1 - y0 + 1;
    if (x1 < 0 || bw * bh > a.width * a.height * 0.97) throw { msg: tx("e_thumb_bg") };
    var sc = Math.min(want[0] / bw, want[1] / bh), w = Math.max(1, Math.round(bw * sc)), h = Math.max(1, Math.round(bh * sc));
    var c = document.createElement("canvas"); c.width = want[0]; c.height = want[1];
    var g = c.getContext("2d"); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.drawImage(a, x0, y0, bw, bh, Math.round((want[0] - w) / 2), want[1] - h, w, h);
    var dd = g.getImageData(0, 0, want[0], want[1]), pp = dd.data, n = want[0] * want[1];
    for (var j = 0; j < n; j++) pp[j * 4 + 3] = pp[j * 4 + 3] < 128 ? 0 : 255;
    var colors = quantize(pp, n, 32);
    g.putImageData(dd, 0, 0);
    return { url: c.toDataURL("image/png"), note: tx("ok", { w: want[0], h: want[1], c: colors }) };
  }
  // pixel art: no máximo `max` cores (as mais usadas, contadas em grupos de 4 bits)
  function quantize(px, n, max) {
    var hist = {}, keys = [];
    for (var i = 0; i < n; i++) {
      var q = i * 4; if (!px[q + 3]) continue;
      var k = (px[q] >> 4) << 8 | (px[q + 1] >> 4) << 4 | (px[q + 2] >> 4);
      if (!hist[k]) { hist[k] = [0, 0, 0, 0]; keys.push(k); }
      var h = hist[k]; h[0]++; h[1] += px[q]; h[2] += px[q + 1]; h[3] += px[q + 2];
    }
    keys.sort(function (a, b) { return hist[b][0] - hist[a][0]; });
    var pal = keys.slice(0, max).map(function (k) { var h = hist[k]; return [h[1] / h[0] | 0, h[2] / h[0] | 0, h[3] / h[0] | 0]; });
    var memo = {};
    for (var j = 0; j < n; j++) {
      var p = j * 4; if (!px[p + 3]) continue;
      var kk = px[p] << 16 | px[p + 1] << 8 | px[p + 2];
      var best = memo[kk];
      if (best === undefined) {
        var bd = 1e9;
        for (var c = 0; c < pal.length; c++) {
          var dr = px[p] - pal[c][0], dg = px[p + 1] - pal[c][1], db = px[p + 2] - pal[c][2];
          var dd = dr * dr * 3 + dg * dg * 4 + db * db * 2;
          if (dd < bd) { bd = dd; best = c; }
        }
        memo[kk] = best;
      }
      px[p] = pal[best][0]; px[p + 1] = pal[best][1]; px[p + 2] = pal[best][2];
    }
    return pal.length;
  }

  // ---------- composição (igual ao jogo) ----------
  function layers(d) {
    return Promise.all([fromData(d.img.sky), fromData(d.img.stand), fromData(d.crowd === "own" ? d.img.crowd : null),
      fromData(d.boards === "own" ? d.img.boards : null), img(IMG + "gen_crowd.png"), img(IMG + "gen_boards.png"),
      img(IMG + "tpl_" + d.grass + ".png"), img(IMG + "trackstrip_" + d.track + ".png")]).then(function (a) {
      return { sky: a[0], stand: a[1], crowd: a[2], boards: a[3], genCrowd: a[4], genBoards: a[5], tpl: a[6], track: a[7] };
    });
  }
  // estádio 920x482 já montado: fundo + torcida (sua ou do jogo) + placas
  function standCanvas(d, ly) {
    var c = document.createElement("canvas"); c.width = LAYER[0]; c.height = LAYER[1];
    var g = c.getContext("2d"); g.imageSmoothingEnabled = false;
    g.drawImage(ly.stand, 0, 0);
    if (ly.crowd) g.drawImage(ly.crowd, 0, 0);
    else if (d.crowd === "gen" && ly.genCrowd) for (var x = 0; x < LAYER[0]; x += ly.genCrowd.width) g.drawImage(ly.genCrowd, x, GEN_CROWD_Y);
    if (ly.boards) g.drawImage(ly.boards, 0, 0);
    else if (d.boards === "gen" && ly.genBoards) g.drawImage(ly.genBoards, 0, 0);
    return c;
  }
  function drawFrame(g, d, ly, standC, dx) {
    g.imageSmoothingEnabled = false;
    g.fillStyle = "#000"; g.fillRect(0, 0, 320, 240);
    if (ly.sky && ly.stand) {
      for (var k = -2; k <= 2; k++) {
        var x = Math.round(TILE_X0 + TILE_W * k + dx);
        g.drawImage(ly.sky, x, 0, Math.round(TILE_W), Math.round(TILE_H));
        g.drawImage(standC, x, 0, Math.round(TILE_W), Math.round(TILE_H));
      }
    }
    if (ly.track) g.drawImage(ly.track, 0, TRACK_Y);
    if (ly.tpl) g.drawImage(ly.tpl, 0, 0);
  }

  // ---------- tela ----------
  function esc(v) { return M.esc(v); }
  function render() {
    var box = document.getElementById("stadium-ed"); if (!box) return;
    var li = document.getElementById("menu-stadiums");
    if (li) { li.hidden = false; li.querySelector("button").textContent = tx("menu"); }
    var all = st(), slot = SLOTS[cur], d = all[slot];
    var h = '<div class="banner">' + esc(tx("title")) + "</div><p>" + esc(tx("intro")) + "</p>";
    h += '<div class="chips">' + SLOTS.map(function (s, i) {
      return '<button type="button" class="chip' + (i === cur ? " on" : "") + '" data-sslot="' + i + '">' + esc(all[s].name || tx("slot", { n: i + 1 })) + "</button>";
    }).join("") + "</div>";
    h += '<label class="f" style="margin-top:10px"><span>' + esc(tx("name")) + ' <span class="c">' + d.name.length + "/" + NAME_MAX + '</span></span><input type="text" maxlength="' + NAME_MAX + '" data-sname value="' + esc(d.name) + '"></label>';
    if (!d.name) h += '<p class="dim" style="font-size:8px">' + esc(tx("noname")) + "</p>";
    h += pickRow("grass", GRASS, d.grass, "g_");
    h += pickRow("track", TRACKS, d.track, "t_");
    h += '<div class="cards stad-cards">' + ORDER.map(function (k) { return card(slot, d, k); }).join("") + "</div>";
    h += '<div class="card"><h2>' + esc(tx("prev")) + '</h2><canvas id="stad-prev" width="320" height="240" class="stad-prev"></canvas>' +
      '<p class="dim" id="stad-prev-note" style="font-size:8px"></p><div class="row"><button type="button" class="btn btn--gold" data-sgif>' + esc(tx("gif")) + "</button></div>" +
      '<p class="dim" style="font-size:8px;margin-top:8px">' + esc(tx("export_hint")) + "</p></div>";
    box.innerHTML = h;
    preview();
  }
  function pickRow(kind, list, val, pre) {
    return '<div class="f" style="margin-top:12px"><span>' + esc(tx(kind)) + '</span><div class="stad-pick">' + list.map(function (v) {
      return '<button type="button" class="stad-opt' + (v === val ? " on" : "") + '" data-s' + kind + '="' + v + '"><img src="' + IMG + (kind === "grass" ? "grass_" : "track_") + v + '.png" alt=""><b>' + esc(tx(pre + v)) + "</b></button>";
    }).join("") + "</div></div>";
  }
  function card(slot, d, k) {
    var key = slot + "|" + k, has = !!d.img[k];
    var h = '<div class="card stad-card"><h2>' + esc(tx("l_" + k)) + '</h2><p style="font-size:8px">' + esc(tx("d_" + k)) + "</p>";
    if (L[k].modes) {
      h += '<div class="row stad-modes">' + ["gen", "own", "none"].map(function (m) {
        return '<button type="button" class="btn btn--small' + (d[k] === m ? " btn--gold" : "") + '" data-smode="' + k + '|' + m + '">' + esc(tx("m_" + m)) + "</button>";
      }).join("") + "</div>";
    }
    var showUp = !L[k].modes || d[k] === "own";
    if (showUp) {
      h += '<div class="row" style="margin-top:8px"><button type="button" class="btn btn--small" data-scopy="' + k + '">' + esc(tx("copy")) + "</button>" +
        '<a class="btn btn--small" href="' + IMG + "ex_" + k + '.png" target="_blank" rel="noopener">' + esc(tx("ex")) + "</a>" +
        '<label class="btn btn--small btn--gold">' + esc(tx("up")) + '<input type="file" accept="image/png,image/jpeg,image/webp" data-sup="' + k + '" hidden></label>' +
        (has ? '<button type="button" class="btn btn--small" data-srm="' + k + '">' + esc(tx("rm")) + "</button>" : "") + "</div>";
      if (has) h += '<img class="stad-thumb" src="' + d.img[k] + '" alt="">';
      if (errs[key]) h += '<p class="msg err" style="font-size:8px">' + esc(errs[key]) + "</p>";
      else h += '<p class="dim" style="font-size:8px">' + esc(notes[key] || (has ? "OK" : tx("none_up"))) + "</p>";
    }
    return h + "</div>";
  }
  var prevToken = 0;
  function preview() {
    var cv = document.getElementById("stad-prev"); if (!cv) return;
    var d = st()[SLOTS[cur]], tok = ++prevToken;
    layers(d).then(function (ly) {
      if (tok !== prevToken) return;
      var standC = ly.stand ? standCanvas(d, ly) : null;
      drawFrame(cv.getContext("2d"), d, ly, standC, 0);
      var note = document.getElementById("stad-prev-note");
      if (note) note.textContent = ly.sky && ly.stand ? "" : tx("p_missing");
    });
  }

  // ---------- GIF (codificador próprio, sem servidor) ----------
  function gif() {
    var d = st()[SLOTS[cur]];
    layers(d).then(function (ly) {
      var standC = ly.stand ? standCanvas(d, ly) : null;
      var c = document.createElement("canvas"); c.width = 320; c.height = 240;
      var g = c.getContext("2d"), frames = [];
      for (var f = 0; f < 24; f++) {   // câmera andando devagar para o lado, como no jogo
        drawFrame(g, d, ly, standC, -Math.round(f * TILE_W / 24));
        frames.push(g.getImageData(0, 0, 320, 240).data.slice());
      }
      var blob = new Blob([encodeGif(frames, 320, 240, 8)], { type: "image/gif" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "FUTIBA_ESTADIO_" + (d.name || SLOTS[cur]).replace(/[^A-Z0-9]/gi, "_") + ".gif";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
  }
  function encodeGif(frames, w, h, delay) {
    // paleta global: as 256 cores mais usadas (grupos de 4 bits), cor mais próxima
    var hist = {}, keys = [];
    frames.forEach(function (px) {
      for (var i = 0; i < px.length; i += 4) {
        var k = (px[i] >> 4) << 8 | (px[i + 1] >> 4) << 4 | (px[i + 2] >> 4);
        if (!hist[k]) { hist[k] = [0, 0, 0, 0]; keys.push(k); }
        var hh = hist[k]; hh[0]++; hh[1] += px[i]; hh[2] += px[i + 1]; hh[3] += px[i + 2];
      }
    });
    keys.sort(function (a, b) { return hist[b][0] - hist[a][0]; });
    var pal = keys.slice(0, 256).map(function (k) { var hh = hist[k]; return [hh[1] / hh[0] | 0, hh[2] / hh[0] | 0, hh[3] / hh[0] | 0]; });
    while (pal.length < 256) pal.push([0, 0, 0]);
    var memo = {};
    function idx(r, gg, b) {
      var k = r << 16 | gg << 8 | b; var v = memo[k];
      if (v !== undefined) return v;
      var bd = 1e9;
      for (var c = 0; c < 256; c++) { var dr = r - pal[c][0], dg = gg - pal[c][1], db = b - pal[c][2]; var dd = dr * dr + dg * dg + db * db; if (dd < bd) { bd = dd; v = c; } }
      memo[k] = v; return v;
    }
    var out = [];
    function b(v) { out.push(v & 255); }
    function w16(v) { b(v); b(v >> 8); }
    "GIF89a".split("").forEach(function (ch) { b(ch.charCodeAt(0)); });
    w16(w); w16(h); b(0xF7); b(0); b(0);
    pal.forEach(function (c) { b(c[0]); b(c[1]); b(c[2]); });
    b(0x21); b(0xFF); b(11); "NETSCAPE2.0".split("").forEach(function (ch) { b(ch.charCodeAt(0)); }); b(3); b(1); w16(0); b(0);
    frames.forEach(function (px) {
      b(0x21); b(0xF9); b(4); b(0); w16(delay); b(0); b(0);
      b(0x2C); w16(0); w16(0); w16(w); w16(h); b(0);
      var ind = new Uint8Array(w * h);
      for (var i = 0; i < w * h; i++) ind[i] = idx(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
      lzw(ind, 8, out);
    });
    b(0x3B);
    return new Uint8Array(out);
  }
  function lzw(ind, minSize, out) {
    out.push(minSize);
    var clear = 1 << minSize, eoi = clear + 1, size = minSize + 1, next = eoi + 1, dict = new Map();
    var buf = [], acc = 0, bits = 0;
    function emit(code) {
      acc |= code << bits; bits += size;
      while (bits >= 8) { buf.push(acc & 255); acc >>= 8; bits -= 8; }
    }
    emit(clear);
    var prefix = ind[0];
    for (var i = 1; i < ind.length; i++) {
      var k = prefix * 4096 + ind[i];
      if (dict.has(k)) { prefix = dict.get(k); continue; }
      emit(prefix);
      if (next < 4096) { dict.set(k, next++); if (next > (1 << size) && size < 12) size++; }
      else { emit(clear); dict.clear(); size = minSize + 1; next = eoi + 1; }
      prefix = ind[i];
    }
    emit(prefix); emit(eoi);
    if (bits > 0) buf.push(acc & 255);
    for (var j = 0; j < buf.length; j += 255) { var chunk = buf.slice(j, j + 255); out.push(chunk.length); for (var q = 0; q < chunk.length; q++) out.push(chunk[q]); }
    out.push(0);
  }

  // ---------- exportação (chamada pelo BAIXAR MOD do estúdio) ----------
  function addToMod(zip, root) {
    var all = st(), list = [], images = 0, error = "";
    zip.folder(root + "img/stadiums/");
    SLOTS.forEach(function (s, i) {
      var d = all[s]; if (!d.name || error) return;
      if (ORDER.some(function (k) { return errs[s + "|" + k]; })) { error = tx("e_export", { n: i + 1 }); return; }
      var e = { slot: s, name: M.clean(d.name, NAME_MAX), grass: d.grass === "padrao" ? "" : d.grass, track: d.track };
      ORDER.forEach(function (k) {
        if (L[k].modes && d[k] === "none") { e[k] = "none"; return; }
        if (L[k].modes && d[k] !== "own") return;   // do jogo: o jogo põe a genérica
        var url = d.img[k];
        if (!url) return;
        var b64 = url.split(",")[1] || "";
        if (b64.length * 0.75 > MAX_PNG) { error = tx("e_export", { n: i + 1 }); return; }
        var path = "img/stadiums/" + s + "_" + k + ".png";
        zip.file(root + path, b64, { base64: true }); images++; e[k] = path;
      });
      list.push(e);
    });
    return { list: list, images: images, error: error };
  }
  // ---------- eventos ----------
  function changed() { M.save(); }
  document.addEventListener("click", function (e) {
    var box = document.getElementById("stadium-ed"); if (!box || !box.contains(e.target)) return;
    var d = st()[SLOTS[cur]], el;
    if ((el = e.target.closest("[data-sslot]"))) { cur = +el.dataset.sslot; render(); return; }
    if ((el = e.target.closest("[data-sgrass]"))) { d.grass = el.dataset.sgrass; changed(); render(); return; }
    if ((el = e.target.closest("[data-strack]"))) { d.track = el.dataset.strack; changed(); render(); return; }
    if ((el = e.target.closest("[data-smode]"))) { var p = el.dataset.smode.split("|"); d[p[0]] = p[1]; changed(); render(); return; }
    if ((el = e.target.closest("[data-srm]"))) { var k = el.dataset.srm; delete d.img[k]; delete errs[SLOTS[cur] + "|" + k]; delete notes[SLOTS[cur] + "|" + k]; changed(); render(); return; }
    if ((el = e.target.closest("[data-scopy]"))) {
      var txt = P[el.dataset.scopy];
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { M.toast(tx("copied")); }, function () { window.prompt("", txt); });
      return;
    }
    if (e.target.closest("[data-sgif]")) { gif(); return; }
  });
  document.addEventListener("input", function (e) {
    if (!e.target.matches || !e.target.matches("[data-sname]")) return;
    var d = st()[SLOTS[cur]];
    var v = M.clean(e.target.value, NAME_MAX); d.name = v;
    var chip = document.querySelector('[data-sslot="' + cur + '"]'); if (chip) chip.textContent = v || tx("slot", { n: cur + 1 });
    M.save();
  });
  document.addEventListener("change", function (e) {
    if (e.target.matches && e.target.matches("[data-sname]")) { render(); return; }
    if (!e.target.matches || !e.target.matches("[data-sup]")) return;
    var k = e.target.dataset.sup, slot = SLOTS[cur], file = e.target.files && e.target.files[0];
    if (!file) return;
    fit(file, k).then(function (r) {
      st()[slot].img[k] = r.url; delete errs[slot + "|" + k]; notes[slot + "|" + k] = r.note;
      changed(); render();
    }, function (err) {
      errs[slot + "|" + k] = err.msg; delete st()[slot].img[k]; render();
    });
  });

  window.FutibaStadiums = { count: count, addToMod: addToMod, render: render, _gif: encodeGif };
  var li = document.getElementById("menu-stadiums"); if (li) li.hidden = false;
})();
