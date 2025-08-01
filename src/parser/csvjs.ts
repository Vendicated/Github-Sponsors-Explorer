/**
 * Heavily modified & modernised version of https://github.com/rufuspollock/csv.js
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2011-2013 Open Knowledge Foundation
 * Copyright (c) 2025 Vendicated
 */

const DELIMITER = ",";
const LINE_TERMINATOR = "\n";
const QUOTE_CHAR = '"';

const IntRegex = /^\d+$/;
const FloatRegex = /^\d*\.\d+$|^\d+\.\d*$/;

export type ParsedCSVValue = string | number | boolean | null;
export type ParsedCSVRow = ParsedCSVValue[];
export type ParsedCSVRows = ParsedCSVRow[];

export function parseHeadersAndRows(s: string) {
    const rows = parseRows(s);

    if (rows.length === 0) return { headers: [], rows: [] };

    return {
        headers: rows[0],
        rows: rows.slice(1)
    }
};


// Heavily based on uselesscode's JS CSV parser (MIT Licensed):
// http://www.uselesscode.org/javascript/csv/
export function parseRows(s: string) {
    s = normalizeLineTerminator(s);
    s = chomp(s);

    let isInQuote = false,
        isCurrentFieldQuoted = false,
        currentField: ParsedCSVValue = "", // Buffer for building up the current field
        currentRow: ParsedCSVRow = [],
        rows: ParsedCSVRows = [];

    function processField(field: string) {
        if (isCurrentFieldQuoted) return field;
        if (!field) return null;

        field = field.trim();

        if (IntRegex.test(field)) {
            return parseInt(field, 10);
        }
        if (FloatRegex.test(field)) {
            return parseFloat(field);
        }

        return field;
    };

    for (let i = 0; i < s.length; i += 1) {
        const ch = s.charAt(i);

        // If we are at a EOF or EOR
        if (!isInQuote && (ch === DELIMITER || ch === LINE_TERMINATOR)) {
            currentField = processField(currentField);
            currentRow.push(currentField);

            if (ch === LINE_TERMINATOR) {
                rows.push(currentRow);
                currentRow = [];
            }

            currentField = "";
            isCurrentFieldQuoted = false;
        } else {
            if (ch !== QUOTE_CHAR) {
                currentField += ch;
            } else {
                if (!isInQuote) {
                    // We are not in a quote, start a quote
                    isInQuote = true;
                    isCurrentFieldQuoted = true;
                } else {
                    // Next char is quotechar, this is an escaped quotechar
                    if (s.charAt(i + 1) === QUOTE_CHAR) {
                        currentField += QUOTE_CHAR;
                        // Skip the next char
                        i += 1;
                    } else {
                        // It's not escaping, so end quote
                        isInQuote = false;
                    }
                }
            }
        }
    }

    // Add the last field
    currentField = processField(currentField);
    currentRow.push(currentField);
    rows.push(currentRow);

    return rows;
};

function normalizeLineTerminator(csvString: string) {
    return csvString.replace(/(\r\n|\n|\r)/gm, "\n");
};

function chomp(s: string) {
    if (s.endsWith(LINE_TERMINATOR)) {
        s = s.slice(0, -LINE_TERMINATOR.length);
    }

    return s;
}
