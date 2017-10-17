const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');

module.exports = function(controller) {
  controller.hears(['export'], 'direct_message,direct_mention', (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      convo.ask('Which list would you like to export?')
    })
  })

}
