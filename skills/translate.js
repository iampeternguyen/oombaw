const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');

module.exports = function(controller) {

    // add event handlers to controller
    // such as hears handlers that match triggers defined in code
    // or controller.studio.before, validate, and after which tie into triggers
    // defined in the Botkit Studio UI.
    controller.on('slash_command', function(bot, message) {
      // reply to slash command
      oombawDB.checkAddUser(message).then(currentUser => {
        let userObj = currentUser.toObject();
        if (userObj.hasOwnProperty('translateTo')) {
          //bot.whisper(message, "translating...");
          let original = message.text;
          translateWord(currentUser, original).then(res => {
            bot.replyPrivate(message, res.original + ": " + res.translated);
            saveYesOrNo(currentUser, res)
          });
        } else {
          let original = message.text;
          bot.replyPrivate(message, {
            "text": "What language would you like to translate to?",
            "response_type": "ephemeral",
            "attachments": [{
              //"text": "Choose a language to translate to",
              "fallback": "",
              "color": "#3AA3E3",
              "attachment_type": "default",
              "callback_id": "language_selection",
              "actions": [{
                "name": "language_choice",
                "text": "Pick a language...",
                "type": "select",
                "options": [{
                    "text": "Afrikaans",
                    "value": "af"
                  },
                  {
                    "text": "Albanian",
                    "value": "sq"
                  },
                  {
                    "text": "Arabic ",
                    "value": "ar"
                  },
                  {
                    "text": "Azerbaijani",
                    "value": "az"
                  },
                  {
                    "text": "Basque",
                    "value": "eu"
                  },
                  {
                    "text": "English",
                    "value": "en"
                  },
                  {
                    "text": "Vietnamese",
                    "value": "vi"
                  }
                ]
              }]
            }]
          });

          controller.on('interactive_message_callback', function(bot, message) {
            //bot.whisper(message, 'preferences saved ' + original);

            oombawDB.addUserPref(message, message.text).then(currentUser => {

              translateWord(currentUser, original).then(res => {

                bot.replyInteractive(message, {
                  text: res.original + ": " + res.translated,
                  replace_original: true,
                  callback_id: 'language_selection',
                  response_type: 'ephemeral'
                }, (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Experiment finished')
                  }
                });
                //bot.whisper(message, res);
                saveYesOrNo(currentUser, res);

              });
            });
          });
        }
      })

    });


    function translateWord(currentUser, text) {
      return new Promise((resolve, reject) => {
        translate(text, {
            to: currentUser.translateTo
          })
          .then(res => {
            if (res == null) {
              reject("cannot translate word")
            } else {
              res.original = text.toLowerCase();
              res.translated = res.text.toLowerCase();
              resolve(res);
              //bot.replyPrivate(message, res.original + ': ' + res.translated);
              //console.log(original + ' is ' + translated);
              // console.log(res.text);
              // => I speak English
              // console.log(res.from.language.iso);
              // => nl
              //saveYesOrNo(currentUser, msg, res);
            }

          }).catch("transation error");
      });
    }

    function saveYesOrNo(currentUser, res) {
      translate('Do you want to save this?', {
        to: currentUser.translateTo
      }).then(translatedMessage => {
          bot.sendEphemeral({
              user: currentUser.userID,
              text: '',
              attachments: [{
                text: translatedMessage.text,
                fallback: 'Yes or No?',
                callback_id: 'yesno_callback',
                actions: [{
                    name: 'answer',
                    text: ':thumbsup:',
                    type: 'button',
                    value: 'yes'
                  },
                  {
                    name: 'answer',
                    text: ':thumbsdown:',
                    type: 'button',
                    value: 'no'
                  }
                ]
              }]
            }




            controller.on('interactive_message_callback', function(bot, message) {
              //bot.whisper(message, 'preferences saved ' + original);
              if (message.text == "yes") {
                bot.replyInteractive(message, {
                  text: "saving",
                  replace_original: true,
                  callback_id: 'yesno_callback',
                  response_type: 'ephemeral'
                }, (err) => {
                  if (err) {
                    console.log(err);
                  } else {}
                });
              } else {
                bot.replyInteractive(message, {
                  text: "not saving",
                  replace_original: true,
                  callback_id: 'yesno_callback',
                  response_type: 'ephemeral'
                }, (err) => {
                  if (err) {
                    console.log(err);
                  } else {}
                });
              }



              //bot.whisper(message, res);
            });


            //   //TODO not getting updated
            //   console.log('original before sending is ' + res.original);
            //   slapp.action('yesno_callback', 'answer', (msg, value) => {
            //     if (value == 'yes') {
            //       console.log('sending original ' + res.original);
            //       //console.log(msg);
            //       oombawDB.saveVocab(res, msg, res.original, res.translated);
            //       msg.respond(msg.body.response_url, `:thumbsup:`);
            //     } else {
            //       console.log('not saving');
            //       msg.respond(msg.body.response_url, `:thumbsdown:`);
            //     }
            //   });
            // })
            // .catch(err => {
            //   console.error(err);
          });

      }


    }
