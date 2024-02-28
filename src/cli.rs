use clap::{Args, Parser, Subcommand};
use std::path::PathBuf;

#[derive(Parser)]
#[command(author, version, about, long_about)]
pub struct Cli {
    /// Command to execute
    #[command(subcommand)]
    pub command: Command,
}

#[derive(Debug, Subcommand)]
pub enum Command {
    Load(LoadArgs),
    Train(TrainArgs),
    List(ListArgs),
}

#[derive(Debug, Args)]
#[command(args_conflicts_with_subcommands = true)]
#[command(flatten_help = true)]
pub struct LoadArgs {
    /// Path to file with vocabulary to update database with
    pub file: PathBuf,

    /// Lesson id (in the future there will be possibility to specify description)
    pub lesson_id: usize,
}

#[derive(Debug, Args)]
#[command(args_conflicts_with_subcommands = true)]
#[command(flatten_help = true)]
pub struct TrainArgs {
    /// Id of lesson to train
    pub lesson_id: Option<usize>,
}

#[derive(Debug, Args)]
#[command(args_conflicts_with_subcommands = true)]
#[command(flatten_help = true)]
pub struct ListArgs {
    /// Id of lesson to train
    pub lesson_id: Option<usize>,
}

