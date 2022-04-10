//здесь и будет код команды
const {VK, Keyboard, KeyboardBuilder} = require('vk-io')
const { Command } = require('commander-core');
const {User} = require('../Model/Model');

const text_hi = `Привет вездекодерам!\n\nЯ умею присылать мемы и принимать к ним оценки, оценки идут в статистику, которую можешь посмотреть! Ты можешь загрузить и свой мем.\nТакже присутсвует мини-тест твоих общих знаний.`
// клавиатура с началом вопросов
const key_question = () => {
  // создаем инлайн кноку
  const key = Keyboard.keyboard([
    [
      Keyboard.textButton({
          label: `Мем`,
          payload: {
            command: `мем`,
          },
          color: Keyboard.POSITIVE_COLOR
      }),
      Keyboard.textButton({
        label: `Статистика`,
        payload: {
          command: `статистика`,
        }
      })
    ],
    [
      Keyboard.textButton({
        label: `Загрузить свой мем`,
        payload: {
          command: `загрузить мем`,
        },
        color: Keyboard.SECONDARY_COLOR
      })
    ],
    [
        Keyboard.textButton({
            label: `Пройти тест`,
            payload: {
              command: `пройти тест`,
            }
        })
    ],
  ]);
  
  return key; 
};
//по желанию вы можете объявить тут массив из команд
module.exports = new Command({
  pattern: /^(?:привет|hi|start)$/i,
  name: 'начальная команда',
  description: 'Привествие',
  async handler(context, bot) {
    try {
    return context.send(text_hi, {keyboard: key_question()});
  } catch(err) {
    console.error(err);
    return context.send('Error!)');
  }
  },
}); 