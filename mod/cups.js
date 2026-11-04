/* FUTIBA MOD STUDIO: EDITOR DE COPAS (4/nov).
 * Uma copa moldável: nome, logo, taça, modalidade, número de times, quais times
 * e quais estádios. Sai um .json só ("futiba-cup", imagens dentro), que o jogo
 * importa em EDITOR > IMPORTAR COPA. O jogo tem 2 vagas para copas.
 * Tudo fica no navegador, no mesmo rascunho do estúdio.
 * Ver scripts/core... custom_cups.gd no projeto do jogo.
 */
(function () {
  "use strict";
  var ENABLED = true;
  if (!ENABLED || !window.FutibaMod) return;
  var M = window.FutibaMod;
  var SIZES = [4, 8, 16, 32], GROUP_SIZES = [8, 16, 32];
  var CUT_MAX = 3, CUT_TEXT = 90, CUT_W = 288, CUT_H = 136;
  var MODS = ["campo", "futsal", "praia", "society"];
  var GROUPS = {
    campo: ["field", "secret", "desafio", "ml", "wc"],
    futsal: ["futsal", "field"],
    praia: ["beach"],
    society: ["society"]
  };
  var NAME_MAX = 24, LOGO = 48, TROPHY = [32, 40];
  var BASE = null, cur = 0, filter = "";

  var TX = {
    pt: {
      menu: "COPAS", title: "COPAS",
      intro: "MONTE A SUA COPA: ESCOLHA O NOME, A MODALIDADE, O FORMATO, QUANTOS TIMES JOGAM E QUAIS. SE QUISER, CRIE AS CENAS DE ABERTURA E DE CAMPEÃO. O JOGO TEM 2 VAGAS PARA COPAS. TEMPO DE PARTIDA E DIFICULDADE CONTINUAM VINDO DO JOGO.",
      how: "COMO LEVAR PARA O JOGO: 1) APERTE \"BAIXAR COPA\" (SAI UM .ZIP; NÃO PRECISA ABRIR). 2) PC: PONHA O .ZIP NA PASTA MOD, AO LADO DO JOGO. ANDROID: DEIXE O .ZIP NO CELULAR. 3) NO JOGO: EDITOR > IMPORTAR COPA, ESCOLHA O ARQUIVO (NO ANDROID, ESCOLHER ARQUIVO) E APERTE A. A COPA APARECE EM COPAS > MINHAS COPAS.",
      mine: "SEUS TIMES NOVOS (DO CRIAR MOD)", ids_h: "TIME DO JOGO QUE VOCÊ EDITOU CONTINUA COM O MESMO ID: É SÓ MARCAR ELE NA LISTA, E ELE ENTRA COM AS SUAS MUDANÇAS. TIME NOVO DO SEU MOD APARECE EM \"SEUS TIMES NOVOS\". TIME DE OUTRA PESSOA: COLE O ID ABAIXO. NO JOGO, O TIME NOVO PRECISA ESTAR IMPORTADO; SE FALTAR, O JOGO COMPLETA COM OUTRO TIME.", byid: "ADICIONAR POR ID", add: "ADICIONAR",
      stage: "FORMATO", s_knockout: "MATA-MATA DIRETO", s_groups: "GRUPOS + MATA-MATA", n_groups: "GRUPOS", h_knockout: "QUEM PERDE SAI. EMPATE VAI PARA OS PÊNALTIS.", h_groups: "GRUPOS DE 4, 3 JOGOS CADA. VITÓRIA VALE 3, EMPATE VALE 1. OS 2 PRIMEIROS DE CADA GRUPO VÃO PARA O MATA-MATA.", cut_intro: "CENA DE ABERTURA (OPCIONAL)", cut_ending: "CENA DE CAMPEÃO (OPCIONAL)", cut_h: "ATÉ 3 QUADROS. CADA UM TEM IMAGEM E TEXTO. A IMAGEM APARECE EM 288 X 136 (O ESTÚDIO CORTA SOZINHO). O TEXTO APARECE IGUAL EM QUALQUER LÍNGUA DO JOGO. QUADRO VAZIO NÃO ENTRA.", quad: "QUADRO {n}", cut_t: "TEXTO",
      slot: "VAGA {n}", name: "NOME DA COPA", modality: "MODALIDADE", size: "NÚMERO DE TIMES",
      m_campo: "CAMPO", m_futsal: "FUTSAL", m_praia: "AREIA", m_society: "SOCIETY",
      teams: "TIMES", teams_n: "ESCOLHIDOS: {n} (PRECISA DE PELO MENOS {s})",
      teams_h: "SE VOCÊ ESCOLHER MAIS TIMES DO QUE O NÚMERO DA COPA, CADA CAMPANHA SORTEIA QUEM ENTRA.",
      search: "PROCURAR TIME", all: "MARCAR TODOS", none: "DESMARCAR TODOS",
      stadiums: "ESTÁDIOS", stadiums_h: "SÓ NO CAMPO. CADA JOGO SORTEIA UM DOS MARCADOS. SEM NENHUM, O JOGO SORTEIA ENTRE OS DELE. ESTÁDIO NOVO QUE NÃO ESTIVER IMPORTADO NO JOGO VIRA UM ESTÁDIO PADRÃO.",
      vaga: "VAGA DE ESTÁDIO {n}", logo: "LOGO DA COPA (PNG, ATÉ 48X48)", trophy: "TAÇA (PNG, ATÉ 32X40)",
      pick: "ESCOLHER IMAGEM", rm: "TIRAR", dl: "BAIXAR COPA",
      e_name: "DÊ UM NOME À COPA.", e_teams: "ESCOLHA PELO MENOS {s} TIMES.", ok: "ARQUIVO {f} BAIXADO."
    },
    en: {
      menu: "CUPS", title: "CUPS",
      intro: "BUILD YOUR CUP: PICK THE NAME, THE MODE, THE FORMAT, HOW MANY TEAMS AND WHICH ONES. IF YOU WANT, CREATE THE OPENING AND CHAMPION SCENES. THE GAME HAS 2 CUP SLOTS. MATCH LENGTH AND DIFFICULTY STILL COME FROM THE GAME.",
      how: "HOW TO USE IT: 1) PRESS \"DOWNLOAD CUP\" (YOU GET A .ZIP; NO NEED TO OPEN IT). 2) PC: PUT THE .ZIP IN THE MOD FOLDER, NEXT TO THE GAME. ANDROID: KEEP THE .ZIP ON THE PHONE. 3) IN THE GAME: EDITOR > IMPORT CUP, PICK THE FILE (ON ANDROID, PICK FILE) AND PRESS A. THE CUP SHOWS UP IN CUPS > MY CUPS.",
      mine: "YOUR NEW TEAMS (FROM CREATE MOD)", ids_h: "A GAME TEAM YOU EDITED KEEPS THE SAME ID: JUST PICK IT ON THE LIST AND IT COMES WITH YOUR CHANGES. NEW TEAMS FROM YOUR MOD SHOW UP IN \"YOUR NEW TEAMS\". SOMEONE ELSE'S TEAM: PASTE THE ID BELOW. IN THE GAME, THE NEW TEAM MUST BE IMPORTED; IF IT IS MISSING, THE GAME FILLS IN ANOTHER TEAM.", byid: "ADD BY ID", add: "ADD",
      stage: "FORMAT", s_knockout: "STRAIGHT KNOCKOUT", s_groups: "GROUPS + KNOCKOUT", n_groups: "GROUPS", h_knockout: "LOSERS GO HOME. A DRAW GOES TO PENALTIES.", h_groups: "GROUPS OF 4, 3 MATCHES EACH. A WIN IS WORTH 3, A DRAW 1. THE TOP 2 OF EACH GROUP REACH THE KNOCKOUT.", cut_intro: "OPENING SCENE (OPTIONAL)", cut_ending: "CHAMPION SCENE (OPTIONAL)", cut_h: "UP TO 3 PANELS. EACH HAS AN IMAGE AND A TEXT. THE IMAGE SHOWS AT 288 X 136 (THE STUDIO CROPS IT). THE TEXT SHOWS THE SAME IN ANY GAME LANGUAGE. EMPTY PANELS ARE SKIPPED.", quad: "PANEL {n}", cut_t: "TEXT",
      slot: "SLOT {n}", name: "CUP NAME", modality: "MODE", size: "NUMBER OF TEAMS",
      m_campo: "FIELD", m_futsal: "FUTSAL", m_praia: "SAND", m_society: "SOCIETY",
      teams: "TEAMS", teams_n: "PICKED: {n} (NEEDS AT LEAST {s})",
      teams_h: "IF YOU PICK MORE TEAMS THAN THE CUP SIZE, EACH CAMPAIGN DRAWS WHO GETS IN.",
      search: "SEARCH TEAM", all: "SELECT ALL", none: "CLEAR ALL",
      stadiums: "STADIUMS", stadiums_h: "FIELD ONLY. EACH MATCH DRAWS ONE OF THE PICKED ONES. WITH NONE, THE GAME DRAWS FROM ITS OWN. A NEW STADIUM NOT IMPORTED IN THE GAME BECOMES A DEFAULT ONE.",
      vaga: "STADIUM SLOT {n}", logo: "CUP LOGO (PNG, UP TO 48X48)", trophy: "TROPHY (PNG, UP TO 32X40)",
      pick: "PICK IMAGE", rm: "REMOVE", dl: "DOWNLOAD CUP",
      e_name: "GIVE THE CUP A NAME.", e_teams: "PICK AT LEAST {s} TEAMS.", ok: "FILE {f} DOWNLOADED."
    },
    es: {
      menu: "COPAS", title: "COPAS",
      intro: "ARMA TU COPA: ELIGE EL NOMBRE, LA MODALIDAD, EL FORMATO, CUÁNTOS EQUIPOS Y CUÁLES. SI QUIERES, CREA LAS ESCENAS DE APERTURA Y DE CAMPEÓN. EL JUEGO TIENE 2 CUPOS PARA COPAS. EL TIEMPO DE PARTIDO Y LA DIFICULTAD SIGUEN VINIENDO DEL JUEGO.",
      how: "CÓMO LLEVARLA AL JUEGO: 1) PULSA \"DESCARGAR COPA\" (SALE UN .ZIP; NO HACE FALTA ABRIRLO). 2) PC: PON EL .ZIP EN LA CARPETA MOD, AL LADO DEL JUEGO. ANDROID: DEJA EL .ZIP EN EL TELÉFONO. 3) EN EL JUEGO: EDITOR > IMPORTAR COPA, ELIGE EL ARCHIVO (EN ANDROID, ELEGIR ARCHIVO) Y PULSA A. LA COPA APARECE EN COPAS > MIS COPAS.",
      mine: "TUS EQUIPOS NUEVOS (DE CREAR MOD)", ids_h: "UN EQUIPO DEL JUEGO QUE EDITASTE SIGUE CON EL MISMO ID: SOLO MÁRCALO EN LA LISTA Y ENTRA CON TUS CAMBIOS. LOS EQUIPOS NUEVOS DE TU MOD APARECEN EN \"TUS EQUIPOS NUEVOS\". EQUIPO DE OTRA PERSONA: PEGA EL ID ABAJO. EN EL JUEGO, EL EQUIPO NUEVO DEBE ESTAR IMPORTADO; SI FALTA, EL JUEGO COMPLETA CON OTRO EQUIPO.", byid: "AGREGAR POR ID", add: "AGREGAR",
      stage: "FORMATO", s_knockout: "ELIMINATORIA DIRECTA", s_groups: "GRUPOS + ELIMINATORIA", n_groups: "GRUPOS", h_knockout: "QUIEN PIERDE SE VA. EL EMPATE VA A PENALES.", h_groups: "GRUPOS DE 4, 3 PARTIDOS CADA UNO. LA VICTORIA VALE 3, EL EMPATE 1. LOS 2 PRIMEROS DE CADA GRUPO PASAN A LA ELIMINATORIA.", cut_intro: "ESCENA DE APERTURA (OPCIONAL)", cut_ending: "ESCENA DE CAMPEÓN (OPCIONAL)", cut_h: "HASTA 3 CUADROS. CADA UNO TIENE IMAGEN Y TEXTO. LA IMAGEN APARECE EN 288 X 136 (EL ESTUDIO LA RECORTA). EL TEXTO APARECE IGUAL EN CUALQUIER IDIOMA DEL JUEGO. EL CUADRO VACÍO NO ENTRA.", quad: "CUADRO {n}", cut_t: "TEXTO",
      slot: "CUPO {n}", name: "NOMBRE DE LA COPA", modality: "MODALIDAD", size: "NÚMERO DE EQUIPOS",
      m_campo: "CAMPO", m_futsal: "FUTSAL", m_praia: "ARENA", m_society: "SOCIETY",
      teams: "EQUIPOS", teams_n: "ELEGIDOS: {n} (NECESITA AL MENOS {s})",
      teams_h: "SI ELIGES MÁS EQUIPOS QUE EL NÚMERO DE LA COPA, CADA CAMPAÑA SORTEA QUIÉN ENTRA.",
      search: "BUSCAR EQUIPO", all: "MARCAR TODOS", none: "DESMARCAR TODOS",
      stadiums: "ESTADIOS", stadiums_h: "SOLO EN CAMPO. CADA PARTIDO SORTEA UNO DE LOS MARCADOS. SIN NINGUNO, EL JUEGO SORTEA ENTRE LOS SUYOS. UN ESTADIO NUEVO QUE NO ESTÉ IMPORTADO EN EL JUEGO SE VUELVE UNO ESTÁNDAR.",
      vaga: "CUPO DE ESTADIO {n}", logo: "LOGO DE LA COPA (PNG, HASTA 48X48)", trophy: "TROFEO (PNG, HASTA 32X40)",
      pick: "ELEGIR IMAGEN", rm: "QUITAR", dl: "DESCARGAR COPA",
      e_name: "PONLE UN NOMBRE A LA COPA.", e_teams: "ELIGE AL MENOS {s} EQUIPOS.", ok: "ARCHIVO {f} DESCARGADO."
    }
  };
  function tx(k, v) {
    var s = (TX[M.lang()] || TX.pt)[k] || TX.pt[k] || k;
    if (v) Object.keys(v).forEach(function (n) { s = s.replace("{" + n + "}", v[n]); });
    return s;
  }
  function esc(v) { return M.esc(v); }
  function blankCut() { var a = []; for (var i = 0; i < CUT_MAX; i++) a.push({ img: "", text: "" }); return a; }
  function fresh() { return { name: "", modality: "campo", stage: "knockout", size: 8, teams: [], stadiums: [], logo: "", trophy: "", intro: blankCut(), ending: blankCut() }; }
  function cups() {
    var S = M.state();
    if (!S.cups) S.cups = [fresh(), fresh()];
    S.cups.forEach(function (c) {
      if (!c.stage) c.stage = "knockout";
      if (!c.intro) c.intro = blankCut();
      if (!c.ending) c.ending = blankCut();
    });
    return S.cups;
  }
  function changed() { M.save(); render(); }

  function loadBase() {
    if (BASE) return Promise.resolve(BASE);
    return fetch("/mod/base/base.json").then(function (r) { return r.json(); }).then(function (b) { BASE = b; return b; });
  }
  function teamsFor(mod) {
    var g = GROUPS[mod];
    return BASE.teams.filter(function (t) { return g.indexOf(t.group) >= 0; });
  }
  // times novos do rascunho do estúdio (CRIAR MOD)
  function myTeams() {
    return (M.state().teams || []).filter(function (t) { return /^mod_/.test(t.id || ""); });
  }
  function teamName(id) {
    var mine = myTeams().filter(function (t) { return t.id === id; })[0];
    if (mine) return mine.name;
    var b = BASE.teams.filter(function (t) { return t.id === id; })[0];
    return b ? b.name : id;
  }
  function stadiumList() {
    var out = (BASE.stadiums || []).slice();
    var mine = M.state().stadiums || {};
    ["ghost1", "ghost2", "ghost3", "ghost4", "ghost5"].forEach(function (s, i) {
      var d = mine[s];
      out.push({ id: s, name: d && d.name ? d.name : tx("vaga", { n: i + 1 }) });
    });
    return out;
  }

  function render() {
    var box = document.getElementById("cups-ed"); if (!box) return;
    var li = document.getElementById("menu-cups");
    if (li) { li.hidden = false; li.querySelector("button").textContent = tx("menu"); }
    if (!BASE) { loadBase().then(render); return; }
    var all = cups(), c = all[cur];
    var h = '<div class="banner">' + esc(tx("title")) + "</div><p>" + esc(tx("intro")) + "</p><p>" + esc(tx("how")) + "</p>";
    h += '<div class="chips">' + all.map(function (x, i) {
      return '<button type="button" class="chip' + (i === cur ? " on" : "") + '" data-cslot="' + i + '">' + esc(tx("slot", { n: i + 1 }) + (x.name ? ": " + x.name : "")) + "</button>";
    }).join("") + "</div>";
    h += '<label class="f" style="margin-top:10px"><span>' + esc(tx("name")) + ' <span class="c">' + c.name.length + "/" + NAME_MAX + '</span></span><input type="text" maxlength="' + NAME_MAX + '" data-cname value="' + esc(c.name) + '"></label>';
    h += '<h3>' + esc(tx("modality")) + '</h3><div class="chips">' + MODS.map(function (m) {
      return '<button type="button" class="chip' + (c.modality === m ? " on" : "") + '" data-cmod="' + m + '">' + esc(tx("m_" + m)) + "</button>";
    }).join("") + "</div>";
    h += '<h3>' + esc(tx("stage")) + '</h3><div class="chips">' + ["knockout", "groups"].map(function (f) {
      return '<button type="button" class="chip' + (c.stage === f ? " on" : "") + '" data-cstage="' + f + '">' + esc(tx("s_" + f)) + "</button>";
    }).join("") + '</div><p class="dim" style="font-size:8px">' + esc(tx("h_" + c.stage)) + "</p>";
    h += '<h3>' + esc(tx("size")) + '</h3><div class="chips">' + (c.stage === "groups" ? GROUP_SIZES : SIZES).map(function (s) {
      return '<button type="button" class="chip' + (c.size === s ? " on" : "") + '" data-csize="' + s + '">' + s + (c.stage === "groups" ? " (" + (s / 4) + " " + tx("n_groups") + ")" : "") + "</button>";
    }).join("") + "</div>";
    var ts = teamsFor(c.modality), q = filter.toUpperCase();
    h += "<h3>" + esc(tx("teams")) + '</h3><p class="dim" style="font-size:8px">' + esc(tx("teams_n", { n: c.teams.length, s: c.size })) + " " + esc(tx("teams_h")) + "</p>";
    h += '<div class="bar"><label class="f"><span>' + esc(tx("search")) + '</span><input type="text" data-cfind value="' + esc(filter) + '"></label>' +
      '<button type="button" class="btn btn--small" data-call>' + esc(tx("all")) + '</button><button type="button" class="btn btn--small" data-cnone>' + esc(tx("none")) + "</button></div>";
    var mine = myTeams(), known = {};
    ts.concat(mine).forEach(function (t) { known[t.id] = 1; });
    var extra = c.teams.filter(function (id) { return !known[id]; });
    if (mine.length || extra.length) {
      h += '<p style="font-size:8px;margin:8px 0 4px">' + esc(tx("mine")) + '</p><div class="chips">' +
        mine.map(function (t) { return '<button type="button" class="chip' + (c.teams.indexOf(t.id) >= 0 ? " on" : "") + '" data-cteam="' + esc(t.id) + '">' + esc(t.name) + "</button>"; }).join("") +
        extra.map(function (id) { return '<button type="button" class="chip on" data-cteam="' + esc(id) + '">' + esc(id) + "</button>"; }).join("") + "</div>";
    }
    h += '<div class="chips" style="max-height:260px;overflow:auto">' + ts.filter(function (t) { return !q || t.name.indexOf(q) >= 0; }).map(function (t) {
      return '<button type="button" class="chip' + (c.teams.indexOf(t.id) >= 0 ? " on" : "") + '" data-cteam="' + esc(t.id) + '">' + esc(t.name) + "</button>";
    }).join("") + "</div>";
    h += '<p class="dim" style="font-size:8px;margin-top:8px">' + esc(tx("ids_h")) + "</p>";
    h += '<div class="bar"><label class="f"><span>' + esc(tx("byid")) + '</span><input type="text" data-cidin maxlength="24" autocomplete="off"></label>' +
      '<button type="button" class="btn btn--small" data-cidadd>' + esc(tx("add")) + "</button></div>";
    if (c.modality === "campo") {
      h += "<h3>" + esc(tx("stadiums")) + '</h3><p class="dim" style="font-size:8px">' + esc(tx("stadiums_h")) + '</p><div class="chips">' + stadiumList().map(function (s) {
        return '<button type="button" class="chip' + (c.stadiums.indexOf(s.id) >= 0 ? " on" : "") + '" data-cstad="' + esc(s.id) + '">' + esc(s.name) + "</button>";
      }).join("") + "</div>";
    }
    h += '<div class="cards" style="margin-top:12px">' + imgCard("logo", c) + imgCard("trophy", c) + "</div>";
    h += cutBlock("intro", c) + cutBlock("ending", c);
    h += '<div class="row" style="margin-top:12px"><button type="button" class="btn btn--gold" data-cdl>' + esc(tx("dl")) + "</button></div>";
    box.innerHTML = h;
  }
  function cutBlock(kind, c) {
    var h = "<h3>" + esc(tx("cut_" + kind)) + '</h3><p class="dim" style="font-size:8px">' + esc(tx("cut_h")) + '</p><div class="cards">';
    c[kind].forEach(function (q, i) {
      h += '<div class="card"><h2>' + esc(tx("quad", { n: i + 1 })) + "</h2>" +
        (q.img ? '<p><img src="' + q.img + '" alt="" style="image-rendering:pixelated;width:100%;max-width:288px"></p>' : "") +
        '<div class="row"><label class="btn btn--small">' + esc(tx("pick")) + '<input type="file" accept="image/*" hidden data-ccut="' + kind + '" data-ci="' + i + '"></label>' +
        (q.img ? '<button type="button" class="btn btn--small btn--red" data-ccutrm="' + kind + '" data-ci="' + i + '">' + esc(tx("rm")) + "</button>" : "") + "</div>" +
        '<label class="f"><span>' + esc(tx("cut_t")) + ' <span class="c">' + q.text.length + "/" + CUT_TEXT + '</span></span><input type="text" maxlength="' + CUT_TEXT + '" data-ccuttxt="' + kind + '" data-ci="' + i + '" value="' + esc(q.text) + '"></label></div>';
    });
    return h + "</div>";
  }
  // quadro de cutscene: corta para preencher 288x136
  function fitCover(file) {
    return new Promise(function (ok, no) {
      var img = new Image();
      img.onload = function () {
        var s = Math.max(CUT_W / img.width, CUT_H / img.height);
        var w = img.width * s, h = img.height * s;
        var cv = document.createElement("canvas"); cv.width = CUT_W; cv.height = CUT_H;
        var g = cv.getContext("2d"); g.imageSmoothingQuality = "high";
        g.drawImage(img, (CUT_W - w) / 2, (CUT_H - h) / 2, w, h);
        ok(cv.toDataURL("image/png"));
      };
      img.onerror = no;
      img.src = URL.createObjectURL(file);
    });
  }
  function cutOut(list) {
    return list.filter(function (q) { return q.img || q.text; }).map(function (q) { return { img: q.img, text: M.clean(q.text, CUT_TEXT) }; });
  }
  function imgCard(k, c) {
    return '<div class="card"><h2>' + esc(tx(k)) + "</h2>" + (c[k] ? '<p><img src="' + c[k] + '" alt="" style="image-rendering:pixelated;height:64px"></p>' : "") +
      '<div class="row"><label class="btn btn--small">' + esc(tx("pick")) + '<input type="file" accept="image/png" hidden data-cimg="' + k + '"></label>' +
      (c[k] ? '<button type="button" class="btn btn--small btn--red" data-crm="' + k + '">' + esc(tx("rm")) + "</button>" : "") + "</div></div>";
  }
  function fit(file, w, h) {
    return new Promise(function (ok, no) {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, w / img.width, h / img.height);
        var cv = document.createElement("canvas");
        cv.width = Math.max(1, Math.round(img.width * s)); cv.height = Math.max(1, Math.round(img.height * s));
        var g = cv.getContext("2d"); g.imageSmoothingEnabled = false;
        g.drawImage(img, 0, 0, cv.width, cv.height);
        ok(cv.toDataURL("image/png"));
      };
      img.onerror = no;
      img.src = URL.createObjectURL(file);
    });
  }
  function download() {
    var c = cups()[cur];
    var nm = M.clean(c.name, NAME_MAX);
    if (!nm) { M.toast(tx("e_name")); return; }
    if (c.teams.length < c.size) { M.toast(tx("e_teams", { s: c.size })); return; }
    var out = {
      format: "futiba-cup", version: 1, name: nm, modality: c.modality, stage: c.stage, size: c.size, teams: c.teams,
      intro: cutOut(c.intro), ending: cutOut(c.ending),
      stadiums: c.modality === "campo" ? c.stadiums : [], logo: c.logo || "", trophy: c.trophy || ""
    };
    var base = "FUTIBA_COPA_" + nm.replace(/[^A-Z0-9]+/g, "_"), f = base + ".zip";
    var zip = new JSZip();
    zip.file(base + ".json", JSON.stringify(out));
    zip.generateAsync({ type: "blob", compression: "DEFLATE" }).then(function (blob) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = f; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      M.toast(tx("ok", { f: f }));
    });
  }
  function toggle(list, id) {
    var i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("#cups-ed button"); if (!b) return;
    var c = cups()[cur], d = b.dataset;
    if (d.cslot != null) { cur = +d.cslot; render(); }
    else if (d.cmod) { if (c.modality !== d.cmod) { c.modality = d.cmod; c.teams = []; c.stadiums = []; } changed(); }
    else if (d.csize) { c.size = +d.csize; changed(); }
    else if (d.cidadd != null) {
      var inp = document.querySelector("[data-cidin]"), id = String(inp.value || "").trim().toLowerCase();
      if (id && c.teams.indexOf(id) < 0) c.teams.push(id);
      changed();
    }
    else if (d.cstage) { c.stage = d.cstage; if (c.stage === "groups" && c.size === 4) c.size = 8; changed(); }
    else if (d.ccutrm) { c[d.ccutrm][+d.ci].img = ""; changed(); }
    else if (d.cteam) { toggle(c.teams, d.cteam); changed(); }
    else if (d.cstad) { toggle(c.stadiums, d.cstad); changed(); }
    else if (d.call != null) { c.teams = teamsFor(c.modality).map(function (t) { return t.id; }); changed(); }
    else if (d.cnone != null) { c.teams = []; changed(); }
    else if (d.crm) { c[d.crm] = ""; changed(); }
    else if (d.cdl != null) download();
  });
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (!t.closest || !t.closest("#cups-ed")) return;
    if (t.dataset.cname != null) { cups()[cur].name = M.clean(t.value, NAME_MAX); M.save(); }
    if (t.dataset.ccuttxt) { cups()[cur][t.dataset.ccuttxt][+t.dataset.ci].text = t.value.toUpperCase().slice(0, CUT_TEXT); M.save(); }
    if (t.dataset.cfind != null) {
      filter = t.value;
      var at = t.selectionStart;
      render();
      var n = document.querySelector("[data-cfind]");
      if (n) { n.focus(); n.setSelectionRange(at, at); }
    }
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.ccut && t.files[0]) {
      fitCover(t.files[0]).then(function (url) { cups()[cur][t.dataset.ccut][+t.dataset.ci].img = url; changed(); });
      return;
    }
    if (!t.dataset || !t.dataset.cimg || !t.files[0]) return;
    var k = t.dataset.cimg, sz = k === "logo" ? [LOGO, LOGO] : TROPHY;
    fit(t.files[0], sz[0], sz[1]).then(function (url) { cups()[cur][k] = url; changed(); });
  });

  window.FutibaCups = { render: render };
  var li = document.getElementById("menu-cups"); if (li) { li.hidden = false; li.querySelector("button").textContent = tx("menu"); }
})();
