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

// загруженные мемы
const Memes = sequelize.define('memes', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(100), allowNull: true },
    link: {type: DataTypes.STRING(100), allowNull: true },
    url: {type: DataTypes.STRING(500), allowNull: false },  
    
    like_count: {type: DataTypes.INTEGER, defaultValue: 0},
    dislike_count: {type: DataTypes.INTEGER, defaultValue: 0},
});

// оценки мемов пользователями
const MemeScores = sequelize.define('memes_scores', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    like: {type: DataTypes.BOOLEAN, allowNull: false},
});
// связи
// каждая картинка принадлежит пользователю
User.hasMany(Memes, {as: 'mem_user'});
Memes.belongsTo(User);
// каждая запись о оценки приналдежит мему и пользователю
Memes.hasMany(MemeScores, {as: 'list_scores'});
MemeScores.belongsTo(Memes);

User.hasMany(MemeScores, {as: 'list_like'});
MemeScores.belongsTo(User);

module.exports = {
    User, 
    Memes,
    MemeScores
}