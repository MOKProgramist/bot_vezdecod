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

module.exports = [new Command({
    pattern: /^(?:мем лайк|mem like)\s?([0-9]+)$/i,
    name: 'оценки',
    description: 'Оценки мемов',
    async handler(context, bot) {
      try {
        const user = await User.findOne({
            where: {
                id_vk: context.senderId
            }
        })
        // проверка наличия мема. Вдруг ))
        const meme = await Memes.findOne({
            where: {
                id: context.body[1]
            }
        });
        if(!meme) return context.send('Такого мема не найдено, оценку установить не получиться.');
        // console.log(meme)
        // проверка оценки. Вдруг ))
        const memeScores = await MemeScores.findOne({
            where: {
                userId: user.id,
                memeId: meme.id
            }
        });
        // если уже ставил
        if(memeScores) {
            // если человек изменяет на протиположную оценку
            let boll = memeScores.like == true;
            if(boll) return context.send('Больше одного лайка на мем поставить нельзя :_)');
            // изменяем диз на лайк
            await memeScores.update({like: true});
            return context.send('Ты изменил свою оценку на лайк!');
        }

        const like = await MemeScores.create({like: true, userId: user.id, memeId: meme.id});
        //console.log(like)
        return context.send(`Ты поставил лайк на мем #${context.body[1]}`)

    } catch(err) {
      console.error(err);
      return context.send('Error!)');
    } 
    },
}),
new Command({
    pattern: /^(?:мем дизлайк|mem dis|мем диз)\s?([0-9]+)$/i,
    name: 'оценки',
    description: 'Оценки мемов',
    async handler(context, bot) {
      try {
        const user = await User.findOne({
            where: {
                id_vk: context.senderId
            }
        })
        // проверка наличия мема. Вдруг ))
        const meme = await Memes.findOne({
            where: {
                id: context.body[1]
            }
        });
        if(!meme) return context.send('Такого мема не найдено, оценку установить не получиться.');
        // console.log(meme)
        // проверка оценки. Вдруг ))
        const memeScores = await MemeScores.findOne({
            where: {
                userId: user.id,
                memeId: meme.id
            }
        });
        // если уже ставил
        if(memeScores) {
            // если человек изменяет на протиположную оценку
            let boll = memeScores.like == false;
            if(boll) return context.send('Больше одного дизлайка на мем поставить нельзя :_)');
            // изменяем диз на лайк
            await memeScores.update({like: false});
            return context.send('Ты изменил свою оценку на дизлайк!');
        }

        const like = await MemeScores.create({like: false, userId: user.id, memeId: meme.id});
        // console.log(like)
        return context.send(`Ты поставил дизлайк на мем #${context.body[1]}`)

    } catch(err) {
      console.error(err);
      return context.send('Error!)');
    } 
    },
}),
]  
