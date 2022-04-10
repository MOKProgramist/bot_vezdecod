require('dotenv').config();
// Вопросы
const { SessionManager }  = require('@vk-io/session');
const { SceneManager, StepScene } = require('@vk-io/scenes');
const sessionManager = new SessionManager();
const sceneManager = new SceneManager();
const QuestionManager = require('vk-io-question');

const { Handler } = require('commander-core')
const { VK, getRandomId } = require('vk-io')
const path = require('path')

const {User, MemeScores, Memes} = require('./Model/Model');
const QuestionKey = require('./keyboard_bot');
const Utils = require('./utils.js') //наши утилиты
const sequelize = require('./bd'); // база данных
const TOKEN = process.env.TOKEN //токен от группы
const vk = new VK({token: TOKEN})

const handler = new Handler({
	commands: {
		directory: path.resolve(__dirname, 'commands')
	},
	strictLoader: true, //строгость загрузки (проверяет есть ли команды иначе кидает ошибку)
	utils: new Utils() //загружаем наши утилиты в класс обработчика
});

handler.events.on('command_error', async({context, utils, error}) =>{
	context.send(`Произошла непредвиденная ошибка`)
	if(utils.adminIds) {
		vk.api.messages.send({
			user_ids: utils.adminIds,
			random_id: getRandomId(),
			message: `Ошибка в команде ${utils.getCommand.name}:
				${context.senderId} => ${context.$command}
				${error.stack}`
		})
	}
}); //событие срабатывания ошибок в команде

handler.events.on('command_not_found', async({context}) =>{
	if(!context.isChat) {
		context.send(`Вот список команд: `, { keyboard: QuestionKey.start()})
	}
}); //событие при отсутствие подходящей команды

vk.updates.on('message_new', sessionManager.middleware);


vk.updates.on('message_new', [sceneManager.middleware, async(context, next) => {
    if(context.isOutbox) {
        return;
    }
    return next();
}]);

vk.updates.on('message_new', sceneManager.middlewareIntercept); // Default scene entry handler

vk.updates.on('message_new', async(context, next) => {
    if(context.senderId < 0) return next();
    // if(!handler.utils.adminIds.includes(context.senderId)) return next();
    const user = await User.findOne({
        where: {
            id_vk: context.senderId
        }
      });
  
      // регистрация
      if(!user) {
          let [user_vk] = await vk.api.users.get({user_ids: [context.senderId]});
          // console.log(user_vk);
          let user_new = await User.create({id_vk: context.senderId, lastName: user_vk.last_name, firstName: user_vk.first_name});
          // console.log(user_new);
      };

	context.text = context.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim();
    // чтение контеста с кнопок
    if(context.messagePayload) {
        if(context.messagePayload.command) context.text = context.messagePayload.command;
        // чтобы закончить сессию
        if(context.messagePayload.command_que) {
            if(context.messagePayload.command_que == 'exit que') {
                context.text = 'привет'
            }
        }
    };

    context.vk = vk;
	await handler.execute(context);
});

const startProject = async() => {
    try {
        await vk.updates.start();

        // база
        sequelize.sync().then(result=>{
            // console.log(result);
            sequelize.sync({alter: true} ); // Синхронизация 
            
          })
          .catch(err=> console.log(err));

        handler.loadCommands()
        .then(() => console.log('commands loaded')) // загружает команды
        .catch(err => console.error(err)) // обязательно обрабатывайте ошибку

    } catch (err) {
        console.error(`Во время запуска произошла ошибка: ${err.message}`);
    }
};

startProject(); 


