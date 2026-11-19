window.SEED_S1_EN = `
INSERT INTO residents VALUES (16,'Hermes Bastos','police chief','Downtown',61,'peaked cap');
CREATE TABLE phones (number TEXT PRIMARY KEY, resident_id INTEGER);
INSERT INTO phones VALUES
('41 99999-0016',16),('41 99999-0002',2),('41 99999-0012',12),('41 99999-0013',13),('41 99999-0009',9),
('41 99999-0011',11),('41 99999-0001',1),('41 99999-0005',5),('41 99999-0007',7),('41 99999-0014',14);
CREATE TABLE messages (id INTEGER PRIMARY KEY, date TEXT, time TEXT, sender TEXT, recipient TEXT, text TEXT);
INSERT INTO messages VALUES
(1,'2026-10-28','10:00','41 99999-0007','41 99999-0016','Chief, want to invest in trading cards? Guaranteed returns.'),
(2,'2026-10-29','09:10','41 99999-0016','41 99999-0013','Matheus, bring cheese bread. And the Plaza Fund spreadsheets.'),
(3,'2026-10-29','16:00','0800 555 0101','41 99999-0016','Congratulations! You are pre-approved for a speedboat timeshare.'),
(4,'2026-10-29','21:40','41 99999-0012','41 99999-0016','Chief, the building manager''s lights were on late again. Just saying. I am not watching anyone.'),
(5,'2026-10-30','08:05','41 99999-0016','41 99999-0002','Building manager, I need the Plaza Fund statements. Today.'),
(6,'2026-10-30','08:47','41 99999-0002','41 99999-0016','Of course, chief! I will send them Monday, no fail :)'),
(7,'2026-10-30','11:20','41 90000-1313','41 99999-0016','Dear Chief Hermes Bastos: you have been named Police Chief of the Year! Ceremony at the National Police Chiefs Congress, Oblivion Ridge Hotel, Saturday. Complimentary ticket: Friday bus, 18:40.'),
(8,'2026-10-30','11:24','41 99999-0016','41 90000-1313','I accept. Finally someone recognizes my work.'),
(9,'2026-10-30','14:02','41 99999-0016','41 99999-0013','The Plaza Fund does not add up: we raised 30k and there is 12k in the account. Back Monday to sort it out. Tell no one.'),
(10,'2026-10-30','14:03','41 99999-0013','41 99999-0016','Ok! (accidentally told Mrs. Lúcia)'),
(11,'2026-10-30','17:55','41 99999-0016','41 99999-0012','Mrs. Lúcia, please water my new fern. The old one was stolen, as you know.'),
(12,'2026-10-30','19:30','41 99999-0002','41 99999-0011','Wagner, another "lessons" payment hit your account. You know what to do.'),
(13,'2026-10-31','10:00','41 99999-0012','41 99999-0016','Chief? Chief?? The fern is fine. You are not answering.'),
(14,'2026-11-02','08:30','41 99999-0013','41 99999-0016','Chief, where are you? The coffee got cold.');
CREATE TABLE plaza_fund (id INTEGER PRIMARY KEY, date TEXT, time TEXT, type TEXT, amount REAL, description TEXT, account TEXT);
INSERT INTO plaza_fund VALUES
(1,'2026-08-01','10:00','in',15000,'City hall grant',NULL),
(2,'2026-08-05','20:00','in',5000,'Fundraising party',NULL),
(3,'2026-08-20','21:00','in',6000,'Plaza bingo night',NULL),
(4,'2026-09-02','18:00','in',4000,'Resident donations',NULL),
(5,'2026-09-10','14:00','out',2500,'Seedlings and flowers','1200-5'),
(6,'2026-09-12','15:30','out',500,'Paint for the benches','4410-2'),
(7,'2026-09-20','23:41','out',5000,'Bandstand renovation - installment 1','7781-0'),
(8,'2026-10-04','23:15','out',5000,'Bandstand renovation - installment 2','7781-0'),
(9,'2026-10-18','23:58','out',5000,'Bandstand renovation - installment 3','7781-0');
CREATE TABLE invoices (id INTEGER PRIMARY KEY, fund_id INTEGER, supplier TEXT, number TEXT, description TEXT);
INSERT INTO invoices VALUES
(1,5,'Melo Florist','INV-1043','120 flower seedlings'),
(2,6,'Paint & Co','INV-88','Green enamel paint, 18 liters');
CREATE TABLE cameras (id INTEGER PRIMARY KEY, location TEXT, date TEXT, time TEXT, resident_id INTEGER);
INSERT INTO cameras VALUES
(1,'Police station','2026-10-29','08:02',16),
(2,'Marcos Bakery','2026-10-29','12:40',16),
(3,'Police station','2026-10-30','07:58',16),
(4,'Marcos Bakery','2026-10-30','12:30',16),
(5,'Police station','2026-10-30','13:10',16),
(6,'Bus station','2026-10-30','18:05',16),
(7,'Bus station','2026-10-30','18:20',2),
(8,'Marcos Bakery','2026-10-30','07:30',12),
(9,'Plaza','2026-10-30','16:00',12),
(10,'Police station','2026-11-02','08:15',13);
CREATE TABLE buses (id INTEGER PRIMARY KEY, resident_id INTEGER, date TEXT, time TEXT, line TEXT, destination TEXT);
INSERT INTO buses VALUES
(1,15,'2026-10-30','07:10','210','Downtown'),
(2,16,'2026-10-30','18:40','777','Oblivion Ridge'),
(3,2,'2026-10-30','18:50','210','New Village'),
(4,12,'2026-10-31','09:00','210','Downtown');
CREATE TABLE bank_logins (id INTEGER PRIMARY KEY, date TEXT, time TEXT, username TEXT, ip TEXT, action TEXT);
INSERT INTO bank_logins VALUES
(1,'2026-09-10','13:55','celia','189.4.22.10','payment'),
(2,'2026-09-12','15:25','celia','189.4.22.10','payment'),
(3,'2026-09-15','22:30','celia','189.4.22.10','balance check'),
(4,'2026-09-19','10:00','celia','189.4.22.10','balance check'),
(5,'2026-09-20','23:40','treasury','177.10.0.45','payment'),
(6,'2026-10-04','23:14','treasury','177.10.0.45','payment'),
(7,'2026-10-18','23:57','treasury','177.10.0.45','payment'),
(8,'2026-10-21','09:15','celia','189.4.22.10','balance check'),
(9,'2026-10-25','23:30','treasury','177.10.0.45','balance check');
CREATE TABLE wifi_logs (id INTEGER PRIMARY KEY, resident_id INTEGER, ip TEXT, date TEXT);
INSERT INTO wifi_logs (resident_id, ip, date) VALUES
(2,'177.10.0.45','2026-09-20'),(2,'177.10.0.45','2026-10-04'),(2,'177.10.0.45','2026-10-18'),(2,'177.10.0.45','2026-10-25'),
(11,'177.10.0.45','2026-09-20'),(11,'177.10.0.45','2026-10-04'),(11,'177.10.0.45','2026-10-18'),
(14,'177.10.0.45','2026-10-04'),(14,'177.10.0.45','2026-10-04'),(14,'177.10.0.45','2026-10-04'),
(8,'177.10.0.45','2026-09-20'),(8,'177.10.0.45','2026-10-18'),
(5,'189.4.22.10','2026-09-20'),(5,'189.4.22.10','2026-10-04'),(5,'189.4.22.10','2026-10-18');
CREATE TABLE accounts (account TEXT PRIMARY KEY, holder_id INTEGER, bank TEXT, kind TEXT);
INSERT INTO accounts VALUES
('7781-0',NULL,'Pacato Bank','Business - Pacata Renovations LLC'),
('3320-1',11,'Pacato Bank','checking'),
('9054-7',2,'Neighborhood Bank','savings'),
('1200-5',14,'Pacato Bank','Business - Melo Florist'),
('4410-2',NULL,'Neighborhood Bank','Business - Paint & Co'),
('5500-9',7,'CryptoBank','checking');
CREATE TABLE transfers (id INTEGER PRIMARY KEY, date TEXT, from_account TEXT, to_account TEXT, amount REAL);
INSERT INTO transfers VALUES
(1,'2026-09-21','7781-0','3320-1',5000),
(2,'2026-09-21','3320-1','9054-7',4500),
(3,'2026-10-02','5500-9','1200-5',80),
(4,'2026-10-05','7781-0','3320-1',5000),
(5,'2026-10-05','3320-1','9054-7',4500),
(6,'2026-10-10','1200-5','5500-9',20),
(7,'2026-10-19','7781-0','3320-1',5000),
(8,'2026-10-19','3320-1','9054-7',4500);
`;

