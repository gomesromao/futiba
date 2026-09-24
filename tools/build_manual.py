"""Gera o manual do FUTIBA em PT, EN e ES (manual/pt.html, en.html, es.html).

Mesmo layout para as três línguas; muda só o texto e as telas com texto
(assets/v2/menu/*-<lang>.png). Os PDFs saem do próprio HTML:
    python tools/build_manual.py            # só HTML
    python tools/build_manual.py --pdf      # HTML + PDF (Microsoft Edge headless)
Referência de comandos: build 52.9 (levantada no código do jogo).
"""
import os, sys, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "manual")

# ---------------------------------------------------------------- botões
def k(*keys):
    return "".join("<kbd>%s</kbd>" % x for x in keys)

def b(name, cls):
    return '<span class="btn %s">%s</span>' % (cls, name)

A, B, X, Y = b("A", "b-a"), b("B", "b-b"), b("X", "b-x"), b("Y", "b-y")
RB, LB, START = b("RB", "b-sh"), b("LB", "b-sh"), b("START", "b-start")
TA, TB, TC, TL1, TST = b("A", "b-a"), b("B", "b-b"), b("C", "b-c"), b("L1", "b-l1"), b("START", "b-start")
ARROWS = k("←", "↑", "↓", "→")


def phone_svg(t):
    """Celular deitado: jogo 4:3 no meio, controles nas faixas pretas."""
    return f'''<svg class="phone" viewBox="0 0 880 400" role="img" aria-label="{t['alt']}">
  <rect x="10" y="10" width="860" height="380" rx="46" fill="#1c1f27" stroke="#555a66" stroke-width="4"/>
  <rect x="40" y="34" width="800" height="332" rx="16" fill="#000"/>
  <rect x="219" y="34" width="442" height="332" fill="#1d7a3a"/>
  <g stroke="#e9f5e5" stroke-width="3" fill="none" opacity=".85">
    <rect x="236" y="50" width="408" height="300"/><line x1="440" y1="50" x2="440" y2="350"/><circle cx="440" cy="200" r="42"/>
    <rect x="236" y="140" width="46" height="120"/><rect x="598" y="140" width="46" height="120"/>
  </g>
  <text x="440" y="206" text-anchor="middle" font-family="Press Start 2P, monospace" font-size="15" fill="#fff">{t['game']}</text>
  <circle cx="129" cy="258" r="62" fill="#0000" stroke="#ffffff66" stroke-width="3"/>
  <g fill="#ffffffcc"><path d="M129 208 l12 18 h-24z"/><path d="M129 308 l12 -18 h-24z"/><path d="M79 258 l18 -12 v24z"/><path d="M179 258 l-18 -12 v24z"/></g>
  <circle cx="752" cy="298" r="24" fill="#2e9a4a" stroke="#fff8" stroke-width="2"/><text x="752" y="304" text-anchor="middle" font-family="Press Start 2P, monospace" font-size="14" fill="#fff">A</text>
  <circle cx="770" cy="240" r="24" fill="#c8402f" stroke="#fff8" stroke-width="2"/><text x="770" y="246" text-anchor="middle" font-family="Press Start 2P, monospace" font-size="14" fill="#fff">B</text>
  <circle cx="752" cy="182" r="24" fill="#2f6fc8" stroke="#fff8" stroke-width="2"/><text x="752" y="188" text-anchor="middle" font-family="Press Start 2P, monospace" font-size="14" fill="#fff">C</text>
  <circle cx="734" cy="124" r="24" fill="#9b59d0" stroke="#fff8" stroke-width="2"/><text x="734" y="130" text-anchor="middle" font-family="Press Start 2P, monospace" font-size="12" fill="#fff">L1</text>
  <circle cx="752" cy="66" r="18" fill="#333" stroke="#f5c518" stroke-width="3"/><rect x="742" y="63" width="20" height="6" fill="#fff"/>
  <circle cx="752" cy="298" r="31" fill="none" stroke="#f5c518" stroke-width="3" stroke-dasharray="6 5"/>
  <g font-family="Barlow Semi Condensed, sans-serif" font-weight="700" font-size="17" fill="#f3ecd6">
    <text x="129" y="176" text-anchor="middle">{t['dpad']}</text>
    <text x="700" y="72" text-anchor="end">START</text>
    <text x="129" y="366" text-anchor="middle" fill="#aeb6c8" font-size="15">{t['bar']}</text>
    <text x="752" y="366" text-anchor="middle" fill="#aeb6c8" font-size="15">{t['bar']}</text>
  </g>
</svg>'''


# ---------------------------------------------------------------- textos
L = {}

