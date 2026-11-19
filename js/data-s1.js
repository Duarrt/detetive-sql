window.SEED_S1 = `
INSERT INTO moradores VALUES (16,'Hermes Bastos','delegado','Centro',61,'quepe');
CREATE TABLE telefones (numero TEXT PRIMARY KEY, morador_id INTEGER);
INSERT INTO telefones VALUES
('41 99999-0016',16),('41 99999-0002',2),('41 99999-0012',12),('41 99999-0013',13),('41 99999-0009',9),
('41 99999-0011',11),('41 99999-0001',1),('41 99999-0005',5),('41 99999-0007',7),('41 99999-0014',14);
CREATE TABLE mensagens (id INTEGER PRIMARY KEY, data TEXT, hora TEXT, de TEXT, para TEXT, texto TEXT);
INSERT INTO mensagens VALUES
(1,'2026-10-28','10:00','41 99999-0007','41 99999-0016','Delegado, quer investir em figurinhas? Retorno garantido.'),
(2,'2026-10-29','09:10','41 99999-0016','41 99999-0013','Matheus, traz pão de queijo. E as planilhas do Fundo da Praça.'),
(3,'2026-10-29','16:00','0800 555 0101','41 99999-0016','Parabéns! Você foi pré-aprovado para um consórcio de lancha.'),
(4,'2026-10-29','21:40','41 99999-0012','41 99999-0016','Delegado, a luz da casa da síndica ficou acesa até tarde de novo. Só comentando. Não estou vigiando ninguém.'),
(5,'2026-10-30','08:05','41 99999-0016','41 99999-0002','Síndica, preciso dos extratos do Fundo da Praça. Hoje.'),
(6,'2026-10-30','08:47','41 99999-0002','41 99999-0016','Claro, delegado! Mando na segunda sem falta :)'),
(7,'2026-10-30','11:20','41 90000-1313','41 99999-0016','Prezado Delegado Hermes Bastos: o senhor foi eleito Delegado Destaque do Ano! Cerimônia no Congresso Nacional de Delegados, Hotel Serra do Esquecimento, sábado. Passagem cortesia: ônibus de sexta, 18:40.'),
(8,'2026-10-30','11:24','41 99999-0016','41 90000-1313','Aceito. Finalmente alguém reconhece meu trabalho.'),
(9,'2026-10-30','14:02','41 99999-0016','41 99999-0013','O Fundo da Praça não fecha: arrecadamos 30 mil e tem 12 na conta. Volto segunda e resolvo. Não conta pra ninguém.'),
(10,'2026-10-30','14:03','41 99999-0013','41 99999-0016','Ok! (contei pra Dona Lúcia sem querer)'),
(11,'2026-10-30','17:55','41 99999-0016','41 99999-0012','Dona Lúcia, rega minha samambaia nova. A antiga foi furtada, como a senhora sabe.'),
(12,'2026-10-30','19:30','41 99999-0002','41 99999-0011','Wagner, caiu mais um pagamento de "aulas" na sua conta. Já sabe o que fazer.'),
(13,'2026-10-31','10:00','41 99999-0012','41 99999-0016','Delegado? Delegado?? A samambaia está bem. O senhor não responde.'),
(14,'2026-11-02','08:30','41 99999-0013','41 99999-0016','Delegado, cadê o senhor? O café esfriou.');
CREATE TABLE fundo_praca (id INTEGER PRIMARY KEY, data TEXT, hora TEXT, tipo TEXT, valor REAL, descricao TEXT, conta TEXT);
INSERT INTO fundo_praca VALUES
(1,'2026-08-01','10:00','entrada',15000,'Repasse da prefeitura',NULL),
(2,'2026-08-05','20:00','entrada',5000,'Festa de arrecadação',NULL),
(3,'2026-08-20','21:00','entrada',6000,'Bingo da praça',NULL),
(4,'2026-09-02','18:00','entrada',4000,'Doações dos moradores',NULL),
(5,'2026-09-10','14:00','saida',2500,'Mudas e flores','1200-5'),
(6,'2026-09-12','15:30','saida',500,'Tinta para os bancos','4410-2'),
(7,'2026-09-20','23:41','saida',5000,'Reforma do coreto - parcela 1','7781-0'),
(8,'2026-10-04','23:15','saida',5000,'Reforma do coreto - parcela 2','7781-0'),
(9,'2026-10-18','23:58','saida',5000,'Reforma do coreto - parcela 3','7781-0');
CREATE TABLE notas_fiscais (id INTEGER PRIMARY KEY, fundo_id INTEGER, fornecedor TEXT, numero TEXT, descricao TEXT);
INSERT INTO notas_fiscais VALUES
(1,5,'Floricultura Melo','NF-1043','120 mudas de flores'),
(2,6,'Tinta & Cia','NF-88','Tinta esmalte verde, 18 litros');
CREATE TABLE cameras (id INTEGER PRIMARY KEY, local TEXT, data TEXT, hora TEXT, morador_id INTEGER);
INSERT INTO cameras VALUES
(1,'Delegacia','2026-10-29','08:02',16),
(2,'Padaria do Marcos','2026-10-29','12:40',16),
(3,'Delegacia','2026-10-30','07:58',16),
(4,'Padaria do Marcos','2026-10-30','12:30',16),
(5,'Delegacia','2026-10-30','13:10',16),
(6,'Rodoviária','2026-10-30','18:05',16),
(7,'Rodoviária','2026-10-30','18:20',2),
(8,'Padaria do Marcos','2026-10-30','07:30',12),
(9,'Praça','2026-10-30','16:00',12),
(10,'Delegacia','2026-11-02','08:15',13);
CREATE TABLE onibus (id INTEGER PRIMARY KEY, morador_id INTEGER, data TEXT, hora TEXT, linha TEXT, destino TEXT);
INSERT INTO onibus VALUES
(1,15,'2026-10-30','07:10','210','Centro'),
(2,16,'2026-10-30','18:40','777','Serra do Esquecimento'),
(3,2,'2026-10-30','18:50','210','Vila Nova'),
(4,12,'2026-10-31','09:00','210','Centro');
CREATE TABLE acessos_banco (id INTEGER PRIMARY KEY, data TEXT, hora TEXT, usuario TEXT, ip TEXT, acao TEXT);
INSERT INTO acessos_banco VALUES
(1,'2026-09-10','13:55','celia','189.4.22.10','pagamento'),
(2,'2026-09-12','15:25','celia','189.4.22.10','pagamento'),
(3,'2026-09-15','22:30','celia','189.4.22.10','consulta'),
(4,'2026-09-19','10:00','celia','189.4.22.10','consulta'),
(5,'2026-09-20','23:40','tesouraria','177.10.0.45','pagamento'),
(6,'2026-10-04','23:14','tesouraria','177.10.0.45','pagamento'),
(7,'2026-10-18','23:57','tesouraria','177.10.0.45','pagamento'),
(8,'2026-10-21','09:15','celia','189.4.22.10','consulta'),
(9,'2026-10-25','23:30','tesouraria','177.10.0.45','consulta');
CREATE TABLE conexoes_wifi (id INTEGER PRIMARY KEY, morador_id INTEGER, ip TEXT, data TEXT);
INSERT INTO conexoes_wifi (morador_id, ip, data) VALUES
(2,'177.10.0.45','2026-09-20'),(2,'177.10.0.45','2026-10-04'),(2,'177.10.0.45','2026-10-18'),(2,'177.10.0.45','2026-10-25'),
(11,'177.10.0.45','2026-09-20'),(11,'177.10.0.45','2026-10-04'),(11,'177.10.0.45','2026-10-18'),
(14,'177.10.0.45','2026-10-04'),(14,'177.10.0.45','2026-10-04'),(14,'177.10.0.45','2026-10-04'),
(8,'177.10.0.45','2026-09-20'),(8,'177.10.0.45','2026-10-18'),
(5,'189.4.22.10','2026-09-20'),(5,'189.4.22.10','2026-10-04'),(5,'189.4.22.10','2026-10-18');
CREATE TABLE contas (conta TEXT PRIMARY KEY, titular_id INTEGER, banco TEXT, tipo TEXT);
INSERT INTO contas VALUES
('7781-0',NULL,'Banco Pacato','PJ - Pacata Reformas ME'),
('3320-1',11,'Banco Pacato','corrente'),
('9054-7',2,'Banco do Bairro','poupança'),
('1200-5',14,'Banco Pacato','PJ - Floricultura Melo'),
('4410-2',NULL,'Banco do Bairro','PJ - Tinta & Cia'),
('5500-9',7,'CriptoBank','corrente');
CREATE TABLE transferencias (id INTEGER PRIMARY KEY, data TEXT, conta_origem TEXT, conta_destino TEXT, valor REAL);
INSERT INTO transferencias VALUES
(1,'2026-09-21','7781-0','3320-1',5000),
(2,'2026-09-21','3320-1','9054-7',4500),
(3,'2026-10-02','5500-9','1200-5',80),
(4,'2026-10-05','7781-0','3320-1',5000),
(5,'2026-10-05','3320-1','9054-7',4500),
(6,'2026-10-10','1200-5','5500-9',20),
(7,'2026-10-19','7781-0','3320-1',5000),
(8,'2026-10-19','3320-1','9054-7',4500);
`;

