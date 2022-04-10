//здесь и будет код команды
const {VK, Keyboard, KeyboardBuilder} = require('vk-io')
const { Command } = require('commander-core');
const {User, MemeScores, Memes} = require('../Model/Model');

//по желанию вы можете объявить тут массив из команд
module.exports = new Command({
  pattern: /^(?:статистика|stats)$/i,
  name: 'статистика мемов',
  description: 'Статистика',
  async handler(context, bot) {
    try {
    const user = await User.findOne({
      where: {
          id_vk: context.senderId
      }
    });

    const scoresUser = await MemeScores.findAll({
        where: {
            userId: user.id
        }
    });
    // console.log(scoresUser)
    const scoresUsers = await MemeScores.findAll();

    // if(!scores) return context.send('У тебя пока нет оценных мемов. Нажимай на кнопку "Мем" и оцени его!');

    // общая стата
    var countLike = 0; let countDis = 0;
    if(scoresUsers) {
        scoresUsers.forEach(el => {
            // если лайк
            if(el.like) countLike++;
            // если диз
            if(!el.like) countDis++;
        })
    }
    // массив оценок пользователя
    var countLikeUser = 0; let countDisUser = 0;
    if(scoresUser != null) {
        scoresUser.forEach(el => {
            // если лайк
            // console.log(el.id)
            if(el.like) countLikeUser++;
            // если диз
            if(!el.like) countDisUser++;
        })
    }
    let text = (countLikeUser > 0 || countDisUser > 0 ? 
        `Всего ты оценил ${countLikeUser + countDisUser} ${bot.declOfNum(countLikeUser + countDisUser, ["мем", "мема", "мемов"])}\n${countLikeUser} 👍\n${countDisUser} 👎\n\n` : `Ты пока не ставил оценки`)
    context.send(`Пользователи поставили:\n${countLike} 👍\n${countDis} 👎\n\n${text}`);

    // самые залайканые мемы
    const memTop9 = await Memes.findAll({
        limit: 9,
        order: [
            ['like_count', 'DESC'],
        ],
    });
    // перебираем массив и записываем урл фоток
    const arrayPhoto = new Array();
    memTop9.forEach(el => {
        arrayPhoto.push(`photo${el.link}`);
    });

    // отправка фоток
    context.send({
        message: 'Топ 9 мемов по версии пользователей: ',
        attachment: arrayPhoto.join(',')
    });
    // console.log(arrayPhoto.join(','))
  } catch(err) {
    console.error(err);
    return context.send('Error!)');
  }
  },
}); 