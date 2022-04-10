const {VK, Keyboard, KeyboardBuilder} = require('vk-io')
const { API, Upload } = require('vk-io');
const path = require('path')
const api = new API({
	token: process.env.TOKEN
});

const upload = new Upload({
	api
});

var fs = require('fs');
const { Command } = require('commander-core');
const {User, Memes, MemeScores} = require('../Model/Model');

module.exports = new Command({
    pattern: /^(?:мем|mem|отправь мем)$/i,
    name: 'мемы',
    description: 'Отправка мема',
    async handler(context, bot) {
      try {
        const user = await User.findOne({
            where: {
                id_vk: context.senderId
            }
        })
        // console.log(user);
        // запрашиваем мем
        let likeBol = await bot.createMemDir(user.id);

        context.sendPhotos({
			value: likeBol.url
		}, { message: `#${likeBol.id} Лови мем! 😃\nОцени лайком или дизлайком!`, keyboard: keyMem(likeBol.id)})
        // console.log(likeBol)

    } catch(err) {
      console.error(err);
      return context.send('Error!)');
    } 
    },
});  

const keyMem = (memId) => {
    const key = Keyboard.keyboard([
        [
            Keyboard.textButton({
                label: `👍`,
                payload: {
                    command: `мем лайк ${memId}`,
                },
            }),
            Keyboard.textButton({
                label: `👎`,
                payload: {
                    command: `мем диз ${memId}`,
                },
            })
        ]
    ]).inline()
    return key;
}