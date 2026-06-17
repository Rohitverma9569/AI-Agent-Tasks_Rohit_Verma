.PHONY: help build test verify lint clean

ROOT := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
FASTAPI_VENV := $(ROOT)services/fastapi/.venv

help:
	@echo "Targets:"
	@echo "  make build   - Build Rust release binary"
	@echo "  make test    - Run Rust, FastAPI, and Node unit tests"
	@echo "  make verify  - build + test (recommended CI/local gate)"
	@echo "  make lint    - Static checks where available"
	@echo "  make clean   - Remove build artifacts and temp DB"

build:
	cd engines/rust && cargo build --release

test:
	./scripts/verify.sh test-only

verify: build test
	@echo "verify: all checks passed"

lint:
	cd engines/rust && cargo fmt --check
	cd engines/rust && cargo clippy -- -D warnings

clean:
	cd engines/rust && cargo clean
	rm -f data/fraud.db
