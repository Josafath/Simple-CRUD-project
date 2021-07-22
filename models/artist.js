const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 100, trim: true },
    img_url: { type: String, trim: true, maxlength: 200 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
})

ArtistSchema
    .virtual('url')
    .get(function() {
        return ('/music/artist/' + this._id);
    });


module.exports = mongoose.model("Artist", ArtistSchema);