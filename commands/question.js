//здесь и будет код команды
const {VK, Keyboard, KeyboardBuilder} = require('vk-io')
const { Command } = require('commander-core');

//по желанию вы можете объявить тут массив из команд
module.exports = new Command({
  pattern: /^(?:пройти тест|тест начать)$/i,
  name: 'тестирование людей',
  description: 'Мини-тест',
  async handler(context, bot) {
    try {
        return context.scene.enter('questions');
    } catch(err) {
        console.error(err);
        return context.send("error")
    }
  },
}); 
