const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');

module.exports = function(controller) {
  controller.hears(['export'], 'direct_message,direct_mention', (bot, message) => {
    oombawDB.getUser(message).then(currentUser => {
      console.log(currentUser.vocabList)
      console.log(currentUser.vocabList[0])
      let vocabArray = []
      for (i = 0; i < currentUser.vocabList.length; i++) {
        vocabArray.push({
          name: 'answer',
          text: currentUser.vocabList[i].source,
          type: 'button',
          value: i
        })
      }
      console.log(vocabArray)

      bot.startConversation(message, (err, convo) => {
        convo.ask({
          user: currentUser.userID,
          text: "Which list would you like to export?",
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

  })

}
