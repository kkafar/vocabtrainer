use crate::{context::Context, cli::Cli, DatabaseProxy};


pub struct Application {
    context: Context,
}


impl Application {
    pub fn new(args: &Cli) -> Self {
        let cwd = std::env::current_dir().expect("Failed to read current directory from env");
        let db_path = cwd.join("testdb.db3");

        let mut db = DatabaseProxy::new(db_path).unwrap();
        let _ = db.ensure_db_exists();

        Self {
            context: Context::new(db),
        }
    }

    pub fn context(&self) -> &Context {
        &self.context
    }

    pub fn context_mut(&mut self) -> &mut Context {
        &mut self.context
    }
}
