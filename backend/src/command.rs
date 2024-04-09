use std::{collections::HashSet, io::Write, path::PathBuf};

use log::info;
use rand::seq::IteratorRandom;

use crate::{
    cli,
    database::DatabaseProxy,
    dictionary::DictionaryRecord,
    history::{History, HistoryRecord},
};

#[derive(Eq, PartialEq, Clone, Copy)]
pub enum UserInput {
    Yes,
    No,
    Rollback,
    Unknown,
}

fn load_from_file(
    path: impl Into<PathBuf>,
    lesson_id: usize,
) -> anyhow::Result<Box<dyn Iterator<Item = DictionaryRecord>>> {
    let content: Vec<DictionaryRecord> = std::fs::read_to_string(path.into())
        .unwrap()
        .lines()
        .map(|line| {
            if let Some(split) = line.split_once(" - ") {
                (split.0.to_owned(), split.1.to_owned())
            } else {
                (line.to_owned(), "".to_owned())
            }
        })
        .map(|(word, translation)| DictionaryRecord {
            word,
            translation,
            lesson_id,
        })
        .collect();
    Ok(Box::new(content.into_iter()))
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

pub fn handle_load_cmd(opts: &cli::LoadArgs, db: &mut DatabaseProxy) {
    info!("Handling load cmd with args: {opts:?}");
    load_from_file(&opts.file, opts.lesson_id)
        .unwrap()
        .for_each(|record| {
            let _ = db.insert_record(&record);
        });
}

pub fn handle_train_cmd(opts: &cli::TrainArgs, db: &mut DatabaseProxy) -> anyhow::Result<()> {
    let dict = db.read_all_records()?;
    let dict_swap: Vec<DictionaryRecord> = dict
        .clone()
        .into_iter()
        .filter(|record| !record.translation.is_empty())
        .map(|record| DictionaryRecord {
            word: record.translation,
            translation: record.word,
            lesson_id: record.lesson_id,
        })
        .collect();

    let chained_iter: Vec<DictionaryRecord> = if let Some(lesson_id) = opts.lesson_id {
        dict.into_iter()
            .chain(dict_swap)
            .filter(|record| record.lesson_id == lesson_id)
            .collect()
    } else {
        dict.into_iter().chain(dict_swap).collect()
    };

    let total_count = chained_iter.len();
    let mut done_count = 0usize;

    println!("Total count: {total_count}");

    let mut set: HashSet<DictionaryRecord> = HashSet::from_iter(chained_iter);
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
                println!(
                    "> {} - {}  -  OK {}/{}",
                    record.word, record.translation, done_count, total_count
                );
            }
            UserInput::No => {
                history.add(HistoryRecord::new(record.clone(), user_input));
                println!(
                    "> {} - {}  -  REPEAT {}/{}",
                    record.word, record.translation, done_count, total_count
                );
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
            _ => panic!("Illegal value of UserInput, this should never happen"),
        };
    }
    Ok(())
}

pub fn handle_list_cmd(opts: &cli::ListArgs, db: &mut DatabaseProxy) -> anyhow::Result<()> {
    let records: Vec<DictionaryRecord> = if let Some(lesson_id) = opts.lesson_id {
        db.read_records_for_lesson(lesson_id)?
    } else {
        db.read_all_records()?
    };

    for (i, record) in records.into_iter().enumerate() {
        println!("{i}: {} - {}", record.word, record.translation);
    }
    Ok(())
}

pub fn handle_list_lessons_cmd(db: &mut DatabaseProxy) -> anyhow::Result<()> {
    let lessons = db.list_lessons()?;
    println!("Available lessons:");
    for lesson in lessons {
        println!("{}", lesson);
    }


    Ok(())
}
