DISTRIBUTIVE_NUMERALS: frozenset[str] = frozenset({
    "each", "every", "either", "neither",
})

ORDINAL_WORD_TO_INT: dict[str, int] = {
    "first": 1, "second": 2, "third": 3, "fourth": 4, "fifth": 5,
    "sixth": 6, "seventh": 7, "eighth": 8, "ninth": 9, "tenth": 10,
    "eleventh": 11, "twelfth": 12, "thirteenth": 13, "fourteenth": 14,
    "fifteenth": 15, "sixteenth": 16, "seventeenth": 17, "eighteenth": 18,
    "nineteenth": 19, "twentieth": 20, "thirtieth": 30, "fortieth": 40,
    "fiftieth": 50, "sixtieth": 60, "seventieth": 70, "eightieth": 80,
    "ninetieth": 90, "hundredth": 100, "thousandth": 1_000,
    "millionth": 1_000_000, "billionth": 1_000_000_000,
}

MULTIPLICATIVE_SEED: dict[int, str] = {
    1: "once",
    2: "twice",
    3: "thrice",
}

FRACTIONAL_SEED: dict[int, str] = {
    2: "half",
    3: "third",
    4: "quarter",
}