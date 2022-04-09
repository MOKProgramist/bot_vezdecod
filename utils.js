const { UtilsCore } = require('commander-core');
const {VK} = require('vk-io')
/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
class Utils extends UtilsCore {
  constructor() {
    super();
    this.adminIds = [360767360]; //ваш ID в вк так же можете поместить сюда массив идентификаторов
    this.vk = VK;
  }

  testMetods() {
    return console.log('test');
  }
}

module.exports = Utils;