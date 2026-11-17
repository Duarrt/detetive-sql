# Detetive SQL / SQL Detective

Jogo de navegador para aprender SQL do básico ao avançado, resolvendo pequenos crimes na Vila Pacata sob o comando do sarcástico Delegado Bastos. Disponível em português (pt-BR) e inglês (en-US).

*A browser game to learn SQL from basic to advanced by solving petty crimes in Vila Pacata for the sarcastic Chief Bastos. Available in Brazilian Portuguese and US English.*

- 13 casos em 5 fases: SELECT e WHERE, agregação, JOINs, subconsultas e CASE, CTEs e funções de janela.
- As consultas rodam num SQLite dentro do navegador ([sql.js](https://github.com/sql-js/sql.js)); não há servidor nem banco de dados remoto.
- Progresso salvo só no `localStorage` do navegador do jogador.
- Idioma: botão PT/EN no topo. Na primeira visita segue o idioma do navegador; dá para forçar com `?lang=pt` ou `?lang=en`. Na versão em inglês, o banco (tabelas, colunas e valores) também é traduzido.

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

O e-mail de contato fica em `privacidade.html` e `privacy.html`.

## Privacidade e segurança

- Nenhuma requisição a terceiros: fontes e sql.js estão em `fonts/` e `vendor/`.
- CSP restritiva: só scripts, estilos e fontes do próprio domínio; nada de scripts inline.
- Sem cookies, login, formulários, analytics ou anúncios.
- Comandos que alteram dados (INSERT, UPDATE, DELETE, DROP…) rodam e em seguida o banco é restaurado ao estado original.

## Estrutura

```
index.html          jogo
privacidade.html    política de privacidade (pt-BR)
privacy.html        privacy policy (en-US)
css/style.css       estilos e @font-face locais
js/i18n.js          textos da interface em pt-BR e en-US
js/data.js          banco e casos em pt-BR (SEED, CASES)
js/data-en.js       banco e casos em en-US (SEED_EN, CASES_EN)
js/game.js          lógica do jogo
vendor/sql.js/      sql.js 1.13.0, build asm.js (licença MIT)
fonts/              Special Elite (Apache 2.0), Courier Prime e Work Sans (SIL OFL 1.1)
_headers            cabeçalhos de segurança para Cloudflare Pages / Netlify
```

## Criar novos casos

Cada caso em `js/data.js` (e o equivalente em `js/data-en.js`, mesma posição na lista) tem `historia`, `conceito`, `exemplo`, `objetivo`, `dicas`, `solucao` e `fim`. A resposta da jogadora é aceita quando o resultado bate com o de `solucao` (mesmas colunas, na mesma ordem, e mesmas linhas; a ordem das linhas só conta quando `ordem: true`).

O progresso (casos resolvidos, XP, dicas) é compartilhado entre os idiomas pela posição do caso, então mantenha as duas listas com a mesma quantidade e ordem de casos.