L["pt"] = dict(
    html="pt-BR", code="PT", title="FUTIBA — Manual de jogo",
    nav=[("#comece", "Começo"), ("#partida", "Partida"), ("#modos", "Modos"), ("#teclado", "PC"), ("#toque", "Android")],
    pdf="Baixar PDF", site="← Site",
    foot="FUTIBA 2026 • MANUAL DE JOGO",
    cover=dict(h1="MANUAL DE JOGO", sub="FUTEBOL DO NOSSO JEITO",
               modes="AMISTOSO • CAMPEONATO • COPA • PÊNALTIS • FUTSAL • PAREDÃO",
               ref="PC (teclado e controle) • Android (toque e controle) • referência: build 52.9"),
    p2=dict(hd="COMECE A JOGAR", big="BOLA ROLANDO.",
            lead="FUTIBA é futebol de videogame do jeito antigo: passe rápido, carrinho que pesa, goleiro que decide. Menos botão, mais leitura de jogo: <strong>o mesmo botão muda de função com e sem a bola.</strong>",
            steps=[("ESCOLHA O MODO", "Amistoso para ir direto ao jogo, Campeonato e Copa para campanha, Pênaltis para duelo, Indoor para futsal e paredão."),
                   ("ESCOLHA O TIME", "32 clubes, cada um com elenco, atributos, formação e retrato de cada jogador."),
                   ("MONTE O TIME", "Ajuste a escalação e o esquema. No futsal e no paredão, marque quem joga na linha."),
                   ("JOGUE", "Leia o campo, toque a bola e escolha a hora do chute.")],
            menu_h="O MENU PRINCIPAL",
            menu=[("AMISTOSO", "partida avulsa, com estádio, horário e clima à sua escolha."),
                  ("CAMPEONATO", "16 clubes, 15 rodadas, pontos corridos."),
                  ("COPA", "mata-mata de 8 ou 16 clubes."),
                  ("PÊNALTIS", "direto para a marca da cal."),
                  ("INDOOR", "futsal e paredão."),
                  ("CONQUISTAS", "12 conquistas e o álbum de figurinhas."),
                  ("OPÇÕES", "idioma, volume, filtro, duração do tempo e dificuldade.")]),
    p3=dict(hd="ANTES DO APITO", big="DO MENU AO CÍRCULO CENTRAL.",
            lead="O caminho de uma partida no campo. Nas telas, o jogo mostra embaixo os botões de cada momento.",
            s=[("1 · TIMES", "<b>←/→</b> trocam de clube. Confirme o mandante, depois o visitante. <b>↓</b> leva a INFO, com a história do clube."),
               ("2 · PRÉ-JOGO", "Escolha quem você controla (mandante, visitante ou só assistir), o estádio (12), o horário (dia, tarde, noite) e o clima (sol ou chuva)."),
               ("3 · ESCALAÇÃO", "Confirme um jogador e depois outro para trocar os dois, inclusive com o banco. Embaixo: formação, AUTO (o jogo escala), RIVAL (ver o adversário) e CONFIRMAR."),
               ("4 · ABERTURA", "A câmera passeia pela arquibancada e desce ao gramado. <b>START</b> pula."),
               ("5 · CARA OU COROA", "<b>←/→</b> escolhem cara ou coroa; confirmar lança a moeda."),
               ("6 · LADO", "Se você ganhou: <b>↑</b> fica com a bola; <b>←</b> ou <b>→</b> escolhe o campo. Se o rival ganhou, você vê a escolha dele.")]),
    p4=dict(hd="DENTRO DA PARTIDA", big="O QUE ESTÁ NA TELA.",
            hud=[("PLACAR", "no alto, à esquerda, com as siglas dos clubes."),
                 ("RELÓGIO", "no alto, à direita."),
                 ("RADAR", "embaixo, no meio: pontos dos dois times e a bola."),
                 ("NOMES", "embaixo: à direita o seu jogador, à esquerda o rival mais perto. Chip amarelo = cartão; cruz = lesão."),
                 ("BALÕES", "os jogadores falam: pedem a bola, reclamam, comemoram.")],
            cards=[("PAUSA", "CONTINUAR, TÁTICAS e SAIR DA PARTIDA.", ""),
                   ("TÁTICAS", "Formação e até 3 substituições. Valem na próxima saída de bola.", "green"),
                   ("INTERVALO", "Tela de escalação para mexer no time. No 2º tempo os lados invertem.", "blue"),
                   ("GOL", "Quem marcou comemora, o rival lamenta, depois vem o replay. <b>START</b> encurta.", "red"),
                   ("JUIZ", "Faltas, amarelo, vermelho e lesão. Vermelho no seu time: volta à escalação para reorganizar.", "orange"),
                   ("FIM DE JOGO", "Resumo com os gols. REVANCHE, NOVOS TIMES ou SELEÇÃO DE MODO.", "purple")]),
    p5=dict(hd="MODOS DE JOGO", big="ESCOLHA A BRIGA.",
            m=[("AMISTOSO", "ENTROU, JOGOU", "red", ["Dois times, pré-jogo, escalação e bola rolando.", "Tempo do jogo em OPÇÕES: 3, 5 ou 7 minutos reais por tempo.", "Sem campanha: o placar termina ali. A rivalidade, não."]),
               ("CAMPEONATO", "A TEMPORADA TODA CONTA", "green", ["16 clubes, turno único, 15 rodadas. Vitória 3, empate 1.", "Desempate: pontos, saldo de gols, gols pró.", "Vermelho ou lesão no seu time tira o jogador da rodada seguinte.", "Cada clube tem o próprio save."]),
               ("COPA", "PERDEU, ACABOU", "blue", ["Chave de 8 ou 16, jogo único.", "Empatou? Vai para os pênaltis, jogados por você.", "Artilharia, cartões e lesões acompanham a campanha."]),
               ("PÊNALTIS", "UM CHUTE. UM MERGULHO.", "purple", ["Monte a ordem dos 10 batedores de cada time.", "5 cobranças para cada lado e depois morte súbita.", "Batendo: <b>setas</b> miram (esquerda, meio, direita; alto, meio, baixo) e o botão de passe bate.", "No gol: <b>setas</b> escolhem o canto e o botão de passe pula."])]),
    p6=dict(hd="INDOOR", big="FUTSAL E PAREDÃO.",
            setup_h="MONTAGEM DO TIME (os dois modos)",
            setup=["Marque quem joga na linha com o botão de passe.",
                   "O <b>GL</b> (goleiro-linha) é o reserva que pode entrar no lugar do goleiro para atacar: escolha com o botão de chute.",
                   "<b>←/→</b> decidem se a partida já começa com o GL.",
                   "<b>START</b> passa para o time rival e, depois, começa o jogo."],
            fut_h="FUTSAL", fut_tag="4 NA LINHA + 1 NO GOL",
            fut=["Dois tempos de 3 minutos reais (o relógio mostra 30 minutos cada). Não depende da opção de duração.",
                 "Lateral cobrado com o pé.",
                 "Faltas se acumulam: a 6ª do time (e a 12ª, a 18ª…) é pênalti direto.",
                 "O goleiro pode passar do meio da quadra.",
                 "Troca de jogadores livre, com a bola rolando.",
                 "Expulso não volta. Time reduzido a goleiro + 1 perde por W.O."],
            par_h="PAREDÃO", par_tag="3 NA LINHA + 1 NO GOL",
            par=["Quem fizer 5 gols primeiro vence.",
                 "A bola bate na parede e volta: não tem lateral, escanteio nem tiro de meta.",
                 "Sem juiz, sem falta, sem cartão.",
                 "O goleiro não pode passar do meio: se passar, a bola vai para o rival. O GL pode.",
                 "Troca de linha livre, com a bola rolando (pausa → TÁTICAS / TROCAS)."]),
    p7=dict(hd="COMANDOS · PC · TECLADO", big="TECLADO.",
            lead="Na partida o jogador anda <b>só com as setas</b>. WASD funciona nos menus.",
            th=("TECLA", "COM A BOLA", "SEM A BOLA"),
            rows=[(k("←", "↑", "↓", "→"), "Mover e dar direção ao passe, ao cruzamento e à mira do chute", "Mover"),
                  (k("Z"), "Passe (vai para o companheiro na direção)", "Desarme em pé. <b>Segure</b> para correr atrás da bola"),
                  (k("X"), "Chute. <b>Segure</b> para mais força (↑/↓ mudam a altura na boca do gol)", "Disputa pelo alto (cabeçada, peixinho) ou troca de jogador"),
                  (k("A"), "Cruzamento ou lançamento. <b>Segure</b> para mais força", "Carrinho"),
                  (k("SHIFT"), "Segure para correr. Um toque: drible (rolinho ou corte). Dois toques rápidos: pedalada", "Correr"),
                  (k("ESPAÇO"), "Lambreta (meias e atacantes). Durante ela, <kbd>X</kbd> é bicicleta", "—"),
                  (k("P") + k("ENTER"), "Pausa. <kbd>ENTER</kbd> também pula a abertura e encurta o replay", "Pausa")],
            futsal="<b>Futsal:</b> <kbd>SHIFT</kbd> + <kbd>Z</kbd> = toque em profundidade. Com o SHIFT segurado, o passe sempre sai em profundidade.",
            set_h="BOLA PARADA",
            sets=["<b>Falta:</b> <kbd>←</kbd>/<kbd>→</kbd> escolhem o batedor, <kbd>Z</kbd> confirma. Setas miram. <kbd>Z</kbd> passe curto, <kbd>X</kbd> chute, <kbd>A</kbd> cruzamento.",
                  "<b>Escanteio e tiro de meta:</b> setas miram, <kbd>Z</kbd> ou <kbd>X</kbd> cobra.",
                  "<b>Lateral:</b> <kbd>←</kbd>/<kbd>→</kbd> escolhem o lado, <kbd>Z</kbd> ou <kbd>X</kbd> cobra.",
                  "<b>Pênalti no jogo:</b> segure <kbd>↑</kbd> ou <kbd>↓</kbd> para escolher o canto (mais tempo = mais alto) e bata com <kbd>Z</kbd> ou <kbd>X</kbd>. O goleiro pula sozinho."],
            menu_h="MENUS",
            menu="Setas ou WASD navegam · <kbd>Z</kbd> ou <kbd>ENTER</kbd> confirmam · <kbd>ESC</kbd> ou <kbd>X</kbd> voltam · <kbd>←</kbd>/<kbd>→</kbd> ajustam valores · <kbd>L</kbd> abre o álbum nas conquistas."),
    p8=dict(hd="COMANDOS · PC · CONTROLE", big="CONTROLE.",
            lead="Nomes no padrão Xbox. Em outros controles, use o botão na mesma posição.",
            th=("BOTÃO", "COM A BOLA", "SEM A BOLA"),
            rows=[("D-PAD / ANALÓGICO", "Mover e dar direção", "Mover"),
                  (A, "Passe", "Desarme em pé. <b>Segure</b> para correr atrás da bola"),
                  (X, "Chute. <b>Segure</b> para mais força", "Disputa pelo alto ou troca de jogador"),
                  (Y, "Cruzamento ou lançamento. <b>Segure</b> para mais força", "Carrinho"),
                  (RB, "Segure para correr. Toque: drible. Dois toques: pedalada", "Correr"),
                  (LB + " + " + Y, "Lambreta (meias e atacantes). Durante ela, " + X + " é bicicleta", "—"),
                  (START, "Pausa · pula a abertura · encurta o replay", "Pausa")],
            futsal="<b>Futsal:</b> " + LB + " + " + A + " = toque em profundidade.",
            extra="Na bola parada vale a mesma lógica do teclado: " + A + " passe curto, " + X + " chute, " + Y + " cruzamento. " + B + " não faz nada no jogo: ele só volta nos menus.",
            menu_h="MENUS",
            menu="D-pad ou analógico navegam · " + A + " confirma · " + B + " volta · " + LB + " abre o álbum nas conquistas."),
    p9=dict(hd="ANDROID · TOQUE", big="CONTROLES NA TELA.",
            lead="O jogo fica no meio, em 4:3. Os controles ficam nas faixas pretas dos lados, sem cobrir o campo.",
            svg=dict(alt="Celular deitado: jogo no meio, direcional na faixa esquerda, L1, C, B, A e START na faixa direita.", game="JOGO", dpad="DIRECIONAL", bar="faixa preta"),
            th=("BOTÃO", "NA PARTIDA", "NOS MENUS"),
            rows=[("DIRECIONAL", "Mover (vale diagonal). Arraste o dedo sem soltar", "Navegar"),
                  (TA, "Passe · sem bola, desarme (segure para correr atrás da bola)", "Confirmar"),
                  (TB, "Chute (segure para mais força) · sem bola, disputa pelo alto ou troca", "Voltar"),
                  (TC, "Cruzamento (segure para mais força) · sem bola, carrinho", "—"),
                  (TL1, "Segure para correr · dois toques: pedalada · " + TL1 + " + " + TC + " lambreta · futsal: " + TL1 + " + " + TA + " toque em profundidade", "Álbum nas conquistas"),
                  (TST, "Pausa · pula a abertura · encurta o replay", "Avança na montagem do futsal e do paredão")],
            glow_h="O BOTÃO DOURADO",
            glow="Quando uma tela espera você, o botão certo ganha um <b>anel dourado piscando</b>. Nos menus é o " + TA + " (com a palavra OK). Na montagem do futsal e do paredão é o " + TST + ". Na partida: " + TST + " na abertura e no replay; " + TA + " no cara ou coroa, na pausa e no fim de jogo.",
            tips_h="DICAS",
            tips=["Vale apertar vários botões ao mesmo tempo: direcional + L1 + chute, por exemplo.",
                  "Para cruzar correndo, solte o L1 antes: com L1 segurado, o C vira lambreta.",
                  "No futsal, com L1 segurado, o passe sempre sai em profundidade."]),
    p10=dict(hd="ANDROID · CONTROLE · OPÇÕES", big="COM CONTROLE.",
             pad="A versão Android com controle é para portáteis com botões físicos (R36S, Anbernic, Retroid…) ou celular com controle pareado. Não aparece nada na tela: o jogo fica em 4:3 no meio e os botões são os mesmos do controle no PC (página 8).",
             opt_h="OPÇÕES",
             opt=[("IDIOMA", "português, inglês ou espanhol."),
                  ("VOLUME", "geral, música e efeitos."),
                  ("MOLDURA", "só no PC: TV, álbum, pôster, gibi ou FUTIBA nas laterais."),
                  ("FILTRO", "NORMAL ou TV RAIZ (tubo)."),
                  ("DURAÇÃO DO TEMPO", "3, 5 ou 7 minutos reais por tempo (campo)."),
                  ("DIFICULDADE", "fácil, normal ou difícil (muda a CPU).")],
             sec_h="SEGREDOS",
             sec="Ganhe a Copa ou o Campeonato e aparecem duas equipes escondidas. E quem jogava videogame nos anos 90 sabe: na tela de abertura sempre tem um código.",
             ach_h="CONQUISTAS",
             ach="12 conquistas liberam figurinhas no álbum do FUTIBA: primeira vitória, virada, goleada, hat-trick, gol contra, jogar com um a menos…"),
)

