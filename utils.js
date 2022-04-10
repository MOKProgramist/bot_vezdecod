const { UtilsCore } = require('commander-core');
const { API, Upload } = require('vk-io');

const api = new API({
	token: process.env.TOKEN
});

const upload = new Upload({
	api
});

var fs = require('fs');
const {Memes, User, MemeScores} = require('./Model/Model');
/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
let photo = new Array();
class Utils extends UtilsCore {
  constructor() {
    super();
    this.adminIds = [360767360, 683583714]; //ваш ID в вк так же можете поместить сюда массив идентификаторов
    this.vk = API;
  }

  testMetods() {
    return console.log('test');
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  findPhoto() {
    let randomId = this.getRandomInt(photo.length);

    return photo[randomId];
  }
  // склонения слов
  declOfNum(n, text_forms) {  
    n = Math.abs(n) % 100; 
    var n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
  };

  // рандоамная фотка из базы уже
  randomMemeDB = async(userId) => {
    const countMemsDb = await Memes.count();
    const findMem = await Memes.findOne({
      where: {
        id: this.getRandomInt(countMemsDb)
      }
    });

  // проверяем на оценку пользователя
  return this.checkLike(userId, findMem, true);
  }


 // создание фоток в бд из папки с мемами
 createMemDir = async (userId) => {
    path = __dirname + '/Memes/';
    // console.log(path)
    // вызываем метод получения картинки
    let namePhoto = this.findPhoto();
    // загружаем мем, если его нет в базе
    const findMem = await Memes.findOne({
        where: {
            name: namePhoto
        }
    });
    // мема нет
    if(!findMem) { 
        const attachment = await upload.messagePhoto({
            source: {
            value: fs.createReadStream(path + namePhoto),
            // Обязательно нужно указать размер файла, иначе загрузка завершится неудачей
            // В примере использован `fs.statSync`, в реальном приложении нужно использовать `fs.stats` так как он не блокирует поток
            contentLength: fs.statSync(path + namePhoto).size
            }
        });
        // console.log(attachment);
        const Mem = await Memes.create({
            name: namePhoto, url: attachment.largeSizeUrl, userId: null, link: `${attachment.ownerId}_${attachment.id}_${attachment.accessKey}`
        });
        return Mem;
    }

    return this.checkLike(userId, findMem);
  }; 

// проверка оценки пользователя фоток из бд
  checkLike = async (userId, mem, bd = false) => {
    const listLike = await MemeScores.findOne({
        where: {
            userId: userId,
            memeID: mem.id
        }
    });
    
    // если юзер уже оценил мем
    if(listLike) {
      // если запросили фотку из бд
      if(bd) return this.randomMemeDB(userId);
      // если запросили из файлов

      return this.createMemDir(userId);
    }
    return mem
  };

}

// при запуске собираем фотки
const arrayPhoto = async() => {
  path = __dirname + '/Memes/';
  fs.readdir(path, function(err, items) {
    for (var i =0; i < items.length; i++) {
      photo.push(items[i]);
    }

});
}
arrayPhoto();

module.exports = Utils;