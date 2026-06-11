-- =====================================================================
--  DEMO SEED — sample data for presentation
--  Courses, lessons, blocks (content/exercise/mix), vocabulary, groups, codes,
--  demo students. Idempotent: first deletes its own data by fixed UUIDs.
--  Password of all demo students: demo1234
-- =====================================================================

BEGIN;

-- ── Cleanup of previous demo (cascades remove children) ──────────────────
DELETE FROM lesson_practice_types  WHERE lesson_id::text LIKE '1e550000-%';
DELETE FROM lesson_practice_config WHERE lesson_id::text LIKE '1e550000-%';
DELETE FROM access_codes WHERE id::text LIKE 'acce0000-%';
DELETE FROM user_groups  WHERE id::text LIKE '9405e000-%';
DELETE FROM courses      WHERE id::text LIKE 'c0de0000-%';
DELETE FROM users        WHERE id::text LIKE 'd0570000-%';
DELETE FROM vocabulary_words WHERE id::text LIKE '0cab0000-%';

-- ── Courses ─────────────────────────────────────────────────────────────
INSERT INTO courses (id, title, description, thumbnail_color, visibility) VALUES
('c0de0000-0000-0000-0000-000000000001', 'Angličtina pro začátečníky', 'Základy angličtiny od nuly — pozdravy, čísla, rodina a jídlo.', '#1d3fb0', 'private'),
('c0de0000-0000-0000-0000-000000000002', 'Angličtina mírně pokročilí', 'Navazující kurz A2 — cestování, město a čas.', '#7c3aed', 'private'),
('c0de0000-0000-0000-0000-000000000003', 'Business English', 'Obchodní angličtina — schůzky a e-mailová komunikace.', '#0f766e', 'private');

-- ── Lessons ─────────────────────────────────────────────────────────────
INSERT INTO lessons (id, course_id, title, order_index, lock_config) VALUES
('1e550000-0000-0000-0000-000000000001', 'c0de0000-0000-0000-0000-000000000001', 'Pozdravy a představení', 0, '{"mode":"toggle","isLocked":false,"constraintGroups":[]}'),
('1e550000-0000-0000-0000-000000000002', 'c0de0000-0000-0000-0000-000000000001', 'Čísla a věk',           1, '{"mode":"toggle","isLocked":false,"constraintGroups":[]}'),
('1e550000-0000-0000-0000-000000000003', 'c0de0000-0000-0000-0000-000000000001', 'Rodina',                2, '{"mode":"toggle","isLocked":false,"constraintGroups":[]}'),
('1e550000-0000-0000-0000-000000000004', 'c0de0000-0000-0000-0000-000000000001', 'Jídlo a pití',          3, '{"mode":"scheduled","isLocked":false,"unlockAt":"2026-12-01T08:00:00.000Z","constraintGroups":[]}'),
('1e550000-0000-0000-0000-000000000005', 'c0de0000-0000-0000-0000-000000000002', 'Cestování',             0, '{"mode":"toggle","isLocked":false,"constraintGroups":[]}'),
('1e550000-0000-0000-0000-000000000006', 'c0de0000-0000-0000-0000-000000000002', 'Ve městě',              1, '{"mode":"toggle","isLocked":false,"constraintGroups":[]}'),
('1e550000-0000-0000-0000-000000000007', 'c0de0000-0000-0000-0000-000000000002', 'Čas a kalendář',        2, '{"mode":"toggle","isLocked":true,"constraintGroups":[]}'),
('1e550000-0000-0000-0000-000000000008', 'c0de0000-0000-0000-0000-000000000003', 'Schůzky',               0, '{"mode":"toggle","isLocked":false,"constraintGroups":[]}'),
('1e550000-0000-0000-0000-000000000009', 'c0de0000-0000-0000-0000-000000000003', 'E-maily',               1, '{"mode":"toggle","isLocked":false,"constraintGroups":[]}');

