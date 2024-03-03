use anyhow::{Context, Result};
use log::LevelFilter; use log4rs::{
    self,
    append::console::ConsoleAppender,
    config::{self, Appender, Logger},
    encode::pattern::PatternEncoder,
    Config,
};

const LOG_PATTERN: &str = "[{l}] {m}{n}";
const APPENDER_NAME: &str = "main_appender";
const LOGGER_NAME: &str = "main_logger";

pub fn init() -> Result<log4rs::Handle> {
    let stdout_appender = ConsoleAppender::builder()
        .encoder(Box::new(PatternEncoder::new(LOG_PATTERN)))
        .build();

    let appender = Appender::builder().build(APPENDER_NAME, Box::new(stdout_appender));

    let logger = Logger::builder()
        .appender(APPENDER_NAME)
        .additive(false)
        .build(LOGGER_NAME, LevelFilter::Trace);

    let config = Config::builder()
        .appender(appender)
        .logger(logger)
        .build(
            config::Root::builder()
                .appender(APPENDER_NAME)
                .build(LevelFilter::Trace),
        )
        .with_context(|| "Failed to create logger configuration")?;

    log4rs::init_config(config).with_context(|| "Failed to initialize logger with provided config")
}

