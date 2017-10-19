const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');
const helper = require('../controllers/helper');

module.exports = function(controller) {

  controller.on('slash_command', function(bot, message) {
    // reply to slash command

    // get necessary info from message
    var userInfo = {
      teamID: message.team_id || message.team.id,
      userID: message.user

    }
    var text = message;



    oombawDB.checkAddUser(userInfo)
      .then(oombawUser => helper.checkLanguagePrefs(oombawUser, text, controller))
      .then(oombawUser => translateWord(oombawUser, text.text))
      .then(oombawUser => {
        bot.replyPrivate(message, oombawUser.temp.original + ": " + oombawUser.temp.translated);
        saveYesOrNo(oombawUser, message);
      })
      .catch(console.error)

  });

  function translateWord(oombawUser, text) {
    return new Promise((resolve, reject) => {
      translate(text, {
        to: oombawUser.translateTo
      })
        .then(res => {
          if (res == null) {
            reject("cannot translate word")
          } else {
            res.original = text.toLowerCase();
            res.translated = res.text.toLowerCase();
            oombawUser.temp = res;
            resolve(oombawUser);

          }

        }).catch("transation error");
    });
  }

  function saveYesOrNo(oombawUser, message) {

    translate('Do you want to save this?', {
      to: oombawUser.translateTo
    }).then(translatedMessage => {
      bot.whisper(message, {
        user: oombawUser.userID,
        text: translatedMessage.text,
        response_type: "ephemeral",
        attachments: [{
          text: "",
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
      });



      controller.on('interactive_message_callback', function(bot, message) {
        if (message.text == "yes" && message.callback_id == "yesno_callback") {
          oombawDB.saveVocab(oombawUser);
          bot.replyInteractive(message, {
            text: ":ok_hand:",
            replace_original: true,
            callback_id: 'yesno_callback',
            response_type: 'ephemeral'
          }, (err) => {
            if (err) {
              console.log(err);
            } else {
            }
          });

        } else if (message.text == "no" && message.callback_id == "yesno_callback") {
          bot.replyInteractive(message, {
            text: ":ok_hand:",
            replace_original: true,
            callback_id: 'yesno_callback',
            response_type: 'ephemeral'
          }, (err) => {
            if (err) {
              console.log(err);
            } else {
            }
          });
        }

      });

    });

  }


}

