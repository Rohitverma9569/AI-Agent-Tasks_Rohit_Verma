use log_analyzer::{analyze_log, analyze_log_file, AnalyzeError};
use std::path::Path;

#[test]
fn valid_log_file_returns_correct_counts() {
    let content = "\
2026-06-17 INFO Started
2026-06-17 WARN Slow response
2026-06-17 ERROR Failed
2026-06-17 INFO Done
";
    let summary = analyze_log(content);
    assert_eq!(summary.info, 2);
    assert_eq!(summary.warn, 1);
    assert_eq!(summary.error, 1);
    assert_eq!(summary.total_lines, 4);
}

#[test]
fn empty_file_returns_zero_counts() {
    let dir = std::env::temp_dir().join("log_analyzer_empty_test");
    let _ = std::fs::create_dir_all(&dir);
    let path = dir.join("empty.log");
    std::fs::write(&path, "").unwrap();

    let summary = analyze_log_file(&path).expect("empty file should succeed");
    assert_eq!(summary.info, 0);
    assert_eq!(summary.warn, 0);
    assert_eq!(summary.error, 0);
    assert_eq!(summary.total_lines, 0);

    let _ = std::fs::remove_file(&path);
}

#[test]
fn missing_file_returns_error() {
    let path = Path::new("/tmp/log_analyzer_does_not_exist_12345.log");
    let result = analyze_log_file(path);
    assert!(matches!(result, Err(AnalyzeError::NotFound(_))));
}

#[test]
fn analyze_log_file_reads_valid_file() {
    let summary = analyze_log_file(Path::new("sample.log")).expect("sample.log should exist");
    assert_eq!(summary.info, 4);
    assert_eq!(summary.warn, 2);
    assert_eq!(summary.error, 2);
    assert_eq!(summary.total_lines, 8);
}
