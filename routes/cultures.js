const express = require("express");
const router = express.Router();

const cultures = require("../data/cultures");

router.get("/", (req, res) => {
  res.render("cultures/index", {
    title: "Cultures | Kalix Codex",
    cultures
  });
});

router.get("/:slug", (req, res) => {
  const culture = cultures.find((c) => c.slug === req.params.slug);

  if (!culture) {
    return res.status(404).render("pages/404", {
      title: "Culture Not Found | Kalix Codex"
    });
  }

  res.render("cultures/detail", {
    title: `${culture.name} | Kalix Codex`,
    culture
  });
});

module.exports = router;