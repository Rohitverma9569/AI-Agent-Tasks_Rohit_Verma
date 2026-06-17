from __future__ import annotations

# Hardcoded exchange rates: units of each currency per 1 USD
RATES_PER_USD: dict[str, float] = {
    "USD": 1.0,
    "INR": 83.0,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 156.0,
}


class UnsupportedCurrencyError(ValueError):
    """Raised when a currency code is not in the hardcoded rate table."""


def list_supported_currencies() -> list[str]:
    return sorted(RATES_PER_USD.keys())


def convert_amount(amount: float, from_currency: str, to_currency: str) -> float:
    from_code = from_currency.upper()
    to_code = to_currency.upper()

    if from_code not in RATES_PER_USD:
        raise UnsupportedCurrencyError(f"Unsupported source currency: {from_code}")
    if to_code not in RATES_PER_USD:
        raise UnsupportedCurrencyError(f"Unsupported target currency: {to_code}")

    if from_code == to_code:
        return round(amount, 4)

    amount_in_usd = amount / RATES_PER_USD[from_code]
    converted = amount_in_usd * RATES_PER_USD[to_code]
    return round(converted, 4)
