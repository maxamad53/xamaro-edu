ALTER TABLE subjects ADD COLUMN level TEXT NOT NULL DEFAULT 'all' CHECK (level IN ('all','middle','secondary'));
ALTER TABLE classes ADD COLUMN level TEXT NOT NULL DEFAULT 'middle' CHECK (level IN ('middle','secondary'));
UPDATE subjects SET level='middle' WHERE name IN ('Sayniska','Bulshada');
UPDATE subjects SET level='secondary' WHERE name IN ('Juquraafi','Taariikh','Dhaqaale','ICT');
