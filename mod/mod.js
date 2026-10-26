/* FUTIBA MOD STUDIO
   Tudo roda no navegador: o rascunho (times + fotos) fica no IndexedDB
   do jogador enquanto ele monta o mod, e o ZIP é gerado aqui mesmo.
   Formato e limites: ver Downloads/FUTIBA_MODS_O_QUE_MUDAR_NO_JOGO.md. */
(function () {
  "use strict";

  // ---------- regras do formato (iguais às que o jogo vai cortar) ----------
  var LIM = { TEAM: 17, SHORT: 4, COACH: 18, PNAME: 15, PSHORT: 13, MOD: 24,
    NEW_TEAMS: 64, TEAMS: 160, PNG: 65536, JSON: 2 * 1024 * 1024, SQUAD: 16 };
  var CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-'ÁÀÂÃÉÊÍÓÔÕÚÇÜÑ";
  var SIZES = { crest: [24, 24], crest_hd: [48, 48], coach: [48, 64], player: [32, 32] };
  var ATTRS = ["pace", "shooting", "passing", "dribbling", "defense", "heading", "goalkeeping", "stamina", "strength"];
  var POS = ["GK", "DF", "MF", "FW"];
  var PATTERNS = ["solid", "vertical", "hoops", "chestband", "chestband3", "band"];
  var BODIES = ["standard", "short", "tall", "slim", "robust"];
  var TRAITS = ["", "ARTILHEIRO", "BATEDOR", "BIGODE DE OURO", "CANHAO", "CAPITAO", "CEREBRO", "DOUTOR",
    "DRIBLADOR", "FENOMENO", "GALA", "GENIO", "GOLEIRO LINHA", "GUERREIRO", "JOIA", "MAESTRO", "MAGO",
    "MATADOR", "MESTRE", "MURALHA", "REI", "SAMURAI", "VELOCISTA", "XERIFE"];
  var SKINS = ["#f1c27d", "#e0ac69", "#c68642", "#8d5524", "#5c3a1e"];
  var HAIRS = ["#17110b", "#3a2415", "#7a4a1e", "#c9a227", "#6e6e6e"];
  var GROUPS = ["field", "ml", "futsal", "beach", "secret", "desafio"];
  var NEW_POS = ["GK", "DF", "DF", "DF", "DF", "MF", "MF", "MF", "MF", "FW", "FW", "GK", "DF", "MF", "MF", "FW"];

  // ---------- textos ----------
  var T = {
    pt: {
      "menu.title": "MOD STUDIO<small>CRIE, BAIXE E IMPORTE MODS NO FUTIBA</small>",
      "menu.get": "PACOTE ORIGINAL", "menu.studio": "CRIAR MOD", "menu.ai": "PROMPTS PARA IA",
      "menu.install": "COMO CRIAR E INSTALAR", "menu.limits": "LIMITES",
      "menu.hint": "TUDO FICA NO SEU NAVEGADOR. NADA É ENVIADO PARA O SERVIDOR.",
      "get.title": "PACOTE ORIGINAL", "get.h": "FUTIBA ORIGINAL",
      "get.p": "OS NOMES DE TODOS OS TIMES, TÉCNICOS E JOGADORES COMO ESTÃO HOJE NO FUTIBA. COLOQUE O ARQUIVO NA PASTA mod, IMPORTE NO JOGO E OS TIMES VOLTAM A TER OS NOMES DE VERDADE.",
      "get.count": "{t} TIMES · {p} JOGADORES · UM .JSON, SEM PASTA",
      "get.zip": "BAIXAR ZIP", "get.json": "BAIXAR FUTIBA_ORIGINAL.JSON", "get.h2": "CONTINUAR UM MOD",
      "get.p2": "ABRA UM ZIP DE MOD (SEU OU DE OUTRA PESSOA) PARA EDITAR NO ESTÚDIO.", "get.open": "ABRIR ZIP OU JSON",
      "st.title": "CRIAR MOD", "st.modname": "NOME DO MOD", "st.author": "AUTOR", "st.modid": "PASTA DO MOD",
      "st.add": "ADICIONAR TIMES", "st.pick": "TIME DO JOGO", "st.edit": "EDITAR ESTE", "st.new": "+ TIME NOVO",
      "st.paste": "COLAR JSON DA IA",
      "st.pastep": "COLE O JSON QUE A SUA IA GEROU (UM TIME OU VÁRIOS). PEGUE O PROMPT EM \"PROMPTS PARA IA\".",
      "st.pastego": "ADICIONAR", "st.cancel": "CANCELAR", "st.clear": "LIMPAR RASCUNHO", "st.sure": "APAGAR TUDO?",
      "st.download": "BAIXAR MOD",
      "st.empty": "NENHUM TIME NO MOD AINDA. ESCOLHA UM TIME DO JOGO E APERTE EDITAR, OU CRIE UM TIME NOVO.",
      "st.base": "TIME DO JOGO", "st.newtag": "TIME NOVO", "st.remove": "TIRAR DO MOD",
      "st.copyprompt": "COPIAR PROMPT", "st.change": "TROCAR",
      "f.name": "NOME", "f.short": "SIGLA", "f.country": "PAÍS", "f.c1": "COR 1", "f.c2": "COR 2", "f.c3": "COR 3",
      "f.pattern": "CAMISA", "f.crest": "ESCUDO", "f.coach": "TÉCNICO", "f.nat": "PAÍS",
      "pat.solid": "LISA", "pat.vertical": "LISTRAS", "pat.hoops": "LISTRAS DEITADAS", "pat.chestband": "FAIXA NO PEITO",
      "pat.chestband3": "FAIXA 3 CORES", "pat.band": "FAIXA DIAGONAL",
      "sq.start": "TITULARES", "sq.res": "RESERVAS",
      "p.name": "NOME", "p.short": "NOME CURTO", "p.num": "Nº", "p.pos": "POSIÇÃO", "p.foot": "PÉ", "p.trait": "TRAÇO",
      "p.none": "NENHUM", "p.skin": "PELE", "p.hair": "CABELO", "p.haircol": "COR DO CABELO", "p.facial": "ROSTO",
      "p.body": "CORPO", "p.photo": "FOTO",
      "foot.R": "DIREITO", "foot.L": "ESQUERDO",
      "fac.0": "SEM BARBA", "fac.1": "BIGODE", "fac.2": "BARBA CURTA", "fac.3": "BARBA E BIGODE",
      "body.standard": "PADRÃO", "body.short": "BAIXO", "body.tall": "ALTO", "body.slim": "MAGRO", "body.robust": "FORTE",
      "hair.n": "ESTILO {n}", "hair.6": "ONDULADO", "hair.7": "BLACK POWER", "hair.8": "CHEIO",
      "a.pace": "VELOCIDADE", "a.shooting": "CHUTE", "a.passing": "PASSE", "a.dribbling": "DRIBLE",
      "a.defense": "DEFESA", "a.heading": "CABECEIO", "a.goalkeeping": "GOLEIRO", "a.stamina": "FÔLEGO", "a.strength": "FORÇA",
      "g.field": "CAMPO", "g.ml": "MASTER LIGA", "g.futsal": "FUTSAL (BRAZUCA)", "g.beach": "PRAIA",
      "g.secret": "SECRETOS", "g.desafio": "DESAFIO",
      "ai.title": "PROMPTS PARA IA",
      "ai.p": "COPIE, COLE NA SUA IA PREFERIDA E TROQUE O QUE ESTÁ ENTRE [COLCHETES]. TIMES EM MASSA: A IA DEVOLVE UM JSON, VOCÊ COLA EM \"CRIAR MOD\". FOTOS: ENVIE A FOTO JUNTO COM O PROMPT E SUBA A IMAGEM QUE ELA DEVOLVER. O ESTÚDIO REDUZ PARA O TAMANHO CERTO.",
      "ai.note": "O PROMPT É EM INGLÊS DE PROPÓSITO: FUNCIONA EM QUALQUER IA.",
      "ai.teams": "TIMES EM MASSA (JSON)", "ai.player": "FOTO DE JOGADOR", "ai.coach": "FOTO DE TÉCNICO (3X4)", "ai.crest": "ESCUDO",
      "ai.copy": "COPIAR",
      "in.title": "COMO CRIAR E INSTALAR", "in.create": "CRIAR", "in.install": "INSTALAR", "in.kinds": "DOIS TIPOS DE MOD",
      "in.c1": "ABRA \"CRIAR MOD\", DÊ UM NOME AO MOD E COLOQUE SEU NOME DE AUTOR.",
      "in.c2": "ESCOLHA UM TIME DO JOGO E APERTE EDITAR, OU CRIE UM TIME NOVO. PARA CRIAR VÁRIOS DE UMA VEZ, USE O PROMPT DE TIMES EM MASSA E COLE O JSON DA IA.",
      "in.c3": "TROQUE NOMES, CORES, TÉCNICO E JOGADORES. CLIQUE NO ESCUDO OU NUMA FOTO PARA SUBIR UMA IMAGEM: O ESTÚDIO CORTA E REDUZ SOZINHO.",
      "in.c4": "APERTE BAIXAR MOD. O RASCUNHO FICA SALVO NESTE NAVEGADOR ATÉ VOCÊ LIMPAR.",
      "in.k1": "SÓ TEXTO (NOMES, CORES, ATRIBUTOS): UM ARQUIVO .JSON SOLTO, SEM PASTA. É ASSIM O FUTIBA_ORIGINAL.JSON.",
      "in.k2": "COM FOTOS OU ESCUDOS: UM .ZIP COM UMA PASTA (MOD.JSON + IMAGENS).",
      "in.1": "NA PASTA DO FUTIBA (ONDE ESTÁ O FUTIBA.EXE), CRIE UMA PASTA CHAMADA <code>mod</code>.",
      "in.2": "MOD .JSON: COLOQUE O ARQUIVO DENTRO DE <code>mod</code>. MOD .ZIP: EXTRAIA NA PASTA DO FUTIBA (ELE JÁ TRAZ A PASTA <code>mod</code>).",
      "in.3": "NO JOGO: MENU PRINCIPAL, EDITOR, IMPORTAR MOD. ESCOLHA O MOD E CONFIRME. O FUTIBA REINICIA COM O MOD.",
      "in.4": "PARA VOLTAR AO JOGO DE FÁBRICA: IMPORTAR MOD, SEM MOD.", "in.tree": "ESTRUTURA",
      "lim.title": "LIMITES",
      "lim.team": "NOME DO TIME", "lim.short": "SIGLA (LETRAS E NÚMEROS)", "lim.coach": "NOME DO TÉCNICO",
      "lim.pname": "NOME DO JOGADOR", "lim.pshort": "NOME CURTO DO JOGADOR", "lim.mod": "NOME DO MOD E AUTOR",
      "lim.chars": "CARACTERES", "lim.squad": "JOGADORES POR TIME", "lim.new": "TIMES NOVOS POR MOD",
      "lim.teams": "TIMES POR MOD", "lim.num": "NÚMERO DA CAMISA", "lim.attr": "ATRIBUTOS",
      "lim.crest": "ESCUDO", "lim.coachimg": "FOTO DO TÉCNICO", "lim.player": "FOTO DO JOGADOR",
      "lim.png": "CADA IMAGEM", "lim.json": "MOD.JSON", "lim.any": "QUALQUER IMAGEM: O ESTÚDIO CORTA E REDUZ",
      "u.chars": "CARACTERES",
      "msg.saved": "RASCUNHO SALVO NESTE NAVEGADOR", "msg.nosave": "SEM ACESSO AO ARMAZENAMENTO: NÃO FECHE A PÁGINA",
      "msg.added": "{n} TIME(S) ADICIONADO(S)", "msg.bad": "JSON INVÁLIDO", "msg.dl": "MOD BAIXADO: {f}",
      "msg.maxnew": "LIMITE DE {n} TIMES NOVOS", "msg.maxteams": "LIMITE DE {n} TIMES",
      "msg.copied": "COPIADO!", "msg.already": "ESSE TIME JÁ ESTÁ NO MOD", "msg.noteams": "ADICIONE PELO MENOS UM TIME",
      "msg.opened": "MOD ABERTO: {n} TIME(S)", "msg.imgbad": "NÃO CONSEGUI ABRIR ESSA IMAGEM",
      "msg.cleared": "RASCUNHO APAGADO", "msg.loading": "CARREGANDO TIMES...", "msg.big": "MOD GRANDE DEMAIS"
    },
    en: {
      "menu.title": "MOD STUDIO<small>CREATE, DOWNLOAD AND IMPORT FUTIBA MODS</small>",
      "menu.get": "ORIGINAL PACK", "menu.studio": "CREATE MOD", "menu.ai": "AI PROMPTS",
      "menu.install": "CREATE AND INSTALL", "menu.limits": "LIMITS",
      "menu.hint": "EVERYTHING STAYS IN YOUR BROWSER. NOTHING IS SENT TO A SERVER.",
      "get.title": "ORIGINAL PACK", "get.h": "FUTIBA ORIGINAL",
      "get.p": "THE NAMES OF EVERY TEAM, COACH AND PLAYER AS THEY ARE IN FUTIBA TODAY. PUT THE FILE IN THE mod FOLDER, IMPORT IT IN THE GAME AND THE TEAMS GET THEIR REAL NAMES BACK.",
      "get.count": "{t} TEAMS · {p} PLAYERS · ONE .JSON, NO FOLDER",
      "get.zip": "DOWNLOAD ZIP", "get.json": "DOWNLOAD FUTIBA_ORIGINAL.JSON", "get.h2": "CONTINUE A MOD",
      "get.p2": "OPEN A MOD ZIP (YOURS OR SOMEONE ELSE'S) TO EDIT IT IN THE STUDIO.", "get.open": "OPEN ZIP OR JSON",
      "st.title": "CREATE MOD", "st.modname": "MOD NAME", "st.author": "AUTHOR", "st.modid": "MOD FOLDER",
      "st.add": "ADD TEAMS", "st.pick": "GAME TEAM", "st.edit": "EDIT THIS ONE", "st.new": "+ NEW TEAM",
      "st.paste": "PASTE AI JSON",
      "st.pastep": "PASTE THE JSON YOUR AI MADE (ONE TEAM OR MANY). GET THE PROMPT IN \"AI PROMPTS\".",
      "st.pastego": "ADD", "st.cancel": "CANCEL", "st.clear": "CLEAR DRAFT", "st.sure": "ERASE ALL?",
      "st.download": "DOWNLOAD MOD",
      "st.empty": "NO TEAMS IN THE MOD YET. PICK A GAME TEAM AND PRESS EDIT, OR CREATE A NEW TEAM.",
      "st.base": "GAME TEAM", "st.newtag": "NEW TEAM", "st.remove": "REMOVE FROM MOD",
      "st.copyprompt": "COPY PROMPT", "st.change": "CHANGE",
      "f.name": "NAME", "f.short": "SHORT", "f.country": "COUNTRY", "f.c1": "COLOR 1", "f.c2": "COLOR 2", "f.c3": "COLOR 3",
      "f.pattern": "SHIRT", "f.crest": "CREST", "f.coach": "COACH", "f.nat": "COUNTRY",
      "pat.solid": "PLAIN", "pat.vertical": "STRIPES", "pat.hoops": "HOOPS", "pat.chestband": "CHEST BAND",
      "pat.chestband3": "3 COLOR BAND", "pat.band": "SASH",
      "sq.start": "STARTERS", "sq.res": "BENCH",
      "p.name": "NAME", "p.short": "SHORT NAME", "p.num": "NO.", "p.pos": "POSITION", "p.foot": "FOOT", "p.trait": "TRAIT",
      "p.none": "NONE", "p.skin": "SKIN", "p.hair": "HAIR", "p.haircol": "HAIR COLOR", "p.facial": "FACE",
      "p.body": "BODY", "p.photo": "PHOTO",
      "foot.R": "RIGHT", "foot.L": "LEFT",
      "fac.0": "CLEAN", "fac.1": "MOUSTACHE", "fac.2": "SHORT BEARD", "fac.3": "BEARD AND MOUSTACHE",
      "body.standard": "STANDARD", "body.short": "SHORT", "body.tall": "TALL", "body.slim": "SLIM", "body.robust": "STRONG",
      "hair.n": "STYLE {n}", "hair.6": "WAVY", "hair.7": "AFRO", "hair.8": "FULL",
      "a.pace": "PACE", "a.shooting": "SHOOTING", "a.passing": "PASSING", "a.dribbling": "DRIBBLING",
      "a.defense": "DEFENSE", "a.heading": "HEADING", "a.goalkeeping": "KEEPER", "a.stamina": "STAMINA", "a.strength": "STRENGTH",
      "g.field": "FIELD", "g.ml": "MASTER LEAGUE", "g.futsal": "FUTSAL (BRAZUCA)", "g.beach": "BEACH",
      "g.secret": "SECRET", "g.desafio": "CHALLENGE",
      "ai.title": "AI PROMPTS",
      "ai.p": "COPY, PASTE INTO YOUR FAVORITE AI AND REPLACE WHAT IS IN [BRACKETS]. TEAMS IN BULK: THE AI RETURNS A JSON THAT YOU PASTE IN \"CREATE MOD\". PHOTOS: SEND THE PHOTO WITH THE PROMPT AND UPLOAD WHAT IT RETURNS. THE STUDIO SHRINKS IT TO THE RIGHT SIZE.",
      "ai.note": "THE PROMPT IS IN ENGLISH ON PURPOSE: IT WORKS WITH ANY AI.",
      "ai.teams": "TEAMS IN BULK (JSON)", "ai.player": "PLAYER PHOTO", "ai.coach": "COACH PHOTO (3X4)", "ai.crest": "CREST",
      "ai.copy": "COPY",
      "in.title": "HOW TO CREATE AND INSTALL", "in.create": "CREATE", "in.install": "INSTALL", "in.kinds": "TWO KINDS OF MOD",
      "in.c1": "OPEN \"CREATE MOD\", NAME THE MOD AND TYPE YOUR AUTHOR NAME.",
      "in.c2": "PICK A GAME TEAM AND PRESS EDIT, OR CREATE A NEW TEAM. TO MAKE MANY AT ONCE, USE THE BULK TEAMS PROMPT AND PASTE THE AI JSON.",
      "in.c3": "CHANGE NAMES, COLORS, COACH AND PLAYERS. CLICK THE CREST OR A PHOTO TO UPLOAD AN IMAGE: THE STUDIO CROPS AND SHRINKS IT.",
      "in.c4": "PRESS DOWNLOAD MOD. THE DRAFT STAYS IN THIS BROWSER UNTIL YOU CLEAR IT.",
      "in.k1": "TEXT ONLY (NAMES, COLORS, ATTRIBUTES): ONE LOOSE .JSON FILE, NO FOLDER. THAT IS HOW FUTIBA_ORIGINAL.JSON WORKS.",
      "in.k2": "WITH PHOTOS OR CRESTS: A .ZIP WITH A FOLDER (MOD.JSON + IMAGES).",
      "in.1": "IN THE FUTIBA FOLDER (WHERE FUTIBA.EXE IS), CREATE A FOLDER CALLED <code>mod</code>.",
      "in.2": ".JSON MOD: PUT THE FILE INSIDE <code>mod</code>. .ZIP MOD: EXTRACT IT IN THE FUTIBA FOLDER (IT ALREADY BRINGS THE <code>mod</code> FOLDER).",
      "in.3": "IN THE GAME: MAIN MENU, EDITOR, IMPORT MOD. PICK THE MOD AND CONFIRM. FUTIBA RESTARTS WITH THE MOD.",
      "in.4": "TO GO BACK TO THE FACTORY GAME: IMPORT MOD, NO MOD.", "in.tree": "STRUCTURE",
      "lim.title": "LIMITS",
      "lim.team": "TEAM NAME", "lim.short": "SHORT NAME (LETTERS AND NUMBERS)", "lim.coach": "COACH NAME",
      "lim.pname": "PLAYER NAME", "lim.pshort": "PLAYER SHORT NAME", "lim.mod": "MOD NAME AND AUTHOR",
      "lim.chars": "CHARACTERS", "lim.squad": "PLAYERS PER TEAM", "lim.new": "NEW TEAMS PER MOD",
      "lim.teams": "TEAMS PER MOD", "lim.num": "SHIRT NUMBER", "lim.attr": "ATTRIBUTES",
      "lim.crest": "CREST", "lim.coachimg": "COACH PHOTO", "lim.player": "PLAYER PHOTO",
      "lim.png": "EACH IMAGE", "lim.json": "MOD.JSON", "lim.any": "ANY IMAGE: THE STUDIO CROPS AND SHRINKS IT",
      "u.chars": "CHARACTERS",
      "msg.saved": "DRAFT SAVED IN THIS BROWSER", "msg.nosave": "NO STORAGE ACCESS: DO NOT CLOSE THE PAGE",
      "msg.added": "{n} TEAM(S) ADDED", "msg.bad": "INVALID JSON", "msg.dl": "MOD DOWNLOADED: {f}",
      "msg.maxnew": "LIMIT OF {n} NEW TEAMS", "msg.maxteams": "LIMIT OF {n} TEAMS",
      "msg.copied": "COPIED!", "msg.already": "THIS TEAM IS ALREADY IN THE MOD", "msg.noteams": "ADD AT LEAST ONE TEAM",
      "msg.opened": "MOD OPENED: {n} TEAM(S)", "msg.imgbad": "COULD NOT OPEN THIS IMAGE",
      "msg.cleared": "DRAFT ERASED", "msg.loading": "LOADING TEAMS...", "msg.big": "MOD TOO BIG"
    },
    es: {
      "menu.title": "MOD STUDIO<small>CREA, DESCARGA E IMPORTA MODS DE FUTIBA</small>",
      "menu.get": "PAQUETE ORIGINAL", "menu.studio": "CREAR MOD", "menu.ai": "PROMPTS PARA IA",
      "menu.install": "CÓMO CREAR E INSTALAR", "menu.limits": "LÍMITES",
      "menu.hint": "TODO QUEDA EN TU NAVEGADOR. NADA SE ENVÍA AL SERVIDOR.",
      "get.title": "PAQUETE ORIGINAL", "get.h": "FUTIBA ORIGINAL",
      "get.p": "LOS NOMBRES DE TODOS LOS EQUIPOS, TÉCNICOS Y JUGADORES COMO ESTÁN HOY EN FUTIBA. PON EL ARCHIVO EN LA CARPETA mod, IMPÓRTALO EN EL JUEGO Y LOS EQUIPOS VUELVEN A TENER SUS NOMBRES DE VERDAD.",
      "get.count": "{t} EQUIPOS · {p} JUGADORES · UN .JSON, SIN CARPETA",
      "get.zip": "DESCARGAR ZIP", "get.json": "DESCARGAR FUTIBA_ORIGINAL.JSON", "get.h2": "SEGUIR UN MOD",
      "get.p2": "ABRE UN ZIP DE MOD (TUYO O DE OTRA PERSONA) PARA EDITARLO EN EL ESTUDIO.", "get.open": "ABRIR ZIP O JSON",
      "st.title": "CREAR MOD", "st.modname": "NOMBRE DEL MOD", "st.author": "AUTOR", "st.modid": "CARPETA DEL MOD",
      "st.add": "AGREGAR EQUIPOS", "st.pick": "EQUIPO DEL JUEGO", "st.edit": "EDITAR ESTE", "st.new": "+ EQUIPO NUEVO",
      "st.paste": "PEGAR JSON DE LA IA",
      "st.pastep": "PEGA EL JSON QUE GENERÓ TU IA (UN EQUIPO O VARIOS). EL PROMPT ESTÁ EN \"PROMPTS PARA IA\".",
      "st.pastego": "AGREGAR", "st.cancel": "CANCELAR", "st.clear": "BORRAR BORRADOR", "st.sure": "¿BORRAR TODO?",
      "st.download": "DESCARGAR MOD",
      "st.empty": "TODAVÍA NO HAY EQUIPOS EN EL MOD. ELIGE UN EQUIPO DEL JUEGO Y PULSA EDITAR, O CREA UNO NUEVO.",
      "st.base": "EQUIPO DEL JUEGO", "st.newtag": "EQUIPO NUEVO", "st.remove": "SACAR DEL MOD",
      "st.copyprompt": "COPIAR PROMPT", "st.change": "CAMBIAR",
      "f.name": "NOMBRE", "f.short": "SIGLA", "f.country": "PAÍS", "f.c1": "COLOR 1", "f.c2": "COLOR 2", "f.c3": "COLOR 3",
      "f.pattern": "CAMISETA", "f.crest": "ESCUDO", "f.coach": "TÉCNICO", "f.nat": "PAÍS",
      "pat.solid": "LISA", "pat.vertical": "RAYAS", "pat.hoops": "RAYAS HORIZONTALES", "pat.chestband": "FRANJA EN EL PECHO",
      "pat.chestband3": "FRANJA 3 COLORES", "pat.band": "BANDA DIAGONAL",
      "sq.start": "TITULARES", "sq.res": "SUPLENTES",
      "p.name": "NOMBRE", "p.short": "NOMBRE CORTO", "p.num": "Nº", "p.pos": "POSICIÓN", "p.foot": "PIE", "p.trait": "RASGO",
      "p.none": "NINGUNO", "p.skin": "PIEL", "p.hair": "PELO", "p.haircol": "COLOR DEL PELO", "p.facial": "CARA",
      "p.body": "CUERPO", "p.photo": "FOTO",
      "foot.R": "DERECHO", "foot.L": "IZQUIERDO",
      "fac.0": "SIN BARBA", "fac.1": "BIGOTE", "fac.2": "BARBA CORTA", "fac.3": "BARBA Y BIGOTE",
      "body.standard": "NORMAL", "body.short": "BAJO", "body.tall": "ALTO", "body.slim": "DELGADO", "body.robust": "FUERTE",
      "hair.n": "ESTILO {n}", "hair.6": "ONDULADO", "hair.7": "AFRO", "hair.8": "ABUNDANTE",
      "a.pace": "VELOCIDAD", "a.shooting": "TIRO", "a.passing": "PASE", "a.dribbling": "REGATE",
      "a.defense": "DEFENSA", "a.heading": "CABEZAZO", "a.goalkeeping": "PORTERO", "a.stamina": "RESISTENCIA", "a.strength": "FUERZA",
      "g.field": "CAMPO", "g.ml": "MASTER LIGA", "g.futsal": "FÚTSAL (BRAZUCA)", "g.beach": "PLAYA",
      "g.secret": "SECRETOS", "g.desafio": "DESAFÍO",
      "ai.title": "PROMPTS PARA IA",
      "ai.p": "COPIA, PEGA EN TU IA FAVORITA Y CAMBIA LO QUE ESTÁ ENTRE [CORCHETES]. EQUIPOS EN MASA: LA IA DEVUELVE UN JSON QUE PEGAS EN \"CREAR MOD\". FOTOS: ENVÍA LA FOTO CON EL PROMPT Y SUBE LA IMAGEN QUE DEVUELVA. EL ESTUDIO LA REDUCE AL TAMAÑO CORRECTO.",
      "ai.note": "EL PROMPT ESTÁ EN INGLÉS A PROPÓSITO: FUNCIONA EN CUALQUIER IA.",
      "ai.teams": "EQUIPOS EN MASA (JSON)", "ai.player": "FOTO DE JUGADOR", "ai.coach": "FOTO DE TÉCNICO (3X4)", "ai.crest": "ESCUDO",
      "ai.copy": "COPIAR",
      "in.title": "CÓMO CREAR E INSTALAR", "in.create": "CREAR", "in.install": "INSTALAR", "in.kinds": "DOS TIPOS DE MOD",
      "in.c1": "ABRE \"CREAR MOD\", PONLE NOMBRE AL MOD Y ESCRIBE TU NOMBRE DE AUTOR.",
      "in.c2": "ELIGE UN EQUIPO DEL JUEGO Y PULSA EDITAR, O CREA UNO NUEVO. PARA CREAR MUCHOS DE UNA VEZ, USA EL PROMPT DE EQUIPOS EN MASA Y PEGA EL JSON DE LA IA.",
      "in.c3": "CAMBIA NOMBRES, COLORES, TÉCNICO Y JUGADORES. HAZ CLIC EN EL ESCUDO O EN UNA FOTO PARA SUBIR UNA IMAGEN: EL ESTUDIO LA RECORTA Y REDUCE.",
      "in.c4": "PULSA DESCARGAR MOD. EL BORRADOR QUEDA EN ESTE NAVEGADOR HASTA QUE LO BORRES.",
      "in.k1": "SOLO TEXTO (NOMBRES, COLORES, ATRIBUTOS): UN ARCHIVO .JSON SUELTO, SIN CARPETA. ASÍ ES FUTIBA_ORIGINAL.JSON.",
      "in.k2": "CON FOTOS O ESCUDOS: UN .ZIP CON UNA CARPETA (MOD.JSON + IMÁGENES).",
      "in.1": "EN LA CARPETA DE FUTIBA (DONDE ESTÁ FUTIBA.EXE), CREA UNA CARPETA LLAMADA <code>mod</code>.",
      "in.2": "MOD .JSON: PON EL ARCHIVO DENTRO DE <code>mod</code>. MOD .ZIP: EXTRÁELO EN LA CARPETA DE FUTIBA (YA TRAE LA CARPETA <code>mod</code>).",
      "in.3": "EN EL JUEGO: MENÚ PRINCIPAL, EDITOR, IMPORTAR MOD. ELIGE EL MOD Y CONFIRMA. FUTIBA SE REINICIA CON EL MOD.",
      "in.4": "PARA VOLVER AL JUEGO DE FÁBRICA: IMPORTAR MOD, SIN MOD.", "in.tree": "ESTRUCTURA",
      "lim.title": "LÍMITES",
      "lim.team": "NOMBRE DEL EQUIPO", "lim.short": "SIGLA (LETRAS Y NÚMEROS)", "lim.coach": "NOMBRE DEL TÉCNICO",
      "lim.pname": "NOMBRE DEL JUGADOR", "lim.pshort": "NOMBRE CORTO DEL JUGADOR", "lim.mod": "NOMBRE DEL MOD Y AUTOR",
      "lim.chars": "CARACTERES", "lim.squad": "JUGADORES POR EQUIPO", "lim.new": "EQUIPOS NUEVOS POR MOD",
      "lim.teams": "EQUIPOS POR MOD", "lim.num": "NÚMERO DE CAMISETA", "lim.attr": "ATRIBUTOS",
      "lim.crest": "ESCUDO", "lim.coachimg": "FOTO DEL TÉCNICO", "lim.player": "FOTO DEL JUGADOR",
      "lim.png": "CADA IMAGEN", "lim.json": "MOD.JSON", "lim.any": "CUALQUIER IMAGEN: EL ESTUDIO LA RECORTA Y REDUCE",
      "u.chars": "CARACTERES",
      "msg.saved": "BORRADOR GUARDADO EN ESTE NAVEGADOR", "msg.nosave": "SIN ACCESO AL ALMACENAMIENTO: NO CIERRES LA PÁGINA",
      "msg.added": "{n} EQUIPO(S) AGREGADO(S)", "msg.bad": "JSON NO VÁLIDO", "msg.dl": "MOD DESCARGADO: {f}",
      "msg.maxnew": "LÍMITE DE {n} EQUIPOS NUEVOS", "msg.maxteams": "LÍMITE DE {n} EQUIPOS",
      "msg.copied": "¡COPIADO!", "msg.already": "ESE EQUIPO YA ESTÁ EN EL MOD", "msg.noteams": "AGREGA AL MENOS UN EQUIPO",
      "msg.opened": "MOD ABIERTO: {n} EQUIPO(S)", "msg.imgbad": "NO PUDE ABRIR ESA IMAGEN",
      "msg.cleared": "BORRADOR ELIMINADO", "msg.loading": "CARGANDO EQUIPOS...", "msg.big": "MOD DEMASIADO GRANDE"
    }
  };

  var lang = "pt";
  function t(k, vars) {
    var s = (T[lang] && T[lang][k]) || T.pt[k] || k;
    if (vars) for (var v in vars) s = s.split("{" + v + "}").join(vars[v]);
    return s;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- saneamento (mesmo charset do TeamEdits.sanitize) ----------
  function clean(s, max, live) {
    var out = "";
    var up = String(s == null ? "" : s).toUpperCase();
    for (var i = 0; i < up.length && out.length < max; i++) {
      var ch = up[i];
      if (CHARSET.indexOf(ch) >= 0) out += ch;
    }
    out = out.replace(/ {2,}/g, " ").replace(/^ +/, "");
    return live ? out : out.trim();
  }
  function cleanShort(s) { return String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, LIM.SHORT); }
  function cleanId(s) { return String(s || "").toUpperCase().replace(/[^A-Z0-9_]/g, "_").replace(/_+/g, "_").slice(0, 24); }
  function cleanCountry(s) { return String(s || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2); }
  function cleanColor(s, def) { s = String(s || "").trim().toLowerCase(); if (/^[0-9a-f]{6}$/.test(s)) s = "#" + s; return /^#[0-9a-f]{6}$/.test(s) ? s : def; }
  function clampInt(v, lo, hi, def) { v = parseInt(v, 10); return isNaN(v) ? def : Math.max(lo, Math.min(hi, v)); }
  function pick(v, list, def) { v = String(v == null ? "" : v).toUpperCase(); for (var i = 0; i < list.length; i++) if (String(list[i]).toUpperCase() === v) return list[i]; return def; }
  function pickLower(v, list, def) { v = String(v == null ? "" : v).toLowerCase(); return list.indexOf(v) >= 0 ? v : def; }

  // ---------- estado ----------
  var BASE = null;           // base.json (FUTIBA ORIGINAL)
  var BASE_BY_ID = {};
  var S = freshState();
  var cur = -1, curP = 0;

  function freshState() { return { mod: { id: "MEU_MOD", name: "MEU MOD", author: "" }, teams: [] }; }

  function normPlayer(raw, fallback, idx, teamId) {
    raw = raw || {}; fallback = fallback || {};
    var a = raw.attributes || {}, fa = fallback.attributes || {};
    var ap = raw.appearance || {}, fap = fallback.appearance || {};
    var attrs = {};
    ATTRS.forEach(function (k) { attrs[k] = clampInt(a[k] != null ? a[k] : fa[k], 1, 99, 60); });
    var name = clean(raw.name != null ? raw.name : fallback.name, LIM.PNAME) || ("JOGADOR " + (idx + 1));
    return {
      id: fallback.id || (teamId + "_p" + (idx < 9 ? "0" : "") + (idx + 1)),
      name: name,
      short_name: clean(raw.short_name != null ? raw.short_name : fallback.short_name, LIM.PSHORT) || name.slice(0, LIM.PSHORT).trim(),
      shirt_number: clampInt(raw.shirt_number != null ? raw.shirt_number : fallback.shirt_number, 1, 99, idx + 1),
      position: pick(raw.position || fallback.position, POS, NEW_POS[idx] || "MF"),
      foot: pick(raw.foot || fallback.foot, ["R", "L"], "R"),
      trait: pick(raw.trait != null ? raw.trait : fallback.trait, TRAITS, ""),
      attributes: attrs,
      appearance: {
        skin: clampInt(ap.skin != null ? ap.skin : fap.skin, 0, 4, 2),
        hair_style: clampInt(ap.hair_style != null ? ap.hair_style : fap.hair_style, 0, 8, 1),
        hair_color: clampInt(ap.hair_color != null ? ap.hair_color : fap.hair_color, 0, 4, 0),
        facial: clampInt(ap.facial != null ? ap.facial : fap.facial, 0, 3, 0),
        body_type: pickLower(ap.body_type || fap.body_type, BODIES, "standard")
      },
      photo: typeof raw.photo === "string" && raw.photo.indexOf("data:image/png") === 0 ? raw.photo : ""
    };
  }

  // Time no rascunho. base=true: override de um time do jogo (casado por ID).
  function normTeam(raw, forceNewId) {
    raw = raw || {};
    var b = !forceNewId && raw.id && BASE_BY_ID[raw.id] ? BASE_BY_ID[raw.id] : null;
    var id = b ? b.id : (forceNewId || newTeamId(raw.short_name || raw.name));
    var fb = b || {};
    var coach = raw.coach || {}, fcoach = fb.coach || {};
    var tm = {
      id: id, base: !!b,
      name: clean(raw.name != null ? raw.name : fb.name, LIM.TEAM) || "TIME NOVO",
      short_name: cleanShort(raw.short_name != null ? raw.short_name : fb.short_name) || "NOV",
      country: cleanCountry(raw.country != null ? raw.country : fb.country) || "BR",
      primary_color: cleanColor(raw.primary_color, fb.primary_color || "#c81e1e"),
      secondary_color: cleanColor(raw.secondary_color, fb.secondary_color || "#ffffff"),
      kit_color3: cleanColor(raw.kit_color3, fb.kit_color3 || "#141416"),
      kit_pattern: pickLower(raw.kit_pattern || fb.kit_pattern, PATTERNS, "solid"),
      crest: isPng(raw.crest) ? raw.crest : "",
      crest_hd: isPng(raw.crest_hd) ? raw.crest_hd : "",
      coach: {
        name: clean(coach.name != null ? coach.name : fcoach.name, LIM.COACH) || "TÉCNICO",
        nationality: cleanCountry(coach.nationality != null ? coach.nationality : fcoach.nationality) || "BR",
        photo: isPng(coach.photo) ? coach.photo : ""
      },
      players: []
    };
    var rawPlayers = Array.isArray(raw.players) ? raw.players : [];
    if (b) {
      var byId = {};
      rawPlayers.forEach(function (p) { if (p && p.id) byId[p.id] = p; });
      b.players.forEach(function (bp, i) {
        tm.players.push(normPlayer(byId[bp.id] || (rawPlayers.length && !rawPlayers[0].id ? rawPlayers[i] : null), bp, i, id));
      });
    } else {
      for (var i = 0; i < LIM.SQUAD; i++) tm.players.push(normPlayer(rawPlayers[i], null, i, id));
    }
    return tm;
  }
  function isPng(s) { return typeof s === "string" && s.indexOf("data:image/png") === 0; }

  function newTeamId(seed) {
    var slug = String(seed || "time").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "").slice(0, 8) || "time";
    var id = "mod_" + slug, n = 2;
    while (S.teams.some(function (x) { return x.id === id; }) || BASE_BY_ID[id]) id = "mod_" + slug.slice(0, 6) + (n++);
    return id;
  }
  function newCount() { return S.teams.filter(function (x) { return !x.base; }).length; }

  // ---------- rascunho no IndexedDB (a "pasta" temporária do mod) ----------
  var db = null, saveTimer = 0, storageOk = true;
  function idb() {
    return new Promise(function (res) {
      try {
        var rq = indexedDB.open("futiba-mod-studio", 1);
        rq.onupgradeneeded = function () { rq.result.createObjectStore("draft"); };
        rq.onsuccess = function () { db = rq.result; res(db); };
        rq.onerror = function () { storageOk = false; res(null); };
      } catch (e) { storageOk = false; res(null); }
    });
  }
  function saveDraft() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      if (!db) { msg(t("msg.nosave"), "err"); return; }
      try {
        var tx = db.transaction("draft", "readwrite");
        tx.objectStore("draft").put(JSON.stringify(S), "state");
        tx.oncomplete = function () { msg(t("msg.saved"), "ok"); };
        tx.onerror = function () { msg(t("msg.nosave"), "err"); };
      } catch (e) { msg(t("msg.nosave"), "err"); }
    }, 500);
  }
  function loadDraft() {
    return new Promise(function (res) {
      if (!db) return res(null);
      try {
        var rq = db.transaction("draft").objectStore("draft").get("state");
        rq.onsuccess = function () { try { res(rq.result ? JSON.parse(rq.result) : null); } catch (e) { res(null); } };
        rq.onerror = function () { res(null); };
      } catch (e) { res(null); }
    });
  }

  // ---------- mensagens ----------
  function msg(text, kind) { var m = $("#msg"); m.textContent = text; m.className = "msg" + (kind ? " " + kind : ""); }
  var toastTimer = 0;
  function toast(text) {
    var el = $("#toast"); el.textContent = text; el.classList.add("on");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove("on"); }, 1600);
  }
  function copy(text) {
    var done = function () { toast(t("msg.copied")); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {} ta.remove();
    }
  }

  // ---------- idioma ----------
  function setLang(l) {
    lang = T[l] ? l : "pt";
    try { localStorage.setItem("futiba-lang", lang); } catch (e) {}
    document.documentElement.lang = { pt: "pt-BR", en: "en", es: "es" }[lang];
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false"); });
    $$("[data-t]").forEach(function (el) { el.innerHTML = t(el.dataset.t); });
    renderCount(); renderPick(); renderPrompts(); renderLimits(); renderStudio();
  }

  // ---------- telas (menu estilo jogo) ----------
  var screen = "get";
  function go(name, scroll) {
    screen = name;
    $$("#menu button").forEach(function (b) { b.setAttribute("aria-current", b.dataset.go === name ? "true" : "false"); });
    $$("[data-screen]").forEach(function (s) { s.hidden = s.id !== "s-" + name; });
    $("#status").hidden = name !== "studio";
    if (name === "studio") ensureBase().then(renderStudio);
    if (scroll) $("#s-" + name).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  var basePromise = null;
  function ensureBase() {
    if (!basePromise) {
      basePromise = fetch("/mod/base/base.json").then(function (r) { return r.json(); }).then(function (j) {
        BASE = j; BASE_BY_ID = {};
        j.teams.forEach(function (tm) { BASE_BY_ID[tm.id] = tm; });
        renderCount(); renderPick();
        return j;
      }).catch(function () { BASE = { teams: [] }; return BASE; });
    }
    return basePromise;
  }

  function renderCount() {
    if (!BASE) return;
    var p = 0; BASE.teams.forEach(function (x) { p += x.players.length; });
    $("#get-count").textContent = t("get.count", { t: BASE.teams.length, p: p });
  }

  function renderPick() {
    var sel = $("#pick-team"); if (!sel || !BASE) return;
    var keep = sel.value;
    sel.innerHTML = GROUPS.map(function (g) {
      var list = BASE.teams.filter(function (x) { return x.group === g; })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (!list.length) return "";
      return '<optgroup label="' + esc(t("g." + g)) + '">' + list.map(function (x) {
        return '<option value="' + esc(x.id) + '">' + esc(x.name) + "</option>";
      }).join("") + "</optgroup>";
    }).join("");
    if (keep) sel.value = keep;
  }

  // ---------- imagens ----------
  function baseImg(path) { return path ? "/mod/base/" + path : ""; }
  function teamCrest(tm) { return tm.crest || (tm.base ? baseImg(BASE_BY_ID[tm.id] && BASE_BY_ID[tm.id].crest) : ""); }
  function coachPhoto(tm) { return tm.coach.photo || (tm.base ? baseImg(BASE_BY_ID[tm.id] && BASE_BY_ID[tm.id].coach.photo) : ""); }
  function playerPhoto(tm, i) {
    var p = tm.players[i];
    if (p.photo) return p.photo;
    if (tm.base) { var bp = BASE_BY_ID[tm.id] && BASE_BY_ID[tm.id].players[i]; return bp ? baseImg(bp.photo) : ""; }
    return "";
  }
  var BLANK = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="#22283c"/><circle cx="4" cy="3" r="1.6" fill="#59607a"/><rect x="1.5" y="5.2" width="5" height="2.8" fill="#59607a"/></svg>');

  // Foto qualquer -> recorte central na proporção -> fundo liso some -> tamanho do jogo.
  function processImage(file, kind) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var out = {};
        var kinds = kind === "crest" ? ["crest", "crest_hd"] : [kind];
        kinds.forEach(function (k) { out[k] = shrink(img, SIZES[k][0], SIZES[k][1]); });
        res(out);
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(); };
      img.src = url;
    });
  }
  function shrink(img, w, h) {
    var sw = img.naturalWidth, sh = img.naturalHeight;
    var cw = sw, ch = Math.round(sw * h / w);
    if (ch > sh) { ch = sh; cw = Math.round(sh * w / h); }
    var c = document.createElement("canvas"); c.width = cw; c.height = ch;
    var g = c.getContext("2d"); g.drawImage(img, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, cw, ch);
    // reduz pela metade com suavização até chegar perto, depois o passo final
    var small = cw <= w * 3;
    while (c.width > w * 2) {
      var n = document.createElement("canvas"); n.width = Math.max(w, Math.round(c.width / 2)); n.height = Math.max(h, Math.round(c.height / 2));
      var ng = n.getContext("2d"); ng.imageSmoothingQuality = "high"; ng.drawImage(c, 0, 0, n.width, n.height); c = n;
    }
    var f = document.createElement("canvas"); f.width = w; f.height = h;
    var fg = f.getContext("2d"); fg.imageSmoothingEnabled = !small; fg.imageSmoothingQuality = "high";
    fg.drawImage(c, 0, 0, w, h);
    clearBackground(fg, w, h);
    return f.toDataURL("image/png");
  }
  // Igual ao jogo: se os 4 cantos têm a mesma cor, apaga essa cor a partir das bordas.
  function clearBackground(g, w, h) {
    var d = g.getImageData(0, 0, w, h), px = d.data;
    function at(x, y) { var i = (y * w + x) * 4; return [px[i], px[i + 1], px[i + 2], px[i + 3]]; }
    var cs = [at(0, 0), at(w - 1, 0), at(0, h - 1), at(w - 1, h - 1)];
    function dist(a, b) { return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])) / 255; }
    for (var i = 1; i < 4; i++) if (dist(cs[0], cs[i]) > 0.16 || cs[i][3] < 200) return;
    var bg = cs[0], seen = new Uint8Array(w * h), stack = [];
    for (var x = 0; x < w; x++) { stack.push([x, 0], [x, h - 1]); }
    for (var y = 0; y < h; y++) { stack.push([0, y], [w - 1, y]); }
    while (stack.length) {
      var v = stack.pop(), vx = v[0], vy = v[1];
      if (vx < 0 || vy < 0 || vx >= w || vy >= h || seen[vy * w + vx]) continue;
      seen[vy * w + vx] = 1;
      if (dist(at(vx, vy), bg) > 0.16) continue;
      px[(vy * w + vx) * 4 + 3] = 0;
      stack.push([vx + 1, vy], [vx - 1, vy], [vx, vy + 1], [vx, vy - 1]);
    }
    g.putImageData(d, 0, 0);
  }

  var imgTarget = null;
  function askImage(kind, ti, pi) { imgTarget = { kind: kind, ti: ti, pi: pi }; var inp = $("#img-in"); inp.value = ""; inp.click(); }

  // ---------- camisa (prévia) ----------
  var SHIRT = [
    "....XXX..XXX....", "..XXXXX..XXXXX..", ".XXXXXXXXXXXXXX.", "XXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXX", "XXX.XXXXXXXX.XXX", "....XXXXXXXX....", "....XXXXXXXX....",
    "....XXXXXXXX....", "....XXXXXXXX....", "....XXXXXXXX....", "....XXXXXXXX....",
    "....SSSSSSSS....", "....SSSSSSSS....", "....SSS..SSS....", "....SSS..SSS...."];
  function drawKit(canvas, tm) {
    var g = canvas.getContext("2d"); g.clearRect(0, 0, 16, 16);
    for (var y = 0; y < 16; y++) for (var x = 0; x < 16; x++) {
      var ch = SHIRT[y][x]; if (ch === ".") continue;
      var col = tm.primary_color;
      if (ch === "S") col = tm.secondary_color;
      else switch (tm.kit_pattern) {
        case "vertical": col = (x >> 1) % 2 ? tm.secondary_color : tm.primary_color; break;
        case "hoops": col = (y >> 1) % 2 ? tm.secondary_color : tm.primary_color; break;
        case "chestband": if (y >= 4 && y <= 6) col = tm.secondary_color; break;
        case "chestband3": if (y === 4 || y === 6) col = tm.secondary_color; else if (y === 5) col = tm.kit_color3; break;
        case "band": if (Math.abs((x - 3) - y) <= 1) col = tm.secondary_color; break;
      }
      g.fillStyle = col; g.fillRect(x, y, 1, 1);
    }
  }

  // ---------- estúdio ----------
  function renderStudio() {
    if (!$("#s-studio") || $("#s-studio").hidden) return;
    $("#mod-name").value = S.mod.name; $("#mod-author").value = S.mod.author; $("#mod-id").value = S.mod.id;
    counts();
    var chips = $("#chips");
    chips.innerHTML = S.teams.map(function (tm, i) {
      return '<span class="chip" data-chip="' + i + '" aria-current="' + (i === cur) + '"><img src="' + esc(teamCrest(tm) || BLANK) +
        '" alt="">' + esc(tm.name) + '<button type="button" class="x" data-del="' + i + '" aria-label="' + esc(t("st.remove")) + '">×</button></span>';
    }).join("");
    var ed = $("#team-ed");
    if (cur < 0 || !S.teams[cur]) { cur = S.teams.length ? 0 : -1; }
    if (cur < 0) { ed.innerHTML = '<div class="empty" style="margin-top:14px">' + esc(t("st.empty")) + "</div>"; return; }
    if (chips.children[cur]) chips.children[cur].setAttribute("aria-current", "true");
    var tm = S.teams[cur];
    var opts = function (list, val, lab) {
      return list.map(function (v) { return '<option value="' + esc(v) + '"' + (String(v) === String(val) ? " selected" : "") + ">" + esc(lab(v)) + "</option>"; }).join("");
    };
    var html = '<div class="team">' +
      '<div class="namebar" data-bind="tname">' + esc(tm.name) + "</div>" +
      '<div class="side">' +
        '<div class="crestline"><div class="pic pic--crest" data-img="crest" title="' + esc(t("f.crest")) + '"><img src="' + esc(teamCrest(tm) || BLANK) + '" alt=""><span class="up">' + esc(t("st.change")) + "</span></div>" +
        '<canvas class="kit" width="16" height="16" id="kit"></canvas></div>' +
        '<div class="pic pic--coach" data-img="coach"><img src="' + esc(coachPhoto(tm) || BLANK) + '" alt=""><span class="up">' + esc(t("st.change")) + "</span></div>" +
        field("f.coach", "coach.name", tm.coach.name, LIM.COACH) +
        '<div class="grid2">' + field("f.nat", "coach.nationality", tm.coach.nationality, 2) +
        '<label class="f"><span>&nbsp;</span><button type="button" class="btn btn--small" data-prompt="coach">' + esc(t("st.copyprompt")) + "</button></label></div>" +
        '<p class="dim" style="font-size:7px;margin:0">ID: ' + esc(tm.id) + " · " + esc(tm.base ? t("st.base") : t("st.newtag")) + "</p>" +
      "</div>" +
      "<div>" +
        '<div class="grid3">' + field("f.name", "name", tm.name, LIM.TEAM) + field("f.short", "short_name", tm.short_name, LIM.SHORT) + field("f.country", "country", tm.country, 2) + "</div>" +
        '<div class="row" style="margin:10px 0 14px">' +
          colorField("f.c1", "primary_color", tm.primary_color) + colorField("f.c2", "secondary_color", tm.secondary_color) +
          colorField("f.c3", "kit_color3", tm.kit_color3) +
          '<label class="f" style="flex:1;min-width:160px"><span>' + esc(t("f.pattern")) + '</span><select data-k="kit_pattern">' + opts(PATTERNS, tm.kit_pattern, function (v) { return t("pat." + v); }) + "</select></label>" +
          '<button type="button" class="btn btn--small" data-prompt="crest">' + esc(t("ai.crest")) + ": " + esc(t("st.copyprompt")) + "</button>" +
        "</div>" +
        '<div class="squad">' + '<h4>' + esc(t("sq.start")) + "</h4>" + tm.players.map(function (p, i) {
          return (i === 11 ? "<h4>" + esc(t("sq.res")) + "</h4>" : "") +
            '<button type="button" class="pc" data-p="' + i + '" aria-current="' + (i === curP) + '"><span class="n">' + p.shirt_number + '</span><img src="' + esc(playerPhoto(tm, i) || BLANK) +
            '" alt=""><span class="nm" data-bind="pn' + i + '">' + esc(p.short_name) + '</span><span class="pos">' + esc(p.position) + "</span></button>";
        }).join("") + "</div>" +
      "</div></div>" + playerEditor(tm, opts);
    ed.innerHTML = html;
    drawKit($("#kit"), tm);
  }
  function field(label, key, val, max) {
    return '<label class="f"><span>' + esc(t(label)) + ' <span class="c">' + String(val).length + "/" + max + '</span></span><input type="text" data-k="' + key + '" value="' + esc(val) + '" maxlength="' + max + '" autocomplete="off" spellcheck="false"></label>';
  }
  function colorField(label, key, val) {
    return '<label class="f"><span>' + esc(t(label)) + '</span><input type="color" data-k="' + key + '" value="' + esc(val) + '"></label>';
  }
  function playerEditor(tm, opts) {
    var p = tm.players[curP]; if (!p) return "";
    var ap = p.appearance;
    var swatch = function (list, key, val) {
      return '<div class="sw">' + list.map(function (c, i) {
        return '<button type="button" style="background:' + c + '" data-sw="' + key + '" data-v="' + i + '" aria-pressed="' + (i === val) + '" aria-label="' + (i + 1) + '"></button>';
      }).join("") + "</div>";
    };
    return '<div class="ped">' +
      '<div class="look"><div class="pic pic--player" data-img="player"><img src="' + esc(playerPhoto(tm, curP) || BLANK) + '" alt=""><span class="up">' + esc(t("st.change")) + "</span></div>" +
      '<button type="button" class="btn btn--small" data-prompt="player">' + esc(t("st.copyprompt")) + "</button>" +
      '<label class="f" style="width:100%"><span>' + esc(t("p.skin")) + "</span>" + swatch(SKINS, "skin", ap.skin) + "</label>" +
      '<label class="f" style="width:100%"><span>' + esc(t("p.haircol")) + "</span>" + swatch(HAIRS, "hair_color", ap.hair_color) + "</label>" +
      "</div>" +
      "<div>" +
        '<div class="grid2">' + field("p.name", "p.name", p.name, LIM.PNAME) + field("p.short", "p.short_name", p.short_name, LIM.PSHORT) + "</div>" +
        '<div class="grid3" style="margin-top:10px">' +
          '<label class="f"><span>' + esc(t("p.num")) + '</span><input type="number" min="1" max="99" data-k="p.shirt_number" value="' + p.shirt_number + '"></label>' +
          '<label class="f"><span>' + esc(t("p.pos")) + '</span><select data-k="p.position">' + opts(POS, p.position, function (v) { return v; }) + "</select></label>" +
          '<label class="f"><span>' + esc(t("p.foot")) + '</span><select data-k="p.foot">' + opts(["R", "L"], p.foot, function (v) { return t("foot." + v); }) + "</select></label>" +
          '<label class="f"><span>' + esc(t("p.trait")) + '</span><select data-k="p.trait">' + opts(TRAITS, p.trait, function (v) { return v || t("p.none"); }) + "</select></label>" +
          '<label class="f"><span>' + esc(t("p.hair")) + '</span><select data-k="p.ap.hair_style">' + opts([0, 1, 2, 3, 4, 5, 6, 7, 8], ap.hair_style, function (v) { return v >= 6 ? t("hair." + v) : t("hair.n", { n: v + 1 }); }) + "</select></label>" +
          '<label class="f"><span>' + esc(t("p.facial")) + '</span><select data-k="p.ap.facial">' + opts([0, 1, 2, 3], ap.facial, function (v) { return t("fac." + v); }) + "</select></label>" +
          '<label class="f"><span>' + esc(t("p.body")) + '</span><select data-k="p.ap.body_type">' + opts(BODIES, ap.body_type, function (v) { return t("body." + v); }) + "</select></label>" +
        "</div>" +
        '<div class="attrs" style="margin-top:14px">' + ATTRS.map(function (k) {
          return '<div class="attr"><span>' + esc(t("a." + k)) + '</span><input type="range" min="1" max="99" data-k="p.attr.' + k + '" value="' + p.attributes[k] + '"><b data-bind="a' + k + '">' + p.attributes[k] + "</b></div>";
        }).join("") + "</div>" +
      "</div></div>";
  }
  function counts() {
    var m = $("[data-count=modname]"), a = $("[data-count=author]");
    if (m) m.textContent = S.mod.name.length + "/" + LIM.MOD;
    if (a) a.textContent = S.mod.author.length + "/" + LIM.MOD;
  }

  // escrita de um campo do editor (data-k)
  function setField(el, final) {
    var tm = S.teams[cur]; if (!tm) return;
    var k = el.dataset.k, v = el.value, p = tm.players[curP];
    var live = !final;
    switch (k) {
      case "name": v = clean(v, LIM.TEAM, live); tm.name = v; break;
      case "short_name": v = cleanShort(v); tm.short_name = v; break;
      case "country": v = cleanCountry(v); tm.country = v; break;
      case "coach.name": v = clean(v, LIM.COACH, live); tm.coach.name = v; break;
      case "coach.nationality": v = cleanCountry(v); tm.coach.nationality = v; break;
      case "primary_color": case "secondary_color": case "kit_color3": tm[k] = cleanColor(v, tm[k]); break;
      case "kit_pattern": tm.kit_pattern = pickLower(v, PATTERNS, "solid"); break;
      case "p.name": v = clean(v, LIM.PNAME, live); p.name = v; break;
      case "p.short_name": v = clean(v, LIM.PSHORT, live); p.short_name = v; break;
      case "p.shirt_number": if (final) { v = clampInt(v, 1, 99, p.shirt_number); p.shirt_number = v; } break;
      case "p.position": p.position = pick(v, POS, "MF"); break;
      case "p.foot": p.foot = pick(v, ["R", "L"], "R"); break;
      case "p.trait": p.trait = pick(v, TRAITS, ""); break;
      case "p.ap.hair_style": p.appearance.hair_style = clampInt(v, 0, 8, 1); break;
      case "p.ap.facial": p.appearance.facial = clampInt(v, 0, 3, 0); break;
      case "p.ap.body_type": p.appearance.body_type = pickLower(v, BODIES, "standard"); break;
      default:
        if (k.indexOf("p.attr.") === 0) {
          var a = k.slice(7); p.attributes[a] = clampInt(v, 1, 99, 60);
          var b = $('[data-bind="a' + a + '"]'); if (b) b.textContent = p.attributes[a];
        }
    }
    if (el.type === "text" && el.value !== String(v)) {
      var pos = el.selectionStart; el.value = v;
      try { el.setSelectionRange(Math.min(pos, v.length), Math.min(pos, v.length)); } catch (e) {}
    }
    var c = el.closest("label") && el.closest("label").querySelector(".c");
    if (c) c.textContent = String(el.value).length + "/" + el.maxLength;
    // atualiza o que mostra o texto sem redesenhar (o foco fica no campo)
    var nb = $('[data-bind="tname"]'); if (nb) nb.textContent = tm.name;
    var chip = $('[data-chip="' + cur + '"]'); if (chip && k === "name") chip.childNodes[1].nodeValue = tm.name;
    var pn = $('[data-bind="pn' + curP + '"]'); if (pn && p) pn.textContent = p.short_name;
    if (k === "p.shirt_number" || k === "p.position") { var card = $('[data-p="' + curP + '"]'); if (card) { card.querySelector(".n").textContent = p.shirt_number; card.querySelector(".pos").textContent = p.position; } }
    if (/color|pattern/.test(k)) drawKit($("#kit"), tm);
    saveDraft();
  }

  function addTeam(tm) {
    if (S.teams.length >= LIM.TEAMS) { msg(t("msg.maxteams", { n: LIM.TEAMS }), "err"); return false; }
    if (!tm.base && newCount() >= LIM.NEW_TEAMS) { msg(t("msg.maxnew", { n: LIM.NEW_TEAMS }), "err"); return false; }
    var at = S.teams.findIndex(function (x) { return x.id === tm.id; });
    if (at >= 0) S.teams[at] = tm; else S.teams.push(tm);
    cur = at >= 0 ? at : S.teams.length - 1; curP = 0;
    return true;
  }

  function parsePasted(text) {
    text = String(text || "").trim().replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/, "");
    var a = text.indexOf("{"), b = text.indexOf("[");
    var start = a < 0 ? b : (b < 0 ? a : Math.min(a, b));
    if (start > 0) text = text.slice(start);
    var j = JSON.parse(text);
    if (Array.isArray(j)) return j;
    if (j && Array.isArray(j.teams)) return j.teams;
    if (j && typeof j === "object") return [j];
    throw new Error("bad");
  }

  // ---------- ZIP ----------
  // Time do jogo: o mod leva só o que mudou. Override só mexe no que vem, então
  // abrir um time e não tocar num jogador não muda nada dele (nem a barba fixa).
  function onlyChanged(full, base) {
    if (!base) return full;
    var out = { id: full.id };
    ["name", "short_name", "country", "primary_color", "secondary_color", "kit_color3", "kit_pattern"].forEach(function (k) {
      if (full[k] !== base[k]) out[k] = full[k];
    });
    if (full.crest) out.crest = full.crest;
    var coach = {}, bc = base.coach || {};
    if (full.coach.name !== bc.name) coach.name = full.coach.name;
    if (full.coach.nationality !== bc.nationality) coach.nationality = full.coach.nationality;
    if (full.coach.photo) coach.photo = full.coach.photo;
    if (Object.keys(coach).length) out.coach = coach;
    var bps = {}; (base.players || []).forEach(function (bp) { bps[bp.id] = bp; });
    var players = full.players.map(function (p) {
      var bp = bps[p.id]; if (!bp) return p;
      var o = { id: p.id };
      ["name", "short_name", "shirt_number", "position", "foot", "trait"].forEach(function (k) { if (p[k] !== bp[k]) o[k] = p[k]; });
      if (ATTRS.some(function (k) { return p.attributes[k] !== bp.attributes[k]; })) o.attributes = p.attributes;
      var ap = {};
      Object.keys(p.appearance).forEach(function (k) { if (p.appearance[k] !== bp.appearance[k]) ap[k] = p.appearance[k]; });
      if (Object.keys(ap).length) o.appearance = ap;
      if (p.photo) o.photo = p.photo;
      return o;
    }).filter(function (o) { return Object.keys(o).length > 1; });
    if (players.length) out.players = players;
    return out;
  }

  function exportMod() {
    if (!S.teams.length) { msg(t("msg.noteams"), "err"); return; }
    var id = cleanId(S.mod.id) || "MEU_MOD"; if (id.length < 3) id = (id + "_MOD").slice(0, 24);
    var root = "mod/" + id + "/";
    var zip = new JSZip();
    ["mod/", root, root + "img/", root + "img/crests/", root + "img/coaches/", root + "img/players/"].forEach(function (d) { zip.folder(d); });
    var big = false, nimg = 0;
    function put(path, dataUrl) {
      var b64 = dataUrl.split(",")[1] || "";
      if (b64.length * 0.75 > LIM.PNG) { big = true; return ""; }
      zip.file(root + path, b64, { base64: true }); nimg++; return path;
    }
    var mod = {
      format: "futiba-mod", version: 1, id: id,
      name: clean(S.mod.name, LIM.MOD) || id, author: clean(S.mod.author, LIM.MOD),
      created: new Date().toISOString().slice(0, 10),
      teams: S.teams.map(function (tm) {
        var crest = tm.crest ? put("img/crests/" + tm.id + ".png", tm.crest) : "";
        if (tm.crest_hd) put("img/crests/" + tm.id + "_hd.png", tm.crest_hd);
        var full = {
          id: tm.id, name: clean(tm.name, LIM.TEAM), short_name: cleanShort(tm.short_name), country: tm.country,
          primary_color: tm.primary_color, secondary_color: tm.secondary_color, kit_color3: tm.kit_color3,
          kit_pattern: tm.kit_pattern, crest: crest,
          coach: { name: clean(tm.coach.name, LIM.COACH), nationality: tm.coach.nationality,
            photo: tm.coach.photo ? put("img/coaches/" + tm.id + ".png", tm.coach.photo) : "" },
          players: tm.players.map(function (p) {
            return { id: p.id, name: clean(p.name, LIM.PNAME), short_name: clean(p.short_name, LIM.PSHORT),
              shirt_number: p.shirt_number, position: p.position, foot: p.foot, trait: p.trait,
              attributes: p.attributes, appearance: p.appearance,
              photo: p.photo ? put("img/players/" + p.id + ".png", p.photo) : "" };
          })
        };
        return tm.base ? onlyChanged(full, BASE_BY_ID[tm.id]) : full;
      })
    };
    var json = JSON.stringify(mod, null, 1);
    if (json.length > LIM.JSON || big) { msg(t("msg.big"), "err"); return; }
    // sem nenhuma imagem: o mod é um .json solto (vai direto em mod/), como o FUTIBA_ORIGINAL
    var ready, fname;
    if (!nimg) {
      fname = id + ".json";
      ready = Promise.resolve(new Blob([json], { type: "application/json" }));
    } else {
      zip.file(root + "mod.json", json);
      fname = "FUTIBA_MOD_" + id + ".zip";
      ready = zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    }
    ready.then(function (blob) {
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fname;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      msg(t("msg.dl", { f: fname }), "ok");
    });
  }

  function openMod(file) {
    ensureBase().then(function () {
      if (/\.json$/i.test(file.name)) {
        return file.text().then(function (txt) { loadModObject(JSON.parse(txt), null, ""); });
      }
      return JSZip.loadAsync(file).then(function (zip) {
        var mj = Object.keys(zip.files).filter(function (n) { return /(^|\/)mod\.json$/i.test(n); })[0];
        if (!mj) throw new Error("no mod.json");
        var dir = mj.slice(0, mj.length - "mod.json".length);
        return zip.file(mj).async("string").then(function (txt) { return loadModObject(JSON.parse(txt), zip, dir); });
      });
    }).then(function () {
      msg(t("msg.opened", { n: S.teams.length }), "ok"); go("studio", true);
    }).catch(function () { msg(t("msg.bad"), "err"); toast(t("msg.bad")); });
  }
  function loadModObject(j, zip, dir) {
    var teams = Array.isArray(j.teams) ? j.teams : [];
    var imgs = [];
    function grab(path, set) {
      if (!zip || !path) return;
      var f = zip.file(dir + path); if (!f) return;
      imgs.push(f.async("base64").then(function (b) { set("data:image/png;base64," + b); }));
    }
    var out = teams.slice(0, LIM.TEAMS).map(function (raw) {
      var isNew = !BASE_BY_ID[raw.id];
      var tm = normTeam(raw, isNew ? (/^mod_[a-z0-9]{1,16}$/.test(raw.id || "") ? raw.id : null) || undefined : undefined);
      if (isNew && !/^mod_/.test(tm.id)) tm.id = newTeamId(tm.short_name);
      grab(raw.crest, function (d) { tm.crest = d; });
      if (raw.crest) grab(String(raw.crest).replace(/\.png$/i, "_hd.png"), function (d) { tm.crest_hd = d; });
      grab(raw.coach && raw.coach.photo, function (d) { tm.coach.photo = d; });
      (raw.players || []).forEach(function (rp) {
        var p = tm.players.filter(function (x) { return x.id === rp.id; })[0];
        if (p) grab(rp.photo, function (d) { p.photo = d; });
      });
      return tm;
    });
    return Promise.all(imgs).then(function () {
      S = { mod: { id: cleanId(j.id) || "MEU_MOD", name: clean(j.name, LIM.MOD) || "MEU MOD", author: clean(j.author, LIM.MOD) }, teams: out };
      cur = out.length ? 0 : -1; curP = 0; saveDraft();
    });
  }

  // ---------- prompts ----------
  function teamColors() {
    var tm = S.teams[cur];
    return tm ? [tm.primary_color, tm.secondary_color] : ["[COLOR 1]", "[COLOR 2]"];
  }
  function promptText(kind) {
    var c = teamColors();
    if (kind === "player") return "Use the attached photo as the reference for the face. " +
      "Turn this person into a football (soccer) player portrait in 16-bit retro pixel art, like a 1990s SNES/Mega Drive soccer game: " +
      "head and shoulders, facing forward, neutral confident expression, wearing a football jersey in the colors " + c[0] + " and " + c[1] + ". " +
      "Keep the real hair, beard and skin tone. The head fills most of the picture. Square 1:1 framing, plain white background, " +
      "crisp pixels, limited palette, strong outline, no text, no logo, no number. It will be shrunk to 32x32 pixels, so keep shapes big and readable.";
    if (kind === "coach") return "Use the attached 3x4 photo as the reference for the face. " +
      "Turn this person into a football (soccer) coach portrait in 16-bit retro pixel art, like a 1990s SNES/Mega Drive soccer game: " +
      "chest-up bust, facing forward slightly turned, serious confident expression, wearing a zip-up tracksuit jacket in the colors " + c[0] + " and " + c[1] + ". " +
      "Keep the real hair, beard, glasses and skin tone. Detailed shaded pixels, warm lighting, limited palette, crisp edges, no text, no logo, " +
      "plain white background, vertical 3:4 framing (head near the top, shoulders at the bottom). It will be shrunk to 48x64 pixels.";
    if (kind === "crest") return "Create a football (soccer) club crest in 16-bit retro pixel art for a club called [CLUB NAME], " +
      "using the colors " + c[0] + " and " + c[1] + ". Simple bold shield shape, at most 3 letters, thick dark outline, flat colors, " +
      "limited palette (6 colors max), centered, filling the frame, plain white background, square 1:1. " +
      "It will be shrunk to 24x24 pixels, so avoid small details and thin lines.";
    // times em massa
    return "You are creating teams for FUTIBA, a 16-bit retro football game. Reply with ONLY valid JSON, no comments, no markdown.\n\n" +
      "Teams to create: [DESCRIBE YOUR TEAMS HERE, FOR EXAMPLE: 4 AMATEUR TEAMS FROM MY NEIGHBORHOOD, OR THE 2026 SQUAD OF MY LOCAL CLUB]\n\n" +
      "Format:\n" +
      '{"teams":[{"name":"","short_name":"","country":"BR","primary_color":"#rrggbb","secondary_color":"#rrggbb","kit_color3":"#rrggbb",' +
      '"kit_pattern":"solid","coach":{"name":"","nationality":"BR"},"players":[{"name":"","short_name":"","shirt_number":1,"position":"GK",' +
      '"foot":"R","trait":"","attributes":{"pace":60,"shooting":60,"passing":60,"dribbling":60,"defense":60,"heading":60,"goalkeeping":60,"stamina":60,"strength":60},' +
      '"appearance":{"skin":2,"hair_style":1,"hair_color":0,"facial":0,"body_type":"standard"}}]}]}\n\n' +
      "Rules (follow all of them):\n" +
      "- Every text in UPPERCASE. Allowed characters: A-Z, 0-9, space, . - ' and ÁÀÂÃÉÊÍÓÔÕÚÇÜÑ. No emoji.\n" +
      "- name: max " + LIM.TEAM + " characters. short_name of the team: max " + LIM.SHORT + " letters or digits.\n" +
      "- coach.name: max " + LIM.COACH + " characters. country and nationality: 2 letter code (BR, AR, ES, US...).\n" +
      "- Exactly " + LIM.SQUAD + " players per team, in lineup order: the first 11 are the starters (1 GK, then defenders, midfielders, forwards), then 5 substitutes including 1 GK.\n" +
      "- player name: max " + LIM.PNAME + " characters. player short_name: max " + LIM.PSHORT + " characters (the name shown on screen).\n" +
      "- shirt_number 1 to 99, no repeats in the same team. position: GK, DF, MF or FW. foot: R or L.\n" +
      "- attributes: integers 1 to 99. Only goalkeepers have goalkeeping above 40. Make the numbers fit each player.\n" +
      "- trait: empty or one of " + TRAITS.slice(1).join(", ") + ". Use few traits.\n" +
      "- skin and hair_color: 0 (lightest) to 4 (darkest). hair_style: 0 to 8 (6 wavy, 7 afro, 8 full). facial: 0 none, 1 moustache, 2 short beard, 3 beard and moustache.\n" +
      "- body_type: standard, short, tall, slim or robust.\n" +
      "- kit_pattern: solid, vertical, hoops, chestband, chestband3 or band. Colors as #rrggbb.";
  }
  function renderPrompts() {
    var box = $("#prompts"); if (!box) return;
    box.innerHTML = [["teams", "ai.teams"], ["player", "ai.player"], ["coach", "ai.coach"], ["crest", "ai.crest"]].map(function (x) {
      return '<div class="card prompt"><h2>' + esc(t(x[1])) + '</h2><textarea readonly spellcheck="false">' + esc(promptText(x[0])) +
        '</textarea><div class="row" style="margin-top:10px"><button type="button" class="btn btn--gold" data-prompt="' + x[0] + '">' + esc(t("ai.copy")) + "</button></div></div>";
    }).join("") + '<p class="dim" style="grid-column:1/-1;font-size:8px">' + esc(t("ai.note")) + "</p>";
  }

  function renderLimits() {
    var el = $("#limits"); if (!el) return;
    var c = " " + t("u.chars");
    var rows = [
      ["lim.team", LIM.TEAM + c], ["lim.short", LIM.SHORT + c], ["lim.coach", LIM.COACH + c],
      ["lim.pname", LIM.PNAME + c], ["lim.pshort", LIM.PSHORT + c], ["lim.mod", LIM.MOD + c],
      ["lim.chars", "A-Z 0-9 . - ' ÁÃÇ..."], ["lim.squad", "16 (11 + 5)"], ["lim.num", "1-99"], ["lim.attr", "1-99"],
      ["lim.new", String(LIM.NEW_TEAMS)], ["lim.teams", String(LIM.TEAMS)],
      ["lim.crest", "24X24 + 48X48 PNG"], ["lim.coachimg", "48X64 PNG"], ["lim.player", "32X32 PNG"],
      ["lim.png", "64 KB"], ["lim.json", "2 MB"], ["lim.any", "JPG PNG WEBP"]
    ];
    el.innerHTML = rows.map(function (r) { return "<tr><td>" + esc(t(r[0])) + "</td><td>" + esc(r[1]) + "</td></tr>"; }).join("");
  }

  // ---------- eventos ----------
  function wire() {
    $$(".lang button").forEach(function (b) { b.addEventListener("click", function () { setLang(b.dataset.lang); }); });
    $$("#menu button").forEach(function (b) { b.addEventListener("click", function () { go(b.dataset.go, true); }); });
    // setas e Enter no menu, como no jogo
    $("#menu").addEventListener("keydown", function (e) {
      var bs = $$("#menu button"), i = bs.indexOf(document.activeElement);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); var n = (i + (e.key === "ArrowDown" ? 1 : -1) + bs.length) % bs.length; bs[n].focus();
      }
    });

    $("#open-mod").addEventListener("change", function (e) { var f = e.target.files[0]; if (f) openMod(f); e.target.value = ""; });

    $("#mod-name").addEventListener("input", function (e) {
      var v = clean(e.target.value, LIM.MOD, true); e.target.value = v; S.mod.name = v;
      if (!S.mod.idTouched) { S.mod.id = cleanId(v.normalize("NFD").replace(/[̀-ͯ]/g, "").trim()) || "MEU_MOD"; $("#mod-id").value = S.mod.id; }
      counts(); saveDraft();
    });
    $("#mod-author").addEventListener("input", function (e) { var v = clean(e.target.value, LIM.MOD, true); e.target.value = v; S.mod.author = v; counts(); saveDraft(); });
    $("#mod-id").addEventListener("input", function (e) { var v = cleanId(e.target.value); e.target.value = v; S.mod.id = v; S.mod.idTouched = true; saveDraft(); });

    $("#add-base").addEventListener("click", function () {
      var id = $("#pick-team").value; if (!id || !BASE_BY_ID[id]) return;
      if (S.teams.some(function (x) { return x.id === id; })) {
        cur = S.teams.findIndex(function (x) { return x.id === id; }); msg(t("msg.already")); renderStudio(); return;
      }
      if (addTeam(normTeam({ id: id }))) { renderStudio(); saveDraft(); }
    });
    $("#add-new").addEventListener("click", function () {
      if (addTeam(normTeam({ name: "TIME NOVO" }, newTeamId("time")))) { renderStudio(); saveDraft(); }
    });
    $("#paste-open").addEventListener("click", function () { $("#paste-box").hidden = false; $("#paste-text").focus(); });
    $("#paste-cancel").addEventListener("click", function () { $("#paste-box").hidden = true; });
    $("#paste-go").addEventListener("click", function () {
      var list;
      try { list = parsePasted($("#paste-text").value); } catch (e) { msg(t("msg.bad"), "err"); toast(t("msg.bad")); return; }
      var n = 0;
      for (var i = 0; i < list.length; i++) {
        var raw = list[i] || {};
        var tm = BASE_BY_ID[raw.id] ? normTeam(raw) : normTeam(raw, newTeamId(raw.short_name || raw.name));
        if (!addTeam(tm)) break;
        n++;
      }
      $("#paste-box").hidden = true; $("#paste-text").value = "";
      if (n) msg(t("msg.added", { n: n }), "ok");
      renderStudio(); saveDraft();
    });

    $("#chips").addEventListener("click", function (e) {
      var del = e.target.closest("[data-del]");
      if (del) {
        S.teams.splice(+del.dataset.del, 1); if (cur >= S.teams.length) cur = S.teams.length - 1;
        renderStudio(); saveDraft(); return;
      }
      var chip = e.target.closest("[data-chip]"); if (chip) { cur = +chip.dataset.chip; curP = 0; renderStudio(); }
    });

    var ed = $("#team-ed");
    ed.addEventListener("input", function (e) { if (e.target.dataset.k) setField(e.target, false); });
    ed.addEventListener("change", function (e) { if (e.target.dataset.k) setField(e.target, true); });
    ed.addEventListener("focusout", function (e) { if (e.target.dataset && e.target.dataset.k && e.target.type === "text") setField(e.target, true); });
    ed.addEventListener("click", function (e) {
      var pc = e.target.closest("[data-p]");
      if (pc) { curP = +pc.dataset.p; renderStudio(); var ped = $(".ped"); if (ped && window.innerWidth < 860) ped.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
      var im = e.target.closest("[data-img]"); if (im) { askImage(im.dataset.img, cur, curP); return; }
      var sw = e.target.closest("[data-sw]");
      if (sw) { S.teams[cur].players[curP].appearance[sw.dataset.sw] = +sw.dataset.v; renderStudio(); saveDraft(); return; }
    });
    document.addEventListener("click", function (e) {
      var pr = e.target.closest("[data-prompt]"); if (pr) copy(promptText(pr.dataset.prompt));
    });

    $("#img-in").addEventListener("change", function (e) {
      var f = e.target.files[0], tg = imgTarget; if (!f || !tg) return;
      processImage(f, tg.kind).then(function (out) {
        var tm = S.teams[tg.ti]; if (!tm) return;
        if (tg.kind === "crest") { tm.crest = out.crest; tm.crest_hd = out.crest_hd; }
        else if (tg.kind === "coach") tm.coach.photo = out.coach;
        else tm.players[tg.pi].photo = out.player;
        renderStudio(); saveDraft();
      }).catch(function () { msg(t("msg.imgbad"), "err"); });
    });

    var armed = 0;
    $("#clear").addEventListener("click", function (e) {
      var b = e.currentTarget;
      if (!armed) { armed = setTimeout(function () { armed = 0; b.textContent = t("st.clear"); }, 3000); b.textContent = t("st.sure"); return; }
      clearTimeout(armed); armed = 0; b.textContent = t("st.clear");
      S = freshState(); cur = -1; curP = 0; renderStudio(); saveDraft(); msg(t("msg.cleared"), "ok");
    });
    $("#download").addEventListener("click", exportMod);
  }

  // ---------- início ----------
  function start() {
    var q = (location.search.match(/[?&]lang=(pt|en|es)/) || [])[1], saved = null;
    try { saved = localStorage.getItem("futiba-lang"); } catch (e) {}
    wire();
    setLang(q || saved || "pt");
    var hash = (location.hash || "").replace("#", "");
    go(["get", "studio", "ai", "install", "limits"].indexOf(hash) >= 0 ? hash : "get", false);
    ensureBase();
    idb().then(loadDraft).then(function (d) {
      if (d && d.teams) {
        ensureBase().then(function () {
          S = { mod: d.mod || freshState().mod, teams: d.teams };
          cur = S.teams.length ? 0 : -1; renderStudio();
        });
      }
    });
  }
  start();
})();
