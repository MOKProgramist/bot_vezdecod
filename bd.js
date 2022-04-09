const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    process.env.BD_NAME, // Название бд
    process.env.BD_USER, // Пользователь
    process.env.BD_PASSWORD, // Пароль
    {
      logging: false,
      host: process.env.BD_HOST, // Хост
      dialect: 'mysql', 
      // port: process.env.BD_PORT,
      
    //   dialectOptions: {
    //       useUTC: false, //for reading from database
    //       dateStrings: true,
    //       typeCast: function (field, next) { // for reading from database
    //         if (field.type === 'DATETIME') {
    //           return field.string();
    //         }
    //         return next()
    //       }
    //   },

    //   pool: {
    //     max: 10, //максимальное кол-во соединений в пуле (Default: 5)
    //     min: 0, //минимальное кол-во соединений в пуле (Default: 0)
    //     acquire: 30000, //время в миллисекундах, в течение которого будет осуществляться попытка установить соединение, прежде чем будет сгенерировано исключение (Default: 60000)
    //     idle: 10000, //время простоя в миллисекундах, по истечении которого соединение покинет пул (Default: 1000)
    //   },
      
    //   timezone: "+03:00"
    }
);