// чисто тест вопросов
// сцена вопросов
sceneManager.addScenes([
    new StepScene('upload_mem', [
        (context) => {
            if (context.scene.step.firstTime || !context.hasAttachments('photo')) {
				return context.send('Отправь свой мем мне');
			}
            // console.log(context);
			return context.scene.step.next();
		},
        async (context) => {
            const user = await User.findOne({
                where: {
                    id_vk: context.senderId
                }
            })
            if (context.hasAttachments('photo')) {
                // console.log(context)
                try {
                // загружаем только первое вложение
                const mem = await Memes.create({
                    name: context.attachments[0].id, url: context.attachments[0].largeSizeUrl, userId: user.id, link: `${context.attachments[0].id}_${context.attachments[0].ownerId}`
                });
                return context.send('Загрузил твой мем в свою коллекцию!');
                } catch(err) {
                    return context.send('Данная фотография уже есть у меня. Попробуй загрузить другую.')
                }

			}
			return context.scene.step.next(); // Automatic exit, since this is the last scene
		}
    ]),
	new StepScene('questions', [
        // 1
		(context) => {
			if (context.scene.step.firstTime || !context.text) {
				return context.send('Сейчас я задам тебе 8 вопросов, для ответа используй кнопки!\n\n1. Какой сейчас год?', { keyboard: QuestionKey.one()});
			}
            context.scene.state.count = 0;
			context.scene.state.que = context.text;
			return context.scene.step.next();
		},
        // 2
		(context) => {
            if(context.messagePayload.command_que == `exit que`) {
                context.send(`Жаль, что не прошел тест до конца, у тебя было ${context.scene.state.count} правильных ответов!`, { keyboard: QuestionKey.start()});
                return context.scene.leave();
            }
			if (context.scene.step.firstTime || !context.text) {
                const res = context.scene.state.que == QuestionKey.one_answer ? "Правильно!\n" : "Неправильно!\n"
                if(context.scene.state.que == QuestionKey.one_answer) context.scene.state.count++;

				return context.send(`${res}\n 2. Какого цвета небо?`, { keyboard: QuestionKey.two()});
			}

			context.scene.state.que = context.text;

			return context.scene.step.next();
		},
        // 3
        (context) => {
            if(context.messagePayload.command_que == `exit que`) {
                context.send(`Жаль, что не прошел тест до конца, у тебя было ${context.scene.state.count} правильных ответов!`, { keyboard: QuestionKey.start()});
                return context.scene.leave();
            }
			if (context.scene.step.firstTime || !context.text) {
                const res = context.scene.state.que == QuestionKey.two_answer ? "Правильно!\n" : "Неправильно!\n"
                if(context.scene.state.que == QuestionKey.two_answer) context.scene.state.count++;
				return context.send(`${res}\n 3. Кто съел Колобка?`, { keyboard: QuestionKey.three()});
			}

			context.scene.state.que = context.text;

			return context.scene.step.next();
		}, 
        // 4
        (context) => {
            if(context.messagePayload.command_que == `exit que`) {
                context.send(`Жаль, что не прошел тест до конца, у тебя было ${context.scene.state.count} правильных ответов!`, { keyboard: QuestionKey.start()});
                return context.scene.leave();
            }
			if (context.scene.step.firstTime || !context.text) {
                const res = context.scene.state.que == QuestionKey.three_answer ? "Правильно!\n" : "Неправильно!\n";
                if(context.scene.state.que == QuestionKey.three_answer) context.scene.state.count++;
				return context.send(`${res}\n 4. Квадратный корень из 144?`, { keyboard: QuestionKey.four()});
			}

			context.scene.state.que = context.text;

			return context.scene.step.next();
		}, 
        // 5
        (context) => {
            if(context.messagePayload.command_que == `exit que`) {
                context.send(`Жаль, что не прошел тест до конца, у тебя было ${context.scene.state.count} правильных ответов!`, { keyboard: QuestionKey.start()});
                return context.scene.leave();
            }
			if (context.scene.step.firstTime || !context.text) {
                const res = context.scene.state.que == QuestionKey.four_answer ? "Правильно!\n" : "Неправильно!\n"
                if(context.scene.state.que == QuestionKey.four_answer) context.scene.state.count++;
				return context.send(`${res}\n 5. Какого мальчика воспитывали животные?`, { keyboard: QuestionKey.five()});
			}

			context.scene.state.que = context.text;

			return context.scene.step.next();
		}, 
        // 6
        (context) => {
            if(context.messagePayload.command_que == `exit que`) {
                context.send(`Жаль, что не прошел тест до конца, у тебя было ${context.scene.state.count} правильных ответов!`, { keyboard: QuestionKey.start()});
                return context.scene.leave();
            }
			if (context.scene.step.firstTime || !context.text) {
                const res = context.scene.state.que == QuestionKey.five_answer ? "Правильно!\n" : "Неправильно!\n"
                if(context.scene.state.que == QuestionKey.five_answer) context.scene.state.count++;
				return context.send(`${res}\n 6. Для тебя будет это легко, чему равно: (2 + 2 * 2) ?`, { keyboard: QuestionKey.six()});
			}

			context.scene.state.que = context.text;

			return context.scene.step.next();
		}, 
        // 7
        (context) => {
            if(context.messagePayload.command_que == `exit que`) {
                context.send(`Жаль, что не прошел тест до конца, у тебя было ${context.scene.state.count} правильных ответов!`, { keyboard: QuestionKey.start()});
                return context.scene.leave();
            }
			if (context.scene.step.firstTime || !context.text) {
                const res = context.scene.state.que == QuestionKey.six_answer ? "Правильно, а ты крутой математик!\n" : "Неправильно, ну ничего!\n"
                if(context.scene.state.que == QuestionKey.six_answer) context.scene.state.count++;
				return context.send(`${res}\n 7. Какое время года сейчас?)`, { keyboard: QuestionKey.seven()});
			}

			context.scene.state.que = context.text;

			return context.scene.step.next();
		}, 
        // 8
        (context) => {
            if(context.messagePayload.command_que == `exit que`) {
                context.send(`Жаль, что не прошел тест до конца, у тебя было ${context.scene.state.count} правильных ответов!`, { keyboard: QuestionKey.start()});
                return context.scene.leave();
            }
			if (context.scene.step.firstTime || !context.text) {
                const res = context.scene.state.que == QuestionKey.seven_answer ? "Правильно!\n" : "Неправильно, хотя возможно у кого-то и другое! :)\n"
                if(context.scene.state.que == QuestionKey.seven_answer) context.scene.state.count++;
				return context.send(`${res}\n И последний вопрос!. 8. Сколько лап у паука?`, { keyboard: QuestionKey.eight()});
			}

			context.scene.state.que = context.text;

			return context.scene.step.next();
		}, 
        // end
		async (context) => {
            if (context.scene.step.firstTime || !context.text) {
                const res = context.scene.state.que == QuestionKey.eight_answer ? "Правильно!\n" : "Неправильно! :)\n"
                if(context.scene.state.que == QuestionKey.eight_answer) context.scene.state.count++;
				return context.send(`${res}\n Ты ответил правильно на ${context.scene.state.count} из 8 вопросов.`, { keyboard: QuestionKey.start()});
			}

			return context.scene.step.next(); // Automatic exit, since this is the last scene
		}
	])
]);


// Синхронизация модели с таблицей: 
// User.sync() — создает таблицу при отсутствии (существующая таблица остается неизменной)
// User.sync({ force: true }) — удаляет существующую таблицу и создает новую
// User.sync({ alter: true }) — приводит таблицу в соответствие с моделью
