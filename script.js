/* ============================================================
   FUTIBA — comportamento da página
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Vídeo de gameplay -------------------------
     O id do vídeo vem da variável de ambiente YOUTUBE_ID,
     servida por /api/config. Enquanto estiver vazia, a página
     mostra o cartaz "Em breve". Para testar sem publicar:
     adicione ?yt=ID_DO_VIDEO na URL.
  ---------------------------------------------------------- */
  function parseVideoId(value) {
    if (!value) return "";
    var raw = String(value).trim();
    if (!raw) return "";

    // Já é um id puro (11 caracteres)
    if (/^[\w-]{11}$/.test(raw)) return raw;

    // youtu.be/ID  ·  /watch?v=ID  ·  /embed/ID  ·  /shorts/ID  ·  /live/ID
    var m = raw.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : "";
  }

  function mountVideo(id) {
    if (!id) return;
    var slot = document.getElementById("video-slot");
    var frame = document.getElementById("video-frame");
    if (!slot || !frame) return;

    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0";
    iframe.title = "Gameplay do FUTIBA";
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    frame.appendChild(iframe);
    slot.setAttribute("data-state", "ready");
  }

  var fromQuery = parseVideoId(new URLSearchParams(location.search).get("yt"));
  if (fromQuery) {
    mountVideo(fromQuery);
  } else {
    fetch("/api/config", { headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { mountVideo(parseVideoId(data && data.youtubeId)); })
      .catch(function () { /* sem função serverless: fica o cartaz "Em breve" */ });
  }

  /* ---------- 2. Foto do portátil --------------------------
     Se assets/r36t.jpg existir, a foto entra no lugar do
     console desenhado. Se não existir, o desenho fica.
  ---------------------------------------------------------- */
  var photo = document.getElementById("r36t-photo");
  var mock = document.getElementById("r36t-mock");
  if (photo && mock) {
    var showPhoto = function () {
      if (!photo.naturalWidth) return;
      photo.hidden = false;
      mock.remove();
    };
    if (photo.complete) showPhoto();
    else photo.addEventListener("load", showPhoto);
  }

  /* ---------- 3. Lightbox das telas ------------------------ */
  var box = document.getElementById("lightbox");
  var boxImg = document.getElementById("lightbox-img");
  var boxClose = document.getElementById("lightbox-close");
  var lastFocus = null;

  function openBox(img) {
    lastFocus = document.activeElement;
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    boxClose.focus();
  }

  function closeBox() {
    box.hidden = true;
    boxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".zoomable"), function (img) {
    img.addEventListener("click", function () { openBox(img); });
  });

  if (boxClose) boxClose.addEventListener("click", closeBox);
  if (box) box.addEventListener("click", function (e) { if (e.target === box) closeBox(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box && !box.hidden) closeBox();
  });

  /* ---------- 4. Entrada dos quadros ----------------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".sec .panel, .sec .balloon, .sec .head, .sec .deck");
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }
})();
