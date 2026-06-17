# Currency Convert CLI

Node.js CLI client that calls the FastAPI conversion service.

## Requirements

- Node.js **18+** (uses built-in `fetch`)

## Usage

```bash
node cli.js <amount> <fromCurrency> <toCurrency>
```

**Example**

```bash
node cli.js 100 USD INR
# Output: 8300
```

## Configuration

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `CONVERT_API_URL` | `http://127.0.0.1:8000` | FastAPI base URL |

## Exit codes

| Code | Meaning |
| ---- | ------- |
| 0 | Success |
| 1 | Invalid CLI arguments |
| 2 | Service unreachable |
| 3 | Non-JSON response |
| 4 | HTTP error from API |
| 5 | Unexpected response shape |

## Example with custom URL

```bash
CONVERT_API_URL=http://localhost:8000 node cli.js 50 EUR GBP
```
