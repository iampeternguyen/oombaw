const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');
const helper = require('../controllers/helper');

module.exports = function(controller) {

  controller.on('slash_command', function(bot, message) {
    // reply to slash command

    oombawDB.checkAddUser(message.team_id, message.user_id)
      .then(oombawUser => helper.checkLanguagePrefs(oombawUser)
        ? hasLangPrefsPath(oombawUser, message)
        : setupPrefsPath(oombawUser, message))

  });

  function setupPrefsPath(oombawUser, message) {
    original = message;
    bot.replyPrivate(message, "What language do you want to translate to?");

    bot.startConversation(message, (err, convo) => {
      var askPreference = {
        "text": "",
        "response_type": "ephemeral",
        "attachments": [{
          "fallback": "",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "callback_id": "language_selection",
          "actions": [{
            "name": "language_choice",
            "text": "Pick a language...",
            "type": "select",
            "options": languages
          }]
        }]
      }

      convo.addQuestion(askPreference, (response, convo) => {
        oombawDB.addUserPrefs(oombawUser, response.text)
          .then(oombawUser => translateWord(oombawUser, original.text)
            .then(oombawUser => {
              convo.addMessage(oombawUser.temp.original + ": " + oombawUser.temp.translated, 'completed')
              convo.gotoThread('completed');
            //saveYesOrNo(oombawUser, original);
            })
        );
      });
    });
  }

  function hasLangPrefsPath(oombawUser, message) {
    translateWord(oombawUser, message.text)
      .then(oombawUser => {
        bot.replyPrivate(message, oombawUser.temp.original + ": " + oombawUser.temp.translated);
        saveYesOrNo(oombawUser, message);
      })
      .catch(console.error)
  }




  function translateWord(oombawUser, text) {
    return new Promise((resolve, reject) => {
      translate(text, {
        to: oombawUser.translateTo
      })
        .then(res => {
          if (res == null) {
            reject("cannot translate word")
          } else {
            res.original = text.toLowerCase();
            res.translated = res.text.toLowerCase();
            oombawUser.temp = res;
            resolve(oombawUser);

          }

        }).catch("transation error");
    });
  }

  function saveYesOrNo(oombawUser, message) {

    translate('Do you want to save this?', {
      to: oombawUser.translateTo
    }).then(translatedMessage => {
      bot.startConversation(message, (err, convo) => {
        saveMessage = {
          user: oombawUser.userID,
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
        }
        convo.addQuestion(saveMessage, (response, convo) => {
          if (response.text == "yes") {
            oombawDB.saveVocab(oombawUser);
            convo.addMessage(":ok_hand:", 'completed')
            convo.gotoThread('completed');
          }
        })
      })
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

