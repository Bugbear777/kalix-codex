const express = require("express");
const router = express.Router();

const heritages = require("../data/heritages");

router.get("/", (req, res) => {
  res.render("heritages/index", {
    title: "Heritages | Kalix Codex",
    heritages
  });
});

router.get("/:slug", (req, res) => {
  const heritage = heritages.find((h) => h.slug === req.params.slug);

  if (!heritage) {
    return res.status(404).render("pages/404", {
      title: "Heritage Not Found | Kalix Codex"
    });
  }

  res.render("heritages/detail", {
    title: `${heritage.name} | Kalix Codex`,
    heritage
  });
});

module.exports = router;