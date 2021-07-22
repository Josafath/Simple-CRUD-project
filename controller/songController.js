const Album = require('../models/album');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const Song = require('../models/song');

const async = require('async');
const { body, validationResult } = require('express-validator');

var fetch = require('node-fetch')

exports.song_list = (req, res, next) => {
    Song.find({}, (err, results) => {
        if (err) { return next(err) }
        res.render('song_list', { title: "Songs", songs: results })
    })
}

exports.song_details = (req, res, next) => {
    async.parallel({
        song: function(callback) {
            Song.findById(req.params.id)
                .exec(callback);
        },
        album: function(callback) {
            Album.find({ 'album': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err) }
        if (results.song == null) {
            let err = new Error('Song not Found')
            err.status = 404;
            return next(err);
        }
        res.render('song_detail', { title: "Song Details", song: results.song, album: results.album })
    })
}

exports.song_create_get = (req, res, next) => {
    async.parallel({
        album: function(callback) {
            Album.find()
                .exec(callback);
        },
        artists: function(callback) {
            Artist.find()
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err) }
        if (results.album == null) {
            let err = new Error('Something bad happened')
            err.status = 404;
            return next(err);
        }
        res.render('create_song', { title: "Create Song", artists: results.artists, albums: results.album })
    })
}

exports.song_create_post = [
    body("name")
    .isLength({ min: 1 }),

    body("artist_name")
    .isLength({ min: 1 }),

    async(req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("create_song", {
                title: "Create Song",
                author: req.body,
                errors: errors.array(),
            });
            return;
        }

        function foundData(artist, name_song) {
            return fetch(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&callback=callback&q_track=${name_song}%20&q_artist=${artist}&apikey=dfa2d203aea071e31f766af0cba63d7a`)
        }
        const return_lyric = async() => {
            const data = await foundData(req.body.artist_name, req.body.name)
            const ooiResponseData = await data.json()
            const lyrics = ooiResponseData["message"]["body"];
            const song = new Song({
                name: req.body.name,
                lyrics: lyrics["lyrics"]["lyrics_body"],
                album: req.body.album
            });
            song.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect(song.url);
            })
        }
        return_lyric();

    }
];

exports.song_update_get = (req, res, next) => {
    async.parallel({
        song_info: (callback) => {
            Song.findById(req.params.id).exec(callback)
        },
        album: function(callback) {
            Album.find()
                .exec(callback);
        },
        artist: function(callback) {
            Artist.find()
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err) }
        res.render('song_update', { title: results.song_info.name, song: results.song_info, albums: results.album, artists: results.artist })
    })
};

exports.song_update_post = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('song_update', {
            title: "Try Again. Something bad you did.",
            song: errors.array(),
        })
        return;
    } else {
        const song = new Song({ _id: req.params.id, name: req.body.name, lyrics: req.body.lyric, album: req.body.album })
        Song.findByIdAndUpdate(req.params.id, song, {}, function update(err, result) {
            if (err) { return next(err) }
            res.redirect(result.url);
        })
    }
}

exports.song_delete_get = (req, res, next) => {
    Song.findById(req.params.id, (err, result) => {
        if (err) { return next(err); }
        res.render('song_delete', { title: "Delete Song", song: result });
    })

}

exports.song_delete_post = (req, res, next) => {
    const Adminpassword = "jossify123";
    if (req.body.password !== Adminpassword) {
        Song.findById(req.params.id, (err, result) => {
            if (err) { return next(err); }
            res.render('song_delete', { title: "Delete Song", song: result });
        })
    } else {
        Song.findByIdAndRemove(req.params.id, function deleteSong(err) {
            if (err) { return next(err) }
            res.redirect('/music/song')
        })
    }
}