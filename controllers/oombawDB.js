const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../models/user');
const translate = require('google-translate-api-extended');



mongoose.Promise = global.Promise;
module.exports = {
  checkAddUser: checkAddUser,
  saveVocab: saveVocab,
  getUser: getUser,
  getVocabList: getVocabList,
  addUserPrefs: addUserPrefs
};
//
function checkAddUser(teamID, userID) {
  return new Promise((resolve, reject) => {
    User.findOne({
      teamID: teamID,
      userID: userID
    }).then(result => {
      if (result === null) {
        var regUser = new User({
          teamID: teamID,
          userID: userID
        });

        regUser.save().then(() => {
          resolve(regUser);
        });
        //console.log("new user added");


      } else {
        //console.log("already added");
        resolve(result);
      }
    }).catch(err => {
      reject("Could not add or find user");
    });
  }

  );

}


function saveVocab(oombawUser) {
  // needs google response stored into oombawUser.temp
  // searching for list
  let found = 0;
  for (i = 0; i < oombawUser.vocabList.length; i++) {
    // if found then add to list
    if (oombawUser.vocabList[i].source == oombawUser.temp.from.language.iso) {

      // double check if word is already saved
      let exists = 0;
      found = 1;
      for (k in oombawUser.vocabList[i].vocab) {

        if (oombawUser.vocabList[i].vocab[k].sourceWord == oombawUser.temp.original)
          exists = 1;
      }

      // if not added, add word
      if (exists == 0) {
        oombawUser.vocabList[i].vocab.push({
          sourceWord: oombawUser.temp.original,
          targetWord: oombawUser.temp.translated
        });
        oombawUser.save();
      }


    }
  }
  // if not found, add list to db and word to list
  if (found === 0) {
    console.log('list not found.. adding list ' + oombawUser.vocabList.length);
    let list = oombawUser.vocabList.length;
    oombawUser.vocabList[list] = [];
    oombawUser.vocabList[list].push({
      source: oombawUser.temp.from.language.iso,
      target: oombawUser.translateTo,
      vocab: [{
        sourceWord: oombawUser.temp.original,
        targetWord: oombawUser.temp.translated
      }]
    })

    oombawUser.save();

  }


}




function getUser(message) {
  return new Promise((resolve, reject) => {
    User.findOne({
      teamID: message.team_id || message.team.id,
      userID: message.user,
    }).then(result => {
      if (result === null) {
        let err = 'could not find user';
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
}

function getVocabList(message) {
  return new Promise((resolve, reject) => {
    getUser(message).then(currentUser => {
      if (currentUser) {
        let list = currentUser.vocabList[message.text].vocab
        //console.log(JSONlist)
        resolve(list)
      } else {
        reject("could not export list as specified")
      }

    })
  })
}

function addUserPrefs(oombawUser, preference) {
  return new Promise((resolve, reject) => {

    oombawUser.translateTo = preference;
    oombawUser.save().then((savedUser) => {
      console.log(savedUser);
      resolve(oombawUser);
    });
  });
}