-- ── Vocabulary ──────────────────────────────────────────────────────────
INSERT INTO vocabulary_words (id, word_en, word_cs, pos, example_sentence) VALUES
('0cab0000-0000-0000-0000-000000000001','hello','ahoj','phrase','Hello, how are you?'),
('0cab0000-0000-0000-0000-000000000002','goodbye','nashledanou','phrase','Goodbye, see you tomorrow.'),
('0cab0000-0000-0000-0000-000000000003','please','prosím','adverb','Please open the window.'),
('0cab0000-0000-0000-0000-000000000004','thanks','děkuji','phrase','Thanks for your help.'),
('0cab0000-0000-0000-0000-000000000005','name','jméno','noun','My name is Anna.'),
('0cab0000-0000-0000-0000-000000000006','friend','přítel','noun','She is my best friend.'),
('0cab0000-0000-0000-0000-000000000007','one','jedna','noun','I have one apple.'),
('0cab0000-0000-0000-0000-000000000008','two','dva','noun','There are two cats.'),
('0cab0000-0000-0000-0000-000000000009','three','tři','noun','We need three chairs.'),
('0cab0000-0000-0000-0000-000000000010','age','věk','noun','What is your age?'),
('0cab0000-0000-0000-0000-000000000011','year','rok','noun','I study English this year.'),
('0cab0000-0000-0000-0000-000000000012','old','starý','adjective','This house is very old.'),
('0cab0000-0000-0000-0000-000000000013','mother','matka','noun','My mother cooks dinner.'),
('0cab0000-0000-0000-0000-000000000014','father','otec','noun','His father drives a bus.'),
('0cab0000-0000-0000-0000-000000000015','sister','sestra','noun','My sister is a doctor.'),
('0cab0000-0000-0000-0000-000000000016','brother','bratr','noun','I have one brother.'),
('0cab0000-0000-0000-0000-000000000017','family','rodina','noun','We are a big family.'),
('0cab0000-0000-0000-0000-000000000018','child','dítě','noun','The child is sleeping.'),
('0cab0000-0000-0000-0000-000000000019','water','voda','noun','I drink water every day.'),
('0cab0000-0000-0000-0000-000000000020','bread','chléb','noun','We buy fresh bread.'),
('0cab0000-0000-0000-0000-000000000021','apple','jablko','noun','She eats a red apple.'),
('0cab0000-0000-0000-0000-000000000022','coffee','káva','noun','He likes black coffee.'),
('0cab0000-0000-0000-0000-000000000023','eat','jíst','verb','We eat lunch at noon.'),
('0cab0000-0000-0000-0000-000000000024','drink','pít','verb','They drink tea together.'),
('0cab0000-0000-0000-0000-000000000025','airport','letiště','noun','The airport is very busy.'),
('0cab0000-0000-0000-0000-000000000026','ticket','lístek','noun','I bought a train ticket.'),
('0cab0000-0000-0000-0000-000000000027','train','vlak','noun','The train is late today.'),
('0cab0000-0000-0000-0000-000000000028','hotel','hotel','noun','Our hotel is near the sea.'),
('0cab0000-0000-0000-0000-000000000029','map','mapa','noun','I need a city map.'),
('0cab0000-0000-0000-0000-000000000030','luggage','zavazadlo','noun','My luggage is too heavy.'),
('0cab0000-0000-0000-0000-000000000031','street','ulice','noun','The street is very long.'),
('0cab0000-0000-0000-0000-000000000032','shop','obchod','noun','This shop is closed.'),
('0cab0000-0000-0000-0000-000000000033','station','stanice','noun','The station is over there.'),
('0cab0000-0000-0000-0000-000000000034','bank','banka','noun','The bank opens at nine.'),
('0cab0000-0000-0000-0000-000000000035','park','park','noun','We walk in the park.'),
('0cab0000-0000-0000-0000-000000000036','bridge','most','noun','The old bridge is beautiful.'),
('0cab0000-0000-0000-0000-000000000037','morning','ráno','noun','I run every morning.'),
('0cab0000-0000-0000-0000-000000000038','evening','večer','noun','We read in the evening.'),
('0cab0000-0000-0000-0000-000000000039','week','týden','noun','There are seven days in a week.'),
('0cab0000-0000-0000-0000-000000000040','month','měsíc','noun','January is the first month.'),
('0cab0000-0000-0000-0000-000000000041','hour','hodina','noun','The lesson takes one hour.'),
('0cab0000-0000-0000-0000-000000000042','today','dnes','adverb','Today is a sunny day.'),
('0cab0000-0000-0000-0000-000000000043','meeting','schůzka','noun','The meeting starts at ten.'),
('0cab0000-0000-0000-0000-000000000044','report','zpráva','noun','Please send the report.'),
('0cab0000-0000-0000-0000-000000000045','deadline','termín','noun','The deadline is on Friday.'),
('0cab0000-0000-0000-0000-000000000046','client','klient','noun','Our client is very happy.'),
('0cab0000-0000-0000-0000-000000000047','invoice','faktura','noun','I will pay the invoice.'),
('0cab0000-0000-0000-0000-000000000048','contract','smlouva','noun','We signed the contract.'),
('0cab0000-0000-0000-0000-000000000049','email','e-mail','noun','I sent you an email.'),
('0cab0000-0000-0000-0000-000000000050','message','zpráva','noun','Leave a short message.'),
('0cab0000-0000-0000-0000-000000000051','attachment','příloha','noun','Open the attachment please.'),
('0cab0000-0000-0000-0000-000000000052','subject','předmět','noun','The email subject is empty.'),
('0cab0000-0000-0000-0000-000000000053','reply','odpověď','noun','I wait for your reply.'),
('0cab0000-0000-0000-0000-000000000054','signature','podpis','noun','Add your signature below.');

