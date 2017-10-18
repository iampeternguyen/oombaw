const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');
const json2csv = require('json2csv');
const fs = require('fs');
const del = require('delete');

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
          oombawDB.getVocabList(message).then(list => {

            let fields = ['sourceWord', 'targetWord', 'date'];
            let url = '';
            json2csv({
              data: list,
              fields: fields
            }, function(err, csv) {
              if (err) console.log(err);
              //console.log(csv);
              fs.writeFile(__dirname + '/../public/' + message.user + '.csv', csv, (err) => {
                if (err)
                  throw err;
                console.log(message.user + '.csv saved.')
                url = 'http://oombaw.herokuapp.com/' + message.user + '.csv';
                // delete file after 5 minutes
                del([__dirname + '/../public/' + message.user + '.csv'], (err, deleted) => {
                  if (err)
                    throw err;
                  console.log(deleted)
                })
                // reply to message 
                bot.replyInteractive(message, {
                  text: "Download vocab list here: " + url,
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
            });



          })

        }

      });

    })

  })


}
