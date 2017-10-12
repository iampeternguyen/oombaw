const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.Promise = global.Promise;
module.exports = {
  checkAddUser: checkAddUser,
  addUserPref: addUserPref,
  saveVocab: saveVocab
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
        result.save().then(() => {
          resolve(result);
        });
      }
    });
  });
}

function saveVocab(google, message, original, translated) {
  console.log('saving' + original + ' as ' + translated);
  User.findOne({
    teamID: message.team.id,
    userID: message.user.id,
  }).then(result => {
    if (result === null) {
      let err = 'could not save word';
    } else {
      //TODO create function that checks if word is already added
      //TODO create function that checks if list is already added
      if (result.vocablist.length === 0) {
        //initializing list
        result.vocablist[0] = {
          source: google.from.language.iso,
          target: result.translateTo,
          vocab: [{
            sourceWord: original,
            targetWord: translated
          }]
        };
        result.save();
      } else {
        var found = 0;
        for (i = 0; i < result.vocablist.length; i++) {

          if (result.vocablist[i].source == google.from.language.iso) {
            result.vocablist[i].vocab.push({
              sourceWord: original,
              targetWord: translated
            });
            result.save();
            found = 1;

          }
        }
        if (found === 0) {
          console.log('list not found');
          result.vocablist[result.vocablist.length] = {
            source: google.from.language.iso,
            target: result.translateTo,
            vocab: [{
              sourceWord: original,
              targetWord: translated
            }]
          };
          result.save();

        }
      }

    }
  }).catch(err => {
    console.log("couldn't find user to save data to");
    console.log(err);
  });

}
