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


 // создание фоток в бд из папки с мемами
 createMemDir = async (userId) => {
  const user = await User.findOne({
      where: {
          id: userId
      }
  })
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
// проверка оценки пользователя
checkLike = async (userId, mem) => {
  const listLike = await MemeScores.findOne({
      where: {
          userId: userId,
          memeID: mem.id
      }
  });
  
  // если юзер уже оценил мем
  if(listLike) {
    // снова получаем мем
    return createMemDir(userId);
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