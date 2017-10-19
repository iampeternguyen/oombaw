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

function checkLanguagePrefs(currentUser) {
  return new Promise((resolve, reject) => {
    let userObj = currentUser.toObject();
    if (userObj.hasOwnProperty('translateTo')) {
      resolve(currentUser);
    } else {
      reject("No language preference")
    }
  })
}
