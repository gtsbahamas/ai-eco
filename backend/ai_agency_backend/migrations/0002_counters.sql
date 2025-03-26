CREATE TABLE IF NOT EXISTS counters (name TEXT PRIMARY KEY, value INTEGER);
INSERT OR IGNORE INTO counters (name, value) VALUES ('page_views', 0);
