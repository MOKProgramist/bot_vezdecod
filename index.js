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

const {User} = require('./Model/Model');
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
	// if(!context.isChat) {
	// 	context.send(`Введенной вами команды не существует!`)
	// }
}); //событие при отсутствие подходящей команды


vk.updates.on('message_new', async(context, next) => {
    if(context.senderId < 0) return next();
	context.text = context.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim();
    // чтение контеста с кнопок
    if(context.messagePayload) {
        if(context.messagePayload.command) context.text = context.messagePayload.command;
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

// Синхронизация модели с таблицей: 
// User.sync() — создает таблицу при отсутствии (существующая таблица остается неизменной)
// User.sync({ force: true }) — удаляет существующую таблицу и создает новую
// User.sync({ alter: true }) — приводит таблицу в соответствие с моделью
