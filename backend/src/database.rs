use std::path::Path;

use log::trace;
use rusqlite::{params, Connection};

use crate::dictionary::DictionaryRecord;

pub struct DatabaseProxy {
    pub conn: Connection,
}

impl DatabaseProxy {
    pub fn new(path: impl AsRef<Path>) -> anyhow::Result<Self> {
        let conn = match Connection::open(path.as_ref()) {
            Ok(conn) => conn,
            Err(err) => {
                return Err(anyhow::Error::new(err));
            }
        };
        return Ok(DatabaseProxy { conn });
    }

    pub fn ensure_db_exists(self: &mut Self) -> anyhow::Result<()> {
        let mut stmt = self.conn.prepare("CREATE TABLE IF NOT EXISTS vocab (word TEXT NOT NULL UNIQUE, translation TEXT, lesson_id INTEGER NOT NULL, PRIMARY KEY (word))").unwrap();
        stmt.execute([])?;
        Ok(())
    }

    pub fn insert_record(self: &mut Self, record: &DictionaryRecord) -> anyhow::Result<()> {
        trace!("Inserting record {record:?}");
        let mut stmt = self
            .conn
            .prepare("INSERT INTO vocab (word, translation, lesson_id) VALUES (?1, ?2, ?3);")
            .unwrap();
        stmt.execute(params![
            &record.word,
            &record.translation,
            &record.lesson_id
        ])?;
        Ok(())
    }

    pub fn read_all_records(&mut self) -> anyhow::Result<Vec<DictionaryRecord>> {
        trace!("Reading all records");
        let mut stmt = self
            .conn
            .prepare("SELECT word, translation, lesson_id FROM vocab")
            .unwrap();
        let res: Vec<DictionaryRecord> = stmt
            .query_map([], |row| DictionaryRecord::try_from(row))?
            .filter_map(Result::ok)
            .collect();
        Ok(res)
    }

    pub fn read_records_for_lesson(
        &mut self,
        lesson_id: usize,
    ) -> anyhow::Result<Vec<DictionaryRecord>> {
        trace!("Reading records for lesson {lesson_id}");
        let mut stmt = self
            .conn
            .prepare("SELECT word, translation, lesson_id FROM vocab WHERE lesson_id = ?1")
            .unwrap();
        let res: Vec<DictionaryRecord> = stmt
            .query_map([lesson_id], |row| DictionaryRecord::try_from(row))?
            .filter_map(Result::ok)
            .collect();
        Ok(res)
    }
}