-- ── Linking vocabulary to lessons (6 per lesson) ─────────────────────────
INSERT INTO lesson_vocabulary (lesson_id, vocabulary_id)
SELECT l.id::uuid, v.id
FROM (VALUES
  ('1e550000-0000-0000-0000-000000000001', 1, 6),
  ('1e550000-0000-0000-0000-000000000002', 7, 12),
  ('1e550000-0000-0000-0000-000000000003', 13, 18),
  ('1e550000-0000-0000-0000-000000000004', 19, 24),
  ('1e550000-0000-0000-0000-000000000005', 25, 30),
  ('1e550000-0000-0000-0000-000000000006', 31, 36),
  ('1e550000-0000-0000-0000-000000000007', 37, 42),
  ('1e550000-0000-0000-0000-000000000008', 43, 48),
  ('1e550000-0000-0000-0000-000000000009', 49, 54)
) AS l(id, lo, hi)
JOIN vocabulary_words v
  ON v.id::text LIKE '0cab0000-%'
 AND (right(v.id::text, 3))::int BETWEEN l.lo AND l.hi;

-- ── Lesson blocks ───────────────────────────────────────────────────────
INSERT INTO blocks (id, lesson_id, title, type, order_index, content_attributes, exercise_attributes) VALUES
('b10c0000-0000-0000-0000-000000000011','1e550000-0000-0000-0000-000000000001','Úvod do pozdravů','content', 0,'{"requiresReadConfirmation":true}', NULL),
('b10c0000-0000-0000-0000-000000000012','1e550000-0000-0000-0000-000000000001','Procvič představení','exercise',1, NULL,'{"isMandatory":true}'),
('b10c0000-0000-0000-0000-000000000013','1e550000-0000-0000-0000-000000000001','Hry: pozdravy','mix',     2, NULL, NULL),
('b10c0000-0000-0000-0000-000000000021','1e550000-0000-0000-0000-000000000002','Čísla 1–10','content',    0,'{"requiresReadConfirmation":false}', NULL),
('b10c0000-0000-0000-0000-000000000023','1e550000-0000-0000-0000-000000000002','Hry: čísla','mix',        1, NULL, NULL),
('b10c0000-0000-0000-0000-000000000031','1e550000-0000-0000-0000-000000000003','Členové rodiny','content',0,'{"requiresReadConfirmation":false}', NULL),
('b10c0000-0000-0000-0000-000000000032','1e550000-0000-0000-0000-000000000003','Doplň o rodině','exercise',1, NULL,'{"isMandatory":false}'),
('b10c0000-0000-0000-0000-000000000041','1e550000-0000-0000-0000-000000000004','Jídlo a pití','content',  0,'{"requiresReadConfirmation":false}', NULL),
('b10c0000-0000-0000-0000-000000000051','1e550000-0000-0000-0000-000000000005','Na letišti','content',    0,'{"requiresReadConfirmation":false}', NULL),
('b10c0000-0000-0000-0000-000000000052','1e550000-0000-0000-0000-000000000005','Procvič cestování','exercise',1, NULL,'{"isMandatory":true}'),
('b10c0000-0000-0000-0000-000000000053','1e550000-0000-0000-0000-000000000005','Hry: cestování','mix',    2, NULL, NULL),
('b10c0000-0000-0000-0000-000000000061','1e550000-0000-0000-0000-000000000006','Po městě','content',      0,'{"requiresReadConfirmation":false}', NULL),
('b10c0000-0000-0000-0000-000000000071','1e550000-0000-0000-0000-000000000007','Čas','content',           0,'{"requiresReadConfirmation":false}', NULL),
('b10c0000-0000-0000-0000-000000000081','1e550000-0000-0000-0000-000000000008','Plánování schůzky','content',0,'{"requiresReadConfirmation":false}', NULL),
('b10c0000-0000-0000-0000-000000000082','1e550000-0000-0000-0000-000000000008','Procvič fráze','exercise', 1, NULL,'{"isMandatory":false}'),
('b10c0000-0000-0000-0000-000000000091','1e550000-0000-0000-0000-000000000009','Struktura e-mailu','content',0,'{"requiresReadConfirmation":false}', NULL);

