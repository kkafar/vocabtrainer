mod logging;

use anyhow;
use log::info;

#[tokio::main]
async fn main() -> anyhow::Result<()> {

    let _ = logging::init();

    info!("Hello world from vocabtrainer application");


    anyhow::Ok(())
}
