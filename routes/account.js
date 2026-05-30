const express = require("express");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../data/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/account", requireAuth, async (req, res) => {
  try {
    const db = getDatabase();

    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.session.user.id)
    });

    if (!user) {
      req.session.destroy(() => {
        res.redirect("/login");
      });
      return;
    }

    res.render("account", {
      title: "My Account",
      user,
      error: null,
      success: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading account.");
  }
});

router.post("/account", requireAuth, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    const db = getDatabase();

    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.session.user.id)
    });

    if (!user) {
      return res.redirect("/login");
    }

    if (!username || !email) {
      return res.render("account", {
        title: "My Account",
        user,
        error: "Username and email are required.",
        success: null
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmailUser = await db.collection("users").findOne({
      email: normalizedEmail,
      _id: { $ne: user._id }
    });

    if (existingEmailUser) {
      return res.render("account", {
        title: "My Account",
        user,
        error: "That email is already being used by another account.",
        success: null
      });
    }

    const updateFields = {
      username: username.trim(),
      email: normalizedEmail,
      updatedAt: new Date()
    };

    if (newPassword && newPassword.trim() !== "") {
      if (!currentPassword) {
        return res.render("account", {
          title: "My Account",
          user,
          error: "Current password is required to change your password.",
          success: null
        });
      }

      const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);

      if (!passwordMatches) {
        return res.render("account", {
          title: "My Account",
          user,
          error: "Current password is incorrect.",
          success: null
        });
      }

      updateFields.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: updateFields }
    );

    req.session.user = {
      ...req.session.user,
      username: updateFields.username,
      email: updateFields.email
    };

    const updatedUser = await db.collection("users").findOne({
      _id: user._id
    });

    res.render("account", {
      title: "My Account",
      user: updatedUser,
      error: null,
      success: "Account updated successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating account.");
  }
});

router.post("/account/delete", requireAuth, async (req, res) => {
  try {
    const { confirmDelete } = req.body;

    const db = getDatabase();

    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.session.user.id)
    });

    if (!user) {
      return res.redirect("/login");
    }

    if (confirmDelete !== user.email) {
      return res.render("account", {
        title: "My Account",
        user,
        error: "To delete your account, type your email exactly.",
        success: null
      });
    }

    await db.collection("users").deleteOne({
      _id: user._id
    });

    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting account.");
  }
});

module.exports = router;