L["en"] = dict(
    html="en", code="EN", title="FUTIBA — Game manual",
    nav=[("#comece", "Start"), ("#partida", "Match"), ("#modos", "Modes"), ("#teclado", "PC"), ("#toque", "Android")],
    pdf="Download PDF", site="← Site",
    foot="FUTIBA 2026 • GAME MANUAL",
    cover=dict(h1="GAME MANUAL", sub="FOOTBALL OUR WAY",
               modes="FRIENDLY • CHAMPIONSHIP • CUP • PENALTIES • FUTSAL • WALL MODE",
               ref="PC (keyboard and controller) • Android (touch and controller) • reference: build 52.9"),
    p2=dict(hd="START PLAYING", big="KICK-OFF.",
            lead="FUTIBA is videogame football the old way: quick passes, slide tackles that hurt, goalkeepers who decide. Fewer buttons, more reading of the game: <strong>the same button does different things with and without the ball.</strong>",
            steps=[("PICK A MODE", "Friendly to go straight to a match, Championship and Cup for a campaign, Penalties for a duel, Indoor for futsal and wall mode."),
                   ("PICK A TEAM", "32 clubs, each with a squad, ratings, formation and a portrait for every player."),
                   ("SET UP THE TEAM", "Adjust the line-up and the formation. In futsal and wall mode, pick who plays outfield."),
                   ("PLAY", "Read the pitch, move the ball and choose the moment to shoot.")],
            menu_h="THE MAIN MENU",
            menu=[("FRIENDLY", "a one-off match, with the stadium, time of day and weather you want."),
                  ("CHAMPIONSHIP", "16 clubs, 15 rounds, round robin."),
                  ("CUP", "knockout of 8 or 16 clubs."),
                  ("PENALTIES", "straight to the spot."),
                  ("INDOOR", "futsal and wall mode."),
                  ("ACHIEVEMENTS", "12 achievements and the sticker album."),
                  ("OPTIONS", "language, volume, filter, half length and difficulty.")]),
    p3=dict(hd="BEFORE THE WHISTLE", big="FROM THE MENU TO THE CENTRE CIRCLE.",
            lead="The path to a match on the pitch. On every screen, the game shows the buttons for that moment at the bottom.",
            s=[("1 · TEAMS", "<b>←/→</b> change club. Confirm the home team, then the away team. <b>↓</b> goes to INFO, with the club's story."),
               ("2 · PRE-MATCH", "Choose who you control (home, away or just watch), the stadium (12), the time of day (day, sunset, night) and the weather (sun or rain)."),
               ("3 · LINE-UP", "Confirm one player and then another to swap them, bench included. At the bottom: formation, AUTO (the game picks), OPPONENT (see the rival) and CONFIRM."),
               ("4 · OPENING", "The camera tours the stand and comes down to the pitch. <b>START</b> skips it."),
               ("5 · COIN TOSS", "<b>←/→</b> pick heads or tails; confirm flips the coin."),
               ("6 · SIDE", "If you won: <b>↑</b> keeps the ball; <b>←</b> or <b>→</b> picks the end. If the rival won, you watch their choice.")]),
    p4=dict(hd="IN THE MATCH", big="WHAT IS ON SCREEN.",
            hud=[("SCORE", "top left, with the club codes."),
                 ("CLOCK", "top right."),
                 ("RADAR", "bottom centre: dots for both teams and the ball."),
                 ("NAMES", "bottom: your player on the right, the nearest rival on the left. Yellow chip = card; cross = injury."),
                 ("BALLOONS", "players talk: they call for the ball, complain, celebrate.")],
            cards=[("PAUSE", "RESUME, TACTICS and QUIT MATCH.", ""),
                   ("TACTICS", "Formation and up to 3 substitutions. They apply at the next restart.", "green"),
                   ("HALF-TIME", "Line-up screen to change the team. In the 2nd half the ends swap.", "blue"),
                   ("GOAL", "The scorer celebrates, the rival laments, then comes the replay. <b>START</b> shortens it.", "red"),
                   ("REFEREE", "Fouls, yellow, red and injuries. A red on your team: back to the line-up to reorganise.", "orange"),
                   ("FULL TIME", "Summary with the goals. REMATCH, NEW TEAMS or MODE SELECT.", "purple")]),
    p5=dict(hd="GAME MODES", big="PICK YOUR FIGHT.",
            m=[("FRIENDLY", "IN AND PLAY", "red", ["Two teams, pre-match, line-up and kick-off.", "Match length in OPTIONS: 3, 5 or 7 real minutes per half.", "No campaign: the score ends there. The rivalry doesn't."]),
               ("CHAMPIONSHIP", "THE WHOLE SEASON COUNTS", "green", ["16 clubs, single round robin, 15 rounds. Win 3, draw 1.", "Tie-break: points, goal difference, goals scored.", "A red card or injury on your team rules the player out of the next round.", "Every club has its own save."]),
               ("CUP", "LOSE AND YOU'RE OUT", "blue", ["Bracket of 8 or 16, single match.", "A draw? It goes to penalties, played by you.", "Top scorers, cards and injuries follow the run."]),
               ("PENALTIES", "ONE KICK. ONE DIVE.", "purple", ["Set the order of the 10 takers for each team.", "5 kicks each and then sudden death.", "Taking: <b>arrows</b> aim (left, centre, right; high, middle, low) and the pass button shoots.", "In goal: <b>arrows</b> pick the corner and the pass button dives."])]),
    p6=dict(hd="INDOOR", big="FUTSAL AND WALL MODE.",
            setup_h="TEAM SET-UP (both modes)",
            setup=["Mark who plays outfield with the pass button.",
                   "The <b>sweeper</b> (GL) is the substitute who can replace the goalkeeper to attack: pick him with the shoot button.",
                   "<b>←/→</b> decide whether the match starts with the sweeper on.",
                   "<b>START</b> moves on to the rival team and then starts the match."],
            fut_h="FUTSAL", fut_tag="4 OUTFIELD + 1 IN GOAL",
            fut=["Two halves of 3 real minutes (the clock shows 30 minutes each). The half-length option does not apply.",
                 "Kick-ins taken with the foot.",
                 "Fouls add up: the team's 6th (and 12th, 18th…) is a direct penalty.",
                 "The goalkeeper may cross the halfway line.",
                 "Free substitutions, with the ball in play.",
                 "A sent-off player does not return. A team down to goalkeeper + 1 loses by forfeit."],
            par_h="WALL MODE", par_tag="3 OUTFIELD + 1 IN GOAL",
            par=["First to 5 goals wins.",
                 "The ball bounces off the wall: no throw-ins, corners or goal kicks.",
                 "No referee, no fouls, no cards.",
                 "The goalkeeper may not cross the halfway line: if he does, the ball goes to the rival. The sweeper may.",
                 "Free outfield substitutions, with the ball in play (pause → TACTICS / SUBS)."]),
    p7=dict(hd="CONTROLS · PC · KEYBOARD", big="KEYBOARD.",
            lead="In the match the player moves <b>with the arrow keys only</b>. WASD works in the menus.",
            th=("KEY", "WITH THE BALL", "WITHOUT THE BALL"),
            rows=[(k("←", "↑", "↓", "→"), "Move and aim passes, crosses and shots", "Move"),
                  (k("Z"), "Pass (to the teammate in that direction)", "Standing tackle. <b>Hold</b> to chase the ball"),
                  (k("X"), "Shoot. <b>Hold</b> for more power (↑/↓ change the height at the goal)", "Aerial duel (header, diving header) or switch player"),
                  (k("A"), "Cross or long ball. <b>Hold</b> for more power", "Slide tackle"),
                  (k("SHIFT"), "Hold to sprint. One tap: dribble (roll or cut). Two quick taps: step-over", "Sprint"),
                  (k("SPACE"), "Rainbow flick (midfielders and forwards). During it, <kbd>X</kbd> is a bicycle kick", "—"),
                  (k("P") + k("ENTER"), "Pause. <kbd>ENTER</kbd> also skips the opening and shortens the replay", "Pause")],
            futsal="<b>Futsal:</b> <kbd>SHIFT</kbd> + <kbd>Z</kbd> = through ball. With SHIFT held, the pass always goes in behind.",
            set_h="SET PIECES",
            sets=["<b>Free kick:</b> <kbd>←</kbd>/<kbd>→</kbd> pick the taker, <kbd>Z</kbd> confirms. Arrows aim. <kbd>Z</kbd> short pass, <kbd>X</kbd> shot, <kbd>A</kbd> cross.",
                  "<b>Corner and goal kick:</b> arrows aim, <kbd>Z</kbd> or <kbd>X</kbd> takes it.",
                  "<b>Throw-in:</b> <kbd>←</kbd>/<kbd>→</kbd> pick the side, <kbd>Z</kbd> or <kbd>X</kbd> throws.",
                  "<b>Penalty in a match:</b> hold <kbd>↑</kbd> or <kbd>↓</kbd> to pick the corner (longer = higher) and shoot with <kbd>Z</kbd> or <kbd>X</kbd>. The goalkeeper dives on his own."],
            menu_h="MENUS",
            menu="Arrows or WASD navigate · <kbd>Z</kbd> or <kbd>ENTER</kbd> confirm · <kbd>ESC</kbd> or <kbd>X</kbd> go back · <kbd>←</kbd>/<kbd>→</kbd> change values · <kbd>L</kbd> opens the album in achievements."),
    p8=dict(hd="CONTROLS · PC · CONTROLLER", big="CONTROLLER.",
            lead="Xbox button names. On other controllers, use the button in the same position.",
            th=("BUTTON", "WITH THE BALL", "WITHOUT THE BALL"),
            rows=[("D-PAD / STICK", "Move and aim", "Move"),
                  (A, "Pass", "Standing tackle. <b>Hold</b> to chase the ball"),
                  (X, "Shoot. <b>Hold</b> for more power", "Aerial duel or switch player"),
                  (Y, "Cross or long ball. <b>Hold</b> for more power", "Slide tackle"),
                  (RB, "Hold to sprint. Tap: dribble. Two taps: step-over", "Sprint"),
                  (LB + " + " + Y, "Rainbow flick (midfielders and forwards). During it, " + X + " is a bicycle kick", "—"),
                  (START, "Pause · skip the opening · shorten the replay", "Pause")],
            futsal="<b>Futsal:</b> " + LB + " + " + A + " = through ball.",
            extra="Set pieces follow the keyboard logic: " + A + " short pass, " + X + " shot, " + Y + " cross. " + B + " does nothing in the match: it only goes back in menus.",
            menu_h="MENUS",
            menu="D-pad or stick navigate · " + A + " confirms · " + B + " goes back · " + LB + " opens the album in achievements."),
    p9=dict(hd="ANDROID · TOUCH", big="ON-SCREEN CONTROLS.",
            lead="The game sits in the middle, in 4:3. The controls sit on the black bars at the sides, without covering the pitch.",
            svg=dict(alt="Phone in landscape: game in the middle, d-pad on the left bar, L1, C, B, A and START on the right bar.", game="GAME", dpad="D-PAD", bar="black bar"),
            th=("BUTTON", "IN THE MATCH", "IN MENUS"),
            rows=[("D-PAD", "Move (diagonals work). Slide your finger without lifting it", "Navigate"),
                  (TA, "Pass · without the ball, tackle (hold to chase the ball)", "Confirm"),
                  (TB, "Shoot (hold for more power) · without the ball, aerial duel or switch", "Back"),
                  (TC, "Cross (hold for more power) · without the ball, slide tackle", "—"),
                  (TL1, "Hold to sprint · two taps: step-over · " + TL1 + " + " + TC + " rainbow flick · futsal: " + TL1 + " + " + TA + " through ball", "Album in achievements"),
                  (TST, "Pause · skip the opening · shorten the replay", "Moves on in the futsal and wall set-up")],
            glow_h="THE GOLDEN BUTTON",
            glow="When a screen is waiting for you, the right button gets a <b>blinking golden ring</b>. In menus it is " + TA + " (with the word OK). In the futsal and wall set-up it is " + TST + ". In the match: " + TST + " at the opening and the replay; " + TA + " at the coin toss, the pause and full time.",
            tips_h="TIPS",
            tips=["You can press several buttons at once: d-pad + L1 + shoot, for example.",
                  "To cross while sprinting, release L1 first: with L1 held, C becomes the rainbow flick.",
                  "In futsal, with L1 held, the pass always goes in behind."]),
    p10=dict(hd="ANDROID · CONTROLLER · OPTIONS", big="WITH A CONTROLLER.",
             pad="The Android controller version is for handhelds with physical buttons (R36S, Anbernic, Retroid…) or a phone with a paired controller. Nothing shows on screen: the game sits in 4:3 in the middle and the buttons are the same as the controller on PC (page 8).",
             opt_h="OPTIONS",
             opt=[("LANGUAGE", "Portuguese, English or Spanish."),
                  ("VOLUME", "master, music and effects."),
                  ("FRAME", "PC only: TV, album, poster, comic or FUTIBA art on the sides."),
                  ("FILTER", "NORMAL or TUBE TV."),
                  ("HALF LENGTH", "3, 5 or 7 real minutes per half (pitch)."),
                  ("DIFFICULTY", "easy, normal or hard (changes the CPU).")],
             sec_h="SECRETS",
             sec="Win the Cup or the Championship and two hidden teams show up. And anyone who played videogames in the 90s knows: the opening screen always has a code.",
             ach_h="ACHIEVEMENTS",
             ach="12 achievements unlock stickers in the FUTIBA album: first win, comeback, thrashing, hat-trick, own goal, playing a man down…"),
)