-- ── Block content (block_contents.id = blocks.id) ───────────────────────
INSERT INTO block_contents (id, lesson_id, title, blocks) VALUES
('b10c0000-0000-0000-0000-000000000011','1e550000-0000-0000-0000-000000000001','Úvod do pozdravů',
 '[{"id":"h","type":"heading","level":2,"html":"Pozdravy a představení","textColor":"#ecedfb","textAlign":"left","fontWeight":800,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":8,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0},{"id":"p","type":"paragraph","html":"V této lekci se naučíš základní pozdravy a jak se představit. Klíčová slovíčka: <b>hello</b>, <b>goodbye</b>, <b>please</b>, <b>thanks</b>.","textColor":"#c8cce6","fontSize":16,"lineHeight":1.6,"textAlign":"left","fontWeight":400,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0}]'),
('b10c0000-0000-0000-0000-000000000021','1e550000-0000-0000-0000-000000000002','Čísla 1–10',
 '[{"id":"h","type":"heading","level":2,"html":"Čísla a věk","textColor":"#ecedfb","textAlign":"left","fontWeight":800,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":8,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0},{"id":"p","type":"paragraph","html":"Naučíme se počítat a ptát se na věk: <b>one</b>, <b>two</b>, <b>three</b> a fráze <i>What is your age?</i>","textColor":"#c8cce6","fontSize":16,"lineHeight":1.6,"textAlign":"left","fontWeight":400,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0}]'),
('b10c0000-0000-0000-0000-000000000031','1e550000-0000-0000-0000-000000000003','Členové rodiny',
 '[{"id":"h","type":"heading","level":2,"html":"Rodina","textColor":"#ecedfb","textAlign":"left","fontWeight":800,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":8,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0},{"id":"p","type":"paragraph","html":"Členové rodiny: <b>mother</b>, <b>father</b>, <b>sister</b>, <b>brother</b>. Umíš říct, kdo patří do tvojí rodiny?","textColor":"#c8cce6","fontSize":16,"lineHeight":1.6,"textAlign":"left","fontWeight":400,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0}]'),
('b10c0000-0000-0000-0000-000000000041','1e550000-0000-0000-0000-000000000004','Jídlo a pití',
 '[{"id":"h","type":"heading","level":2,"html":"Jídlo a pití","textColor":"#ecedfb","textAlign":"left","fontWeight":800,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":8,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0},{"id":"p","type":"paragraph","html":"Slovíčka pro jídlo a pití: <b>water</b>, <b>bread</b>, <b>apple</b>, <b>coffee</b>.","textColor":"#c8cce6","fontSize":16,"lineHeight":1.6,"textAlign":"left","fontWeight":400,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0}]'),
