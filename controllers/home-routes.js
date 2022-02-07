const router = require('express').Router();
const {
  Scores,
  User
} = require('../models');

const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    res.render('homepage', {
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/game', (req, res) => {
  try {
  res.render('game');
  }catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/register', (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

router.get('/highscore', async (req, res) => {
  if (req.session.loggedIn) {
    const scoresData = await Scores.findAll({
      limit: 10,
      order: [
        ["scores", "DESC"],
      ],
    })
    const userscoresJson = JSON.stringify(scoresData, null, 2);
    const parsedScore = JSON.parse(userscoresJson);
    const user_id = [];
    const userScores = [];
    for (var i = 0; i < parsedScore.length; i++) {
      user_id.push(parsedScore[i].userid);
    }
    for (var i = 0; i < parsedScore.length; i++) {
      userScores.push(parsedScore[i].scores);
    }
    const userName = [];
    for (var i = 0; i < user_id.length; i++) {
      const playerName = await User.findOne({
        where: {
          id: user_id[i]
        }
      })
      userName.push(playerName.username.toUpperCase());
    }
    res.render('highscore', {
      user_id,
      userName,
      userScores,
      loggedIn: req.session.loggedIn,
    })
  } else {
    res.render('login');
  }
});

router.post('/score', async (req, res) => {
  try {
    const dbScoreData = await Scores.create({
      userid: req.body.userid,
      scores: req.body.scores,
    });
    res.status(201).json(dbScoreData)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;