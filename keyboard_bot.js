const {Keyboard} = require('vk-io');

class Question {
    static start() {
        const key = Keyboard.keyboard([
            [
              Keyboard.textButton({
                  label: `Мем`,
                  payload: {
                    command: `мем`,
                  },
                  color: Keyboard.POSITIVE_COLOR
              }),
              Keyboard.textButton({
                label: `Статистика`,
                payload: {
                  command: `статистика`,
                }
              })
            ],
            [
              Keyboard.textButton({
                label: `Загрузить свой мем`,
                payload: {
                  command: `загрузить мем`,
                },
                color: Keyboard.SECONDARY_COLOR
              })
            ],
            [
                Keyboard.textButton({
                    label: `Пройти тест`,
                    payload: {
                      command: `пройти тест`,
                    }
                })
            ],
          ]);
          
          return key; 
    }

    static one_answer = 2022;
    static one() {
        const key = Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: `2022`,
                    payload: {
                        command_que: 2022,
                    },
                }),
                Keyboard.textButton({
                    label: `2023`,
                    payload: {
                        command_que: 2023,
                    }
                })
            ],
            [
                Keyboard.textButton({
                    label: `2222`,
                    payload: {
                        command_que: 2222,
                    },
                }),
                Keyboard.textButton({
                    label: `2021`,
                    payload: {
                        command_que: 2021,
                    },
                })
            ],
            [
                Keyboard.textButton({
                    label: `Закончить с вопросами`,
                    payload: {
                        command_que: `exit que`,
                    }
                })
            ],
        ]).inline()
        
        return key; 
    }
    // 2
    static two_answer = `Синее`;
    static two() {
        const key = Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: `Зеленое`,
                    payload: {
                        command_que: `Зеленое`,
                    },
                    color: Keyboard.POSITIVE_COLOR
                }),
                Keyboard.textButton({
                    label: `Белое`,
                    payload: {
                        command_que: `Белое`,
                    },
                    color: Keyboard.SECONDARY_COLOR
                })
            ],
            [
                Keyboard.textButton({
                    label: `Синее`,
                    payload: {
                        command_que: `Синее`,
                    },
                    color: Keyboard.PRIMARY_COLOR
                }),
                Keyboard.textButton({
                    label: `Красное`,
                    payload: {
                        command_que: `Красное`,
                    },
                    color: Keyboard.NEGATIVE_COLOR
                }),
            ],
            [
                Keyboard.textButton({
                    label: `Закончить с вопросами`,
                    payload: {
                        command_que: `exit que`,
                    }
                })
            ],
        ])
        
        return key; 
    }
    // 3
    static three_answer = `Лиса`;
    static three() {
        const key = Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: `Лиса`,
                    payload: {
                        command_que: `Лиса`,
                    },
                }),
                Keyboard.textButton({
                    label: `Заяц`,
                    payload: {
                        command_que: `Заяц`,
                    },
                })
            ],
            [
                Keyboard.textButton({
                    label: `Медведь`,
                    payload: {
                        command_que: `Медведь`,
                    },
                
                })
            ],
            [
                Keyboard.textButton({
                    label: `Закончить с вопросами`,
                    payload: {
                        command_que: `exit que`,
                    }
                })
            ],
        ])
        
        return key; 
    }
    // 4
    static four_answer = 12;
    static four() {
        const key = Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: `14`,
                    payload: {
                        command_que: `14`,
                    },
                }),
                Keyboard.textButton({
                    label: `12`,
                    payload: {
                        command_que: `12`,
                    },
                }),
                Keyboard.textButton({
                    label: `11`,
                    payload: {
                        command_que: `11`,
                    },
                })
            ],
            [
                Keyboard.textButton({
                    label: `Закончить с вопросами`,
                    payload: {
                        command_que: `exit que`,
                    }
                })
            ],
        ])
        
        return key; 
    }
    // 5
    static five_answer = `Маугли`; 
    static five() {
        const key = Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: `Чиполлино`,
                    payload: {
                        command_que: `Чиполлино`,
                    },
                }),
                Keyboard.textButton({
                    label: `Буратино`,
                    payload: {
                        command_que: `Буратино`,
                    },
                }),
                Keyboard.textButton({
                    label: `Маугли`,
                    payload: {
                        command_que: `Маугли`,
                    },
                })
            ],
            [
                Keyboard.textButton({
                    label: `Закончить с вопросами`,
                    payload: {
                        command_que: `exit que`,
                    }
                })
            ],
        ])
        
        return key; 
    }
    // 6
    static six_answer = `6`;
    static six() {
        const key = Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: `8`,
                    payload: {
                        command_que: `8`,
                    },
                }),
                Keyboard.textButton({
                    label: `4`,
                    payload: {
                        command_que: `4`,
                    },
                }),
                Keyboard.textButton({
                    label: `6`,
                    payload: {
                        command_que: `6`,
                    },
                })
            ],
            [
                Keyboard.textButton({
                    label: `Закончить с вопросами`,
                    payload: {
                        command_que: `exit que`
                    }
                })
            ],
        ])
        
        return key; 
    }
    // 7 
    static seven_answer = `Весна`;
    static seven() {
        const key = Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: `Зима`,
                    payload: {
                        command_que: `Зима`,
                    },
                }),
                Keyboard.textButton({
                    label: `Лето`,
                    payload: {
                        command_que: `Лето`,
                    },
                }),
            ],
            [
                Keyboard.textButton({
                    label: `Весна`,
                    payload: {
                        command_que: `Весна`,
                    },
                }),
                Keyboard.textButton({
                    label: `Осень`,
                    payload: {
                        command_que: `Осень`,
                    },
                })
            ],
            [
                Keyboard.textButton({
                    label: `Закончить с вопросами`,
                    payload: {
                        command_que: `exit que`,
                    }
                })
            ],
        ])
        
        return key; 
    }
    // 8
    static eight_answer = `8`;
    static eight() {
        const key = Keyboard.keyboard([
            [
                Keyboard.textButton({
                    label: `8`,
                    payload: {
                        command_que: `8`,
                    },
                }),
                Keyboard.textButton({
                    label: `6`,
                    payload: {
                        command_que: `4`,
                    },
                })
            ],
            [
                Keyboard.textButton({
                    label: `Закончить с вопросами`,
                    payload: {
                        command_que: `exit que`,
                    }
                })
            ],
        ])
        
        return key; 
    }
}

module.exports = Question;