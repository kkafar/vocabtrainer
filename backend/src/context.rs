use crate::database::DatabaseProxy;

pub struct Context {
    db_proxy: DatabaseProxy,

}

impl Context {
    pub fn new(db_proxy: DatabaseProxy) -> Self {
        Self { db_proxy }
    }

    pub fn db(&self) -> &DatabaseProxy {
        &self.db_proxy
    }

    pub fn db_mut(&mut self) -> &mut DatabaseProxy {
        &mut self.db_proxy
    }
}
