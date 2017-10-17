const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');

module.exports = function(controller) {
  controller.hears(['export'], 'direct_message,direct_mention', (bot, message) => {
    let currentUser = oombawDB.getUser(message)


    bot.startConversation(message, (err, convo) => {
      convo.ask({
        text: "Which list would you like to save?",
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
      })
    })
  })

}
