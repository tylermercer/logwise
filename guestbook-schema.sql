DROP TABLE IF EXISTS Comments;

CREATE TABLE IF NOT EXISTS Comments (
    Id INTEGER PRIMARY KEY,
    Author TEXT,
    Body TEXT
);

INSERT INTO
    Comments (Id, Author, Body)
VALUES
    (1, 'Alfreds Futterkiste', 'First '),
    (4, 'Thomas Hardy', 'Thomas Hardy was here'),
    (11, 'Victoria Ashworth', 'This is neat'),
    (13, 'Maria Anders', 'Yoooooooo :hype:');