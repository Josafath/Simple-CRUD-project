const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    name: { type: String, required: true, trim: true, uppercase: true, minlength: 1, maxlength: 100 },
    date_release: { type: Date },
    img_url: { type: String, trim: true },
    artist: { type: Schema.Types.Mixed, ref: 'Artist' },
    genre: [{ type: Schema.Types.Mixed, ref: 'Genre' }],
})

AlbumSchema
    .virtual("url")
    .get(function() {
        return ('/music/album/' + this._id);
    })

module.exports = mongoose.model("Album", AlbumSchema);