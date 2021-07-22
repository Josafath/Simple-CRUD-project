const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 100, lowercase: true },
    lyrics: { type: String },
    album: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
});


SongSchema
    .virtual("url")
    .get(function() {
        return ('/music/song/' + this._id);
    })


module.exports = mongoose.model("Song", SongSchema);