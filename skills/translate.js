const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');
const helper = require('../controllers/helper');

module.exports = function(controller) {

  controller.on('slash_command', function(bot, message) {
    // reply to slash command
    bot.startConversation(message, (err, convo) => {
      var msg = message;
      convo.addMessage({
        text: 'Hello let me ask you a question, then i will do something useful'
      }, 'default');
      convo.addQuestion({
        text: 'What is your name?'
      }, function(res, convo) {
        // name has been collected...
        convo.gotoThread('completed');
      }, {
        key: 'name'
      }, 'default');
      convo.addMessage({
        text: 'done'
      }, 'completed');
    // oombawDB.checkAddUser(msg)
    //   .then(oombawUser => helper.checkLanguagePrefs(oombawUser, convo, controller))
    //   .then(oombawUser => translateWord(oombawUser, msg.text))
    //   .then(oombawUser => {
    //     convo.say(oombawUser.temp.original + ": " + oombawUser.temp.translated);
    //   //saveYesOrNo(oombawUser, oombawUser.message || message);
    //   })
    //   .catch(console.error)
    });




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
            console.log(oombawUser);
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

