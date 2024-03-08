use rusqlite::Row;

#[derive(Debug, Eq, PartialEq, Hash, Clone)]
pub struct DictionaryRecord {
    pub word: String,
    pub translation: String,
    pub lesson_id: usize,
}

impl<'a> TryFrom<&Row<'a>> for DictionaryRecord {
    type Error = rusqlite::Error;

    fn try_from(value: &Row<'a>) -> Result<Self, Self::Error> {
        let word = value.get::<usize, String>(0)?;
        let translation = value.get::<usize, String>(1)?;
        let lesson_id = value.get::<usize, usize>(2)?;
        Ok(DictionaryRecord {
            word,
            translation,
            lesson_id,
        })
    }
}