('b10c0000-0000-0000-0000-000000000051','1e550000-0000-0000-0000-000000000005','Na letišti',
 '[{"id":"h","type":"heading","level":2,"html":"Cestování","textColor":"#ecedfb","textAlign":"left","fontWeight":800,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":8,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0},{"id":"p","type":"paragraph","html":"Na letišti se hodí: <b>airport</b>, <b>ticket</b>, <b>train</b>, <b>luggage</b>.","textColor":"#c8cce6","fontSize":16,"lineHeight":1.6,"textAlign":"left","fontWeight":400,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0}]'),
('b10c0000-0000-0000-0000-000000000061','1e550000-0000-0000-0000-000000000006','Po městě',
 '[{"id":"h","type":"heading","level":2,"html":"Ve městě","textColor":"#ecedfb","textAlign":"left","fontWeight":800,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":8,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0},{"id":"p","type":"paragraph","html":"Orientace ve městě: <b>street</b>, <b>shop</b>, <b>station</b>, <b>bank</b>.","textColor":"#c8cce6","fontSize":16,"lineHeight":1.6,"textAlign":"left","fontWeight":400,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0}]'),
('b10c0000-0000-0000-0000-000000000071','1e550000-0000-0000-0000-000000000007','Čas',
 '[{"id":"h","type":"heading","level":2,"html":"Čas a kalendář","textColor":"#ecedfb","textAlign":"left","fontWeight":800,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":8,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0},{"id":"p","type":"paragraph","html":"Části dne a kalendář: <b>morning</b>, <b>evening</b>, <b>week</b>, <b>month</b>.","textColor":"#c8cce6","fontSize":16,"lineHeight":1.6,"textAlign":"left","fontWeight":400,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0}]'),
('b10c0000-0000-0000-0000-000000000081','1e550000-0000-0000-0000-000000000008','Plánování schůzky',
 '[{"id":"h","type":"heading","level":2,"html":"Schůzky","textColor":"#ecedfb","textAlign":"left","fontWeight":800,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":8,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0},{"id":"p","type":"paragraph","html":"Domluva schůzky: <b>meeting</b>, <b>deadline</b>, <b>client</b>, <b>report</b>.","textColor":"#c8cce6","fontSize":16,"lineHeight":1.6,"textAlign":"left","fontWeight":400,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0}]'),
('b10c0000-0000-0000-0000-000000000091','1e550000-0000-0000-0000-000000000009','Struktura e-mailu',
 '[{"id":"h","type":"heading","level":2,"html":"E-maily","textColor":"#ecedfb","textAlign":"left","fontWeight":800,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":8,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0},{"id":"p","type":"paragraph","html":"Části e-mailu: <b>subject</b>, <b>message</b>, <b>attachment</b>, <b>signature</b>.","textColor":"#c8cce6","fontSize":16,"lineHeight":1.6,"textAlign":"left","fontWeight":400,"fontStyle":"normal","backgroundColor":null,"paddingTop":0,"paddingRight":0,"paddingBottom":0,"paddingLeft":0,"borderWidth":0,"borderColor":"#2c2e4d","borderRadius":0}]');

-- ── Exercises (exercises.id = blocks.id) ────────────────────────────────
INSERT INTO exercises (id, lesson_id, title, instructions, xp, items) VALUES
('b10c0000-0000-0000-0000-000000000012','1e550000-0000-0000-0000-000000000001','Procvič představení','Doplň chybějící slova a vyber správné odpovědi.',20,
 '[{"type":"inline","id":"it1","nodes":[{"type":"text","value":"Hello, my name "},{"type":"input","id":"n1","correct":"is","acceptAlso":[],"hint":"sloveso to be","evaluation":"auto"},{"type":"text","value":" Anna. Nice to "},{"type":"input","id":"n2","correct":"meet","acceptAlso":[],"hint":"poznat","evaluation":"auto"},{"type":"text","value":" you."}]},{"type":"mc","id":"it2","question":"Which word is a greeting?","options":[{"id":"o1","value":"Hello","correct":true},{"id":"o2","value":"Apple","correct":false},{"id":"o3","value":"Train","correct":false}],"multiple":false}]'),
('b10c0000-0000-0000-0000-000000000032','1e550000-0000-0000-0000-000000000003','Doplň o rodině','Doplň správné slovo.',15,
 '[{"type":"inline","id":"it1","nodes":[{"type":"text","value":"My "},{"type":"input","id":"n1","correct":"mother","acceptAlso":["mum","mom"],"hint":"matka","evaluation":"auto"},{"type":"text","value":" cooks dinner. My "},{"type":"input","id":"n2","correct":"father","acceptAlso":["dad"],"hint":"otec","evaluation":"auto"},{"type":"text","value":" drives a car."}]}]'),
