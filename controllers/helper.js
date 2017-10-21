const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');


module.exports = {
  translateMessage: translateMessage,
  checkLanguagePrefs: checkLanguagePrefs

};
//

function translateMessage(text, user) {
  return new Promise((resolve, reject) => {
    translate(text, {
      to: user.translateTo
    }).then(translated => {
      if (translated) {
        console.log(translated)
        resolve(translated)
      } else {
        reject(null)
      }
    })
  })
}

function checkLanguagePrefs(oombawUser) {
  let userObj = oombawUser.toObject();
  if (userObj.hasOwnProperty('translateTo')) {
    return true;
  } else {
    return false;
  }

}

function askUserPrefs(oombawUser) {
  return new Promise((resolve, reject) => {
    //          "channel": oombawUser.message.channel_id,
    // "token": oombawUser.message.token,
    // "user": oombawUser.message.user_id,
    bot.replyPrivate(oombawUser.message, {
      "text": "What language would you like to translate to?",
      response_type: "ephemeral",
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
          "options": languages
        }]
      }]
    });
    // TODO cannot send header problem but still sends message
    oombawUser.controller.on('interactive_message_callback', function(bot, message) {
      //bot.whisper(message, 'preferences saved ' + original);
      //console.log(message);
      if (message.callback_id == "language_selection") {
        console.log(message);
        bot.replyInteractive(message, {
          text: ":ok_hand: ",
          replace_original: true,
          "channel": oombawUser.message.channel_id,
          "token": oombawUser.message.token,
          "user": oombawUser.message.user_id,
          response_type: "ephemeral",
          callback_id: 'language_selection',
        }, (err) => {
          if (err) {
            console.log(err);
          } else {
            oombawUser.message = message;
            oombawDB.addUserPrefs(oombawUser).then(res => resolve(oombawUser))

          }
        });


      }

    });
  })



}




