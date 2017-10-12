module.exports = function(controller) {

  // add event handlers to controller
  // such as hears handlers that match triggers defined in code
  // or controller.studio.before, validate, and after which tie into triggers
  // defined in the Botkit Studio UI.
  controller.hears('^experiment', ['direct_message', 'direct_mention'], (bot, message) => {
    console.log('Experiment started');
    bot.reply(message, {
      attachments: [{
        title: 'Experiment',
        callback_id: 'experiment',
        attachment_type: 'default',
        actions: [{
          name: 'public',
          text: 'Secret',
          value: '',
          type: 'button'
        }]
      }]
    });
  });

  controller.on('interactive_message_callback', (bot, message) => {
    console.log('Experiment continued');
    bot.replyInteractive(message, {
      text: 'Can you keep a secret?',
      replace_original: false,
      response_type: 'ephemeral'
    }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Experiment finished')
      }
    });
  });
}
