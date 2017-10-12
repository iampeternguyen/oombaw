module.exports = function(controller) {

  // add event handlers to controller
  // such as hears handlers that match triggers defined in code
  // or controller.studio.before, validate, and after which tie into triggers
  // defined in the Botkit Studio UI.
  controller.hears('translate', ['direct_message', 'direct_mention', 'mention'], function(bot, message) {

    bot.reply(message, 'Hello Peter.');
    console.log(bot + message);

  });

}
