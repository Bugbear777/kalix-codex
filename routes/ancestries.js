const express = require("express");
const router = express.Router();

const {
  getAllAncestries,
  getAncestryBySlug,
  getAncestryTraits,
  getAncestryGifts
} = require("../data/ancestries");

// GET /ancestries
router.get("/", async (req, res) => {
  try {
    const ancestries = await getAllAncestries();

    res.render("ancestries/index", {
      title: "Ancestries",
      ancestries
    });
  } catch (error) {
    console.error("Error loading ancestries:", error);
    res.status(500).send("Error loading ancestries.");
  }
});

// GET /ancestries/:slug
router.get("/:slug", async (req, res) => {
  try {
    const ancestry = await getAncestryBySlug(req.params.slug);

    if (!ancestry) {
      return res.status(404).send("Ancestry not found.");
    }

    const traits = await getAncestryTraits(ancestry.slug);
    const gifts = await getAncestryGifts(ancestry.slug);

    res.render("ancestries/detail", {
      title: ancestry.name,
      ancestry,
      traits,
      gifts
    });
  } catch (error) {
    console.error("Error loading ancestry:", error);
    res.status(500).send("Error loading ancestry.");
  }
});

module.exports = router;