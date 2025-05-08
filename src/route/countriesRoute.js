const express = require("express");
const router = express.Router();
const axios = require("axios");
const apiKeyAuth = require("../middleware/apiKeyAuth");

router.get("/", apiKeyAuth, async (req, res) => {
    try {
        const response = await axios.get("https://restcountries.com/v3.1/all");

        const filteredCountries = response.data.map((country) => ({
            name: country.name?.common || "N/A",
            capital: country.capital?.[0] || "N/A",
            currencies: country.currencies
                ? Object.entries(country.currencies).map(([code, details]) => ({
                    code,
                    name: details.name,
                    symbol: details.symbol,
                }))
                : [],
            languages: country.languages
                ? Object.values(country.languages)
                : [],
            flag: country.flags?.png || country.flags?.svg || "N/A",
        }));

        res.json({ countries: filteredCountries });
    } catch (error) {
        console.error("Failed to fetch countries:", error.message);
        res.status(500).json({ error: "Failed to fetch country data" });
    }
});

module.exports = router;
