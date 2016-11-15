// Allows for schema creations in an object oriented approach
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

// Toggles the setting (boolean))
settingSchema.methods.toggle = function() {
  this.enabled = !this.enabled;
};

mongoose.model('Setting', settingSchema);
