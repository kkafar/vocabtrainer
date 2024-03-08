use crate::{command::UserInput, dictionary::DictionaryRecord};

pub struct HistoryRecord {
    pub dict_record: DictionaryRecord,
    pub user_input: UserInput,
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
        assert!(
            record.user_input != UserInput::Rollback,
            "History record must not contain Rollback user input"
        );
        self.records.push(record);
    }

    pub fn pop(&mut self) -> Option<HistoryRecord> {
        self.records.pop()
    }

    pub fn is_empty(&self) -> bool {
        self.records.is_empty()
    }
}
