const translate = require('google-translate-api-extended');


module.exports = {
  translate: translate,

};
//

function translate(text, user) {
  return new Promise((resolve, reject) => {
    translate(text, {
      to: user.translateTo
    }).then(translated => {
      if (translated) {
        resolve(translated)
      } else {
        reject(null)
      }
    })
  })
}

