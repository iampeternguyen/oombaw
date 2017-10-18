const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema and Model

const VocabSchema = new Schema({
  sourceWord: String,
  targetWord: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const VocabListSchema = new Schema({
  source: String,
  target: String,
  vocab: [VocabSchema]
});

const UserSchema = new Schema({
  teamID: String,
  userID: String,
  translateTo: String,
  messages: {},
  vocabList: [VocabListSchema]
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
