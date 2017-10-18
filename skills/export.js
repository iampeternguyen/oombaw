const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');

module.exports = function(controller) {
  controller.hears(['export'], 'direct_message,direct_mention', (bot, message) => {
    oombawDB.getUser(message).then(currentUser => {
      let vocabArray = []
      for (i = 0; i < currentUser.vocabList.length; i++) {
        vocabArray.push({
          name: 'answer',
          text: currentUser.vocabList[i].source,
          type: 'button',
          value: i
        })
      }

      bot.startConversation(message, (err, convo) => {
        convo.ask({
          user: currentUser.userID,
          text: "Which list would you like to export?",
          response_type: "ephemeral",
          attachments: [{
            text: "",
            fallback: 'Which list?',
            callback_id: 'export_callback',
            actions: vocabArray
          }]
        })
      })

      controller.on('interactive_message_callback', function(bot, message) {
        if (message.callback_id == "export_callback") {
          // TODO get JSON of vocab list
          oombawDB.getVocabList(message).then(result => {
            // TODO export list 
            bot.replyInteractive(message, {
              text: ":ok_hand:",
              replace_original: true,
              callback_id: 'export_callback',
              response_type: 'ephemeral'
            }, (err) => {
              if (err) {
                console.log(err);
              } else {
              }
            });
          })

        }

      });

    })

  })

}
