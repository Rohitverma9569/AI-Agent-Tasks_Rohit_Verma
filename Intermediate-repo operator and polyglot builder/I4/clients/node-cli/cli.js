#!/usr/bin/env node
"use strict";

const DEFAULT_API_URL = "http://127.0.0.1:8000";

function printUsage() {
  console.error("Usage: node cli.js <amount> <fromCurrency> <toCurrency>");
  console.error("Example: node cli.js 100 USD INR");
  console.error("");
  console.error("Environment:");
  console.error("  CONVERT_API_URL  Base URL of FastAPI service (default: http://127.0.0.1:8000)");
}

function parseArgs(argv) {
  const positional = argv.filter((arg) => !arg.startsWith("-"));
  if (positional.length !== 3) {
    printUsage();
    process.exit(1);
  }

  const amount = Number(positional[0]);
  const fromCurrency = String(positional[1]).trim();
  const toCurrency = String(positional[2]).trim();

  if (!Number.isFinite(amount) || amount <= 0) {
    console.error("Error: amount must be a positive number.");
    process.exit(1);
  }

  if (!/^[A-Za-z]{3}$/.test(fromCurrency) || !/^[A-Za-z]{3}$/.test(toCurrency)) {
    console.error("Error: currency codes must be 3 letters (e.g. USD, INR).");
    process.exit(1);
  }

  return { amount, fromCurrency: fromCurrency.toUpperCase(), toCurrency: toCurrency.toUpperCase() };
}

async function convertCurrency({ amount, fromCurrency, toCurrency }) {
  const baseUrl = (process.env.CONVERT_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
  const url = `${baseUrl}/convert`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ amount, from: fromCurrency, to: toCurrency }),
    });
  } catch (err) {
    console.error(`Error: unable to reach conversion service at ${baseUrl}`);
    console.error(`Detail: ${err.message}`);
    console.error("Hint: start the FastAPI server in another terminal (see README).");
    process.exit(2);
  }

  let body;
  try {
    body = await response.json();
  } catch {
    console.error(`Error: service returned non-JSON response (HTTP ${response.status}).`);
    process.exit(3);
  }

  if (!response.ok) {
    const message = body.message || body.detail?.message || JSON.stringify(body.detail || body);
    console.error(`Error: conversion failed (HTTP ${response.status}).`);
    console.error(`Detail: ${message}`);
    process.exit(4);
  }

  if (typeof body.convertedAmount !== "number") {
    console.error("Error: unexpected response shape (missing convertedAmount).");
    process.exit(5);
  }

  return body.convertedAmount;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const convertedAmount = await convertCurrency(args);
  console.log(convertedAmount);
}

main();
