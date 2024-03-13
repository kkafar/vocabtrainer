use application::Application;
use clap::Parser;

mod application;
mod cli;
mod command;
mod context;
mod database;
mod dictionary;
mod history;
mod logging;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _ = logging::init();
    let args = cli::Cli::parse();

    let mut app = Application::new(args);
    app.run()?;

    anyhow::Ok(())
}
