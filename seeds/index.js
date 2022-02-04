const sequelize = require('../config/connection');
const seedGallery = require('./galleryData');
const seedPaintings = require('./paintingData');
const seedScores = require('./scoresData');

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedGallery();

  await seedPaintings();

  await seedScores();

  process.exit(0);
};

seedAll();
