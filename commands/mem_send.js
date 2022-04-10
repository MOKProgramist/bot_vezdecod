const {VK, Keyboard, KeyboardBuilder} = require('vk-io')
const { Command } = require('commander-core');
const {User, Memes, MemeScores} = require('../Model/Model');

module.exports = new Command({
    pattern: /^(?:мем|mem|отправь мем)$/i,
    name: 'мемы',
    description: 'Отправка мема',
    async handler(context, bot) {
      try {
        // вызываем метод получения картинки
        
    } catch(err) {
      console.error(err);
      return context.send('Error!)');
    }
    },
}); 