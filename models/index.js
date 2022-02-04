const User = require('./User');
const Scores = require('./Scores');

User.hasMany(Scores, {
  foreignKey: 'userid',
});

Scores.belongsTo(User, {
  foreignKey: 'userid',
})

module.exports = { User, Scores };