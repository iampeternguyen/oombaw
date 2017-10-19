const translate = require('google-translate-api-extended');
const oombawDB = require('../controllers/oombawDB');


module.exports = {
  translateMessage: translateMessage,
  checkLanguagePrefs: checkLanguagePrefs

};
//

function translateMessage(text, user) {
  return new Promise((resolve, reject) => {
    translate(text, {
      to: user.translateTo
    }).then(translated => {
      if (translated) {
        console.log(translated)
        resolve(translated)
      } else {
        reject(null)
      }
    })
  })
}

function checkLanguagePrefs(oombawUser) {
  return new Promise((resolve, reject) => {
    console.log(oombawUser)
    let userObj = oombawUser.toObject();
    if (userObj.hasOwnProperty('translateTo')) {
      resolve(oombawUser);
    } else {
      reject("No language preference")
    }
  })
}
