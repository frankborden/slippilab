CREATE TABLE replays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  file_name TEXT NOT NULL,
  played_on TEXT NOT NULL,
  num_frames INTEGER NOT NULL,
  external_stage_id INTEGER NOT NULL,
  players TEXT NOT NULL,
  is_teams INTEGER NOT NULL
);