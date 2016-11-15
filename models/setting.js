// Allows for schema creations in an object oriented approach
// Package should be installed using npm
var mongoose = require('mongoose');

var settingSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  enabled: {
    type: Boolean,
    default: true,
    required: true
  }
});

// Toggles the setting between true and false
settingSchema.method.toggle = function(){
  this.enabled = !this.enabled;
};

mongoose.model('Setting', settingSchema);
