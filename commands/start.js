//здесь и будет код команды
const {VK, Keyboard, KeyboardBuilder} = require('vk-io')
const { Command } = require('commander-core');
const {User} = require('../Model/Model');

// клавиатура с началом вопросов
const key_question = () => {
  // создаем инлайн кноку
  const key = Keyboard.keyboard([
      [
          Keyboard.textButton({
              label: `Пройти тест`,
              payload: {
                command: `пройти тест`,
              }
          })
      ],
  ]).inline();
  
  return key; 
};
//по желанию вы можете объявить тут массив из команд
module.exports = new Command({
  pattern: /^(?:привет|hi|start)$/i,
  name: 'начальная команда',
  description: 'Привествие',
  async handler(context, bot) {
    try {
    const user = await User.findOne({
      where: {
          id_vk: context.senderId
      }
    });
    const {vk} = context;

    if(!user) {
        let [user_vk] = await vk.api.users.get({user_ids: [context.senderId]});
        // console.log(user_vk);
        let user_new = await User.create({id_vk: context.senderId, lastName: user_vk.last_name, firstName: user_vk.first_name});
        // console.log(user_new);
        // context.send(`${user_new.firstName}, ты успешно зарегистрирован!`)
        return context.send(`Привет вездекодерам!`, {keyboard: key_question()});
    };

    return context.send(`Привет вездекодерам!`, {keyboard: key_question()});
  } catch(err) {
    console.error(err);
    return context.send('Error!)');
  }
  },
}); 