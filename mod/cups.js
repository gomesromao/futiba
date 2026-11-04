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
  var SIZES = [4, 8, 16, 32];
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
      intro: "MONTE A SUA COPA: ESCOLHA O NOME, A MODALIDADE, QUANTOS TIMES JOGAM E QUAIS. O JOGO TEM 2 VAGAS PARA COPAS. O FORMATO É MATA-MATA, COM PÊNALTIS EM CASO DE EMPATE. TEMPO DE PARTIDA E DIFICULDADE CONTINUAM VINDO DO JOGO.",
      how: "COMO LEVAR PARA O JOGO: 1) APERTE \"BAIXAR COPA\". 2) PC: PONHA O ARQUIVO NA PASTA MOD, AO LADO DO JOGO. ANDROID: DEIXE O ARQUIVO NO CELULAR. 3) NO JOGO: EDITOR > IMPORTAR COPA, ESCOLHA O ARQUIVO E APERTE A. A COPA APARECE EM COPAS > MINHAS COPAS.",
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
      intro: "BUILD YOUR CUP: PICK THE NAME, THE MODE, HOW MANY TEAMS AND WHICH ONES. THE GAME HAS 2 CUP SLOTS. THE FORMAT IS KNOCKOUT, WITH PENALTIES ON A DRAW. MATCH LENGTH AND DIFFICULTY STILL COME FROM THE GAME.",
      how: "HOW TO USE IT: 1) PRESS \"DOWNLOAD CUP\". 2) PC: PUT THE FILE IN THE MOD FOLDER, NEXT TO THE GAME. ANDROID: KEEP THE FILE ON THE PHONE. 3) IN THE GAME: EDITOR > IMPORT CUP, PICK THE FILE AND PRESS A. THE CUP SHOWS UP IN CUPS > MY CUPS.",
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
      intro: "ARMA TU COPA: ELIGE EL NOMBRE, LA MODALIDAD, CUÁNTOS EQUIPOS Y CUÁLES. EL JUEGO TIENE 2 CUPOS PARA COPAS. EL FORMATO ES ELIMINATORIA, CON PENALES EN CASO DE EMPATE. EL TIEMPO DE PARTIDO Y LA DIFICULTAD SIGUEN VINIENDO DEL JUEGO.",
      how: "CÓMO LLEVARLA AL JUEGO: 1) PULSA \"DESCARGAR COPA\". 2) PC: PON EL ARCHIVO EN LA CARPETA MOD, AL LADO DEL JUEGO. ANDROID: DEJA EL ARCHIVO EN EL TELÉFONO. 3) EN EL JUEGO: EDITOR > IMPORTAR COPA, ELIGE EL ARCHIVO Y PULSA A. LA COPA APARECE EN COPAS > MIS COPAS.",
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
  function fresh() { return { name: "", modality: "campo", size: 8, teams: [], stadiums: [], logo: "", trophy: "" }; }
  function cups() {
    var S = M.state();
    if (!S.cups) S.cups = [fresh(), fresh()];
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
    h += '<h3>' + esc(tx("size")) + '</h3><div class="chips">' + SIZES.map(function (s) {
      return '<button type="button" class="chip' + (c.size === s ? " on" : "") + '" data-csize="' + s + '">' + s + "</button>";
    }).join("") + "</div>";
    var ts = teamsFor(c.modality), q = filter.toUpperCase();
    h += "<h3>" + esc(tx("teams")) + '</h3><p class="dim" style="font-size:8px">' + esc(tx("teams_n", { n: c.teams.length, s: c.size })) + " " + esc(tx("teams_h")) + "</p>";
    h += '<div class="bar"><label class="f"><span>' + esc(tx("search")) + '</span><input type="text" data-cfind value="' + esc(filter) + '"></label>' +
      '<button type="button" class="btn btn--small" data-call>' + esc(tx("all")) + '</button><button type="button" class="btn btn--small" data-cnone>' + esc(tx("none")) + "</button></div>";
    h += '<div class="chips" style="max-height:260px;overflow:auto">' + ts.filter(function (t) { return !q || t.name.indexOf(q) >= 0; }).map(function (t) {
      return '<button type="button" class="chip' + (c.teams.indexOf(t.id) >= 0 ? " on" : "") + '" data-cteam="' + esc(t.id) + '">' + esc(t.name) + "</button>";
    }).join("") + "</div>";
    if (c.modality === "campo") {
      h += "<h3>" + esc(tx("stadiums")) + '</h3><p class="dim" style="font-size:8px">' + esc(tx("stadiums_h")) + '</p><div class="chips">' + stadiumList().map(function (s) {
        return '<button type="button" class="chip' + (c.stadiums.indexOf(s.id) >= 0 ? " on" : "") + '" data-cstad="' + esc(s.id) + '">' + esc(s.name) + "</button>";
      }).join("") + "</div>";
    }
    h += '<div class="cards" style="margin-top:12px">' + imgCard("logo", c) + imgCard("trophy", c) + "</div>";
    h += '<div class="row" style="margin-top:12px"><button type="button" class="btn btn--gold" data-cdl>' + esc(tx("dl")) + "</button></div>";
    box.innerHTML = h;
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
      format: "futiba-cup", version: 1, name: nm, modality: c.modality, size: c.size, teams: c.teams,
      stadiums: c.modality === "campo" ? c.stadiums : [], logo: c.logo || "", trophy: c.trophy || ""
    };
    var f = "FUTIBA_COPA_" + nm.replace(/[^A-Z0-9]+/g, "_") + ".json";
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: "application/json" }));
    a.download = f; document.body.appendChild(a); a.click(); a.remove();
    M.toast(tx("ok", { f: f }));
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
    if (!t.dataset || !t.dataset.cimg || !t.files[0]) return;
    var k = t.dataset.cimg, sz = k === "logo" ? [LOGO, LOGO] : TROPHY;
    fit(t.files[0], sz[0], sz[1]).then(function (url) { cups()[cur][k] = url; changed(); });
  });

  window.FutibaCups = { render: render };
  var li = document.getElementById("menu-cups"); if (li) li.hidden = false;
})();
