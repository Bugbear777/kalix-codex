const express = require('express');
const bcrypt = require('bcrypt');
const { getDatabase } = require("../data/database");

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  });
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('All fields are required.');
    }

    const db = getDatabase();
    const existingUser = await db.collection('users').findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).send('An account with that email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
      createdAt: new Date()
    };

    await db.collection('users').insertOne(newUser);

    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating account.');
  }
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = getDatabase();
    const user = await db.collection('users').findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(400).send('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(400).send('Invalid email or password.');
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in.');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;