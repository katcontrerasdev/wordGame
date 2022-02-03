const { Scores } = require('../models');

const scoresdata = [
  {
    userid: 1,
    scores: 30
  }
];

const seedScores = () => Scores.bulkCreate(scoresdata);

module.exports = seedScores;