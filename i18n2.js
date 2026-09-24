/* ============================================================
   FUTIBA — idiomas da página (PT padrão · EN · ES)
   O HTML já vem em português. Este script troca textos
   (data-i18n = innerHTML, data-i18n-alt = alt, data-i18n-aria =
   aria-label), imagens com texto (data-src-lang) e links por
   idioma (data-href-lang). Escolha: ?lang=xx, depois a última
   escolha salva; sem nada, português.
   ============================================================ */
(function () {
  "use strict";

  var META = {
    pt: {
      html: "pt-BR",
      title: "FUTIBA — futebol 16-bit, do jeito que era bom",
      desc: "FUTIBA é uma carta de amor ao futebol raiz dos videogames. Pixel art 320×240, 32 equipes, 12 estádios, copa, campeonato, pênaltis, futsal e paredão. Demo grátis para PC e Android."
    },
    en: {
      html: "en",
      title: "FUTIBA — 16-bit football, the way it used to be",
      desc: "FUTIBA is a love letter to old-school videogame football. 320×240 pixel art, 32 teams, 12 stadiums, cup, championship, penalties, futsal and wall mode. Free demo for PC and Android."
    },
    es: {
      html: "es",
      title: "FUTIBA — fútbol 16-bit, como era antes",
      desc: "FUTIBA es una carta de amor al fútbol de los videojuegos de antes. Pixel art 320×240, 32 equipos, 12 estadios, copa, campeonato, penales, fútsal y paredón. Demo gratis para PC y Android."
    }
  };

  var T = {
    en: {
      "skip": "Skip to content",
      "nav.campo": "On the pitch", "nav.estadios": "Stadiums", "nav.indoor": "Futsal &amp; Wall",
      "nav.equipes": "Teams", "nav.bolso": "Pocket", "nav.manual": "Manual", "nav.baixar": "Download",
      "cover.alt": "FUTIBA title screen: two pixel-art players fighting for the ball in a packed stadium, with the FUTIBA logo on top.",
      "cover.free": "FREE",
      "cover.eyebrow": "FUTIBA Almanac · Issue #2 · Demo version",
      "cover.title": "16-bit football,<br>the way it<br>used to be",
      "cover.lede": "A love letter to old-school videogame football. Top-down camera, shots from outside the box, a goal scream straight out of a tube TV. <strong>320×240 pixels</strong> and no shame at all.",
      "cover.cta": "Download the demo", "cover.cta2": "Game manual",
      "cover.ticker_label": "Game summary",
      "tk.1": "32 teams", "tk.2": "12 stadiums", "tk.3": "Cup", "tk.4": "Championship", "tk.5": "Penalties", "tk.6": "Futsal", "tk.7": "Wall mode",
      "pg.1": "P. 1", "pg.1b": "P. 1½", "pg.2": "P. 2", "pg.3": "P. 3", "pg.4": "P. 4", "pg.5": "P. 5", "pg.6": "P. 6",
      "pg.7": "P. 7", "pg.8": "P. 8", "pg.9": "P. 9", "pg.10": "P. 10", "pg.11": "P. 11",
      "alb.eyebrow": "Straight from the tube", "alb.head": "The sticker album",
      "alb.deck": "Everything here is a <strong>real capture of the game running</strong>. No promo art: it is exactly what shows up on your screen.",
      "alb.1": "Superclásico at night, with the crowd right on top.",
      "alb.1.alt": "Real FUTIBA capture: Boca vs River at night, with the blue and gold stand and the fan banners at the top of the screen.",
      "alb.2": "Maracanã: the camera rises before kick-off.",
      "alb.2.alt": "Real capture of the FUTIBA opening at the Maracanã: packed stand, flags, flares and Christ the Redeemer in the background.",
      "alb.3": "Tokyo, rainy night.",
      "alb.3.alt": "Real FUTIBA capture: night match in the rain in Tokyo, wet pitch and boards in Japanese.",
      "alb.4": "Dirt pitch: muddy boots and a bouncing ball.",
      "alb.4.alt": "Real FUTIBA capture: match on a dirt pitch, with the crowd right by the fence.",
      "alb.5": "GOAL! One team celebrates, the other holds its head.",
      "alb.5.alt": "Real FUTIBA capture at the moment of a goal: GOAL! sign, the scorer's portrait and players celebrating near the box.",
      "alb.6": "Futsal: wooden court and a full arena.",
      "alb.6.alt": "Real capture of FUTIBA futsal: wooden court, goalkeeper in goal and the stand on the side.",
      "alb.7": "Wall mode: the bar court, at night.",
      "alb.7.alt": "Real capture of FUTIBA wall mode: night court with Bar do Zé boards and the crowd against the fence.",
      "alb.8": "On PC: TV frame and tube filter.",
      "alb.8.alt": "Real FUTIBA capture on PC with the old TV frame and the tube filter on.",
      "his.eyebrow": "The story behind it", "his.head": "Why FUTIBA exists",
      "his.b1": "FUTIBA is a <strong>love letter to old-school videogame football</strong>. Pixels on screen, ball at your feet and that goal you still remember.",
      "his.b2": "It is still in development. This is the <strong>demo</strong>, made for you to play and pass around. The final version is coming soon.",
      "his.refs": "Where the idea came from",
      "his.r1": "The way it plays: top-down camera, reading the pitch, rhythm. The mother reference.",
      "his.r2": "Arcade excess. Presentation, personality, impact when the goal goes in.",
      "his.r3t": "Almanacs and sticker albums",
      "his.r3": "Portrait line-ups, official team photo, league table. The magazine became the menu.",
      "cam.eyebrow": "The ref blows the whistle", "cam.head": "What happens on the pitch",
      "cam.deck": "Its own match engine, made in Godot, with the quirks of old videogame football, and a few the old ones never had.",
      "cam.c1t": "Match", "cam.c1h": "Truly pixel-perfect",
      "cam.c1": "Internal 320×240 resolution, integer scaling, no blur. Keyboard or controller on PC, touch or controller on Android.",
      "cam.c2t": "Cup", "cam.c2h": "Knockout of 8 or 16",
      "cam.c2": "Bracket, single match and penalties when it ends level. Lose and you're out.",
      "cam.c3t": "Championship", "cam.c3h": "Round robin, 15 rounds",
      "cam.c3": "16 clubs, full table, top scorers and cards. Every club has its own save.",
      "cam.c4t": "Referee", "cam.c4h": "The card comes walking",
      "cam.c4": "The referee walks to the foul before showing the card. Go in too hard and the medic comes in with the stretcher.",
      "cam.c5t": "Goal", "cam.c5h": "Party and heartbreak",
      "cam.c5": "The scorer celebrates, the teammates join in and the rivals lament. Then comes the replay.",
      "cam.c6t": "Weather", "cam.c6h": "Day, sunset, night and rain",
      "cam.c6": "Time and weather change the look of the stadium. The same pitch never feels like the same match.",
      "cam.s1": "A sunny classic, ball at your feet and radar on.",
      "cam.s1.alt": "Real FUTIBA capture: Barcelona vs Real Madrid on a sunny day, with the boards and the colourful stand at the top.",
      "cam.s2": "Coin toss in the centre circle, before kick-off.",
      "cam.s2.alt": "Real capture of the FUTIBA coin toss: two golden coins over the centre circle, with the captains and the referee.",
      "est.eyebrow": "Home ground", "est.head": "Twelve stadiums",
      "est.deck": "Each one with its own crowd, its own boards and its own sky.",
      "est.tokio": "Tokyo", "est.terrao": "Dirt pitch",
      "est.more": "Plus Olímpico, Mooca, Milan and Africa.",
      "ind.eyebrow": "Indoor mode", "ind.head": "Futsal &amp; Wall",
      "ind.deck": "When the pitch feels too big, the kickabout moves to the court.",
      "ind.f.tag": "Futsal", "ind.f.h": "4 outfield + 1 in goal",
      "ind.f.1": "Kick-ins taken with the foot", "ind.f.2": "The team's 6th foul becomes a penalty",
      "ind.f.3": "Sweeper keeper for the all-or-nothing push",
      "ind.f.alt": "Real capture of FUTIBA futsal: wooden court, colourful boards and the arena crowd.",
      "ind.p.tag": "Wall mode", "ind.p.h": "3 outfield + 1 in goal",
      "ind.p.1": "The ball bounces off the wall: no throw-ins", "ind.p.2": "First to 5 goals wins",
      "ind.p.3": "Rolling substitutions, with the ball in play",
      "ind.p.alt": "Real capture of FUTIBA wall mode: the bar's night court, with the FUTIBA logo in the centre circle.",
      "eq.eyebrow": "Pick the team", "eq.head": "The teams",
      "eq.deck": "32 playable teams, each with a full squad, formation, playing style and a hand-drawn portrait for every player. No generic silhouettes.",
      "eq.s1": "Team select: coach, the starting eleven, ratings and formation.",
      "eq.s1.alt": "Real capture of FUTIBA team select: coach, the eleven in numbered portraits, ratings and formation.",
      "eq.s2": "Line-up: change the formation and swap in the bench.",
      "eq.s2.alt": "Real capture of the FUTIBA line-up: mini pitch with the numbers, the bench and the goalkeeper's ratings.",
      "eq.facts": "What every team carries",
      "eq.f1": "Full squad, starters and substitutes", "eq.f2": "Individual portrait for every player and the coach",
      "eq.f3": "Attack, defence, pace and technique ratings", "eq.f4": "Its own formation, from 3-5-2 to 4-2-4",
      "eq.f5": "Kit applied to the players and the goalkeeper in real time",
      "eq.secret_tag": "Secret",
      "eq.secret": "Win the Cup or the Championship and two hidden teams show up on the list. Anyone who played videogames in the 90s knows there is always a code.",
      "vid.eyebrow": "On the small screen", "vid.soon": "Coming soon",
      "vid.p": "The gameplay video is being recorded. Meanwhile, download the demo and make your own.",
      "bol.eyebrow": "Away game", "bol.head": "FUTIBA in your pocket",
      "bol.deck": "There is a version for every way of playing: PC, phone with touch and retro handheld with real buttons.",
      "bol.photo.alt": "FUTIBA running on a retro handheld console.",
      "bol.cap": "FUTIBA running on a retro handheld, with real buttons.",
      "bol.facts": "Made to fit",
      "bol.f1": "On the phone, the buttons sit on the black bars at the sides: the pitch stays clear",
      "bol.f2": "The button that moves the screen forward lights up in gold",
      "bol.f3": "Handheld with a controller: play straight on the buttons, nothing on screen",
      "bol.f4": "Same game, same modes, nothing cut",
      "man.eyebrow": "Read before kick-off", "man.head": "Game manual",
      "man.deck": "Every command, screen by screen: keyboard and controller on PC, touch and controller on Android. The modes, the futsal and wall rules, and what each button does.",
      "man.read": "Read the manual", "man.pdf": "Download PDF",
      "man.alt": "FUTIBA main menu with the game modes.",
      "dl.eyebrow": "No cost, no sign-up",
      "dl.deck": "Version in development. Things will change, bugs will show up, and that is exactly why it is here.",
      "dl.pc": ".zip file · unzip it and open the executable. Keyboard or controller.",
      "dl.go": "Download →",
      "dl.phone": "Phone", "dl.touch": "Android touch", "dl.touch_meta": ".apk file · on-screen controls, no controller needed.",
      "dl.handheld": "Handheld", "dl.pad": "Android with controller",
      "dl.pad_meta": ".apk file · for retro handhelds with physical buttons, like R36S, Anbernic, Retroid...",
      "dl.note": "<strong>Version note:</strong> FUTIBA is developed on PC first and only then adapted for Android. That is why the best experience today is the Windows version. The Android versions are playable, but they do not always follow the latest updates.",
      "dl.fine": "All three files are on Google Drive. For both .apk files, Android asks you to allow installs from unknown sources. No account, no ads, no charge.",
      "ct.eyebrow": "Complaints, praise and ideas", "ct.head": "Talk to the coach",
      "ct.deck": "Found a bug, want a team in the game, have an idea too good to keep? Send an e-mail. The same person who makes the game answers.",
      "ft.note": "Made in Brazil, with heart, in Godot. Demo in development: the final version is on its way.",
      "lb.close": "Close image"
    },
    es: {
      "skip": "Saltar al contenido",
      "nav.campo": "En la cancha", "nav.estadios": "Estadios", "nav.indoor": "Fútsal y Paredón",
      "nav.equipes": "Equipos", "nav.bolso": "De bolsillo", "nav.manual": "Manual", "nav.baixar": "Descargar",
      "cover.alt": "Pantalla de título de FUTIBA: dos jugadores en pixel art disputando la pelota en un estadio lleno, con el logo de FUTIBA arriba.",
      "cover.free": "GRATIS",
      "cover.eyebrow": "Almanaque FUTIBA · Edición n.º 2 · Versión demo",
      "cover.title": "Fútbol 16-bit,<br>como era<br>antes",
      "cover.lede": "Una carta de amor al fútbol de los videojuegos de antes. Cámara desde arriba, remate de fuera del área, grito de gol de televisor de tubo. <strong>320×240 píxeles</strong> y cero vergüenza.",
      "cover.cta": "Descargar la demo", "cover.cta2": "Manual del juego",
      "cover.ticker_label": "Resumen del juego",
      "tk.1": "32 equipos", "tk.2": "12 estadios", "tk.3": "Copa", "tk.4": "Campeonato", "tk.5": "Penales", "tk.6": "Fútsal", "tk.7": "Paredón",
      "pg.1": "Pág. 1", "pg.1b": "Pág. 1½", "pg.2": "Pág. 2", "pg.3": "Pág. 3", "pg.4": "Pág. 4", "pg.5": "Pág. 5", "pg.6": "Pág. 6",
      "pg.7": "Pág. 7", "pg.8": "Pág. 8", "pg.9": "Pág. 9", "pg.10": "Pág. 10", "pg.11": "Pág. 11",
      "alb.eyebrow": "Directo del tubo", "alb.head": "El álbum de figuritas",
      "alb.deck": "Todo aquí es <strong>captura real del juego funcionando</strong>. Nada de arte promocional: es exactamente lo que aparece en tu pantalla.",
      "alb.1": "Superclásico de noche, con la hinchada encima.",
      "alb.1.alt": "Captura real de FUTIBA: Boca vs River de noche, con la tribuna azul y oro y los trapos de la hinchada arriba de la pantalla.",
      "alb.2": "Maracaná: la cámara sube antes del pitazo.",
      "alb.2.alt": "Captura real de la apertura de FUTIBA en el Maracaná: tribuna llena, banderas, bengalas y el Cristo al fondo.",
      "alb.3": "Tokio, noche de lluvia.",
      "alb.3.alt": "Captura real de FUTIBA: partido nocturno con lluvia en Tokio, césped mojado y carteles en japonés.",
      "alb.4": "Cancha de tierra: botines sucios y pelota picando.",
      "alb.4.alt": "Captura real de FUTIBA: partido en cancha de tierra, con la gente pegada al alambrado.",
      "alb.5": "¡GOL! Un equipo festeja, el otro se agarra la cabeza.",
      "alb.5.alt": "Captura real de FUTIBA en el momento del gol: cartel ¡GOL!, retrato del goleador y jugadores festejando cerca del área.",
      "alb.6": "Fútsal: piso de madera y estadio cubierto lleno.",
      "alb.6.alt": "Captura real del fútsal de FUTIBA: cancha de madera, arquero en el arco y la tribuna al costado.",
      "alb.7": "Paredón: la cancha del bar, de noche.",
      "alb.7.alt": "Captura real del paredón de FUTIBA: cancha nocturna con carteles del Bar do Zé y la gente pegada al alambrado.",
      "alb.8": "En PC: marco de TV y filtro de tubo.",
      "alb.8.alt": "Captura real de FUTIBA en PC con el marco de televisor antiguo y el filtro de tubo activados.",
      "his.eyebrow": "La historia detrás", "his.head": "Por qué existe FUTIBA",
      "his.b1": "FUTIBA es una <strong>carta de amor al fútbol de los videojuegos de antes</strong>. Píxeles en la pantalla, pelota al pie y ese gol que todavía recordás.",
      "his.b2": "Todavía está en desarrollo. Esta es la <strong>demo</strong>, hecha para que juegues y la compartas. Pronto sale la versión final.",
      "his.refs": "De dónde salió la idea",
      "his.r1": "La forma de jugar: cámara desde arriba, lectura de la cancha, ritmo. La referencia madre.",
      "his.r2": "El exceso arcade. Presentación, personalidad, impacto a la hora del gol.",
      "his.r3t": "Almanaques y álbumes de figuritas",
      "his.r3": "Formación con retratos, foto oficial del equipo, tabla de posiciones. La revista se volvió menú.",
      "cam.eyebrow": "Pita el árbitro", "cam.head": "Lo que pasa en la cancha",
      "cam.deck": "Motor de partido propio, hecho en Godot, con las mañas del fútbol de videojuego de antes, y algunas que los de antes no tenían.",
      "cam.c1t": "Partido", "cam.c1h": "Pixel-perfect de verdad",
      "cam.c1": "Resolución interna de 320×240, escala entera, sin borrones. Teclado o control en PC, táctil o control en Android.",
      "cam.c2t": "Copa", "cam.c2h": "Eliminación de 8 o 16",
      "cam.c2": "Llaves, partido único y penales si hay empate. Perdiste, se terminó.",
      "cam.c3t": "Campeonato", "cam.c3h": "Todos contra todos, 15 fechas",
      "cam.c3": "16 clubes, tabla completa, goleadores y tarjetas. Cada club tiene su propia partida guardada.",
      "cam.c4t": "Árbitro", "cam.c4h": "La tarjeta llega caminando",
      "cam.c4": "El árbitro camina hasta la falta antes de mostrar la tarjeta. Una entrada muy fuerte y entra el médico con la camilla.",
      "cam.c5t": "Gol", "cam.c5h": "Festejo y lamento",
      "cam.c5": "El goleador festeja, los compañeros se suman y el rival se lamenta. Después viene la repetición.",
      "cam.c6t": "Clima", "cam.c6h": "Día, tarde, noche y lluvia",
      "cam.c6": "La hora y el tiempo cambian la cara del estadio. La misma cancha nunca parece el mismo partido.",
      "cam.s1": "Clásico al sol, pelota al pie y radar encendido.",
      "cam.s1.alt": "Captura real de FUTIBA: Barcelona vs Real Madrid en un día de sol, con los carteles y la tribuna de colores arriba.",
      "cam.s2": "Cara o cruz en el círculo central, antes de que ruede la pelota.",
      "cam.s2.alt": "Captura real del cara o cruz de FUTIBA: dos monedas doradas sobre el círculo central, con los capitanes y el árbitro.",
      "est.eyebrow": "De local", "est.head": "Doce estadios",
      "est.deck": "Cada uno con su hinchada, sus carteles y su cielo.",
      "est.tokio": "Tokio", "est.terrao": "Cancha de tierra",
      "est.more": "Y también Olímpico, Mooca, Milán y África.",
      "ind.eyebrow": "Modo indoor", "ind.head": "Fútsal y Paredón",
      "ind.deck": "Cuando la cancha queda grande, el picado se muda al piso.",
      "ind.f.tag": "Fútsal", "ind.f.h": "4 de campo + 1 portero",
      "ind.f.1": "Saque de banda con el pie", "ind.f.2": "La 6.ª falta del equipo es penal",
      "ind.f.3": "Portero-líbero para ir a todo o nada",
      "ind.f.alt": "Captura real del fútsal de FUTIBA: cancha de madera, carteles de colores y la hinchada del estadio cubierto.",
      "ind.p.tag": "Paredón", "ind.p.h": "3 de campo + 1 portero",
      "ind.p.1": "La pelota rebota en la pared: no hay saque de banda", "ind.p.2": "Gana el primero en hacer 5 goles",
      "ind.p.3": "Cambios con la pelota en juego",
      "ind.p.alt": "Captura real del paredón de FUTIBA: la cancha nocturna del bar, con el logo de FUTIBA en el círculo central.",
      "eq.eyebrow": "Armá el equipo", "eq.head": "Los equipos",
      "eq.deck": "32 equipos jugables, cada uno con plantel completo, formación, estilo de juego y un retrato dibujado para cada jugador. Nada de siluetas genéricas.",
      "eq.s1": "Selección de equipo: técnico, los once, atributos y esquema.",
      "eq.s1.alt": "Captura real de la selección de equipo de FUTIBA: técnico, los once en retratos numerados, atributos y formación.",
      "eq.s2": "Alineación: cambiá el esquema y meté a los del banco.",
      "eq.s2.alt": "Captura real de la alineación de FUTIBA: canchita con los números, el banco y los atributos del arquero.",
      "eq.facts": "Lo que trae cada equipo",
      "eq.f1": "Plantel completo, titulares y suplentes", "eq.f2": "Retrato individual de cada jugador y del técnico",
      "eq.f3": "Atributos de ataque, defensa, velocidad y técnica", "eq.f4": "Formación propia, del 3-5-2 al 4-2-4",
      "eq.f5": "Camiseta aplicada a los jugadores y al arquero en tiempo real",
      "eq.secret_tag": "Secreto",
      "eq.secret": "Ganá la Copa o el Campeonato y aparecen dos equipos escondidos en la lista. Quien jugaba videojuegos en los 90 sabe que siempre hay un código.",
      "vid.eyebrow": "En la pantallita", "vid.soon": "Muy pronto",
      "vid.p": "El video de gameplay se está grabando. Mientras tanto, descargá la demo y hacé el tuyo.",
      "bol.eyebrow": "De visitante", "bol.head": "FUTIBA de bolsillo",
      "bol.deck": "Hay una versión para cada forma de jugar: PC, celular táctil y portátil retro con botones de verdad.",
      "bol.photo.alt": "FUTIBA funcionando en una consola portátil retro.",
      "bol.cap": "FUTIBA funcionando en una portátil retro, con botones físicos.",
      "bol.facts": "Hecho para entrar",
      "bol.f1": "En el celular, los botones van en las franjas negras de los costados: la cancha queda libre",
      "bol.f2": "El botón que avanza la pantalla se ilumina en dorado",
      "bol.f3": "Portátil con control: jugás directo con los botones, nada en pantalla",
      "bol.f4": "Mismo juego, mismos modos, sin recortes",
      "man.eyebrow": "Leé antes del pitazo", "man.head": "Manual del juego",
      "man.deck": "Todos los comandos, pantalla por pantalla: teclado y control en PC, táctil y control en Android. Los modos, las reglas del fútsal y del paredón, y qué hace cada botón.",
      "man.read": "Leer el manual", "man.pdf": "Descargar PDF",
      "man.alt": "Menú principal de FUTIBA con los modos de juego.",
      "dl.eyebrow": "Sin costo, sin registro",
      "dl.deck": "Versión en desarrollo. Las cosas van a cambiar, van a aparecer bugs, y justamente por eso está acá.",
      "dl.pc": "Archivo .zip · descomprimí y abrí el ejecutable. Teclado o control.",
      "dl.go": "Descargar →",
      "dl.phone": "Celular", "dl.touch": "Android táctil", "dl.touch_meta": "Archivo .apk · controles en pantalla, sin necesidad de control.",
      "dl.handheld": "Portátil", "dl.pad": "Android con control",
      "dl.pad_meta": "Archivo .apk · para portátiles retro con botones físicos, tipo R36S, Anbernic, Retroid...",
      "dl.note": "<strong>Nota de versión:</strong> FUTIBA se desarrolla primero en PC y recién después se adapta a Android. Por eso hoy la mejor experiencia es la versión de Windows. Las versiones de Android se pueden jugar, pero no siempre siguen las últimas actualizaciones.",
      "dl.fine": "Los tres archivos están en Google Drive. En los dos .apk, Android pide permitir la instalación de fuentes desconocidas. Sin cuenta, sin publicidad, sin cobro.",
      "ct.eyebrow": "Quejas, elogios e ideas", "ct.head": "Hablá con el técnico",
      "ct.deck": "¿Encontraste un bug, querés un equipo en el juego, tenés una idea demasiado buena para guardarla? Mandá un e-mail. Responde la misma persona que hace el juego.",
      "ft.note": "Hecho en Brasil, a pulmón, en Godot. Demo en desarrollo: la versión final está en camino.",
      "lb.close": "Cerrar imagen"
    }
  };

  var LANGS = ["pt", "en", "es"];
  var PT = {};   // textos originais (português) guardados na primeira troca

  function pick() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) >= 0) return q;
    try {
      var saved = localStorage.getItem("futiba_lang");
      if (saved && LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) { /* sem storage: fica o padrão */ }
    return "pt";
  }

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function apply(lang) {
    var dict = T[lang] || {};
    each("[data-i18n]", function (el) {
      var k = el.getAttribute("data-i18n");
      if (!(k in PT)) PT[k] = el.innerHTML;
      el.innerHTML = lang === "pt" ? PT[k] : (dict[k] || PT[k]);
    });
    each("[data-i18n-alt]", function (el) {
      var k = "alt:" + el.getAttribute("data-i18n-alt");
      if (!(k in PT)) PT[k] = el.getAttribute("alt");
      el.setAttribute("alt", lang === "pt" ? PT[k] : (dict[el.getAttribute("data-i18n-alt")] || PT[k]));
    });
    each("[data-i18n-aria]", function (el) {
      var k = "aria:" + el.getAttribute("data-i18n-aria");
      if (!(k in PT)) PT[k] = el.getAttribute("aria-label");
      el.setAttribute("aria-label", lang === "pt" ? PT[k] : (dict[el.getAttribute("data-i18n-aria")] || PT[k]));
    });
    each("[data-src-lang]", function (el) {
      el.src = el.getAttribute("data-src-lang").replace("{lang}", lang);
    });
    each("[data-href-lang]", function (el) {
      el.href = el.getAttribute("data-href-lang").replace("{lang}", lang).replace("{LANG}", lang.toUpperCase());
    });
    each(".lang button", function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    var m = META[lang];
    document.documentElement.lang = m.html;
    document.title = m.title;
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute("content", m.desc);
  }

  var current = pick();
  if (current !== "pt") apply(current);

  each(".lang button", function (b) {
    b.addEventListener("click", function () {
      current = b.getAttribute("data-lang");
      try { localStorage.setItem("futiba_lang", current); } catch (e) { /* ok */ }
      apply(current);
    });
  });
})();
