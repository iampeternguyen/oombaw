const translate = require('google-translate-api-extended');


module.exports = {
  translateMessage: translateMessage,

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