('b10c0000-0000-0000-0000-000000000052','1e550000-0000-0000-0000-000000000005','Procvič cestování','Doplň a vyber.',20,
 '[{"type":"inline","id":"it1","nodes":[{"type":"text","value":"I bought a train "},{"type":"input","id":"n1","correct":"ticket","acceptAlso":[],"hint":"lístek","evaluation":"auto"},{"type":"text","value":"."}]},{"type":"mc","id":"it2","question":"Where do planes take off?","options":[{"id":"o1","value":"Airport","correct":true},{"id":"o2","value":"Hotel","correct":false},{"id":"o3","value":"Shop","correct":false}],"multiple":false}]'),
('b10c0000-0000-0000-0000-000000000082','1e550000-0000-0000-0000-000000000008','Procvič fráze','Vyber správnou odpověď.',10,
 '[{"type":"mc","id":"it1","question":"When is the report due?","options":[{"id":"o1","value":"By the deadline","correct":true},{"id":"o2","value":"By the apple","correct":false},{"id":"o3","value":"By the train","correct":false}],"multiple":false}]');

-- ── Game mix (lesson_mixes — one per lesson) ───────────────────────────
INSERT INTO lesson_mixes (lesson_id, games, is_random_order, xp) VALUES
('1e550000-0000-0000-0000-000000000001',
 '[{"id":"g1","type":"multiple_choice","order":0,"activeVariantId":"v1","variants":[{"id":"v1","isAutoGenerated":false,"generatedAt":null,"data":{"randomizeOptions":false,"questions":[{"id":"q1","question":"Jak se anglicky řekne ahoj?","options":[{"id":"a","text":"Hello","isCorrect":true},{"id":"b","text":"Goodbye","isCorrect":false},{"id":"c","text":"Please","isCorrect":false}]},{"id":"q2","question":"Co znamená thanks?","options":[{"id":"a","text":"děkuji","isCorrect":true},{"id":"b","text":"prosím","isCorrect":false},{"id":"c","text":"jméno","isCorrect":false}]}]}}]},{"id":"g2","type":"fill_in","order":1,"activeVariantId":"v1","variants":[{"id":"v1","isAutoGenerated":false,"generatedAt":null,"data":{"showHints":true,"sentences":[{"id":"s1","sentence":"My {blank} is John.","answer":"name","hint":"jméno"},{"id":"s2","sentence":"{blank}, how are you?","answer":"Hello","hint":"pozdrav"}]}}]},{"id":"g3","type":"word_order","order":2,"activeVariantId":"v1","variants":[{"id":"v1","isAutoGenerated":false,"generatedAt":null,"data":{"showHint":true,"sentences":[{"id":"s1","words":["My","name","is","John"],"hint":"Jmenuji se John"},{"id":"s2","words":["Nice","to","meet","you"],"hint":"Rád tě poznávám"}]}}]}]',
 false, 30),
('1e550000-0000-0000-0000-000000000002',
 '[{"id":"g1","type":"translation","order":0,"activeVariantId":"v1","variants":[{"id":"v1","isAutoGenerated":false,"generatedAt":null,"data":{"inputType":"text","items":[{"id":"i1","source":"one","answer":"jedna","acceptAlso":[],"direction":"en_to_cs"},{"id":"i2","source":"year","answer":"rok","acceptAlso":[],"direction":"en_to_cs"}]}}]},{"id":"g2","type":"connector","order":1,"activeVariantId":"v1","variants":[{"id":"v1","isAutoGenerated":false,"generatedAt":null,"data":{"leftLabel":"Anglicky","rightLabel":"Česky","rightType":"text","pairs":[{"id":"p1","left":"two","right":"dva","color":"#5b7cfa"},{"id":"p2","left":"three","right":"tři","color":"#22c79a"},{"id":"p3","left":"old","right":"starý","color":"#f59e0b"}]}}]}]',
 false, 20),
