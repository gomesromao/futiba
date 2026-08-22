# FUTIBA — site oficial

Página única, estática e responsiva do FUTIBA, no estilo almanaque de quadrinhos.
Feita em HTML, CSS e JavaScript puro — sem framework, sem build, sem dependência para instalar.

---

## Publicar na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: **Add New… → Project → Import** o repositório.
3. Em *Framework Preset* escolha **Other**. Deixe *Build Command* e *Output Directory* em branco.
4. **Deploy**.

Pronto. Não há nada para compilar: o Vercel serve os arquivos como estão e transforma
`api/config.js` em função serverless automaticamente.

### Testar no seu computador

Qualquer servidor estático resolve. Por exemplo:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`. O `/api/config` só funciona na Vercel — localmente o
bloco de vídeo mostra o cartaz "Em breve", que é o comportamento correto.

---

## O vídeo de gameplay (variável de ambiente)

O bloco **Gameplay** começa mostrando um cartaz "Em breve". Quando o vídeo estiver no ar,
é só criar a variável de ambiente — sem mexer no código.

Na Vercel: **Settings → Environment Variables**

| Nome | Valor |
|---|---|
| `YOUTUBE_ID` | `dQw4w9WgXcQ` (só o id) **ou** a URL inteira do YouTube |

Aceita qualquer formato de link: `youtu.be/…`, `watch?v=…`, `/embed/…`, `/shorts/…`, `/live/…`.

Depois de salvar a variável, faça um **Redeploy** para ela valer. O bloco troca sozinho:
some o cartaz, entra o player.

Para conferir o embed antes de publicar a variável, abra o site com `?yt=ID_DO_VIDEO` no fim
da URL — por exemplo `https://seusite.vercel.app/?yt=dQw4w9WgXcQ`.

---

## A foto do portátil

A seção **FUTIBA no bolso** procura o arquivo:

```
assets/r36t.jpg
```

Coloque ali a foto do jogo rodando no portátil (aquela que você tirou). A página troca
sozinha o desenho pela foto assim que o arquivo existir. Enquanto não existir, aparece um
console desenhado em CSS com a tela de seleção dentro — funciona, mas a foto real é melhor.

Se sua foto for `.png`, ou renomeie para `r36t.jpg`, ou troque o caminho em `index.html`
(procure por `r36t-photo`).

---

## Trocar textos, links e imagens

Tudo o que muda com frequência está em um lugar só:

| O quê | Onde |
|---|---|
| Textos das seções | `index.html` |
| Links de download (PC, portátil Android, celular touch) | `index.html`, seção `id="baixar"` |
| E-mail de contato | `index.html`, seção `id="contato"` |
| Screenshots | `assets/` |
| Cores, tamanhos, espaçamentos | `styles.css`, bloco `:root` no topo |

As screenshots já incluídas:

- `title-screen.png` — tela de título (também é a capa da página)
- `gameplay.png` — partida em andamento
- `team-select.png` — seleção de equipe
- `team-select-botafogo.png` — seleção de equipe que aparece dentro do portátil desenhado
- `squad-photo.png` — foto oficial do time
- `og-cover.jpg` — imagem que aparece quando o link é compartilhado no WhatsApp, X, Discord etc.

Para adicionar mais telas, copie um bloco `<figure class="shot panel">` existente. Toda imagem
com a classe `zoomable` abre em tela cheia ao ser clicada.

---

## Estrutura

```
.
├── index.html          página inteira
├── styles.css          estilo (tokens de cor e tipografia no topo)
├── script.js           vídeo, lightbox, animação de entrada, foto do portátil
├── api/
│   └── config.js       entrega o YOUTUBE_ID para a página
├── assets/             imagens
├── vercel.json         URLs limpas e cache das imagens
└── robots.txt
```

---

## Detalhes técnicos

- **Fontes**: Bangers, Press Start 2P e Barlow Semi Condensed, carregadas do Google Fonts.
  Se preferir não depender de CDN, baixe os arquivos, coloque em `assets/fonts/` e troque o
  `<link>` do `index.html` por `@font-face` no `styles.css`.
- **Acessibilidade**: navegação por teclado com foco visível, textos alternativos nas imagens,
  atalho "pular para o conteúdo" e respeito a `prefers-reduced-motion`.
- **Sem rastreamento**: nenhum analytics, nenhum cookie. O player usa `youtube-nocookie.com`.

---

## Sobre as imagens

Todas as imagens deste repositório são capturas do próprio FUTIBA e da arte do projeto.
Nenhum material de terceiros foi incluído. Ao adicionar novas telas, vale lembrar que
escudos, nomes e uniformes de clubes reais pertencem aos clubes — para uma versão pública
e divulgada, o mais seguro é usar telas com as equipes fictícias do jogo.

© FUTIBA 2026
