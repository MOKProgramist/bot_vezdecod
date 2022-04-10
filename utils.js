const { UtilsCore } = require('commander-core');
const { API, Upload } = require('vk-io');

const api = new API({
	token: process.env.TOKEN
});

const upload = new Upload({
	api
});

var fs = require('fs');
const {Memes} = require('./Model/Model');
/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
let photo = new Array();
class Utils extends UtilsCore {
  constructor() {
    super();
    this.adminIds = [360767360]; //ваш ID в вк так же можете поместить сюда массив идентификаторов
    this.vk = API;
  }

  static testMetods() {
    return console.log('test');
  }

  static getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  static async findPhoto() {
    let randomId = getRandomInt(photo.length);

    return photo[randomId];
  }


  // загружаем фотки в вк и базу
  static async createMemesToDir() {
    const attachment = await upload.messagePhoto({
      source: {
        value: <input>
      }
    });
  }
}

// при запуске собираем фотки
const arrayPhoto = async() => {
  path = __dirname + '/Memes/';

fs.readdir(path, function(err, items) {
 
    for (var i=0; i<items.length; i++) {
      // console.log(items[i]);
      photo.push(items[i]);
    }

});
}
arrayPhoto();

module.exports = Utils;