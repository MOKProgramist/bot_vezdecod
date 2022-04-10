//здесь и будет код команды
const {VK, Keyboard, KeyboardBuilder} = require('vk-io')
const { Command } = require('commander-core');
const {User, MemeScores} = require('../Model/Model');

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

    const scores = await MemeScores.findAll({
        userId: user.id
    });

    if(!scores) return context.send('У тебя пока нет оценных мемов. Нажимай на кнопку "Мем" и оцени его!');

    // массив оценок
    let countLike = 0; let countDis = 0;
    scores.forEach(el => {
        // если лайк
        if(el.like) countLike++;
        // если диз
        if(!el.like) countDis++;
    })

    return context.send(`Статитсика пользователя: Всего ты оценил ${countLike + countDis} ${bot.declOfNum(countLike + countDis, ["мем", "мема", "мемов"])}\n\n👍${countLike}\n👎${countDis}\n\n`);
  } catch(err) {
    console.error(err);
    return context.send('Error!)');
  }
  },
}); 