window.CASES_S1_EN = [
{titulo:'Monday without coffee',
 historia:`Monday, November 2. Chief Bastos didn't show up. His mug is cold, his chair is empty, and on the desk there's just one note: <b>"If I disappear, check the database."</b>\n\nI'll be doing the talking now. Mrs. Lúcia, the precinct's unpaid volunteer assistant. I don't spy on anyone, I just pay attention. Let's start with his phone: <b>41 99999-0016</b>. I want everything he sent or received since <b>2026-10-29</b>, in the order it happened.`,
 conceito:`When a filter mixes <b>OR</b> and <b>AND</b>, use <b>parentheses</b>: without them AND is evaluated first and you get the wrong result. Dates in 'YYYY-MM-DD' format compare correctly with <code>&gt;=</code>. And <b>ORDER BY</b> takes several columns: it sorts by the first and breaks ties with the second.`,
 exemplo:`SELECT * FROM cameras\nWHERE (resident_id = 12 OR resident_id = 2)\n  AND date >= '2026-10-30'\nORDER BY date, time;`,
 objetivo:'Show date, time, sender, recipient and text of the messages sent OR received by 41 99999-0016 from 2026-10-29 on, ordered by date and time.',
 dicas:[`WHERE (sender = '41 99999-0016' OR recipient = '41 99999-0016') AND date >= '2026-10-29'`,'Finish with ORDER BY date, time.'],
 solucao:`SELECT date, time, sender, recipient, text FROM messages\nWHERE (sender = '41 99999-0016' OR recipient = '41 99999-0016')\n  AND date >= '2026-10-29'\nORDER BY date, time;`, ordem:true,
 fim:'He accepted a "Police Chief of the Year" award. The man who took three years to solve the Yogurt Case. Something smells off. And the Plaza Fund doesn\'t add up.',
 pista:'Friday, 10/30: Bastos accepted an invitation to a "National Police Chiefs Congress" and said the Plaza Fund doesn\'t add up: 30k raised, 12k in the account.'},

{titulo:'The number with no owner',
 historia:`The invitation came from a number I don't know, and I know everybody. The <b>phones</b> table says who owns each number in town. I want the numbers that messaged the chief and have <b>no registered owner</b>. No repeats.`,
 conceito:`<b>DISTINCT</b> removes duplicate rows from the result. To find who "has no match" in another table, use the old Prologue trick: <b>LEFT JOIN</b> and keep the rows where the right side came back <b>NULL</b>.<br><br>Another way that also works: <code>WHERE sender NOT IN (SELECT number FROM phones)</code>. Just one catch: if the subquery returns any NULL, NOT IN returns nothing at all. LEFT JOIN + IS NULL doesn't have that problem.`,
 exemplo:`SELECT DISTINCT location FROM cameras;`,
 objetivo:'List, without repeats, the numbers (sender column) that messaged 41 99999-0016 and do not appear in the phones table.',
 dicas:['FROM messages m LEFT JOIN phones p ON p.number = m.sender',`WHERE m.recipient = '41 99999-0016' AND p.number IS NULL, with SELECT DISTINCT m.sender`],
 solucao:`SELECT DISTINCT m.sender\nFROM messages m\nLEFT JOIN phones p ON p.number = m.sender\nWHERE m.recipient = '41 99999-0016' AND p.number IS NULL;`, ordem:false,
 fim:'Two numbers. One is Marcelo\'s timeshare call center, which calls the whole town, me included, three times a day. The other is a prepaid SIM bought with cash. Nobody hands out awards from a prepaid SIM.',
 pista:'The invitation came from a prepaid SIM with no owner (41 90000-1313). Nobody in town admits knowing that number.'},

{titulo:'The account that doesn\'t add up',
 historia:`The chief said the Plaza Fund raised 30k and only has 12k left. The fund was supposed to renovate the bandstand. I walk past the plaza every day (by chance) and the bandstand is exactly the same: same peeling paint, same pigeon.\n\nI want <b>a single row</b> with total money in, total money out, and the balance.`,
 conceito:`<b>CASE</b> inside <b>SUM</b> adds up only what you want: <code>SUM(CASE WHEN type = 'in' THEN amount ELSE 0 END)</code> sums only the incoming money. You can do several conditional sums in one query, with no GROUP BY.`,
 exemplo:`SELECT\n  SUM(CASE WHEN age >= 50 THEN 1 ELSE 0 END) AS fifty_plus,\n  SUM(CASE WHEN age < 50 THEN 1 ELSE 0 END) AS under_50\nFROM residents;`,
 objetivo:'Show, in one row, three columns: total money in, total money out, and the balance (in minus out) of the plaza_fund table.',
 dicas:[`SUM(CASE WHEN type = 'in' THEN amount ELSE 0 END) for money in; the same with 'out'.`,`Balance: SUM(CASE WHEN type = 'in' THEN amount ELSE -amount END)`],
 solucao:`SELECT\n  SUM(CASE WHEN type = 'in' THEN amount ELSE 0 END) AS money_in,\n  SUM(CASE WHEN type = 'out' THEN amount ELSE 0 END) AS money_out,\n  SUM(CASE WHEN type = 'in' THEN amount ELSE -amount END) AS balance\nFROM plaza_fund;`, ordem:false,
 fim:'30k in, 18k out. Eighteen thousand and the pigeon is still there. Either that bandstand was renovated on the inside, or someone renovated something else.',
 pista:'18k left the Plaza Fund and the bandstand looks exactly the same. The numbers add up; the plaza doesn\'t.'},

{titulo:'Ghost contractor',
 historia:`Every honest payment has an invoice. Sandra's flower shop has one, the paint store has one. I want the <b>money that went out of the fund with no matching invoice</b> in the <b>invoices</b> table.`,
 conceito:`<b>NOT EXISTS</b> checks that a subquery finds <i>nothing</i>. For each outer row, the database runs the subquery: if it comes back empty, the row goes into the result. It's the most direct way to ask "who doesn't have…".`,
 exemplo:`SELECT name FROM residents r\nWHERE NOT EXISTS (\n  SELECT 1 FROM phones p WHERE p.resident_id = r.id\n);`,
 objetivo:'Show date, amount, description and account of the plaza_fund outgoing payments that have no invoice in invoices (invoices.fund_id points to plaza_fund.id).',
 dicas:[`WHERE f.type = 'out' AND NOT EXISTS (...)`,'Inside NOT EXISTS: SELECT 1 FROM invoices i WHERE i.fund_id = f.id'],
 solucao:`SELECT f.date, f.amount, f.description, f.account\nFROM plaza_fund f\nWHERE f.type = 'out'\n  AND NOT EXISTS (SELECT 1 FROM invoices i WHERE i.fund_id = f.id);`, ordem:false,
 fim:'Three installments of 5k to "Pacata Renovations LLC", account 7781-0. I checked the phone book, the business registry and the church group chat. That company doesn\'t exist. Not even the bandstand has heard of it.',
 pista:'15k was paid in three installments to "Pacata Renovations LLC" (account 7781-0) with no invoice. The company has no address, no phone and no worksite.'},

{titulo:'The last trip',
 historia:`I need to know where the chief was on Friday, <b>2026-10-30</b>. I have two sources: the town <b>cameras</b> and the <b>buses</b> records. I want a single timeline combining both, ordered by time.`,
 conceito:`<b>UNION ALL</b> stacks the result of two queries, one on top of the other. Both need the same number of columns, in the same order. You can create a fixed text column, like <code>'camera' AS source</code>. The <b>ORDER BY</b> goes at the very end and applies to everything. (UNION without ALL also removes duplicates.)`,
 exemplo:`SELECT name FROM residents WHERE neighborhood = 'Downtown'\nUNION ALL\nSELECT name FROM residents WHERE age > 60;`,
 objetivo:'For resident 16 on 2026-10-30, show time, source and place: from cameras (source = \'camera\', place = location) and from buses (source = \'bus\', place = destination), all ordered by time.',
 dicas:[`SELECT time, 'camera' AS source, location AS place FROM cameras WHERE ...`,`... UNION ALL SELECT time, 'bus', destination FROM buses WHERE ... ORDER BY time`],
 solucao:`SELECT time, 'camera' AS source, location AS place\nFROM cameras WHERE resident_id = 16 AND date = '2026-10-30'\nUNION ALL\nSELECT time, 'bus', destination\nFROM buses WHERE resident_id = 16 AND date = '2026-10-30'\nORDER BY time;`, ordem:true,
 fim:'At 18:40 he boarded the bus to Oblivion Ridge, where phones get no signal and the hotel only has AM radio. I called: there is no congress. He\'s fine, probably sitting in the lobby waiting for a ceremony that will never happen. Someone wanted the chief out of town. Oh, and the bus station camera caught someone else at 18:20, but I\'m not one to gossip.',
 pista:'Friday, 18:40: Bastos took the bus to Oblivion Ridge, with no phone signal. The congress doesn\'t exist: someone got him out of town on purpose.'},

{titulo:'Night shift',
 historia:`The Plaza Fund has online banking. The treasurer is Célia, the teacher, who does everything during business hours and opens every email with "Dear all". But there's also a generic login, "treasury", that anyone with the password can use.\n\nI want the logins made on a <b>weekend</b> and <b>from 22:00 on</b>.`,
 conceito:`<b>strftime</b> extracts parts of a date. <code>strftime('%w', date)</code> returns the day of the week as text: <b>'0' is Sunday</b> and <b>'6' is Saturday</b>. With <b>IN</b> you test several values at once: <code>day IN ('0', '6')</code> is the same as <code>day = '0' OR day = '6'</code>. Note that strftime returns <i>text</i>, which is why the numbers go in quotes. Other useful formats: <code>'%Y'</code> year, <code>'%m'</code> month, <code>'%d'</code> day.`,
 exemplo:`SELECT date, strftime('%w', date) AS weekday\nFROM buses;`,
 objetivo:'Show date, time, username and ip of the bank_logins made on Saturday or Sunday, with time from 22:00 on.',
 dicas:[`strftime('%w', date) IN ('0', '6')`,`... AND time >= '22:00'`],
 solucao:`SELECT date, time, username, ip FROM bank_logins\nWHERE strftime('%w', date) IN ('0', '6')\n  AND time >= '22:00';`, ordem:false,
 fim:'All on Sundays, all close to midnight, all from IP 177.10.0.45. Three payments and a balance check the following Sunday, just to admire the money. Who works Sundays at 11 p.m.? Bakers and crooks. And the baker was asleep, I checked.',
 pista:'The three payments to the ghost company were authorized on Sundays near midnight, with the "treasury" login, always from IP 177.10.0.45.'},

{titulo:'Same network',
 historia:`IP 177.10.0.45 belongs to a router in New Village. The provider sent the records of who connected to it (table <b>wifi_logs</b>). I want whoever was connected <b>on all three payment dates</b>: <b>2026-09-20</b>, <b>2026-10-04</b> and <b>2026-10-18</b>. Careful: some people connected several times on the same day.`,
 conceito:`<b>IN ('a', 'b', 'c')</b> filters by a list of values, without writing three ORs. <b>COUNT(DISTINCT column)</b> counts only different values: three connections on the same day count as <i>one</i> date. Combined with <b>HAVING</b>, it answers "who shows up on every date".`,
 exemplo:`SELECT resident_id, COUNT(DISTINCT date) AS days\nFROM bakery\nGROUP BY resident_id\nHAVING COUNT(DISTINCT date) >= 5;`,
 objetivo:'Show the name of whoever was connected to IP 177.10.0.45 on all three dates (2026-09-20, 2026-10-04 and 2026-10-18).',
 dicas:[`JOIN residents and WHERE w.ip = '177.10.0.45' AND w.date IN ('2026-09-20', '2026-10-04', '2026-10-18')`,'GROUP BY r.id HAVING COUNT(DISTINCT w.date) = 3'],
 solucao:`SELECT r.name\nFROM wifi_logs w\nJOIN residents r ON r.id = w.resident_id\nWHERE w.ip = '177.10.0.45'\n  AND w.date IN ('2026-09-20', '2026-10-04', '2026-10-18')\nGROUP BY r.id\nHAVING COUNT(DISTINCT w.date) = 3;`, ordem:false,
 fim:'Marta Gouveia, the building manager, who owns the router. And Wagner Dias, the personal trainer, who lives upstairs and uses her wi-fi without asking. Remember the wi-fi theft in the Prologue? Exactly. Two suspects, one network, and Sandra connected three times in one day just to send flower pictures.',
 rostos:['marta','wagner'],
 pista:'On all three nights, only two devices were on IP 177.10.0.45: building manager Marta\'s (she owns the router) and Wagner\'s (who uses her wi-fi without asking).'},

{titulo:'Final case: follow the money',
 historia:`Two suspects. One of them kept the money. The bank sent the <b>transfers</b> and the <b>accounts</b> registry.\n\nThe money left the ghost company's account, <b>7781-0</b>, and hopped from account to account. Follow the trail to where it <b>stops</b>: the account that received money and didn't send it anywhere else. I want <b>only the name</b> of that account's holder. And then, please, somebody go pick up the chief on the ridge.`,
 conceito:`<b>WITH RECURSIVE</b> creates a CTE that calls itself: a starting part (the anchor) and a recursive part that takes "one more step" from what has already been found, until nothing new turns up. Use <b>UNION</b> (without ALL) between the parts so accounts don't repeat.`,
 exemplo:`WITH RECURSIVE counter(n) AS (\n  SELECT 1\n  UNION\n  SELECT n + 1 FROM counter WHERE n < 5\n)\nSELECT n FROM counter;`,
 objetivo:'Starting from account 7781-0, follow the transfers to the account that sends money nowhere else, and show only its holder\'s name.',
 dicas:['WITH RECURSIVE trail(account) AS (SELECT \'7781-0\' UNION SELECT t.to_account FROM transfers t JOIN trail ON t.from_account = trail.account)','Then: JOIN accounts and residents, and WHERE NOT EXISTS (SELECT 1 FROM transfers t WHERE t.from_account = trail.account)'],
 solucao:`WITH RECURSIVE trail(account) AS (\n  SELECT '7781-0'\n  UNION\n  SELECT t.to_account\n  FROM transfers t\n  JOIN trail ON t.from_account = trail.account\n)\nSELECT r.name\nFROM trail\nJOIN accounts a ON a.account = trail.account\nJOIN residents r ON r.id = a.holder_id\nWHERE NOT EXISTS (\n  SELECT 1 FROM transfers t WHERE t.from_account = trail.account\n);`, ordem:false,
 fim:'Marta Gouveia. The building manager. The same one who, back in the Prologue, swore there was an "organized gang" in New Village: a smoke screen. The money went through Wagner\'s account; he thought they were "lesson payments", kept 10% and asked no questions (he has some explaining to do). The prepaid SIM and the fake invitation got the chief out of town before the statements arrived. We picked Bastos up at Oblivion Ridge: tanned, holding a "Police Chief of the Year" certificate printed at a copy shop, and saying only: "I knew that database would save me." Case closed. The Yogurt Case, however, remains open.',
 rostos:['marta'],
 pista:'The money trail: 7781-0 (ghost company) → 3320-1 (Wagner, the front) → 9054-7 (savings of building manager Marta Gouveia). Case closed.'}
];
