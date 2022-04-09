const sequelize = require('../bd');
const {DataTypes} = require('sequelize');

// информация о пользователе
const User = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    id_vk: {type: DataTypes.BIGINT, primaryKey: true, unique: true},
    lastName: {type: DataTypes.STRING(100) },  
    firstName: {type: DataTypes.STRING(100)},
    admin: {type: DataTypes.BOOLEAN, defaultValue: false}, // админ или нет
    is_allowed: {type: DataTypes.BOOLEAN, defaultValue: false} // может ли писать пользователю или нет в вк
});

// загруженные мемы пользователей
const Memes = sequelize.define('memes', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(100), allowNull: true },
    url: {type: DataTypes.STRING(500), allowNull: false },  
});

// оценки мемов пользователями
const MemeScores = sequelize.define('memes_scores', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(100), allowNull: true },
    url: {type: DataTypes.STRING(500), allowNull: false },  
});
// связи
// каждая картинка принадлежит пользователю
User.hasMany(Memes, {as: 'mems'});
Memes.belongsTo(User);

module.exports = {
    User, 
    Memes
}