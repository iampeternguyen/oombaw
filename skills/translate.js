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
        bot.whisper(message, "translating...");
        let original = message.text;
        translateWord(currentUser, original);
      } else {
        let original = message.text;
        bot.whisper(message, {
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
          bot.whisper(message, 'preferences saved ' + message.callback_id);
          oombawDB.addUserPref(message, message.text).then(currentUser => {
            translateWord(currentUser, original);
          });
        });
      }
    })

  });


  function translateWord(currentUser, text) {
    console.log(text);
    translate(text, {
        to: currentUser.translateTo
      })
      .then(res => {
        res.original = text.toLowerCase();
        res.translated = res.text.toLowerCase();
        bot.whisper(res.original + ': ' + res.translated);
        //console.log(original + ' is ' + translated);
        // console.log(res.text);
        // => I speak English
        // console.log(res.from.language.iso);
        // => nl
        //saveYesOrNo(currentUser, msg, res);
      });
  }

}