L["es"] = dict(
    html="es", code="ES", title="FUTIBA — Manual del juego",
    nav=[("#comece", "Inicio"), ("#partida", "Partido"), ("#modos", "Modos"), ("#teclado", "PC"), ("#toque", "Android")],
    pdf="Descargar PDF", site="← Sitio",
    foot="FUTIBA 2026 • MANUAL DEL JUEGO",
    cover=dict(h1="MANUAL DEL JUEGO", sub="FÚTBOL A NUESTRA MANERA",
               modes="AMISTOSO • CAMPEONATO • COPA • PENALES • FÚTSAL • PAREDÓN",
               ref="PC (teclado y control) • Android (táctil y control) • referencia: build 52.9"),
    p2=dict(hd="EMPEZÁ A JUGAR", big="RUEDA LA PELOTA.",
            lead="FUTIBA es fútbol de videojuego a la antigua: pase rápido, barrida que pesa, arquero que decide. Menos botones, más lectura de juego: <strong>el mismo botón cambia de función con y sin la pelota.</strong>",
            steps=[("ELEGÍ EL MODO", "Amistoso para ir directo al partido, Campeonato y Copa para campaña, Penales para duelo, Indoor para fútsal y paredón."),
                   ("ELEGÍ EL EQUIPO", "32 clubes, cada uno con plantel, atributos, formación y retrato de cada jugador."),
                   ("ARMÁ EL EQUIPO", "Ajustá la alineación y el esquema. En fútsal y paredón, marcá quién juega de campo."),
                   ("JUGÁ", "Leé la cancha, mové la pelota y elegí el momento del remate.")],
            menu_h="EL MENÚ PRINCIPAL",
            menu=[("AMISTOSO", "partido suelto, con el estadio, la hora y el clima que quieras."),
                  ("CAMPEONATO", "16 clubes, 15 fechas, todos contra todos."),
                  ("COPA", "eliminación de 8 o 16 clubes."),
                  ("PENALES", "directo al punto del penal."),
                  ("INDOOR", "fútsal y paredón."),
                  ("LOGROS", "12 logros y el álbum de figuritas."),
                  ("OPCIONES", "idioma, volumen, filtro, duración del tiempo y dificultad.")]),
    p3=dict(hd="ANTES DEL PITAZO", big="DEL MENÚ AL CÍRCULO CENTRAL.",
            lead="El camino de un partido en la cancha. En cada pantalla, el juego muestra abajo los botones de ese momento.",
            s=[("1 · EQUIPOS", "<b>←/→</b> cambian de club. Confirmá el local, después el visitante. <b>↓</b> lleva a INFO, con la historia del club."),
               ("2 · PREVIA", "Elegí a quién controlás (local, visitante o solo mirar), el estadio (12), la hora (día, tarde, noche) y el clima (sol o lluvia)."),
               ("3 · ALINEACIÓN", "Confirmá un jugador y después otro para intercambiarlos, banco incluido. Abajo: formación, AUTO (el juego arma), RIVAL (ver al rival) y CONFIRMAR."),
               ("4 · APERTURA", "La cámara recorre la tribuna y baja a la cancha. <b>START</b> la saltea."),
               ("5 · CARA O CRUZ", "<b>←/→</b> eligen cara o cruz; confirmar lanza la moneda."),
               ("6 · LADO", "Si ganaste: <b>↑</b> te quedás con la pelota; <b>←</b> o <b>→</b> elige el campo. Si ganó el rival, ves su elección.")]),
    p4=dict(hd="EN EL PARTIDO", big="LO QUE HAY EN PANTALLA.",
            hud=[("MARCADOR", "arriba a la izquierda, con las siglas de los clubes."),
                 ("RELOJ", "arriba a la derecha."),
                 ("RADAR", "abajo al centro: puntos de los dos equipos y la pelota."),
                 ("NOMBRES", "abajo: a la derecha tu jugador, a la izquierda el rival más cercano. Chip amarillo = tarjeta; cruz = lesión."),
                 ("GLOBOS", "los jugadores hablan: piden la pelota, se quejan, festejan.")],
            cards=[("PAUSA", "CONTINUAR, TÁCTICAS y SALIR DEL PARTIDO.", ""),
                   ("TÁCTICAS", "Formación y hasta 3 cambios. Se aplican en la próxima reanudación.", "green"),
                   ("ENTRETIEMPO", "Pantalla de alineación para tocar el equipo. En el 2.º tiempo se cambian los lados.", "blue"),
                   ("GOL", "El goleador festeja, el rival se lamenta, después viene la repetición. <b>START</b> la acorta.", "red"),
                   ("ÁRBITRO", "Faltas, amarilla, roja y lesiones. Roja en tu equipo: volvés a la alineación para reorganizar.", "orange"),
                   ("FINAL", "Resumen con los goles. REVANCHA, NUEVOS EQUIPOS o SELECCIÓN DE MODO.", "purple")]),
    p5=dict(hd="MODOS DE JUEGO", big="ELEGÍ LA PELEA.",
            m=[("AMISTOSO", "ENTRÁS Y JUGÁS", "red", ["Dos equipos, previa, alineación y a rodar.", "Duración en OPCIONES: 3, 5 o 7 minutos reales por tiempo.", "Sin campaña: el marcador termina ahí. La rivalidad, no."]),
               ("CAMPEONATO", "CUENTA TODA LA TEMPORADA", "green", ["16 clubes, una rueda, 15 fechas. Victoria 3, empate 1.", "Desempate: puntos, diferencia de gol, goles a favor.", "Roja o lesión en tu equipo deja al jugador afuera de la fecha siguiente.", "Cada club tiene su propia partida guardada."]),
               ("COPA", "PERDISTE, SE TERMINÓ", "blue", ["Llave de 8 o 16, partido único.", "¿Empate? Se define por penales, jugados por vos.", "Goleadores, tarjetas y lesiones acompañan la campaña."]),
               ("PENALES", "UN REMATE. UNA ESTIRADA.", "purple", ["Armá el orden de los 10 pateadores de cada equipo.", "5 remates por lado y después muerte súbita.", "Pateando: las <b>flechas</b> apuntan (izquierda, centro, derecha; arriba, medio, abajo) y el botón de pase patea.", "En el arco: las <b>flechas</b> eligen la esquina y el botón de pase se tira."])]),
    p6=dict(hd="INDOOR", big="FÚTSAL Y PAREDÓN.",
            setup_h="ARMADO DEL EQUIPO (los dos modos)",
            setup=["Marcá quién juega de campo con el botón de pase.",
                   "El <b>portero-líbero</b> (POR-LÍBERO) es el suplente que puede entrar en lugar del arquero para atacar: elegilo con el botón de remate.",
                   "<b>←/→</b> deciden si el partido arranca con el portero-líbero.",
                   "<b>START</b> pasa al equipo rival y, después, empieza el partido."],
            fut_h="FÚTSAL", fut_tag="4 DE CAMPO + 1 PORTERO",
            fut=["Dos tiempos de 3 minutos reales (el reloj muestra 30 minutos cada uno). No depende de la opción de duración.",
                 "Saque de banda con el pie.",
                 "Las faltas se acumulan: la 6.ª del equipo (y la 12.ª, la 18.ª…) es penal directo.",
                 "El arquero puede pasar la mitad de la cancha.",
                 "Cambios libres, con la pelota en juego.",
                 "El expulsado no vuelve. Un equipo reducido a arquero + 1 pierde por W.O."],
            par_h="PAREDÓN", par_tag="3 DE CAMPO + 1 PORTERO",
            par=["Gana el primero en hacer 5 goles.",
                 "La pelota rebota en la pared: no hay saque de banda, córner ni saque de arco.",
                 "Sin árbitro, sin faltas, sin tarjetas.",
                 "El arquero no puede pasar la mitad: si pasa, la pelota va para el rival. El portero-líbero sí puede.",
                 "Cambios de campo libres, con la pelota en juego (pausa → TÁCTICAS / CAMBIOS)."]),
    p7=dict(hd="CONTROLES · PC · TECLADO", big="TECLADO.",
            lead="En el partido el jugador se mueve <b>solo con las flechas</b>. WASD funciona en los menús.",
            th=("TECLA", "CON LA PELOTA", "SIN LA PELOTA"),
            rows=[(k("←", "↑", "↓", "→"), "Moverse y dar dirección al pase, al centro y al remate", "Moverse"),
                  (k("Z"), "Pase (al compañero en esa dirección)", "Quite de pie. <b>Mantené</b> para correr detrás de la pelota"),
                  (k("X"), "Remate. <b>Mantené</b> para más fuerza (↑/↓ cambian la altura en el arco)", "Pelota aérea (cabezazo, palomita) o cambiar de jugador"),
                  (k("A"), "Centro o pelotazo. <b>Mantené</b> para más fuerza", "Barrida"),
                  (k("SHIFT"), "Mantené para correr. Un toque: gambeta (rulo o enganche). Dos toques rápidos: bicicleta de pies", "Correr"),
                  (k("ESPACIO"), "Lambretta (volantes y delanteros). Durante ella, <kbd>X</kbd> es chilena", "—"),
                  (k("P") + k("ENTER"), "Pausa. <kbd>ENTER</kbd> también saltea la apertura y acorta la repetición", "Pausa")],
            futsal="<b>Fútsal:</b> <kbd>SHIFT</kbd> + <kbd>Z</kbd> = pase en profundidad. Con SHIFT apretado, el pase siempre sale en profundidad.",
            set_h="PELOTA PARADA",
            sets=["<b>Tiro libre:</b> <kbd>←</kbd>/<kbd>→</kbd> eligen el pateador, <kbd>Z</kbd> confirma. Las flechas apuntan. <kbd>Z</kbd> pase corto, <kbd>X</kbd> remate, <kbd>A</kbd> centro.",
                  "<b>Córner y saque de arco:</b> las flechas apuntan, <kbd>Z</kbd> o <kbd>X</kbd> ejecuta.",
                  "<b>Lateral:</b> <kbd>←</kbd>/<kbd>→</kbd> eligen el lado, <kbd>Z</kbd> o <kbd>X</kbd> saca.",
                  "<b>Penal en el partido:</b> mantené <kbd>↑</kbd> o <kbd>↓</kbd> para elegir la esquina (más tiempo = más alto) y pateá con <kbd>Z</kbd> o <kbd>X</kbd>. El arquero se tira solo."],
            menu_h="MENÚS",
            menu="Flechas o WASD navegan · <kbd>Z</kbd> o <kbd>ENTER</kbd> confirman · <kbd>ESC</kbd> o <kbd>X</kbd> vuelven · <kbd>←</kbd>/<kbd>→</kbd> cambian valores · <kbd>L</kbd> abre el álbum en logros."),
    p8=dict(hd="CONTROLES · PC · CONTROL", big="CONTROL.",
            lead="Nombres de botones estilo Xbox. En otros controles, usá el botón en la misma posición.",
            th=("BOTÓN", "CON LA PELOTA", "SIN LA PELOTA"),
            rows=[("D-PAD / ANALÓGICO", "Moverse y dar dirección", "Moverse"),
                  (A, "Pase", "Quite de pie. <b>Mantené</b> para correr detrás de la pelota"),
                  (X, "Remate. <b>Mantené</b> para más fuerza", "Pelota aérea o cambiar de jugador"),
                  (Y, "Centro o pelotazo. <b>Mantené</b> para más fuerza", "Barrida"),
                  (RB, "Mantené para correr. Toque: gambeta. Dos toques: bicicleta de pies", "Correr"),
                  (LB + " + " + Y, "Lambretta (volantes y delanteros). Durante ella, " + X + " es chilena", "—"),
                  (START, "Pausa · saltea la apertura · acorta la repetición", "Pausa")],
            futsal="<b>Fútsal:</b> " + LB + " + " + A + " = pase en profundidad.",
            extra="En pelota parada vale la misma lógica del teclado: " + A + " pase corto, " + X + " remate, " + Y + " centro. " + B + " no hace nada en el partido: solo vuelve en los menús.",
            menu_h="MENÚS",
            menu="D-pad o analógico navegan · " + A + " confirma · " + B + " vuelve · " + LB + " abre el álbum en logros."),
    p9=dict(hd="ANDROID · TÁCTIL", big="CONTROLES EN PANTALLA.",
            lead="El juego queda en el medio, en 4:3. Los controles van en las franjas negras de los costados, sin tapar la cancha.",
            svg=dict(alt="Celular acostado: juego en el medio, cruceta en la franja izquierda, L1, C, B, A y START en la franja derecha.", game="JUEGO", dpad="CRUCETA", bar="franja negra"),
            th=("BOTÓN", "EN EL PARTIDO", "EN LOS MENÚS"),
            rows=[("CRUCETA", "Moverse (vale diagonal). Deslizá el dedo sin soltar", "Navegar"),
                  (TA, "Pase · sin la pelota, quite (mantené para correr detrás de la pelota)", "Confirmar"),
                  (TB, "Remate (mantené para más fuerza) · sin la pelota, pelota aérea o cambio", "Volver"),
                  (TC, "Centro (mantené para más fuerza) · sin la pelota, barrida", "—"),
                  (TL1, "Mantené para correr · dos toques: bicicleta de pies · " + TL1 + " + " + TC + " lambretta · fútsal: " + TL1 + " + " + TA + " pase en profundidad", "Álbum en logros"),
                  (TST, "Pausa · saltea la apertura · acorta la repetición", "Avanza en el armado de fútsal y paredón")],
            glow_h="EL BOTÓN DORADO",
            glow="Cuando una pantalla te está esperando, el botón correcto tiene un <b>anillo dorado que titila</b>. En los menús es " + TA + " (con la palabra OK). En el armado de fútsal y paredón es " + TST + ". En el partido: " + TST + " en la apertura y la repetición; " + TA + " en el cara o cruz, la pausa y el final.",
            tips_h="CONSEJOS",
            tips=["Podés apretar varios botones a la vez: cruceta + L1 + remate, por ejemplo.",
                  "Para centrar corriendo, soltá el L1 antes: con L1 apretado, el C se vuelve lambretta.",
                  "En fútsal, con L1 apretado, el pase siempre sale en profundidad."]),
    p10=dict(hd="ANDROID · CONTROL · OPCIONES", big="CON CONTROL.",
             pad="La versión Android con control es para portátiles con botones físicos (R36S, Anbernic, Retroid…) o celular con control emparejado. No aparece nada en pantalla: el juego queda en 4:3 en el medio y los botones son los mismos del control en PC (página 8).",
             opt_h="OPCIONES",
             opt=[("IDIOMA", "portugués, inglés o español."),
                  ("VOLUMEN", "general, música y efectos."),
                  ("MARCO", "solo en PC: TV, álbum, póster, cómic o FUTIBA a los costados."),
                  ("FILTRO", "NORMAL o TV DE TUBO."),
                  ("DURACIÓN DEL TIEMPO", "3, 5 o 7 minutos reales por tiempo (cancha)."),
                  ("DIFICULTAD", "fácil, normal o difícil (cambia la CPU).")],
             sec_h="SECRETOS",
             sec="Ganá la Copa o el Campeonato y aparecen dos equipos escondidos. Y quien jugaba videojuegos en los 90 sabe: en la pantalla de apertura siempre hay un código.",
             ach_h="LOGROS",
             ach="12 logros liberan figuritas en el álbum de FUTIBA: primera victoria, remontada, goleada, triplete, gol en contra, jugar con uno menos…"),
)


