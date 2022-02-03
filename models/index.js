const User = require('./User');
const Gallery = require('./Gallery');
const Painting = require('./Painting');
const Scores = require('./Scores');

Gallery.hasMany(Painting, {
  foreignKey: 'gallery_id',
});

Painting.belongsTo(Gallery, {
  foreignKey: 'gallery_id',
});

User.hasMany(Scores, {
  foreignKey: 'userid',
});

Scores.belongsTo(User, {
  foreignKey: 'userid',
})

module.exports = { User, Gallery, Painting, Scores };
