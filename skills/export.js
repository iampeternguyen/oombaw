const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');

module.exports = function(controller) {
  controller.hears(['export'], 'direct_message,direct_mention', (bot, message) => {
    let currentUser = oombawDB.getUser(message)
    currentUser = currentUser.toObject()
    let vocabArray = []
    for (i = 0; i < currentUser.vocablist.length; i++) {
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
        text: translatedMessage.text,
        response_type: "ephemeral",
        attachments: [{
          text: "",
          fallback: 'Yes or No?',
          callback_id: 'yesno_callback',
          actions: vocabArray
        }]
      })
    })
  })

}