('1e550000-0000-0000-0000-000000000005',
 '[{"id":"g1","type":"word_order","order":0,"activeVariantId":"v1","variants":[{"id":"v1","isAutoGenerated":false,"generatedAt":null,"data":{"showHint":true,"sentences":[{"id":"s1","words":["The","train","is","late"],"hint":"Vlak má zpoždění"},{"id":"s2","words":["I","need","a","map"],"hint":"Potřebuji mapu"}]}}]},{"id":"g2","type":"multiple_choice","order":1,"activeVariantId":"v1","variants":[{"id":"v1","isAutoGenerated":false,"generatedAt":null,"data":{"randomizeOptions":false,"questions":[{"id":"q1","question":"Co znamená luggage?","options":[{"id":"a","text":"zavazadlo","isCorrect":true},{"id":"b","text":"letiště","isCorrect":false},{"id":"c","text":"hotel","isCorrect":false}]}]}}]}]',
 false, 25);

-- ── Groups ───────────────────────────────────────────────────────────
INSERT INTO user_groups (id, name, color) VALUES
('9405e000-0000-0000-0000-000000000001','Třída 9.A','#5b7cfa'),
('9405e000-0000-0000-0000-000000000002','Firemní kurz','#0f766e');

INSERT INTO group_course_assignments (group_id, course_id) VALUES
('9405e000-0000-0000-0000-000000000001','c0de0000-0000-0000-0000-000000000001'),
('9405e000-0000-0000-0000-000000000002','c0de0000-0000-0000-0000-000000000003');

-- ── Demo students (password: demo1234) ──────────────────────────────────
INSERT INTO users (id, email, password_hash, role) VALUES
('d0570000-0000-0000-0000-000000000001','student1@demo.cz','$2b$12$YULa74ixXW6oKHH0Gf9lMOI1D/EYjITUnQyXmVcRaoYQztHRtzM8G','user'),
('d0570000-0000-0000-0000-000000000002','student2@demo.cz','$2b$12$YULa74ixXW6oKHH0Gf9lMOI1D/EYjITUnQyXmVcRaoYQztHRtzM8G','user'),
('d0570000-0000-0000-0000-000000000003','student3@demo.cz','$2b$12$YULa74ixXW6oKHH0Gf9lMOI1D/EYjITUnQyXmVcRaoYQztHRtzM8G','user');

INSERT INTO user_group_members (group_id, user_id) VALUES
('9405e000-0000-0000-0000-000000000001','d0570000-0000-0000-0000-000000000001'),
('9405e000-0000-0000-0000-000000000001','d0570000-0000-0000-0000-000000000002');

INSERT INTO user_course_assignments (user_id, course_id) VALUES
('d0570000-0000-0000-0000-000000000001','c0de0000-0000-0000-0000-000000000002'),
('d0570000-0000-0000-0000-000000000003','c0de0000-0000-0000-0000-000000000001'),
('d0570000-0000-0000-0000-000000000003','c0de0000-0000-0000-0000-000000000003');

-- ── Access codes ──────────────────────────────────────────────────
INSERT INTO access_codes (id, code, course_id, group_id, valid_from, valid_until, status, used_by_user_id, used_at) VALUES
('acce0000-0000-0000-0000-000000000001','WELCOME1','c0de0000-0000-0000-0000-000000000001', NULL, NULL, NULL, 'active', NULL, NULL),
('acce0000-0000-0000-0000-000000000002','TRIDA9A','c0de0000-0000-0000-0000-000000000001','9405e000-0000-0000-0000-000000000001', NULL, NULL, 'active', NULL, NULL),
('acce0000-0000-0000-0000-000000000003','BIZ2026','c0de0000-0000-0000-0000-000000000003','9405e000-0000-0000-0000-000000000002', NULL, NULL, 'active', NULL, NULL),
('acce0000-0000-0000-0000-000000000004','EXPIRED','c0de0000-0000-0000-0000-000000000002', NULL, NULL, '2025-01-01T00:00:00.000Z', 'active', NULL, NULL),
('acce0000-0000-0000-0000-000000000005','USEDCODE','c0de0000-0000-0000-0000-000000000002', NULL, NULL, NULL, 'used', 'd0570000-0000-0000-0000-000000000001', NOW());

COMMIT;
