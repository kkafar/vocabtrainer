use application::Application;
use clap::Parser;

mod logging;
mod cli;
mod application;
mod context;
mod command;
mod database;
mod history;
mod dictionary;


#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _ = logging::init();
    let args = cli::Cli::parse();

    let mut app = Application::new(args);
    app.run()?;

    anyhow::Ok(())
}
