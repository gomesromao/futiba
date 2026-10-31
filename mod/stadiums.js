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
 * No jogo: 5 vagas (ghost1..ghost5). O botão BAIXAR ESTÁDIOS gera um .json
 * ("futiba-stadiums", imagens dentro) que o jogador importa em EDITOR >
 * IMPORTAR ESTÁDIOS; só as vagas com nome viram estádio.
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
      intro: "O JOGO TEM SÓ 5 VAGAS PARA ESTÁDIOS NOVOS (VAGA 1 A VAGA 5). CADA VAGA SÓ VIRA ESTÁDIO NO JOGO SE TIVER NOME. A ARTE VOCÊ GERA NA SUA IA: COPIE O PROMPT DE CADA PARTE, PEÇA A IMAGEM E ENVIE AQUI. O ESTÚDIO ACERTA O TAMANHO SOZINHO E TE AVISA SE ALGO NÃO SERVIR.",
      how: "COMO LEVAR PARA O JOGO: 1) APERTE \"BAIXAR ESTÁDIOS\" (SAI UM ARQUIVO .ZIP COM AS 5 VAGAS; NÃO PRECISA ABRIR). 2) PC: PONHA O ARQUIVO NA PASTA ESTADIOS, AO LADO DO JOGO (CRIE A PASTA SE NÃO EXISTIR). ANDROID: DEIXE O ARQUIVO NO CELULAR. 3) NO JOGO: EDITOR > IMPORTAR ESTÁDIOS, ESCOLHA O ARQUIVO (NO ANDROID, ESCOLHER ARQUIVO) E APERTE A. O JOGO DIZ QUANTOS ESTÁDIOS ENTRARAM E EM QUAIS VAGAS. IMPORTAR DE NOVO TROCA TODOS; \"SEM ESTÁDIOS NOVOS\" TIRA TODOS.",
      sizes_t: "MEDIDAS EXATAS (EM PIXELS)", sizes: "CÉU, ESTÁDIO, TORCIDA E PLACAS: 920 X 482 (LARGURA X ALTURA). TORCIDA DE COSTAS: 490 X 470. MINIATURA: 50 X 34. O ESTÚDIO REDUZ IMAGENS MAIORES DESDE QUE TENHAM O MESMO FORMATO (A MESMA PROPORÇÃO). SE DER ERRO, REVISE AS MEDIDAS.",
      samples_t: "EXEMPLOS PARA BAIXAR", samples: "UM ESTÁDIO DE EXEMPLO PRONTO PARA IMPORTAR NO JOGO, COM CADA CAMADA SEPARADA NAS MEDIDAS EXATAS E A VERSÃO EM ROSA-CHOQUE (COMO A IA DEVE ENTREGAR). USE COMO MOLDE.", samples_dl: "BAIXAR EXEMPLO (.ZIP)",
      dl: "BAIXAR ESTÁDIOS (.ZIP)", dl_none: "DÊ NOME A PELO MENOS UMA VAGA ANTES DE BAIXAR.", dl_ok: "ARQUIVO {f} BAIXADO COM {n} ESTÁDIO(S).",
      slot: "VAGA {n}", name: "NOME DO ESTÁDIO (NESTA VAGA)", noname: "VAGA SEM NOME: ELA NÃO VIRA ESTÁDIO NO JOGO.",
      grass: "GRAMADO", track: "PISTA (ENTRE AS PLACAS E O CAMPO)",
      g_padrao: "PADRÃO", g_africa: "ÁFRICA", g_barcelona: "BARCELONA", g_manchester: "MANCHESTER", g_milao: "MILÃO", g_terrao: "TERRÃO", g_tokio: "TÓQUIO",
      t_concreto: "CONCRETO", t_saibro: "SAIBRO", t_cinza: "CINZA", t_terra: "TERRA", t_grama: "GRAMA",
      l_sky: "1. CÉU", l_stand: "2. ESTÁDIO", l_crowd: "3. TORCIDA", l_boards: "4. PLACAS", l_backs: "5. TORCIDA DE COSTAS", l_thumb: "6. MINIATURA",
      d_sky: "O QUE FICA LÁ NO ALTO, ATRÁS DE TUDO. UMA IMAGEM INTEIRA, SEM PARTES VAZIAS. UMA ARTE SÓ: DE TARDE E DE NOITE O JOGO ESCURECE SOZINHO.",
      d_stand: "A ARQUIBANCADA, OS PRÉDIOS, AS ÁRVORES E OS REFLETORES. ONDE FOR CÉU, A IMAGEM TEM QUE SER TRANSPARENTE (PNG RECORTADO) OU ROSA-CHOQUE (#FF00FF): O ESTÚDIO APAGA ESSA COR E O CÉU APARECE ALI. SE QUISER, PODE DESENHAR A TORCIDA E AS PLACAS AQUI MESMO. NADA CORTADO NO ALTO: PRÉDIOS, ÁRVORES E REFLETORES INTEIROS, COM CONTORNO.",
      d_crowd: "SÓ AS PESSOAS, COM TUDO EM VOLTA TRANSPARENTE (PNG RECORTADO) OU EM ROSA-CHOQUE. A FILEIRA DE CIMA TEM QUE TER AS CABEÇAS INTEIRAS (NADA CORTADO), COM UM CONTORNO ESCURO NO TOPO. SE NÃO ENVIAR, ENTRA A TORCIDA DO JOGO NUMA FAIXA NO MEIO DA ARQUIBANCADA, COM BEIRADA (VEJA NA PRÉVIA). SE VOCÊ JÁ DESENHOU A TORCIDA NO ESTÁDIO, ESCOLHA \"JÁ ESTÁ NO DESENHO\".",
      d_boards: "UMA FILEIRA DE PLACAS DE PROPAGANDA EMBAIXO, O RESTO TRANSPARENTE OU ROSA-CHOQUE. SE NÃO ENVIAR, ENTRAM AS PLACAS DO JOGO. JÁ DESENHOU NO ESTÁDIO? ESCOLHA \"JÁ ESTÁ NO DESENHO\".",
      d_backs: "A TORCIDA DO LADO DE CÁ, DE COSTAS PARA VOCÊ. APARECE EMBAIXO DA TELA QUANDO A BOLA DESCE. A IMAGEM INTEIRA É GENTE DE COSTAS. SE NÃO ENVIAR, ENTRA A DO JOGO. (ELA NÃO APARECE NA PRÉVIA, QUE MOSTRA O ALTO DO CAMPO.)",
      d_thumb: "O DESENHO PEQUENO QUE APARECE NA TELA DO PRÉ-JOGO (ONDE VOCÊ ESCOLHE MANDANTE, ESTÁDIO E HORÁRIO): O ESTÁDIO INTEIRO VISTO DO ALTO, DE LADO, IGUAL AOS DO JOGO (VEJA O EXEMPLO). FUNDO TRANSPARENTE OU ROSA-CHOQUE. NÃO É FOTO. SE NÃO ENVIAR, ENTRA UMA MINIATURA PADRÃO.",
      m_gen: "DO JOGO", m_own: "MINHA (ENVIAR)", m_none: "JÁ ESTÁ NO DESENHO",
      up: "ENVIAR IMAGEM", rm: "TIRAR", copy: "COPIAR PROMPT", ex: "VER EXEMPLO", copied: "PROMPT COPIADO. COLE NA SUA IA (MANDE O EXEMPLO JUNTO).",
      ok: "OK: {w}X{h}, {c} CORES.", none_up: "NADA ENVIADO.",
      e_read: "NÃO CONSEGUI ABRIR ESTA IMAGEM. ENVIE PNG, JPG OU WEBP.",
      e_ratio: "FORMATO ERRADO: ESTA PARTE É {want} (LARGURA X ALTURA) E A SUA IMAGEM É {got}. PEÇA À IA UMA IMAGEM DESTE FORMATO E REVISE AS MEDIDAS.",
      e_sky_holes: "O CÉU TEM PARTES TRANSPARENTES. ELE PRECISA SER UMA IMAGEM INTEIRA.",
      w_stand_nosky: "AVISO: NENHUMA PARTE ROSA-CHOQUE. O CÉU NÃO VAI APARECER (TUDO BEM SE VOCÊ DESENHOU O CÉU AQUI).",
      e_cover: "ESTA IMAGEM COBRE O ESTÁDIO TODO. DEIXE TRANSPARENTE (OU PINTE DE ROSA-CHOQUE #FF00FF) TUDO QUE NÃO FOR {what}.",
      w_crowd: "TORCIDA", w_boards: "PLACA",
      e_thumb_bg: "A MINIATURA PRECISA DE FUNDO TRANSPARENTE OU ROSA-CHOQUE (#FF00FF) EM VOLTA DO ESTÁDIO. NÃO É FOTO: É O DESENHO DO ESTÁDIO VISTO DO ALTO.",
      e_big: "A IMAGEM FICOU PESADA DEMAIS (MAIS DE 1 MB). USE MENOS DETALHES OU MENOS CORES.",
      prev: "PRÉVIA (COMO FICA NO JOGO, TELA 320X240)", gif: "BAIXAR GIF DA PRÉVIA",
      p_missing: "FALTA O CÉU OU O ESTÁDIO: NO JOGO ELE USA O ESTÁDIO PADRÃO ATÉ VOCÊ ENVIAR OS DOIS.",
      e_export: "O ESTÁDIO {n} TEM UMA IMAGEM QUE NÃO SERVE. CORRIJA OU TIRE ANTES DE BAIXAR."
    },
    en: {
      menu: "STADIUMS", title: "STADIUMS (TEST)",
      intro: "THE GAME HAS ONLY 5 SLOTS FOR NEW STADIUMS (SLOT 1 TO SLOT 5). A SLOT ONLY BECOMES A STADIUM IN THE GAME IF IT HAS A NAME. YOU MAKE THE ART WITH YOUR AI: COPY THE PROMPT OF EACH PART, ASK FOR THE IMAGE AND UPLOAD IT HERE. THE STUDIO FIXES THE SIZE BY ITSELF AND TELLS YOU IF SOMETHING DOESN'T WORK.",
      how: "HOW TO TAKE IT TO THE GAME: 1) PRESS \"DOWNLOAD STADIUMS\" (YOU GET ONE .ZIP FILE WITH THE 5 SLOTS; NO NEED TO OPEN IT). 2) PC: PUT THE FILE IN THE ESTADIOS FOLDER, NEXT TO THE GAME (CREATE THE FOLDER IF IT ISN'T THERE). ANDROID: KEEP THE FILE ON THE PHONE. 3) IN THE GAME: EDITOR > IMPORT STADIUMS, PICK THE FILE (ON ANDROID, CHOOSE FILE) AND PRESS A. THE GAME TELLS YOU HOW MANY STADIUMS CAME IN AND IN WHICH SLOTS. IMPORTING AGAIN REPLACES ALL OF THEM; \"NO NEW STADIUMS\" REMOVES THEM ALL.",
      sizes_t: "EXACT SIZES (IN PIXELS)", sizes: "SKY, STADIUM, CROWD AND BOARDS: 920 X 482 (WIDTH X HEIGHT). CROWD FROM BEHIND: 490 X 470. THUMBNAIL: 50 X 34. THE STUDIO SHRINKS BIGGER IMAGES AS LONG AS THEY HAVE THE SAME SHAPE (THE SAME PROPORTION). IF YOU GET AN ERROR, CHECK THE SIZES.",
      samples_t: "SAMPLES TO DOWNLOAD", samples: "A SAMPLE STADIUM READY TO IMPORT IN THE GAME, WITH EACH LAYER SEPARATED IN THE EXACT SIZES AND THE HOT PINK VERSION (HOW YOUR AI SHOULD DELIVER IT). USE IT AS A TEMPLATE.", samples_dl: "DOWNLOAD SAMPLE (.ZIP)",
      dl: "DOWNLOAD STADIUMS (.ZIP)", dl_none: "GIVE A NAME TO AT LEAST ONE SLOT BEFORE DOWNLOADING.", dl_ok: "FILE {f} DOWNLOADED WITH {n} STADIUM(S).",
      slot: "SLOT {n}", name: "STADIUM NAME (IN THIS SLOT)", noname: "SLOT WITHOUT A NAME: IT WON'T BECOME A STADIUM IN THE GAME.",
      grass: "PITCH GRASS", track: "TRACK (BETWEEN THE BOARDS AND THE PITCH)",
      g_padrao: "DEFAULT", g_africa: "AFRICA", g_barcelona: "BARCELONA", g_manchester: "MANCHESTER", g_milao: "MILAN", g_terrao: "DIRT", g_tokio: "TOKYO",
      t_concreto: "CONCRETE", t_saibro: "CLAY", t_cinza: "GRAY", t_terra: "DIRT", t_grama: "GRASS",
      l_sky: "1. SKY", l_stand: "2. STADIUM", l_crowd: "3. CROWD", l_boards: "4. BOARDS", l_backs: "5. CROWD FROM BEHIND", l_thumb: "6. THUMBNAIL",
      d_sky: "WHAT IS UP HIGH, BEHIND EVERYTHING. ONE FULL IMAGE, NO EMPTY PARTS. ONE ART ONLY: IN THE AFTERNOON AND AT NIGHT THE GAME MAKES IT DARKER BY ITSELF.",
      d_stand: "THE STANDS, BUILDINGS, TREES AND FLOODLIGHTS. WHERE THE SKY GOES, THE IMAGE MUST BE TRANSPARENT (CUT-OUT PNG) OR HOT PINK (#FF00FF): THE STUDIO ERASES THAT COLOR AND THE SKY SHOWS THERE. IF YOU WANT, YOU CAN DRAW THE CROWD AND THE BOARDS HERE TOO. NOTHING CUT AT THE TOP: BUILDINGS, TREES AND FLOODLIGHTS WHOLE, WITH AN OUTLINE.",
      d_crowd: "ONLY THE PEOPLE, WITH EVERYTHING AROUND THEM TRANSPARENT (CUT-OUT PNG) OR HOT PINK. THE TOP ROW MUST HAVE WHOLE HEADS (NOTHING CUT), WITH A DARK OUTLINE ON TOP. IF YOU DON'T UPLOAD IT, THE GAME'S CROWD FILLS A BAND IN THE MIDDLE OF THE STANDS, WITH A RIM (SEE THE PREVIEW). ALREADY DREW THE CROWD IN THE STADIUM? PICK \"ALREADY IN THE DRAWING\".",
      d_boards: "ONE ROW OF ADVERTISING BOARDS AT THE BOTTOM, THE REST TRANSPARENT OR HOT PINK. IF YOU DON'T UPLOAD IT, THE GAME'S BOARDS ARE USED. ALREADY DREW THEM IN THE STADIUM? PICK \"ALREADY IN THE DRAWING\".",
      d_backs: "THE CROWD ON THIS SIDE, WITH THEIR BACKS TO YOU. IT SHOWS AT THE BOTTOM OF THE SCREEN WHEN THE BALL GOES DOWN. THE WHOLE IMAGE IS PEOPLE FROM BEHIND. IF YOU DON'T UPLOAD IT, THE GAME'S ONE IS USED. (IT IS NOT IN THE PREVIEW, WHICH SHOWS THE TOP OF THE PITCH.)",
      d_thumb: "THE SMALL DRAWING SHOWN ON THE PRE-MATCH SCREEN (WHERE YOU PICK HOME/AWAY, STADIUM AND TIME): THE WHOLE STADIUM SEEN FROM ABOVE, AT AN ANGLE, LIKE THE GAME'S ONES (SEE THE EXAMPLE). TRANSPARENT OR HOT PINK BACKGROUND. NOT A PHOTO. IF YOU DON'T UPLOAD IT, A DEFAULT ONE IS USED.",
      m_gen: "FROM THE GAME", m_own: "MINE (UPLOAD)", m_none: "ALREADY IN THE DRAWING",
      up: "UPLOAD IMAGE", rm: "REMOVE", copy: "COPY PROMPT", ex: "SEE EXAMPLE", copied: "PROMPT COPIED. PASTE IT IN YOUR AI (SEND THE EXAMPLE WITH IT).",
      ok: "OK: {w}X{h}, {c} COLORS.", none_up: "NOTHING UPLOADED.",
      e_read: "I COULDN'T OPEN THIS IMAGE. UPLOAD PNG, JPG OR WEBP.",
      e_ratio: "WRONG SHAPE: THIS PART IS {want} (WIDTH X HEIGHT) AND YOUR IMAGE IS {got}. ASK YOUR AI FOR AN IMAGE WITH THIS SHAPE AND CHECK THE SIZES.",
      e_sky_holes: "THE SKY HAS SEE-THROUGH PARTS. IT MUST BE ONE FULL IMAGE.",
      w_stand_nosky: "HEADS UP: NO HOT PINK PART. THE SKY WON'T SHOW (FINE IF YOU DREW THE SKY HERE).",
      e_cover: "THIS IMAGE COVERS THE WHOLE STADIUM. MAKE EVERYTHING THAT IS NOT {what} TRANSPARENT (OR HOT PINK #FF00FF).",
      w_crowd: "CROWD", w_boards: "A BOARD",
      e_thumb_bg: "THE THUMBNAIL NEEDS A TRANSPARENT OR HOT PINK BACKGROUND (#FF00FF) AROUND THE STADIUM. IT IS NOT A PHOTO: IT IS A DRAWING OF THE STADIUM SEEN FROM ABOVE.",
      e_big: "THE IMAGE GOT TOO HEAVY (OVER 1 MB). USE LESS DETAIL OR FEWER COLORS.",
      prev: "PREVIEW (HOW IT LOOKS IN THE GAME, 320X240 SCREEN)", gif: "DOWNLOAD PREVIEW GIF",
      p_missing: "THE SKY OR THE STADIUM IS MISSING: IN THE GAME IT USES THE DEFAULT STADIUM UNTIL YOU UPLOAD BOTH.",
      e_export: "STADIUM {n} HAS AN IMAGE THAT DOESN'T WORK. FIX IT OR REMOVE IT BEFORE DOWNLOADING."
    },
    es: {
      menu: "ESTADIOS", title: "ESTADIOS (PRUEBA)",
      intro: "EL JUEGO TIENE SOLO 5 PLAZAS PARA ESTADIOS NUEVOS (PLAZA 1 A PLAZA 5). UNA PLAZA SOLO SE VUELVE ESTADIO EN EL JUEGO SI TIENE NOMBRE. EL ARTE LO HACES CON TU IA: COPIA EL PROMPT DE CADA PARTE, PIDE LA IMAGEN Y SÚBELA AQUÍ. EL ESTUDIO AJUSTA EL TAMAÑO SOLO Y TE AVISA SI ALGO NO SIRVE.",
      how: "CÓMO LLEVARLO AL JUEGO: 1) PULSA \"BAJAR ESTADIOS\" (SALE UN ARCHIVO .ZIP CON LAS 5 PLAZAS; NO HACE FALTA ABRIRLO). 2) PC: PON EL ARCHIVO EN LA CARPETA ESTADIOS, AL LADO DEL JUEGO (CREA LA CARPETA SI NO EXISTE). ANDROID: DEJA EL ARCHIVO EN EL CELULAR. 3) EN EL JUEGO: EDITOR > IMPORTAR ESTADIOS, ELIGE EL ARCHIVO (EN ANDROID, ELEGIR ARCHIVO) Y PULSA A. EL JUEGO DICE CUÁNTOS ESTADIOS ENTRARON Y EN QUÉ PLAZAS. IMPORTAR DE NUEVO LOS CAMBIA TODOS; \"SIN ESTADIOS NUEVOS\" LOS QUITA TODOS.",
      sizes_t: "MEDIDAS EXACTAS (EN PÍXELES)", sizes: "CIELO, ESTADIO, HINCHADA Y VALLAS: 920 X 482 (ANCHO X ALTO). HINCHADA DE ESPALDAS: 490 X 470. MINIATURA: 50 X 34. EL ESTUDIO REDUCE IMÁGENES MÁS GRANDES SIEMPRE QUE TENGAN EL MISMO FORMATO (LA MISMA PROPORCIÓN). SI HAY UN ERROR, REVISA LAS MEDIDAS.",
      samples_t: "EJEMPLOS PARA BAJAR", samples: "UN ESTADIO DE EJEMPLO LISTO PARA IMPORTAR EN EL JUEGO, CON CADA CAPA SEPARADA EN LAS MEDIDAS EXACTAS Y LA VERSIÓN EN ROSA FUERTE (CÓMO DEBE ENTREGARLO TU IA). ÚSALO COMO MOLDE.", samples_dl: "BAJAR EJEMPLO (.ZIP)",
      dl: "BAJAR ESTADIOS (.ZIP)", dl_none: "PONLE NOMBRE A POR LO MENOS UNA PLAZA ANTES DE BAJAR.", dl_ok: "ARCHIVO {f} BAJADO CON {n} ESTADIO(S).",
      slot: "PLAZA {n}", name: "NOMBRE DEL ESTADIO (EN ESTA PLAZA)", noname: "PLAZA SIN NOMBRE: NO SE VUELVE ESTADIO EN EL JUEGO.",
      grass: "CÉSPED", track: "PISTA (ENTRE LAS VALLAS Y EL CAMPO)",
      g_padrao: "ESTÁNDAR", g_africa: "ÁFRICA", g_barcelona: "BARCELONA", g_manchester: "MÁNCHESTER", g_milao: "MILÁN", g_terrao: "TIERRA", g_tokio: "TOKIO",
      t_concreto: "CEMENTO", t_saibro: "ARCILLA", t_cinza: "GRIS", t_terra: "TIERRA", t_grama: "CÉSPED",
      l_sky: "1. CIELO", l_stand: "2. ESTADIO", l_crowd: "3. HINCHADA", l_boards: "4. VALLAS", l_backs: "5. HINCHADA DE ESPALDAS", l_thumb: "6. MINIATURA",
      d_sky: "LO QUE ESTÁ ARRIBA, DETRÁS DE TODO. UNA IMAGEN ENTERA, SIN PARTES VACÍAS. UN SOLO ARTE: DE TARDE Y DE NOCHE EL JUEGO LO OSCURECE SOLO.",
      d_stand: "LA TRIBUNA, LOS EDIFICIOS, LOS ÁRBOLES Y LOS FOCOS. DONDE VA EL CIELO, LA IMAGEN TIENE QUE SER TRANSPARENTE (PNG RECORTADO) O ROSA FUERTE (#FF00FF): EL ESTUDIO BORRA ESE COLOR Y AHÍ APARECE EL CIELO. SI QUIERES, PUEDES DIBUJAR LA HINCHADA Y LAS VALLAS AQUÍ MISMO. NADA CORTADO ARRIBA: EDIFICIOS, ÁRBOLES Y FOCOS ENTEROS, CON CONTORNO.",
      d_crowd: "SOLO LAS PERSONAS, CON TODO ALREDEDOR TRANSPARENTE (PNG RECORTADO) O EN ROSA FUERTE. LA FILA DE ARRIBA TIENE QUE TENER LAS CABEZAS ENTERAS (NADA CORTADO), CON UN CONTORNO OSCURO ARRIBA. SI NO LA SUBES, ENTRA LA HINCHADA DEL JUEGO EN UNA FRANJA EN EL MEDIO DE LA TRIBUNA, CON BORDE (MIRA LA VISTA PREVIA). ¿YA LA DIBUJASTE EN EL ESTADIO? ELIGE \"YA ESTÁ EN EL DIBUJO\".",
      d_boards: "UNA FILA DE VALLAS PUBLICITARIAS ABAJO, EL RESTO TRANSPARENTE O EN ROSA FUERTE. SI NO LAS SUBES, ENTRAN LAS DEL JUEGO. ¿YA LAS DIBUJASTE EN EL ESTADIO? ELIGE \"YA ESTÁ EN EL DIBUJO\".",
      d_backs: "LA HINCHADA DE ESTE LADO, DE ESPALDAS A TI. APARECE ABAJO EN LA PANTALLA CUANDO EL BALÓN BAJA. LA IMAGEN ENTERA ES GENTE DE ESPALDAS. SI NO LA SUBES, ENTRA LA DEL JUEGO. (NO APARECE EN LA VISTA PREVIA, QUE MUESTRA LA PARTE DE ARRIBA DEL CAMPO.)",
      d_thumb: "EL DIBUJO PEQUEÑO QUE APARECE EN LA PANTALLA DEL PREVIO (DONDE ELIGES LOCAL/VISITANTE, ESTADIO Y HORARIO): EL ESTADIO ENTERO VISTO DESDE ARRIBA, EN DIAGONAL, COMO LOS DEL JUEGO (MIRA EL EJEMPLO). FONDO TRANSPARENTE O ROSA FUERTE. NO ES UNA FOTO. SI NO LO SUBES, ENTRA UNA MINIATURA ESTÁNDAR.",
      m_gen: "DEL JUEGO", m_own: "MÍA (SUBIR)", m_none: "YA ESTÁ EN EL DIBUJO",
      up: "SUBIR IMAGEN", rm: "QUITAR", copy: "COPIAR PROMPT", ex: "VER EJEMPLO", copied: "PROMPT COPIADO. PÉGALO EN TU IA (MANDA EL EJEMPLO JUNTO).",
      ok: "OK: {w}X{h}, {c} COLORES.", none_up: "NADA SUBIDO.",
      e_read: "NO PUDE ABRIR ESTA IMAGEN. SUBE PNG, JPG O WEBP.",
      e_ratio: "FORMATO EQUIVOCADO: ESTA PARTE ES {want} (ANCHO X ALTO) Y TU IMAGEN ES {got}. PIDE A LA IA UNA IMAGEN DE ESTE FORMATO Y REVISA LAS MEDIDAS.",
      e_sky_holes: "EL CIELO TIENE PARTES TRANSPARENTES. TIENE QUE SER UNA IMAGEN ENTERA.",
      w_stand_nosky: "AVISO: NINGUNA PARTE EN ROSA FUERTE. EL CIELO NO VA A APARECER (ESTÁ BIEN SI DIBUJASTE EL CIELO AQUÍ).",
      e_cover: "ESTA IMAGEN TAPA TODO EL ESTADIO. DEJA TRANSPARENTE (O PINTA DE ROSA FUERTE #FF00FF) TODO LO QUE NO SEA {what}.",
      w_crowd: "HINCHADA", w_boards: "VALLA",
      e_thumb_bg: "LA MINIATURA NECESITA FONDO TRANSPARENTE O ROSA FUERTE (#FF00FF) ALREDEDOR DEL ESTADIO. NO ES UNA FOTO: ES EL DIBUJO DEL ESTADIO VISTO DESDE ARRIBA.",
      e_big: "LA IMAGEN QUEDÓ MUY PESADA (MÁS DE 1 MB). USA MENOS DETALLES O MENOS COLORES.",
      prev: "VISTA PREVIA (CÓMO QUEDA EN EL JUEGO, PANTALLA 320X240)", gif: "BAJAR GIF DE LA VISTA PREVIA",
      p_missing: "FALTA EL CIELO O EL ESTADIO: EN EL JUEGO USA EL ESTADIO ESTÁNDAR HASTA QUE SUBAS LOS DOS.",
      e_export: "EL ESTADIO {n} TIENE UNA IMAGEN QUE NO SIRVE. CORRÍGELA O QUÍTALA ANTES DE BAJAR."
    }
  };
  function tx(k, v) {
    var s = (TX[M.lang()] || TX.pt)[k] || TX.pt[k] || k;
    if (v) Object.keys(v).forEach(function (n) { s = s.split("{" + n + "}").join(v[n]); });
    return s;
  }

  // ---------- prompts para a IA (em inglês, como os outros do /mod) ----------
  // Prompts para a IA, na língua do site. Medida exata sempre no começo; fundo
  // transparente (PNG recortado) ou, se a IA não fizer, rosa-choque #FF00FF.
  var PT = {
    exact: "TAMANHO FINAL EXATO: {w}x{h} PIXELS (LARGURA x ALTURA), OU UMA IMAGEM MAIOR COM A MESMA PROPORÇÃO. ",
    style: "Pixel art retrô de 16 bits, como os jogos de futebol de Neo Geo e Super Nintendo (use o exemplo anexo só como referência de estilo): pixels quadrados e nítidos, contorno escuro, cores chapadas com sombra em blocos, sem degradê, sem desfoque, sem textura de foto. ",
    cut: "Entregue em PNG com fundo TRANSPARENTE (recortado). Se você não conseguir transparência, pinte o fundo de UMA cor rosa-choque lisa #FF00FF (ela será recortada). ",
    sky: "Desenhe o CÉU atrás de um estádio de futebol, imagem larga na proporção exata de 920x482 (cerca de 1,9:1). Só céu: nuvens, sol ou estrelas e, se quiser, uma paisagem bem longe na parte de baixo (cidade, morros, mar). Sem estádio, sem pessoas. A imagem inteira preenchida, sem partes transparentes. Luz de dia: o jogo escurece sozinho para a tarde e a noite.",
    stand: "Desenhe o lado comprido de um estádio de futebol visto do campo, imagem larga na proporção exata de 920x482 (cerca de 1,9:1). Arquibancada, cobertura ou degraus, prédios, árvores e refletores; a base da arquibancada encosta na borda de baixo. Nada cortado no alto: prédios, árvores e refletores inteiros, cada um com contorno escuro. O CÉU fica transparente (ou rosa-choque). Deixe a arquibancada vazia se for mandar a torcida separada. Os 10% de baixo simples (muro ou alambrado): ali entram as placas.",
    crowd: "Desenhe uma faixa larga de torcedores lado a lado em várias fileiras, vista do campo, imagem larga na proporção exata de 920x482 (cerca de 1,9:1). A torcida ocupa toda a largura, entre 55% e 90% da altura (de cima para baixo). Braços para cima, bandeiras e cachecóis nas cores do clube: [CORES DO CLUBE]. A FILEIRA DE CIMA com as cabeças INTEIRAS (nada cortado) e um contorno escuro ou uma mureta no topo. Tudo que não for pessoa fica transparente (ou rosa-choque).",
    boards: "Desenhe uma fileira de placas de propaganda à beira do campo, imagem larga na proporção exata de 920x482 (cerca de 1,9:1). De 6 a 8 placas lado a lado, ocupando toda a largura, só nos 10% de baixo (de 90% a 100% da altura). Cores fortes, um pictograma simples e no máximo 2 palavras curtas em cada: [SUAS MARCAS OU PALAVRAS]. Tudo acima das placas fica transparente (ou rosa-choque).",
    backs: "Desenhe torcedores vistos DE COSTAS (nuca e ombros), várias fileiras, preenchendo a imagem inteira, na proporção exata de 490x470 (quase quadrada). Vistos de cima e de trás, olhando para o campo. Camisas e cachecóis nas cores do clube: [CORES DO CLUBE]. A fileira de cima com cabeças e ombros inteiros (nada cortado), com contorno escuro. A imagem inteira é gente, sem partes vazias.",
    thumb: "Desenhe um ícone pequeno de um estádio de futebol INTEIRO visto do alto, de lado (quase isométrico), como os exemplos anexos: arquibancada oval ou retangular em volta de um campo verde e alguns refletores. O estádio ocupa a imagem, cerca de 1,5:1 (mais largo que alto). Sem céu, sem chão em volta, sem texto. Ele será reduzido para 50x34 pixels: forte e simples."
  };
  var EN = {
    exact: "EXACT FINAL SIZE: {w}x{h} PIXELS (WIDTH x HEIGHT), OR A BIGGER IMAGE WITH EXACTLY THE SAME PROPORTION. ",
    style: "16-bit retro arcade pixel art, like Neo Geo and Super Nintendo football games (use the attached example only as a style reference): square crisp pixels, dark outlines, flat colors with block shading, no gradients, no blur, no photo textures. ",
    cut: "Deliver a PNG with a TRANSPARENT background (cut out). If you can't do transparency, paint the background ONE flat solid hot pink color #FF00FF (it will be cut out). ",
    sky: "Draw the SKY behind a football stadium, a wide image with exactly 920x482 proportions (about 1.9:1). Only sky: clouds, sun or stars and, if you want, a far away landscape at the very bottom (city, hills, sea). No stadium, no people. The whole image filled, no transparent parts. Daytime light: the game darkens it by itself for the afternoon and the night.",
    stand: "Draw the long side of a football stadium seen from the pitch, a wide image with exactly 920x482 proportions (about 1.9:1). Stands, roof or terraces, buildings, trees and floodlights; the bottom of the stands touches the bottom edge. Nothing cut at the top: buildings, trees and floodlights complete, each with a dark outline. The SKY is transparent (or hot pink). Leave the stands empty if you will send a separate crowd. Keep the bottom 10% simple (a wall or a fence): the boards go there.",
    crowd: "Draw a wide band of football fans standing shoulder to shoulder in many rows, seen from the pitch, a wide image with exactly 920x482 proportions (about 1.9:1). The fans fill the whole width, between 55% and 90% of the height (from the top). Arms up, flags and scarves in the club colors: [CLUB COLORS]. The TOP ROW with WHOLE heads (nothing cut) and a dark outline or a railing along the top. Everything that is not a person is transparent (or hot pink).",
    boards: "Draw one row of pitchside advertising boards, a wide image with exactly 920x482 proportions (about 1.9:1). 6 to 8 boards side by side, filling the whole width, only in the bottom 10% (from 90% to 100% of the height). Bold colors, a simple pictogram and at most 2 short words on each: [YOUR BRANDS OR WORDS]. Everything above the boards is transparent (or hot pink).",
    backs: "Draw football fans seen FROM BEHIND (backs of heads and shoulders), many rows, filling the whole image, with exactly 490x470 proportions (almost square). Seen from above and behind, looking at the pitch. Shirts and scarves in the club colors: [CLUB COLORS]. The top row with whole heads and shoulders (nothing cut), with a dark outline. The whole image is people, no empty parts.",
    thumb: "Draw a small icon of a WHOLE football stadium seen from above at a 3/4 angle (isometric-like), like the attached examples: oval or rectangular stands around a green pitch and a few floodlights. The stadium fills the image, about 1.5:1 (wider than tall). No sky, no ground around it, no text. It will be shrunk to 50x34 pixels: bold and simple."
  };
  var ES = {
    exact: "TAMAÑO FINAL EXACTO: {w}x{h} PÍXELES (ANCHO x ALTO), O UNA IMAGEN MÁS GRANDE CON LA MISMA PROPORCIÓN. ",
    style: "Pixel art retro de 16 bits, como los juegos de fútbol de Neo Geo y Super Nintendo (usa el ejemplo adjunto solo como referencia de estilo): píxeles cuadrados y nítidos, contorno oscuro, colores planos con sombra en bloques, sin degradados, sin desenfoque, sin texturas de foto. ",
    cut: "Entrégalo en PNG con fondo TRANSPARENTE (recortado). Si no puedes hacer transparencia, pinta el fondo de UN color rosa fuerte liso #FF00FF (se recortará). ",
    sky: "Dibuja el CIELO detrás de un estadio de fútbol, imagen ancha en la proporción exacta de 920x482 (cerca de 1,9:1). Solo cielo: nubes, sol o estrellas y, si quieres, un paisaje muy lejano en la parte de abajo (ciudad, cerros, mar). Sin estadio, sin personas. La imagen entera llena, sin partes transparentes. Luz de día: el juego la oscurece solo para la tarde y la noche.",
    stand: "Dibuja el lado largo de un estadio de fútbol visto desde el campo, imagen ancha en la proporción exacta de 920x482 (cerca de 1,9:1). Tribuna, techo o gradas, edificios, árboles y focos; la base de la tribuna toca el borde de abajo. Nada cortado arriba: edificios, árboles y focos enteros, cada uno con contorno oscuro. El CIELO queda transparente (o rosa fuerte). Deja la tribuna vacía si vas a mandar la hinchada aparte. El 10% de abajo simple (muro o alambrado): ahí van las vallas.",
    crowd: "Dibuja una franja ancha de hinchas uno al lado del otro en varias filas, vista desde el campo, imagen ancha en la proporción exacta de 920x482 (cerca de 1,9:1). La hinchada ocupa todo el ancho, entre el 55% y el 90% de la altura (de arriba hacia abajo). Brazos arriba, banderas y bufandas con los colores del club: [COLORES DEL CLUB]. La FILA DE ARRIBA con las cabezas ENTERAS (nada cortado) y un contorno oscuro o un murito arriba. Todo lo que no sea persona queda transparente (o rosa fuerte).",
    boards: "Dibuja una fila de vallas publicitarias junto al campo, imagen ancha en la proporción exacta de 920x482 (cerca de 1,9:1). De 6 a 8 vallas una al lado de la otra, ocupando todo el ancho, solo en el 10% de abajo (del 90% al 100% de la altura). Colores fuertes, un pictograma simple y como máximo 2 palabras cortas en cada una: [TUS MARCAS O PALABRAS]. Todo lo que está arriba de las vallas queda transparente (o rosa fuerte).",
    backs: "Dibuja hinchas vistos DE ESPALDAS (nuca y hombros), varias filas, llenando la imagen entera, en la proporción exacta de 490x470 (casi cuadrada). Vistos desde arriba y desde atrás, mirando al campo. Camisetas y bufandas con los colores del club: [COLORES DEL CLUB]. La fila de arriba con cabezas y hombros enteros (nada cortado), con contorno oscuro. La imagen entera es gente, sin partes vacías.",
    thumb: "Dibuja un ícono pequeño de un estadio de fútbol ENTERO visto desde arriba, en diagonal (casi isométrico), como los ejemplos adjuntos: tribuna ovalada o rectangular alrededor de un campo verde y algunos focos. El estadio ocupa la imagen, cerca de 1,5:1 (más ancho que alto). Sin cielo, sin suelo alrededor, sin texto. Se reducirá a 50x34 píxeles: fuerte y simple."
  };
  var SIZE = { sky: [920, 482], stand: [920, 482], crowd: [920, 482], boards: [920, 482], backs: [490, 470], thumb: [50, 34] };
  function promptFor(k) {
    var T = { pt: PT, en: EN, es: ES }[M.lang()] || PT;
    var cut = (k === "sky" || k === "backs") ? "" : T.cut;
    return T.exact.replace("{w}", SIZE[k][0]).replace("{h}", SIZE[k][1]) + T[k] + " " + T.style + cut;
  }

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
      // 31/out (Daniel: "faixas na torcida e no cenário"): nada de reduzir
      // cores (a redução fazia degraus no céu e tirava o tom de pele da
      // torcida). 1) apaga o rosa-choque NA IMAGEM ORIGINAL (sem borda rosada);
      // 2) na medida exata a imagem entra intacta, pixel por pixel; maior, só
      // reduz (mesma proporção, corte no centro), sem mexer nas cores.
      var src = document.createElement("canvas"); src.width = bm.width; src.height = bm.height;
      var gs = src.getContext("2d"); gs.drawImage(bm, 0, 0);
      if (L[layer].key) {
        var sd = gs.getImageData(0, 0, bm.width, bm.height), sp = sd.data;
        for (var i = 0; i < sp.length; i += 4) {
          if (sp[i] > 190 && sp[i + 1] < 90 && sp[i + 2] > 190) sp[i + 3] = 0;
        }
        gs.putImageData(sd, 0, 0);
      }
      var c = document.createElement("canvas"); c.width = want[0]; c.height = want[1];
      var g = c.getContext("2d");
      if (bm.width === want[0] && bm.height === want[1]) {
        g.drawImage(src, 0, 0);
      } else {
        var sw = bm.width, sh = bm.height;
        if (r > rw) sw = Math.round(bm.height * rw); else sh = Math.round(bm.width / rw);
        g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
        g.drawImage(src, (bm.width - sw) / 2, (bm.height - sh) / 2, sw, sh, 0, 0, want[0], want[1]);
      }
      var d = g.getImageData(0, 0, want[0], want[1]);
      var px = d.data, n = want[0] * want[1], clear = 0, seen = {}, colors = 0;
      for (var j2 = 0; j2 < n; j2++) {
        var q2 = j2 * 4;
        if (px[q2 + 3] < 128) { px[q2] = px[q2 + 1] = px[q2 + 2] = px[q2 + 3] = 0; clear++; continue; }
        px[q2 + 3] = 255;
        var key = px[q2] << 16 | px[q2 + 1] << 8 | px[q2 + 2];
        if (!seen[key]) { seen[key] = 1; colors++; }
      }
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
    var colors = 0, seen = {};
    for (var k2 = 0; k2 < n; k2++) { if (!pp[k2 * 4 + 3]) continue; var kk = pp[k2 * 4] << 16 | pp[k2 * 4 + 1] << 8 | pp[k2 * 4 + 2]; if (!seen[kk]) { seen[kk] = 1; colors++; } }
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
    else if (d.crowd === "gen" && ly.genCrowd) {
      for (var x = 0; x < LAYER[0]; x += ly.genCrowd.width) g.drawImage(ly.genCrowd, x, GEN_CROWD_Y);
      // beirada no topo da torcida (igual ao jogo): mureta clara + contorno escuro
      g.fillStyle = "rgb(107,112,128)"; g.fillRect(0, GEN_CROWD_Y - 3, LAYER[0], 1);
      g.fillStyle = "rgb(20,23,31)"; g.fillRect(0, GEN_CROWD_Y - 2, LAYER[0], 2);
    }
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
    h += '<div class="cards"><div class="card"><h2>' + esc(tx("sizes_t")) + '</h2><p style="font-size:8px">' + esc(tx("sizes")) + "</p></div>" +
      '<div class="card"><h2>' + esc(tx("samples_t")) + '</h2><p style="font-size:8px">' + esc(tx("samples")) + '</p><div class="row">' +
      '<a class="btn btn--gold" href="/mod/samples/FUTIBA_ESTADIOS_EXEMPLO.zip" download>' + esc(tx("samples_dl")) + "</a></div></div></div>";
    h += '<div class="chips">' + SLOTS.map(function (s, i) {
      return '<button type="button" class="chip' + (i === cur ? " on" : "") + '" data-sslot="' + i + '">' + esc(tx("slot", { n: i + 1 }) + (all[s].name ? ": " + all[s].name : "")) + "</button>";
    }).join("") + "</div>";
    h += '<label class="f" style="margin-top:10px"><span>' + esc(tx("name")) + ' <span class="c">' + d.name.length + "/" + NAME_MAX + '</span></span><input type="text" maxlength="' + NAME_MAX + '" data-sname value="' + esc(d.name) + '"></label>';
    if (!d.name) h += '<p class="dim" style="font-size:8px">' + esc(tx("noname")) + "</p>";
    h += pickRow("grass", GRASS, d.grass, "g_");
    h += pickRow("track", TRACKS, d.track, "t_");
    h += '<div class="cards stad-cards">' + ORDER.map(function (k) { return card(slot, d, k); }).join("") + "</div>";
    h += '<div class="card"><h2>' + esc(tx("prev")) + '</h2><canvas id="stad-prev" width="320" height="240" class="stad-prev"></canvas>' +
      '<p class="dim" id="stad-prev-note" style="font-size:8px"></p><div class="row"><button type="button" class="btn btn--gold" data-sgif>' + esc(tx("gif")) + "</button></div>" +
      "</div>" +
      '<div class="card"><p style="font-size:8px">' + esc(tx("how")) + '</p><div class="row"><button type="button" class="btn btn--gold" data-sdl>' + esc(tx("dl")) + "</button></div></div>";
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
    var h = '<div class="card stad-card"><h2>' + esc(tx("l_" + k)) + " (" + L[k].size[0] + "X" + L[k].size[1] + ')</h2><p style="font-size:8px">' + esc(tx("d_" + k)) + "</p>";
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

  // ---------- arquivo de estádios (EDITOR > IMPORTAR ESTÁDIOS no jogo) ----------
  // Um .json só, imagens dentro (data:image/png), formato "futiba-stadiums".
  function buildFile() {
    var all = st(), list = [], error = "";
    SLOTS.forEach(function (s, i) {
      var d = all[s]; if (!d.name || error) return;
      if (ORDER.some(function (k) { return errs[s + "|" + k]; })) { error = tx("e_export", { n: i + 1 }); return; }
      var e = { slot: s, name: M.clean(d.name, NAME_MAX), grass: d.grass === "padrao" ? "" : d.grass, track: d.track };
      ORDER.forEach(function (k) {
        if (L[k].modes && d[k] === "none") { e[k] = "none"; return; }
        if (L[k].modes && d[k] !== "own") return;   // do jogo: o jogo põe a genérica
        var url = d.img[k];
        if (!url) return;
        if ((url.length - 22) * 0.75 > MAX_PNG) { error = tx("e_export", { n: i + 1 }); return; }
        e[k] = url;
      });
      list.push(e);
    });
    return { file: { format: "futiba-stadiums", version: 1, name: list.map(function (e) { return e.name; }).join(" / ").slice(0, 24),
      created: new Date().toISOString().slice(0, 10), stadiums: list }, error: error };
  }
  function download() {
    if (!count()) { M.msg(tx("dl_none"), "err"); M.toast(tx("dl_none")); return; }
    var b = buildFile();
    if (b.error) { M.msg(b.error, "err"); M.toast(b.error); return; }
    var fname = "FUTIBA_ESTADIOS.zip";
    var zip = new JSZip();
    zip.file("FUTIBA_ESTADIOS.json", JSON.stringify(b.file));
    zip.generateAsync({ type: "blob", compression: "DEFLATE" }).then(function (blob) {
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fname;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      M.msg(tx("dl_ok", { f: fname, n: b.file.stadiums.length }), "ok");
    });
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
      var txt = promptFor(el.dataset.scopy);
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { M.toast(tx("copied")); }, function () { window.prompt("", txt); });
      return;
    }
    if (e.target.closest("[data-sgif]")) { gif(); return; }
    if (e.target.closest("[data-sdl]")) { download(); return; }
  });
  document.addEventListener("input", function (e) {
    if (!e.target.matches || !e.target.matches("[data-sname]")) return;
    var d = st()[SLOTS[cur]];
    var v = M.clean(e.target.value, NAME_MAX); d.name = v;
    var chip = document.querySelector('[data-sslot="' + cur + '"]'); if (chip) chip.textContent = tx("slot", { n: cur + 1 }) + (v ? ": " + v : "");
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

  window.FutibaStadiums = { count: count, buildFile: buildFile, render: render, _gif: encodeGif };
  var li = document.getElementById("menu-stadiums"); if (li) li.hidden = false;
})();
