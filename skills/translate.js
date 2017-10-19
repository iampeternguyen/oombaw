const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');
const helper = require('../controllers/helper');

module.exports = function(controller) {

  // add event handlers to controller
  // such as hears handlers that match triggers defined in code
  // or controller.studio.before, validate, and after which tie into triggers
  // defined in the Botkit Studio UI.
  controller.on('slash_command', function(bot, message) {
    // reply to slash command
    oombawDB.checkAddUser(message)
      .then(currentUser => helper.checkLanguagePrefs)
      .then(currentUser => translateWord(currentUser, message.text))
      .then(res => {
        console.log(res)
        bot.replyPrivate(message, res.original + ": " + res.translated);
      //saveYesOrNo(currentUser, res, message);
      })
      .catch(console.error)

  });



  // function checkLanguagePrefs(currentUser) {
  //   let userObj = currentUser.toObject();
  //   if (userObj.hasOwnProperty('translateTo')) {
  //     let original = message.text;
  //     translateWord(currentUser, original).then(res => {
  //       bot.replyPrivate(message, res.original + ": " + res.translated);
  //       saveYesOrNo(currentUser, res, message);
  //     });
  //   } else {
  //     let original = message.text;
  //     bot.replyPrivate(message, {
  //       text: "What language would you like to translate to?",
  //       response_type: "ephemeral",
  //       attachments: [{
  //         //"text": "Choose a language to translate to",
  //         fallback: "",
  //         color: "#3AA3E3",
  //         attachment_type: "default",
  //         callback_id: "language_selection",
  //         actions: [{
  //           name: "language_choice",
  //           text: "Pick a language...",
  //           type: "select",
  //           options: languages
  //         }]
  //       }]
  //     });

  //     controller.on('interactive_message_callback', function(bot, message) {
  //       //bot.whisper(message, 'preferences saved ' + original);
  //       if (message.callback_id == "language_selection") {
  //         oombawDB.addUserPref(message, message.text).then(currentUser => {

  //           translateWord(currentUser, original).then(res => {

  //             bot.replyInteractive(message, {
  //               text: res.original + ": " + res.translated,
  //               replace_original: true,
  //               callback_id: 'language_selection',
  //               response_type: 'ephemeral'
  //             }, (err) => {
  //               if (err) {
  //                 console.log(err);
  //               } else {
  //                 console.log('Experiment finished')
  //               }
  //             });
  //             //bot.whisper(message, res);
  //             saveYesOrNo(currentUser, res, message);

  //           });
  //         });
  //       }

  //     });
  //   }
  // }





  function translateWord(currentUser, text) {
    console.log(text)
    return new Promise((resolve, reject) => {
      translate(text, {
        to: currentUser.translateTo
      })
        .then(res => {
          if (res == null) {
            reject("cannot translate word")
          } else {
            res.original = text.toLowerCase();
            res.translated = res.text.toLowerCase();
            resolve(res);
          //bot.replyPrivate(message, res.original + ': ' + res.translated);
          //console.log(original + ' is ' + translated);
          // console.log(res.text);
          // => I speak English
          // console.log(res.from.language.iso);
          // => nl
          //saveYesOrNo(currentUser, msg, res);
          }

        }).catch("transation error");
    });
  }

  function saveYesOrNo(currentUser, res, message) {

    translate('Do you want to save this?', {
      to: currentUser.translateTo
    }).then(translatedMessage => {
      bot.whisper(message, {
        user: currentUser.userID,
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
          oombawDB.saveVocab(res, currentUser);
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

const languages = [
  {
    "text": "Afrikaans",
    "value": "af"
  },
  {
    "text": "Albanian",
    "value": "sq"
  },
  {
    "text": "Amharic",
    "value": "am"
  },
  {
    "text": "Arabic",
    "value": "ar"
  },
  {
    "text": "Armenian",
    "value": "hy"
  },
  {
    "text": "Azeerbaijani",
    "value": "az"
  },
  {
    "text": "Basque",
    "value": "eu"
  },
  {
    "text": "Belarusian",
    "value": "be"
  },
  {
    "text": "Bengali",
    "value": "bn"
  },
  {
    "text": "Bosnian",
    "value": "bs"
  },
  {
    "text": "Bulgarian",
    "value": "bg"
  },
  {
    "text": "Catalan",
    "value": "ca"
  },
  {
    "text": "Cebuano",
    "value": "ceb (ISO-639-2)"
  },
  {
    "text": "Chinese (Simplified)",
    "value": "zh-CN"
  },
  {
    "text": "Chinese (Traditional)",
    "value": "zh-TW"
  },
  {
    "text": "Corsican",
    "value": "co"
  },
  {
    "text": "Croatian",
    "value": "hr"
  },
  {
    "text": "Czech",
    "value": "cs"
  },
  {
    "text": "Danish",
    "value": "da"
  },
  {
    "text": "Dutch",
    "value": "nl"
  },
  {
    "text": "English",
    "value": "en"
  },
  {
    "text": "Esperanto",
    "value": "eo"
  },
  {
    "text": "Estonian",
    "value": "et"
  },
  {
    "text": "Finnish",
    "value": "fi"
  },
  {
    "text": "French",
    "value": "fr"
  },
  {
    "text": "Frisian",
    "value": "fy"
  },
  {
    "text": "Galician",
    "value": "gl"
  },
  {
    "text": "Georgian",
    "value": "ka"
  },
  {
    "text": "German",
    "value": "de"
  },
  {
    "text": "Greek",
    "value": "el"
  },
  {
    "text": "Gujarati",
    "value": "gu"
  },
  {
    "text": "Haitian Creole",
    "value": "ht"
  },
  {
    "text": "Hausa",
    "value": "ha"
  },
  {
    "text": "Hawaiian",
    "value": "haw"
  },
  {
    "text": "Hebrew",
    "value": "iw"
  },
  {
    "text": "Hindi",
    "value": "hi"
  },
  {
    "text": "Hmong",
    "value": "hmn"
  },
  {
    "text": "Hungarian",
    "value": "hu"
  },
  {
    "text": "Icelandic",
    "value": "is"
  },
  {
    "text": "Igbo",
    "value": "ig"
  },
  {
    "text": "Indonesian",
    "value": "id"
  },
  {
    "text": "Irish",
    "value": "ga"
  },
  {
    "text": "Italian",
    "value": "it"
  },
  {
    "text": "Japanese",
    "value": "ja"
  },
  {
    "text": "Javanese",
    "value": "jw"
  },
  {
    "text": "Kannada",
    "value": "kn"
  },
  {
    "text": "Kazakh",
    "value": "kk"
  },
  {
    "text": "Khmer",
    "value": "km"
  },
  {
    "text": "Korean",
    "value": "ko"
  },
  {
    "text": "Kurdish",
    "value": "ku"
  },
  {
    "text": "Kyrgyz",
    "value": "ky"
  },
  {
    "text": "Lao",
    "value": "lo"
  },
  {
    "text": "Latin",
    "value": "la"
  },
  {
    "text": "Latvian",
    "value": "lv"
  },
  {
    "text": "Lithuanian",
    "value": "lt"
  },
  {
    "text": "Luxembourgish",
    "value": "lb"
  },
  {
    "text": "Macedonian",
    "value": "mk"
  },
  {
    "text": "Malagasy",
    "value": "mg"
  },
  {
    "text": "Malay",
    "value": "ms"
  },
  {
    "text": "Malayalam",
    "value": "ml"
  },
  {
    "text": "Maltese",
    "value": "mt"
  },
  {
    "text": "Maori",
    "value": "mi"
  },
  {
    "text": "Marathi",
    "value": "mr"
  },
  {
    "text": "Mongolian",
    "value": "mn"
  },
  {
    "text": "Myanmar (Burmese)",
    "value": "my"
  },
  {
    "text": "Nepali",
    "value": "ne"
  },
  {
    "text": "Norwegian",
    "value": "no"
  },
  {
    "text": "Nyanja (Chichewa)",
    "value": "ny"
  },
  {
    "text": "Pashto",
    "value": "ps"
  },
  {
    "text": "Persian",
    "value": "fa"
  },
  {
    "text": "Polish",
    "value": "pl"
  },
  {
    "text": "Portuguese",
    "value": "pt"
  },
  {
    "text": "Punjabi",
    "value": "pa"
  },
  {
    "text": "Romanian",
    "value": "ro"
  },
  {
    "text": "Russian",
    "value": "ru"
  },
  {
    "text": "Samoan",
    "value": "sm"
  },
  {
    "text": "Scots Gaelic",
    "value": "gd"
  },
  {
    "text": "Serbian",
    "value": "sr"
  },
  {
    "text": "Sesotho",
    "value": "st"
  },
  {
    "text": "Shona",
    "value": "sn"
  },
  {
    "text": "Sindhi",
    "value": "sd"
  },
  {
    "text": "Sinhala (Sinhalese)",
    "value": "si"
  },
  {
    "text": "Slovak",
    "value": "sk"
  },
  {
    "text": "Slovenian",
    "value": "sl"
  },
  {
    "text": "Somali",
    "value": "so"
  },
  {
    "text": "Spanish",
    "value": "es"
  },
  {
    "text": "Sundanese",
    "value": "su"
  },
  {
    "text": "Swahili",
    "value": "sw"
  },
  {
    "text": "Swedish",
    "value": "sv"
  },
  {
    "text": "Tagalog (Filipino)",
    "value": "tl"
  },
  {
    "text": "Tajik",
    "value": "tg"
  },
  {
    "text": "Tamil",
    "value": "ta"
  },
  {
    "text": "Telugu",
    "value": "te"
  },
  {
    "text": "Thai",
    "value": "th"
  },
  {
    "text": "Turkish",
    "value": "tr"
  },
  {
    "text": "Ukrainian",
    "value": "uk"
  },
  {
    "text": "Urdu",
    "value": "ur"
  },
  {
    "text": "Uzbek",
    "value": "uz"
  },
  {
    "text": "Vietnamese",
    "value": "vi"
  },
  {
    "text": "Welsh",
    "value": "cy"
  },
  {
    "text": "Xhosa",
    "value": "xh"
  },
  {
    "text": "Yiddish",
    "value": "yi"
  },
  {
    "text": "Yoruba",
    "value": "yo"
  },
  {
    "text": "Zulu",
    "value": "zu"
  }
];
