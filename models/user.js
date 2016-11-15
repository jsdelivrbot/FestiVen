// Allows for schema creations in an object oriented approach
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  friends: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  }],
  sent: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  }],
  received: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  }],
  markers: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Marker'
  }],
  settings: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Setting'
  }]
});

// Checks if you have sent a friend request to this person
userSchema.methods.requestSent = function(object_id) {

}

// Checks if you have received a friend request from this person
userSchema.methods.requestReceived = function(object_id) {

}

// Checks if you are friends with this person
userSchema.methods.isFriend = function(object_id) {

}

mongoose.model('User', userSchema);
