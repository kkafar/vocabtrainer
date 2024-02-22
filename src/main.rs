mod logging;
mod cli;

use std::{collections::HashSet, io::Write, path::{Path, PathBuf}};
use anyhow::{self};
use clap::Parser;
use rand::{distributions::Uniform, Rng, seq::IteratorRandom};
use rusqlite::{Connection, Row};
use log::info;


#[derive(Debug, Eq, PartialEq, Hash, Clone)]
pub struct DictionaryRecord {
    pub word: String,
    pub translation: String,
}

impl<'a> TryFrom<&Row<'a>> for DictionaryRecord {
    type Error = rusqlite::Error;

    fn try_from(value: &Row<'a>) -> Result<Self, Self::Error> {
        let word = value.get::<usize, String>(0)?;
        let translation = value.get::<usize, String>(1)?;
        Ok(DictionaryRecord { word, translation })
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
        let mut stmt = self.conn.prepare("CREATE TABLE IF NOT EXISTS vocab (word TEXT NOT NULL UNIQUE, translation TEXT, PRIMARY KEY (word))").unwrap();
        stmt.execute([])?;
        Ok(())
    }

    pub fn insert_record(self: &mut Self, record: &DictionaryRecord) -> anyhow::Result<()> {
        let mut stmt = self.conn.prepare("INSERT INTO vocab (word, translation) VALUES (?1, ?2);").unwrap();
        stmt.execute([&record.word, &record.translation])?;
        Ok(())
    }

    pub fn read_all_records(&mut self) -> anyhow::Result<Vec<DictionaryRecord>> {
        let mut stmt = self.conn.prepare("SELECT word, translation FROM vocab").unwrap();
        let res: Vec<DictionaryRecord> = stmt.query_map([], |row| DictionaryRecord::try_from(row))?.filter_map(Result::ok).collect();
        Ok(res)
    }
}

fn load_from_file(path: impl Into<PathBuf>) -> anyhow::Result<Box<dyn Iterator<Item = DictionaryRecord>>> {
    let content: Vec<DictionaryRecord> = std::fs::read_to_string(path.into()).unwrap()
        .lines()
        .map(|line| {
            if let Some(split) = line.split_once(" - ") {
                (split.0.to_owned(), split.1.to_owned())
            } else {
                (line.to_owned(), "".to_owned())
            }
        })
        .map(|(word, translation)| DictionaryRecord { word, translation })
        .collect();
    Ok(Box::new(content.into_iter()))
}

fn handle_load_cmd(opts: &cli::LoadArgs, db: &mut DatabaseProxy) {
    load_from_file(&opts.file)
        .unwrap()
        .for_each(|record| {
            let _  = db.insert_record(&record);
        });
}

fn handle_train_cmd(db: &mut DatabaseProxy) -> anyhow::Result<()> {
    let dict = db.read_all_records()?;
    let all = dict.len();
    let mut done = 0usize;

    let mut set: HashSet<DictionaryRecord> = HashSet::from_iter(dict.into_iter());

    let mut rng = rand::thread_rng();

    let mut user_input = String::new();


    while !set.is_empty() {
        let record = set.iter().choose(&mut rng).unwrap().clone();

        println!("> {} [y]es/[n]o", record.word);
        print!("> ");
        let _ = std::io::stdout().flush();

        user_input.clear();
        let _ = std::io::stdin().read_line(&mut user_input)?;

        while !user_input.starts_with("y") && !user_input.starts_with("n") {
            user_input.clear();
            print!("> ");
            let _ = std::io::stdout().flush();
            let _ = std::io::stdin().read_line(&mut user_input)?;
        }

        if user_input.starts_with("y") {
            done += 1;
            println!("> {} - {}  -  OK {}/{}", record.word, record.translation, done, all);
            set.remove(&record);
        } else if user_input.starts_with("n") {
            println!("> {} - {}  -  REPEAT {}/{}", record.word, record.translation, done, all);
        }
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
            let _ = handle_train_cmd(&mut db);
        }
    };



    anyhow::Ok(())
}
