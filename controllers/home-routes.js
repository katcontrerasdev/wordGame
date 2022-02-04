const router = require('express').Router();
const {
  Gallery,
  Painting,
  Scores,
  User
} = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');


// GET all galleries for homepage
router.get('/', async (req, res) => {
  try {
    const dbGalleryData = await Gallery.findAll({
      include: [{
        model: Painting,
        attributes: ['filename', 'description'],
      }, ],
    });

    const galleries = dbGalleryData.map((gallery) =>
      gallery.get({
        plain: true
      })
    );

    res.render('homepage', {
      galleries,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one gallery
// Use the custom middleware before allowing the user to access the gallery
router.get('/gallery/:id', withAuth, async (req, res) => {
  try {
    const dbGalleryData = await Gallery.findByPk(req.params.id, {
      include: [{
        model: Painting,
        attributes: [
          'id',
          'title',
          'artist',
          'exhibition_date',
          'filename',
          'description',
        ],
      }, ],
    });

    const gallery = dbGalleryData.get({
      plain: true
    });
    res.render('gallery', {
      gallery,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one painting
// Use the custom middleware before allowing the user to access the painting
router.get('/painting/:id', withAuth, async (req, res) => {
  try {
    const dbPaintingData = await Painting.findByPk(req.params.id);

    const painting = dbPaintingData.get({
      plain: true
    });

    res.render('painting', {
      painting,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/game', (req, res) => {
  
  res.render('game');
  
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
      const scoresData = await Scores.findAll(
        {
          limit: 10,
          order: [
            ["scores", "DESC"],
          ],
        }
        )
        const userscoresJson = JSON.stringify(scoresData, null, 2);
        const parsedScore = JSON.parse(userscoresJson);
        const user_id = [];
        const userScores = [];
        for (var i=0; i<parsedScore.length; i++){
          user_id.push(parsedScore[i].userid);
        }
        for (var i=0; i<parsedScore.length; i++){
          userScores.push(parsedScore[i].scores);
        }
        const userName = [];
        for (var i=0; i< user_id.length; i++){
        const playerName = await User.findOne(
          {
            where: {id: user_id[i]}
          }
          )
        userName.push(playerName.username.toUpperCase());
        }
        res.render('highscore', {
          user_id,
          userName,
          userScores,
              loggedIn: req.session.loggedIn,
            })
          }
          else {
            res.render('login');
          }
        });
      
        

    module.exports = router;
