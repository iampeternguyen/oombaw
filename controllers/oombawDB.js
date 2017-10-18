const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../models/user');
const translate = require('google-translate-api-extended');
const helper = require('../controllers/helper');



mongoose.Promise = global.Promise;
module.exports = {
  checkAddUser: checkAddUser,
  addUserPref: addUserPref,
  saveVocab: saveVocab,
  getuser: getUser
};
//
function checkAddUser(message) {
  return new Promise((resolve, reject) => {
    User.findOne({
      teamID: message.team_id,
      userID: message.user_id
    }).then(result => {
      if (result === null) {
        var regUser = new User({
          teamID: message.team_id,
          userID: message.user_id
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
      console.error(err);
      reject(new Error(err));
    });
  }

  );

}

function addUserPref(message, value) {
  return new Promise((resolve, reject) => {
    User.findOne({
      teamID: message.team.id,
      userID: message.user,
    }).then(result => {
      if (result === null) {
        let err = 'could not change preferences';
        reject(err);
      } else {
        result.translateTo = value;

        // TODO Build separate translate function that returns translated phrase. 
        // TODO translate phrases for help, exporting, changing saving preferences
        // result.messages = {
        //   saved: helper.translateMessage("Do you want to save this?", result)
        // }
        // console.log(result.messages.saved)

        result.save().then(() => {
          resolve(result);
        });


      }
    });
  });
}

function saveVocab(res, currentUser) {
  console.log('saving' + res.original + ' as ' + res.translated);
  User.findOne({
    teamID: currentUser.teamID,
    userID: currentUser.userID,
  }).then(result => {
    if (result === null) {
      let err = 'could not save word';
    } else {
      // searching for list
      let found = 0;
      for (i = 0; i < result.vocablist.length; i++) {
        // if found then add to list
        if (result.vocablist[i].source == res.from.language.iso) {

          // double check if word is already saved
          let exists = 0;
          found = 1;
          for (k in result.vocablist[i].vocab) {

            if (result.vocablist[i].vocab[k].sourceWord == res.original)
              exists = 1;
          }

          // if not added, add word
          if (exists == 0) {
            result.vocablist[i].vocab.push({
              sourceWord: res.original,
              targetWord: res.translated
            });
            result.save();
          }


        }
      }
      // if not found, add list to db and word to list
      if (found === 0) {
        console.log('list not found.. adding list ' + result.vocablist.length);
        let list = result.vocablist.length;
        result.vocablist[list] = {
          source: res.from.language.iso,
          target: result.translateTo,
          vocab: [{
            sourceWord: res.original,
            targetWord: res.translated
          }]
        };
        result.save();

      }


    }
  }).catch(err => {
    console.log("couldn't find user to save data to");
    console.log(err);
  });

}

function getUser(message) {
  return new Promise((resolve, reject) => {
    User.findOne({
      teamID: message.team.id,
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
