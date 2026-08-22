/**
 * /api/config
 *
 * Entrega para a página as configurações que vêm de variável de ambiente
 * do Vercel. Hoje só existe uma: o vídeo de gameplay.
 *
 * No painel do Vercel: Settings → Environment Variables
 *   Nome:  YOUTUBE_ID
 *   Valor: o id do vídeo (ex.: dQw4w9WgXcQ) ou a URL inteira do YouTube
 *
 * Com a variável vazia ou ausente, a página mostra o cartaz "Em breve".
 * Depois de salvar a variável é preciso fazer um novo deploy (Redeploy).
 */
module.exports = function handler(req, res) {
  var value =
    process.env.YOUTUBE_ID ||
    process.env.YOUTUBE_URL ||
    process.env.NEXT_PUBLIC_YOUTUBE_ID ||
    "";

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  res.status(200).end(JSON.stringify({ youtubeId: String(value).trim() }));
};
