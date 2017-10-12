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
        bot.send(message, 'You have saved your preferences');

      } else {
        bot.send(message, 'You have\'t saved your preferences');
      }
    })
    // message.text
    bot.replyPublic(message, 'Everyone can see the results of this slash command' + message.text);

  });

}
