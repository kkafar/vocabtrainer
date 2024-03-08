use std::cell::{RefCell, RefMut, Ref};

use crate::{context::Context, cli::{Cli, self}, command::{handle_load_cmd, handle_train_cmd, handle_list_cmd}, database::DatabaseProxy};

struct Inner {
    context: RefCell<Context>,
    args: Cli,
}

pub struct Application {
    state: Inner,
}

impl Application {
    pub fn new(args: Cli) -> Self {
        let cwd = std::env::current_dir().expect("Failed to read current directory from env");
        let db_path = cwd.join("testdb.db3");

        let mut db = DatabaseProxy::new(db_path).unwrap();
        let _ = db.ensure_db_exists();

        let state = Inner {
            context: RefCell::new(Context::new(db)),
            args,
        };

        Self { state }
    }

    fn context(&self) -> Ref<Context> {
        self.state.context.borrow()
    }

    fn context_mut(&mut self) -> RefMut<Context> {
        self.state.context.borrow_mut()
    }

    pub fn run(&mut self) -> () {
        match self.state.args.command.clone() {
            cli::Command::Load(opts) => {
                handle_load_cmd(&opts, self.context_mut().db_mut());
            }
            cli::Command::Train(ref opts) => {
                match handle_train_cmd(&opts, self.context_mut().db_mut()) {
                    Ok(()) => {

                    }
                    Err(err) => {
                        println!("Error: {err}");
                    }
                }
            }
            cli::Command::List(ref opts) => {
                let _ = handle_list_cmd(&opts, self.context_mut().db_mut());
            }
        };
    }
}
