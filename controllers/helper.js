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
  return new Promise((resolve, reject) => {
    let userObj = oombawUser.toObject();
    if (userObj.hasOwnProperty('translateTo')) {
      resolve(oombawUser);
    } else {
      askUserPrefs(oombawUser);
    //reject("No language preference")
    }
  })
}

function askUserPrefs(oombawUser) {
  bot.whisper({
    text: "What language would you like to translate to?",
    response_type: "ephemeral",
    attachments: [{
      //"text": "Choose a language to translate to",
      fallback: "",
      color: "#3AA3E3",
      attachment_type: "default",
      callback_id: "language_selection",
      actions: [{
        name: "language_choice",
        text: "Pick a language...",
        type: "select",
        options: languages
      }]
    }]
  });

  controller.on('interactive_message_callback', function(bot, message) {
    //bot.whisper(message, 'preferences saved ' + original);
    if (message.callback_id == "language_selection") {
      bot.replyInteractive(message, {
        text: "",
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
      oombawDB.addUserPref(message)
    }

  });


}



