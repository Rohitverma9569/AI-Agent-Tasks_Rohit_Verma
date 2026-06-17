use std::env;
use std::path::Path;
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        eprintln!("Usage: log-analyzer <log-file>");
        eprintln!("Example: cargo run -- sample.log");
        process::exit(1);
    }

    let path = Path::new(&args[1]);
    match log_analyzer::analyze_log_file(path) {
        Ok(summary) => {
            println!("File: {}", path.display());
            println!();
            println!("{}", summary.format_report());
            if summary.total_lines == 0 {
                println!();
                println!("Note: file is empty or contains no log lines.");
            }
        }
        Err(err) => {
            eprintln!("Error: {err}");
            process::exit(1);
        }
    }
}
