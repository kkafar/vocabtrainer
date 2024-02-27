mod logging;
mod cli;

use std::{collections::HashSet, io::Write, path::{Path, PathBuf}};
use anyhow::{self};
use clap::Parser;
use rand::seq::IteratorRandom;
use rusqlite::{params, Connection, Row};
use log::info;


#[derive(Debug, Eq, PartialEq, Hash, Clone)]
pub struct DictionaryRecord {
    pub word: String,
    pub translation: String,
    pub lesson_id: usize,
}

#[derive(Eq, PartialEq, Clone, Copy)]
pub enum UserInput {
    Yes,
    No,
    Rollback,
    Unknown,
}

pub struct HistoryRecord {
    pub dict_record: DictionaryRecord,
    pub user_input: UserInput
}

impl HistoryRecord {
    pub fn new(dict_record: DictionaryRecord, user_input: UserInput) -> Self {
        Self {
            dict_record,
            user_input,
        }
    }
}

pub struct History {
    pub records: Vec<HistoryRecord>,
}

impl History {
    pub fn new() -> Self {
        Self {
            records: Vec::new(),
        }
    }

    pub fn add(&mut self, record: HistoryRecord) {
        assert!(record.user_input != UserInput::Rollback, "History record must not contain Rollback user input");
        self.records.push(record);
    }

    pub fn pop(&mut self) -> Option<HistoryRecord> {
        self.records.pop()
    }

    pub fn is_empty(&self) -> bool {
        self.records.is_empty()
    }
}

impl<'a> TryFrom<&Row<'a>> for DictionaryRecord {
    type Error = rusqlite::Error;

    fn try_from(value: &Row<'a>) -> Result<Self, Self::Error> {
        let word = value.get::<usize, String>(0)?;
        let translation = value.get::<usize, String>(1)?;
        let lesson_id = value.get::<usize, usize>(2)?;
        Ok(DictionaryRecord { word, translation, lesson_id })
    }
}

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
        return Ok(DatabaseProxy { conn })
    }

    pub fn ensure_db_exists(self: &mut Self) -> anyhow::Result<()> {
        let mut stmt = self.conn.prepare("CREATE TABLE IF NOT EXISTS vocab (word TEXT NOT NULL UNIQUE, translation TEXT, lesson_id INTEGER NOT NULL, PRIMARY KEY (word))").unwrap();
        stmt.execute([])?;
        Ok(())
    }

    pub fn insert_record(self: &mut Self, record: &DictionaryRecord) -> anyhow::Result<()> {
        let mut stmt = self.conn.prepare("INSERT INTO vocab (word, translation, lesson_id) VALUES (?1, ?2, ?3);").unwrap();
        stmt.execute(params![&record.word, &record.translation, &record.lesson_id])?;
        Ok(())
    }

    pub fn read_all_records(&mut self) -> anyhow::Result<Vec<DictionaryRecord>> {
        let mut stmt = self.conn.prepare("SELECT word, translation, lesson_id FROM vocab").unwrap();
        let res: Vec<DictionaryRecord> = stmt.query_map([], |row| DictionaryRecord::try_from(row))?.filter_map(Result::ok).collect();
        Ok(res)
    }
}

fn load_from_file(path: impl Into<PathBuf>, lesson_id: usize) -> anyhow::Result<Box<dyn Iterator<Item = DictionaryRecord>>> {
    let content: Vec<DictionaryRecord> = std::fs::read_to_string(path.into()).unwrap()
        .lines()
        .map(|line| {
            if let Some(split) = line.split_once(" - ") {
                (split.0.to_owned(), split.1.to_owned())
            } else {
                (line.to_owned(), "".to_owned())
            }
        })
        .map(|(word, translation)| DictionaryRecord { word, translation, lesson_id })
        .collect();
    Ok(Box::new(content.into_iter()))
}

fn handle_load_cmd(opts: &cli::LoadArgs, db: &mut DatabaseProxy) {
    load_from_file(&opts.file, opts.lesson_id)
        .unwrap()
        .for_each(|record| {
            let _  = db.insert_record(&record);
        });
}