window.CASES_S1 = [
{titulo:'Segunda-feira sem café',
 historia:`Segunda-feira, 2 de novembro. O Delegado Bastos não apareceu. A caneca dele está fria, a cadeira está vazia e na mesa só tem um bilhete: <b>"Se eu sumir, olha no banco."</b>\n\nQuem fala agora sou eu, Dona Lúcia, assistente voluntária não remunerada da delegacia. Eu não vigio ninguém, eu só presto atenção. Vamos começar pelo celular dele: <b>41 99999-0016</b>. Quero tudo o que ele mandou ou recebeu desde <b>2026-10-29</b>, na ordem em que aconteceu.`,
 conceito:`Quando o filtro mistura <b>OR</b> e <b>AND</b>, use <b>parênteses</b>: sem eles, o AND é avaliado primeiro e o resultado sai errado. Datas no formato 'AAAA-MM-DD' comparam certinho com <code>&gt;=</code>. E <b>ORDER BY</b> aceita várias colunas: ordena pela primeira e desempata pela segunda.`,
 exemplo:`SELECT * FROM cameras\nWHERE (morador_id = 12 OR morador_id = 2)\n  AND data >= '2026-10-30'\nORDER BY data, hora;`,
 objetivo:'Mostre data, hora, de, para e texto das mensagens enviadas OU recebidas pelo 41 99999-0016 a partir de 2026-10-29, ordenadas por data e hora.',
 dicas:[`WHERE (de = '41 99999-0016' OR para = '41 99999-0016') AND data >= '2026-10-29'`,'Termine com ORDER BY data, hora.'],
 solucao:`SELECT data, hora, de, para, texto FROM mensagens\nWHERE (de = '41 99999-0016' OR para = '41 99999-0016')\n  AND data >= '2026-10-29'\nORDER BY data, hora;`, ordem:true,
 fim:'Ele aceitou um prêmio de "Delegado Destaque do Ano". O homem que levou três anos para resolver o Caso do Iogurte. Isso não me cheira bem. E o Fundo da Praça não fecha.',
 pista:'Sexta, 30/10: Bastos aceitou um convite para um "Congresso Nacional de Delegados" e avisou que o Fundo da Praça não fecha: 30 mil arrecadados, 12 na conta.'},

{titulo:'O número sem dono',
 historia:`O convite veio de um número que eu não conheço, e eu conheço todo mundo. A tabela <b>telefones</b> diz de quem é cada número da vila. Quero a lista dos números que mandaram mensagem para o delegado e <b>não têm dono</b> cadastrado. Sem repetir número.`,
 conceito:`<b>DISTINCT</b> remove linhas repetidas do resultado. Para achar quem "não tem par" em outra tabela, o velho truque do Prólogo: <b>LEFT JOIN</b> e filtrar onde o lado da direita veio <b>NULL</b>.<br><br>Outro caminho que também funciona: <code>WHERE de NOT IN (SELECT numero FROM telefones)</code>. Cuidado só com um detalhe: se a subconsulta devolver algum NULL, o NOT IN não traz nada. Com LEFT JOIN + IS NULL isso não acontece.`,
 exemplo:`SELECT DISTINCT local FROM cameras;`,
 objetivo:'Liste, sem repetição, os números (coluna de) que mandaram mensagem para o 41 99999-0016 e não aparecem na tabela telefones.',
 dicas:['FROM mensagens m LEFT JOIN telefones t ON t.numero = m.de',`WHERE m.para = '41 99999-0016' AND t.numero IS NULL, com SELECT DISTINCT m.de`],
 solucao:`SELECT DISTINCT m.de\nFROM mensagens m\nLEFT JOIN telefones t ON t.numero = m.de\nWHERE m.para = '41 99999-0016' AND t.numero IS NULL;`, ordem:false,
 fim:'Dois números. Um é a central de consórcio do Marcelo, que liga para a vila inteira, inclusive para mim, três vezes por dia. O outro é um chip pré-pago comprado em dinheiro. Ninguém dá prêmio por chip pré-pago.',
 pista:'O convite veio de um chip pré-pago sem dono (41 90000-1313). Ninguém na vila admite conhecer esse número.'},

{titulo:'A conta que não fecha',
 historia:`O delegado disse que o Fundo da Praça arrecadou 30 mil e só tem 12 na conta. O Fundo era para reformar o coreto. Eu passo pela praça todo dia (por acaso) e o coreto está igualzinho: mesma tinta descascando, mesmo pombo.\n\nQuero <b>uma linha só</b> com o total de entradas, o total de saídas e o saldo.`,
 conceito:`<b>CASE</b> dentro de <b>SUM</b> soma só o que interessa: <code>SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END)</code> soma apenas as entradas. Dá para fazer várias somas condicionais na mesma consulta, sem GROUP BY.`,
 exemplo:`SELECT\n  SUM(CASE WHEN idade >= 50 THEN 1 ELSE 0 END) AS cinquenta_mais,\n  SUM(CASE WHEN idade < 50 THEN 1 ELSE 0 END) AS menos_de_50\nFROM moradores;`,
 objetivo:'Mostre, numa linha, três colunas: o total de entradas, o total de saídas e o saldo (entradas menos saídas) da tabela fundo_praca.',
 dicas:[`SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) para as entradas; o mesmo com 'saida'.`,`Saldo: SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END)`],
 solucao:`SELECT\n  SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS entradas,\n  SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS saidas,\n  SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) AS saldo\nFROM fundo_praca;`, ordem:false,
 fim:'Entraram 30 mil, saíram 18 mil. Dezoito mil reais e o pombo continua lá. Ou esse coreto foi reformado por dentro, ou alguém reformou outra coisa.',
 pista:'Saíram 18 mil do Fundo da Praça e o coreto continua igual. A conta bate, a praça não.'},

{titulo:'Serviço fantasma',
 historia:`Todo pagamento honesto tem nota fiscal. A floricultura da Sandra tem, a loja de tinta tem. Quero as <b>saídas do fundo que não têm nenhuma nota fiscal</b> correspondente na tabela <b>notas_fiscais</b>.`,
 conceito:`<b>NOT EXISTS</b> testa se uma subconsulta <i>não</i> encontra nada. Para cada linha de fora, o banco roda a subconsulta: se ela volta vazia, a linha entra no resultado. É o jeito mais direto de perguntar "quem não tem…".`,
 exemplo:`SELECT nome FROM moradores m\nWHERE NOT EXISTS (\n  SELECT 1 FROM telefones t WHERE t.morador_id = m.id\n);`,
 objetivo:'Mostre data, valor, descricao e conta das saídas do fundo_praca que não têm nenhuma nota em notas_fiscais (notas_fiscais.fundo_id aponta para fundo_praca.id).',
 dicas:[`WHERE f.tipo = 'saida' AND NOT EXISTS (...)`,'Dentro do NOT EXISTS: SELECT 1 FROM notas_fiscais n WHERE n.fundo_id = f.id'],
 solucao:`SELECT f.data, f.valor, f.descricao, f.conta\nFROM fundo_praca f\nWHERE f.tipo = 'saida'\n  AND NOT EXISTS (SELECT 1 FROM notas_fiscais n WHERE n.fundo_id = f.id);`, ordem:false,
 fim:'Três parcelas de 5 mil para a "Pacata Reformas ME", conta 7781-0. Procurei no catálogo telefônico, na junta comercial e no grupo da igreja. Essa empresa não existe. Nem o coreto sabe dela.',
 pista:'15 mil foram pagos em três parcelas à "Pacata Reformas ME" (conta 7781-0), sem nenhuma nota fiscal. A empresa não tem endereço, telefone nem obra.'},

{titulo:'A última viagem',
 historia:`Preciso saber onde o delegado esteve na sexta, <b>2026-10-30</b>. Tenho duas fontes: as <b>cameras</b> da vila e os registros do <b>onibus</b>. Quero uma linha do tempo só, juntando as duas, em ordem de horário.`,
 conceito:`<b>UNION ALL</b> empilha o resultado de duas consultas, uma embaixo da outra. As duas precisam ter o mesmo número de colunas, na mesma ordem. Dá para criar uma coluna fixa com um texto, como <code>'camera' AS fonte</code>. O <b>ORDER BY</b> vai no final e vale para tudo. (UNION sem ALL também remove duplicatas.)`,
 exemplo:`SELECT nome FROM moradores WHERE bairro = 'Centro'\nUNION ALL\nSELECT nome FROM moradores WHERE idade > 60;`,
 objetivo:'Para o morador 16 em 2026-10-30, mostre hora, fonte e lugar: das cameras (fonte = \'camera\', lugar = local) e do onibus (fonte = \'onibus\', lugar = destino), tudo ordenado por hora.',
 dicas:[`SELECT hora, 'camera' AS fonte, local AS lugar FROM cameras WHERE ...`,`... UNION ALL SELECT hora, 'onibus', destino FROM onibus WHERE ... ORDER BY hora`],
 solucao:`SELECT hora, 'camera' AS fonte, local AS lugar\nFROM cameras WHERE morador_id = 16 AND data = '2026-10-30'\nUNION ALL\nSELECT hora, 'onibus', destino\nFROM onibus WHERE morador_id = 16 AND data = '2026-10-30'\nORDER BY hora;`, ordem:true,
 fim:'Às 18:40 ele embarcou no ônibus para a Serra do Esquecimento, onde celular não pega e o hotel só tem rádio AM. Liguei para lá: não existe nenhum congresso. Ele está bem, provavelmente sentado no saguão esperando uma cerimônia que nunca vai acontecer. Alguém quis o delegado longe daqui. Ah, e a câmera da rodoviária pegou outra pessoa às 18:20, mas eu não sou de fazer fofoca.',
 pista:'Sexta, 18:40: Bastos pegou o ônibus para a Serra do Esquecimento, sem sinal de celular. O congresso não existe: alguém o tirou da vila de propósito.'},

{titulo:'Expediente noturno',
 historia:`O Fundo da Praça tem internet banking. A tesoureira é a professora Célia, que faz tudo em horário comercial e responde e-mail com "Prezados". Mas existe também um login genérico, "tesouraria", que qualquer um com a senha usa.\n\nQuero os acessos feitos no <b>fim de semana</b> e <b>a partir das 22:00</b>.`,
 conceito:`<b>strftime</b> extrai partes de uma data. <code>strftime('%w', data)</code> devolve o dia da semana como texto: <b>'0' é domingo</b> e <b>'6' é sábado</b>. Com <b>IN</b> você testa vários valores de uma vez: <code>dia IN ('0', '6')</code> é o mesmo que <code>dia = '0' OR dia = '6'</code>. Repare que o resultado de strftime é <i>texto</i>, por isso os números vão entre aspas. Outros formatos úteis: <code>'%Y'</code> ano, <code>'%m'</code> mês, <code>'%d'</code> dia.`,
 exemplo:`SELECT data, strftime('%w', data) AS dia_semana\nFROM onibus;`,
 objetivo:'Mostre data, hora, usuario e ip dos acessos_banco feitos em sábado ou domingo, com hora a partir de 22:00.',
 dicas:[`strftime('%w', data) IN ('0', '6')`,`... AND hora >= '22:00'`],
 solucao:`SELECT data, hora, usuario, ip FROM acessos_banco\nWHERE strftime('%w', data) IN ('0', '6')\n  AND hora >= '22:00';`, ordem:false,
 fim:'Todos domingo, todos perto da meia-noite, todos do IP 177.10.0.45. Três pagamentos e uma consulta no domingo seguinte, só para admirar o saldo. Quem trabalha domingo às 23h? Padeiro e golpista. E o padeiro estava dormindo, eu vi.',
 pista:'Os três pagamentos à empresa fantasma foram autorizados domingo, perto da meia-noite, pelo login "tesouraria", sempre do IP 177.10.0.45.'},

{titulo:'Mesma rede',
 historia:`O IP 177.10.0.45 é de um roteador da Vila Nova. A operadora mandou os registros de quem conectou nele (tabela <b>conexoes_wifi</b>). Quero quem estava conectado <b>nas três datas</b> dos pagamentos: <b>2026-09-20</b>, <b>2026-10-04</b> e <b>2026-10-18</b>. Cuidado: tem gente que conectou várias vezes no mesmo dia.`,
 conceito:`<b>IN ('a', 'b', 'c')</b> filtra por uma lista de valores, sem escrever três OR. <b>COUNT(DISTINCT coluna)</b> conta só os valores diferentes: três conexões no mesmo dia contam como <i>uma</i> data. Combinado com <b>HAVING</b>, responde "quem aparece em todas as datas".`,
 exemplo:`SELECT morador_id, COUNT(DISTINCT data) AS dias\nFROM padaria\nGROUP BY morador_id\nHAVING COUNT(DISTINCT data) >= 5;`,
 objetivo:'Mostre o nome de quem esteve conectado ao IP 177.10.0.45 em todas as três datas (2026-09-20, 2026-10-04 e 2026-10-18).',
 dicas:[`JOIN moradores e WHERE w.ip = '177.10.0.45' AND w.data IN ('2026-09-20', '2026-10-04', '2026-10-18')`,'GROUP BY m.id HAVING COUNT(DISTINCT w.data) = 3'],
 solucao:`SELECT m.nome\nFROM conexoes_wifi w\nJOIN moradores m ON m.id = w.morador_id\nWHERE w.ip = '177.10.0.45'\n  AND w.data IN ('2026-09-20', '2026-10-04', '2026-10-18')\nGROUP BY m.id\nHAVING COUNT(DISTINCT w.data) = 3;`, ordem:false,
 fim:'Marta Gouveia, a síndica, dona do roteador. E Wagner Dias, o personal trainer, que mora no andar de cima e usa o wi-fi dela sem pedir. Lembra do furto de wi-fi do Prólogo? Pois é. Dois suspeitos, uma rede, e a Sandra conectou três vezes no mesmo dia só para mandar foto de flor.',
 rostos:['marta','wagner'],
 pista:'Nas três madrugadas, só dois aparelhos estavam no IP 177.10.0.45: o da síndica Marta (dona do roteador) e o do Wagner (que usa o wi-fi dela sem pedir).'},

{titulo:'Caso final: siga o dinheiro',
 historia:`Dois suspeitos. Um deles ficou com o dinheiro. O banco mandou as <b>transferencias</b> e o cadastro das <b>contas</b>.\n\nO dinheiro saiu da conta da empresa fantasma, <b>7781-0</b>, e foi pulando de conta em conta. Siga a trilha até onde ele <b>para</b>, ou seja, a conta que recebeu e não transferiu para mais ninguém. Quero <b>só o nome</b> do titular dessa conta. E depois, por favor, alguém vai buscar o delegado na serra.`,
 conceito:`<b>WITH RECURSIVE</b> cria uma CTE que se chama a si mesma: uma parte inicial (o ponto de partida) e uma parte recursiva que dá "mais um passo" a partir do que já foi encontrado, até não achar mais nada. Use <b>UNION</b> (sem ALL) entre as partes para não repetir contas.`,
 exemplo:`WITH RECURSIVE contagem(n) AS (\n  SELECT 1\n  UNION\n  SELECT n + 1 FROM contagem WHERE n < 5\n)\nSELECT n FROM contagem;`,
 objetivo:'A partir da conta 7781-0, siga as transferencias até a conta que não transfere para ninguém e mostre só o nome do titular dela.',
 dicas:['WITH RECURSIVE trilha(conta) AS (SELECT \'7781-0\' UNION SELECT t.conta_destino FROM transferencias t JOIN trilha ON t.conta_origem = trilha.conta)','Depois: JOIN contas e moradores, e WHERE NOT EXISTS (SELECT 1 FROM transferencias t WHERE t.conta_origem = trilha.conta)'],
 solucao:`WITH RECURSIVE trilha(conta) AS (\n  SELECT '7781-0'\n  UNION\n  SELECT t.conta_destino\n  FROM transferencias t\n  JOIN trilha ON t.conta_origem = trilha.conta\n)\nSELECT m.nome\nFROM trilha\nJOIN contas c ON c.conta = trilha.conta\nJOIN moradores m ON m.id = c.titular_id\nWHERE NOT EXISTS (\n  SELECT 1 FROM transferencias t WHERE t.conta_origem = trilha.conta\n);`, ordem:false,
 fim:'Marta Gouveia. A síndica. A mesma que, lá no Prólogo, jurava que havia uma "quadrilha organizada" na Vila Nova: era cortina de fumaça. O dinheiro passava pela conta do Wagner, que achou que eram "pagamentos de aulas", ficou com 10% e não perguntou nada (vai ter que explicar). O chip pré-pago e o convite falso tiraram o delegado da vila antes que os extratos chegassem. Buscamos o Bastos na Serra do Esquecimento: bronzeado, com um certificado de "Delegado Destaque" impresso numa gráfica e uma única frase: "Eu sabia que esse banco ia me salvar." Caso encerrado. O Caso do Iogurte, esse continua aberto.',
 rostos:['marta'],
 pista:'A trilha do dinheiro: 7781-0 (empresa fantasma) → 3320-1 (Wagner, o laranja) → 9054-7 (poupança da síndica Marta Gouveia). Caso encerrado.'}
];
