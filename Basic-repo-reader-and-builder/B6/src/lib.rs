//! Log analyzer library — counts INFO, WARN, and ERROR lines in log files.

use std::fmt;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

/// Counts per log level.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct LogSummary {
    pub info: usize,
    pub warn: usize,
    pub error: usize,
    pub total_lines: usize,
}

impl LogSummary {
    pub fn format_report(&self) -> String {
        format!(
            "Log Analysis Summary\n\
             --------------------\n\
             INFO:  {}\n\
             WARN:  {}\n\
             ERROR: {}\n\
             Total lines: {}",
            self.info, self.warn, self.error, self.total_lines
        )
    }
}

/// Errors that can occur while reading or analyzing a log file.
#[derive(Debug, PartialEq, Eq)]
pub enum AnalyzeError {
    NotFound(PathBuf),
    NotAFile(PathBuf),
    ReadFailed { path: PathBuf, message: String },
}

impl fmt::Display for AnalyzeError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AnalyzeError::NotFound(path) => {
                write!(f, "File not found: {}", path.display())
            }
            AnalyzeError::NotAFile(path) => {
                write!(f, "Invalid path (not a file): {}", path.display())
            }
            AnalyzeError::ReadFailed { path, message } => {
                write!(f, "Failed to read {}: {}", path.display(), message)
            }
        }
    }
}

impl std::error::Error for AnalyzeError {}

/// Analyze log content and count INFO, WARN, and ERROR lines.
/// Each non-empty line is classified at most once (ERROR > WARN > INFO).
pub fn analyze_log(content: &str) -> LogSummary {
    let mut summary = LogSummary::default();

    for line in content.lines() {
        if line.trim().is_empty() {
            continue;
        }
        summary.total_lines += 1;
        if line_contains_level(line, "ERROR") {
            summary.error += 1;
        } else if line_contains_level(line, "WARN") {
            summary.warn += 1;
        } else if line_contains_level(line, "INFO") {
            summary.info += 1;
        }
    }

    summary
}

fn line_contains_level(line: &str, level: &str) -> bool {
    line.split(|c: char| !c.is_ascii_alphanumeric() && c != '_')
        .any(|token| token == level)
}

/// Read a log file from disk and return level counts.
pub fn analyze_log_file(path: &Path) -> Result<LogSummary, AnalyzeError> {
    if !path.exists() {
        return Err(AnalyzeError::NotFound(path.to_path_buf()));
    }

    if path.is_dir() {
        return Err(AnalyzeError::NotAFile(path.to_path_buf()));
    }

    let content = fs::read_to_string(path).map_err(|err| map_io_error(path, err))?;
    Ok(analyze_log(&content))
}

fn map_io_error(path: &Path, err: io::Error) -> AnalyzeError {
    match err.kind() {
        io::ErrorKind::NotFound => AnalyzeError::NotFound(path.to_path_buf()),
        _ => AnalyzeError::ReadFailed {
            path: path.to_path_buf(),
            message: err.to_string(),
        },
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn counts_levels_in_content() {
        let content = "INFO boot\nWARN slow\nERROR fail\nINFO ok\n";
        let summary = analyze_log(content);
        assert_eq!(summary.info, 2);
        assert_eq!(summary.warn, 1);
        assert_eq!(summary.error, 1);
    }

    #[test]
    fn empty_content_has_zero_counts() {
        let summary = analyze_log("");
        assert_eq!(summary.total_lines, 0);
    }
}
