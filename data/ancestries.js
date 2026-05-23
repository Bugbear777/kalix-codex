const { getDatabase } = require("./database");

async function getAllAncestries() {
  const db = getDatabase();

  return await db
    .collection("ancestries")
    .find({})
    .sort({ name: 1 })
    .toArray();
}

async function getAncestryBySlug(slug) {
  const db = getDatabase();

  return await db.collection("ancestries").findOne({ slug });
}

async function getAncestryTraits(ancestrySlug) {
  const db = getDatabase();

  return await db
    .collection("ancestryTraits")
    .find({ ancestrySlug })
    .sort({ displayOrder: 1 })
    .toArray();
}

async function getAncestryGifts(ancestrySlug) {
  const db = getDatabase();

  return await db
    .collection("ancestryGifts")
    .find({ ancestrySlug })
    .sort({ displayOrder: 1 })
    .toArray();
}

module.exports = {
  getAllAncestries,
  getAncestryBySlug,
  getAncestryTraits,
  getAncestryGifts
};