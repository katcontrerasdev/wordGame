const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Scores extends Model {}

Scores.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    scores: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    },
  {
    sequelize,
    freezeTableName: true,
    timestamps: false,
    underscored: true,
    modelName: 'scores',
  }
);

module.exports = Scores;
