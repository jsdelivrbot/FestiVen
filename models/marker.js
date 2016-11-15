// Allows for schema creation in an object oriented approach
var mongoose = require('mongoose');
// To allow superclasses
var extend = require('mongoose-schema-extend');

var markerSchema = new mongoose.Schema({
  location: {
    type: [Number],   // [<longitude>, <latitude>]
    index: '2d',      // Create the geospatial index
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
  // Collection makes sure MongoDB uses the specified collection name
  // DiscriminatorKey will make sure the subtypes are saved with the right type ('Car' or 'Tent') and allows usage of instanceof
}, {
  collection: 'markers',
  discriminatorKey: '_type'
});

// Extend the marker schema with an enum that allows Car and Tent to distinguish the type of marker
var privateMarkerSchema = markerSchema.extend({
  type: String,
  enum: ['Car', 'Tent'],
  required: true
});

// Extend the marker schema with a list of users the marker is shared with
var sharedMarkerSchema = markerSchema.extend({
  users: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  }]
});

// Export the created models so they're accessible by name through mongoose
mongoose.model('Marker', markerSchema),
mongoose.model('SharedMarker', sharedMarkerSchema);
mongoose.model('PrivateMarker', privateMarkerSchema);