# ---------------------------------------------------------------- páginas
def page(t, pid, hd, n, body, cls=""):
    return f'''<section class="page {cls}" id="{pid}">
  <header class="page__hd"><img src="img/logo.png" alt="FUTIBA"><h2>{hd}</h2></header>
  <div class="page__bd">{body}</div>
  <footer class="page__ft"><span>{t["foot"]}</span><b>{n:02d}</b></footer>
</section>'''


def shot(src, alt, px=False):
    return f'<figure class="shot"><img src="{src}" alt="{alt}" loading="lazy"{" class=px" if px else ""}></figure>'


def keys_table(th, rows):
    h = "".join(f"<th>{x}</th>" for x in th)
    r = "".join(f"<tr><td>{a}</td><td>{b_}</td><td>{c}</td></tr>" for a, b_, c in rows)
    return f'<table class="keys"><tr>{h}</tr>{r}</table>'


def build(lang):
    t = L[lang]
    m = lambda name: f"../assets/v2/menu/{name}-{lang}.png"
    v = lambda name: f"../assets/v2/{name}.jpg"
    out = []
    c = t["cover"]
    out.append(f'''<section class="page cover" id="capa"><div class="cover__in">
  <img class="cover__logo" src="img/logo.png" alt="FUTIBA">
  <h1>{c["h1"]}</h1><p class="sub">{c["sub"]}</p>
  <p class="modes">{c["modes"]}</p><p class="ref">{c["ref"]}</p></div></section>''')

    p = t["p2"]
    steps = "".join(f'<div class="box step"><div class="step__n">{i+1}</div><div><h3>{h}</h3><p>{d}</p></div></div>' for i, (h, d) in enumerate(p["steps"]))
    menu = "".join(f"<li><b>{a}</b>: {d}</li>" for a, d in p["menu"])
    out.append(page(t, "comece", p["hd"], 2, f'''<p class="big">{p["big"]}</p><p class="lead">{p["lead"]}</p>
  <div class="grid g2">{steps}</div>
  <div class="grid g2" style="margin-top:16px;align-items:center">{shot(m("menu"), "Menu", True)}<div class="box box--gold"><h3>{p["menu_h"]}</h3><ul>{menu}</ul></div></div>'''))

    p = t["p3"]
    imgs = [m("times"), None, m("escalacao"), v("est-maracana"), v("moeda"), v("lado")]
    cells = []
    for i, (h, d) in enumerate(p["s"]):
        img = shot(imgs[i], h, imgs[i].endswith(".png")) if imgs[i] else ""
        cells.append(f'<div class="box"><h3>{h}</h3>{img}<p style="margin-top:10px">{d}</p></div>')
    out.append(page(t, "apito", p["hd"], 3, f'''<p class="big">{p["big"]}</p><p class="lead">{p["lead"]}</p><div class="grid g3">{"".join(cells)}</div>'''))

    p = t["p4"]
    hud = "".join(f"<li><b>{a}</b>: {d}</li>" for a, d in p["hud"])
    cards = "".join(f'<div class="box"><span class="tag {cls}">{h}</span><p>{d}</p></div>' for h, d, cls in p["cards"])
    out.append(page(t, "partida", p["hd"], 4, f'''<p class="big">{p["big"]}</p>
  <div class="grid g2" style="align-items:center">{shot(v("jogo-barcelona"), p["big"])}<div class="box box--gold"><ul>{hud}</ul></div></div>
  <div class="grid g3" style="margin-top:16px">{cards}</div>'''))

    p = t["p5"]
    boxes = "".join(f'<div class="box"><span class="tag {cls}">{tag}</span><h3 class="big" style="font-size:20px">{h}</h3><ul>{"".join(f"<li>{x}</li>" for x in items)}</ul></div>' for h, tag, cls, items in p["m"])
    out.append(page(t, "modos", p["hd"], 5, f'''<p class="big">{p["big"]}</p><div class="grid g2">{boxes}</div>
  <div class="grid g2" style="margin-top:16px">{shot(m("penalti-ordem"), "", True)}{shot(f"../assets/v2/menu/penalti-{lang}.jpg", "")}</div>'''))

    p = t["p6"]
    setup = "".join(f"<li>{x}</li>" for x in p["setup"])
    fut = "".join(f"<li>{x}</li>" for x in p["fut"])
    par = "".join(f"<li>{x}</li>" for x in p["par"])
    out.append(page(t, "indoor", p["hd"], 6, f'''<p class="big">{p["big"]}</p>
  <div class="grid g2" style="align-items:center">{shot(m("futsal-setup"), p["setup_h"], True)}<div class="box box--gold"><h3>{p["setup_h"]}</h3><ul>{setup}</ul></div></div>
  <div class="grid g2" style="margin-top:16px">
    <div class="box"><span class="tag red">{p["fut_tag"]}</span><h3>{p["fut_h"]}</h3>{shot(v("futsal-1"), p["fut_h"])}<ul style="margin-top:10px">{fut}</ul></div>
    <div class="box"><span class="tag blue">{p["par_tag"]}</span><h3>{p["par_h"]}</h3>{shot(v("paredao-1"), p["par_h"])}<ul style="margin-top:10px">{par}</ul></div>
  </div>'''))

    p = t["p7"]
    sets = "".join(f"<li>{x}</li>" for x in p["sets"])
    out.append(page(t, "teclado", p["hd"], 7, f'''<p class="big">{p["big"]}</p><p class="lead">{p["lead"]}</p>
  {keys_table(p["th"], p["rows"])}
  <p class="box box--gold" style="margin-top:10px">{p["futsal"]}</p>
  <div class="grid g2" style="margin-top:12px"><div class="box"><h3>{p["set_h"]}</h3><ul>{sets}</ul></div><div class="box"><h3>{p["menu_h"]}</h3><p>{p["menu"]}</p></div></div>'''))

    p = t["p8"]
    out.append(page(t, "controle", p["hd"], 8, f'''<p class="big">{p["big"]}</p><p class="lead">{p["lead"]}</p>
  {keys_table(p["th"], p["rows"])}
  <p class="box box--gold" style="margin-top:10px">{p["futsal"]}</p>
  <div class="grid g2" style="margin-top:12px"><div class="box"><p>{p["extra"]}</p></div><div class="box"><h3>{p["menu_h"]}</h3><p>{p["menu"]}</p></div></div>'''))

    p = t["p9"]
    tips = "".join(f"<li>{x}</li>" for x in p["tips"])
    out.append(page(t, "toque", p["hd"], 9, f'''<p class="big">{p["big"]}</p><p class="lead">{p["lead"]}</p>
  <div class="grid g2" style="align-items:center">{phone_svg(p["svg"])}<div class="box box--gold"><h3>{p["glow_h"]}</h3><p>{p["glow"]}</p></div></div>
  {keys_table(p["th"], p["rows"])}
  <div class="box" style="margin-top:10px"><h3>{p["tips_h"]}</h3><ul>{tips}</ul></div>'''))

    p = t["p10"]
    opt = "".join(f"<li><b>{a}</b>: {d}</li>" for a, d in p["opt"])
    out.append(page(t, "gamepad", p["hd"], 10, f'''<p class="big">{p["big"]}</p><p class="lead">{p["pad"]}</p>
  <div class="grid g2" style="align-items:start">{shot(m("opcoes"), p["opt_h"], True)}<div class="box"><h3>{p["opt_h"]}</h3><ul>{opt}</ul></div></div>
  <div class="grid g2" style="margin-top:16px"><div class="box box--gold"><h3>{p["sec_h"]}</h3><p>{p["sec"]}</p></div><div class="box"><h3>{p["ach_h"]}</h3><p>{p["ach"]}</p></div></div>'''))

    nav = "".join(f'<a href="{h}">{n}</a>' for h, n in t["nav"])
    langs = "".join(f'<a href="/manual/{x}"{" aria-current=page" if x == lang else ""}>{x.upper()}</a>' for x in ("pt", "en", "es"))
    return f'''<!DOCTYPE html>
<html lang="{t["html"]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t["title"]}</title>
<meta name="description" content="{t["title"]}: {t["cover"]["modes"]}.">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
<link rel="stylesheet" href="manual.css">
</head>
<body>
<div class="topbar"><div class="topbar__in"><a href="/index2?lang={lang}" style="border:0;padding:0"><img src="img/logo.png" alt="FUTIBA"></a>
<nav>{nav}{langs}<a class="pdf" href="FUTIBA_MANUAL_{t["code"]}.pdf" download>{t["pdf"]}</a></nav></div></div>
{"".join(out)}
</body>
</html>
'''


def main():
    for lang in ("pt", "en", "es"):
        with open(os.path.join(OUT, lang + ".html"), "w", encoding="utf-8", newline="\n") as f:
            f.write(build(lang))
        print("manual/%s.html" % lang)
    if "--pdf" in sys.argv:
        edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
        port = sys.argv[sys.argv.index("--pdf") + 1] if len(sys.argv) > sys.argv.index("--pdf") + 1 else "8765"
        for lang in ("pt", "en", "es"):
            pdf = os.path.join(OUT, "FUTIBA_MANUAL_%s.pdf" % lang.upper())
            subprocess.run([edge, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                            "--virtual-time-budget=15000", "--run-all-compositor-stages-before-draw",
                            "--print-to-pdf=" + pdf, "http://localhost:%s/manual/%s.html" % (port, lang)], check=True)
            print(pdf, os.path.getsize(pdf))


if __name__ == "__main__":
    main()
