const sequelize = require('../config/connection');
const seedScores = require('./scoresData');

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedScores();

  process.exit(0);
};

seedAll();
