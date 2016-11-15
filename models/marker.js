// Allows for schema creations in an object oriented approach
// Package should be installed using npm
var mongoose = require('mongoose');

// To allow superclasses
var extend = require('mongoose-schema-extend');

var markerSchema = new mongoose.Schema({

  location: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d',      // create the geospatial index
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
// The discriminatorKey will make sure the subtypes are saved with the right type. In this case 'Car' or 'Tent'. This way instanceof can be used

// Collection makes sure mongo takes the collection name you want instead of pluralizing by itself
}, { collection : 'markers', discriminatorKey:'_type' });

// Extend the marker schema with an enum that allows Car and Tent to distinguish the type of marker
var privateMarkerSchema = markerSchema.extend({
  type : String,
  enum: ['Car', 'Tent'],
  required: true
});

// Extend the marker schema with a list of users the marker is shared with
var sharedMarkerSchema = markerSchema.extend({
  users: [{type: [mongoose.Schema.Types.ObjectId], ref: 'User'}]
});


// Exporting the models that were created, so it is accessible, by name, through mongoose
mongoose.model('Marker', markerSchema),
mongoose.model('SharedMarker', sharedMarkerSchema);
mongoose.model('PrivateMarker', privateMarkerSchema);