fn read_user_input(mut buffer: &mut String) -> anyhow::Result<usize> {
    buffer.clear();
    let read_size = std::io::stdin().read_line(&mut buffer)?;
    Ok(read_size)
}

fn print_prompt() {
    print!("> ");
    let _ = std::io::stdout().flush();
}

fn get_user_input(buffer: &mut String) -> anyhow::Result<UserInput> {
    print_prompt();
    let _read_size = read_user_input(buffer)?;

    let user_input = if buffer.starts_with("y") {
        UserInput::Yes
    } else if buffer.starts_with("n") {
        UserInput::No
    } else if buffer.starts_with("r") {
        UserInput::Rollback
    } else {
        UserInput::Unknown
    };

    Ok(user_input)
}

fn handle_train_cmd(db: &mut DatabaseProxy) -> anyhow::Result<()> {
    let dict = db.read_all_records()?;
    let dict_swap: Vec<DictionaryRecord> = dict.clone()
        .into_iter()
        .filter(|record| !record.translation.is_empty())
        .map(|record| DictionaryRecord { word: record.translation, translation: record.word, lesson_id: record.lesson_id })
        .collect();

    let total_count = dict.len() + dict_swap.len();
    let mut done_count = 0usize;

    println!("Total count: {total_count}");

    let mut set: HashSet<DictionaryRecord> = HashSet::from_iter(dict.into_iter().chain(dict_swap));
    let mut rng = rand::thread_rng();
    let mut buffer = String::new();
    let mut rollback_buffer: Option<DictionaryRecord> = None;

    let mut history = History::new();

    while !set.is_empty() || !rollback_buffer.is_none() {
        let record = if rollback_buffer.is_some() {
            rollback_buffer.take().unwrap()
        } else {
            set.iter().choose(&mut rng).unwrap().clone()
        };

        println!("> {} [y]es/[n]o", record.word);

        let mut user_input = get_user_input(&mut buffer)?;

        while user_input == UserInput::Unknown {
            user_input = get_user_input(&mut buffer)?;
        }

        match user_input {
            UserInput::Yes => {
                done_count += 1;
                set.remove(&record);
                history.add(HistoryRecord::new(record.clone(), user_input));
                println!("> {} - {}  -  OK {}/{}", record.word, record.translation, done_count, total_count);
            }
            UserInput::No => {
                history.add(HistoryRecord::new(record.clone(), user_input));
                println!("> {} - {}  -  REPEAT {}/{}", record.word, record.translation, done_count, total_count);
            }
            UserInput::Rollback => {
                if !history.is_empty() {
                    let history_record = history.pop().unwrap();
                    match history_record.user_input {
                        UserInput::Yes => {
                            let last_dict_record = history_record.dict_record;
                            set.insert(last_dict_record.clone());
                            rollback_buffer = Some(last_dict_record);
                            done_count -= 1;
                        }
                        UserInput::No => {
                            let last_dict_record = history_record.dict_record;
                            rollback_buffer = Some(last_dict_record);
                        }
                        _ => panic!("History record should never contain Rollback action"),
                    };
                } else {
                    rollback_buffer = Some(record);
                }
            }
            _ => panic!("Illegal value of UserInput, this should never happen")
        };
    }
    Ok(())
}


#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _ = logging::init();
    info!("Hello world from vocabtrainer application");

    let args = cli::Cli::parse();

    let cwd = std::env::current_dir().expect("Failed to read current directory from env");
    let db_path = cwd.join("testdb.db3");

    let mut db = DatabaseProxy::new(db_path).unwrap();
    let _ = db.ensure_db_exists();

    match args.command {
        cli::Command::Load(opts) => {
            handle_load_cmd(&opts, &mut db);
        }
        cli::Command::Train => {
            match handle_train_cmd(&mut db) {
                Ok(()) => {

                }
                Err(err) => {
                    println!("Error: {err}");
                }
            }
        }
    };

    anyhow::Ok(())
}
