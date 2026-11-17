# Detetive SQL

Jogo de navegador para aprender SQL do básico ao avançado, resolvendo pequenos crimes na Vila Pacata sob o comando do sarcástico Delegado Bastos.

- 13 casos em 5 fases: SELECT e WHERE, agregação, JOINs, subconsultas e CASE, CTEs e funções de janela.
- As consultas rodam num SQLite dentro do navegador ([sql.js](https://github.com/sql-js/sql.js)); não há servidor nem banco de dados remoto.
- Progresso salvo só no `localStorage` do navegador do jogador.

## Rodar localmente

É um site estático. Qualquer servidor HTTP serve:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar

Sirva a pasta como está (GitHub Pages, Cloudflare Pages, Netlify ou o seu servidor).

- **Cloudflare Pages / Netlify:** o arquivo `_headers` aplica a CSP e os demais cabeçalhos de segurança.
- **GitHub Pages:** não aceita cabeçalhos customizados; a CSP do `<meta>` em cada página cobre o principal (sem `frame-ancestors`).
- **Servidor próprio (nginx, Apache etc.):** replique os cabeçalhos de `_headers` na configuração e force HTTPS.

Antes de publicar, troque o e-mail de contato em `privacidade.html`.

## Privacidade e segurança

- Nenhuma requisição a terceiros: fontes e sql.js estão em `fonts/` e `vendor/`.
- CSP restritiva: só scripts, estilos e fontes do próprio domínio; nada de scripts inline.
- Sem cookies, login, formulários, analytics ou anúncios.
- Comandos que alteram dados (INSERT, UPDATE, DELETE, DROP…) rodam e em seguida o banco é restaurado ao estado original.

## Estrutura

```
index.html          jogo
privacidade.html    política de privacidade
css/style.css       estilos e @font-face locais
js/data.js          banco da Vila Pacata (SEED) e os casos (CASES)
js/game.js          lógica do jogo
vendor/sql.js/      sql.js 1.13.0, build asm.js (licença MIT)
fonts/              Special Elite (Apache 2.0), Courier Prime e Work Sans (SIL OFL 1.1)
_headers            cabeçalhos de segurança para Cloudflare Pages / Netlify
```

## Criar novos casos

Cada caso em `js/data.js` tem `historia`, `conceito`, `exemplo`, `objetivo`, `dicas`, `solucao` e `fim`. A resposta da jogadora é aceita quando o resultado bate com o de `solucao` (mesmas colunas, na mesma ordem, e mesmas linhas; a ordem das linhas só conta quando `ordem: true`).
