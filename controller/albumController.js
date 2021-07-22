const Album = require('../models/album');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const Song = require('../models/song');

const async = require('async');
const { body, validationResult } = require('express-validator');

exports.album_list = (req, res, next) => {
    Album.find({}, (err, results) => {
        if (err) { return next(err) }
        res.render('album_list', { title: "Albums", albums: results })
    })
}

exports.album_details = (req, res, next) => {
    async.parallel({
        album_results: function(callback) {
            Album.findById(req.params.id)
                .exec(callback);
        },
        songs: function(callback) {
            Song.find({ 'album': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err) }
        if (results.album_results == null) {
            let err = new Error('Artist not Found')
            err.status = 404;
            return next(err);
        }
        res.render('album_detail', { title: "Album Details", album: results.album_results, songs: results.songs })
    })
}

exports.album_create_get = (req, res, next) => {
    async.parallel({
            artists: (callback) => {
                Artist.find()
                    .exec(callback)
            },
            genres: (callback) => {
                Genre.find()
                    .exec(callback)
            },
        },
        (err, results) => {
            if (err) { return next(err) }
            res.render('create_album', {
                title: "Create Album",
                artists: results.artists,
                genres: results.genres,
            });
        });
}

exports.album_create_post = [
    body("name")
    .isLength({ min: 1 }),

    body("date_release", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            async.parallel({
                    artists: (callback) => {
                        Artist.find(callback)
                    },
                    genres: (callback) => {
                        Genre.find(callback)
                    },
                },
                function(err, results) {
                    if (err) { return next(err) }
                    for (let i = 0; i < results.genres.length; i++) {
                        if (book.genre.indexOf(results.genres[i]._id) > -1) {
                            results.genres[i].checked = 'true';
                        }
                    }
                    res.render('create_album', { title: "Create Album", artists: results.artists, genres: results.genres })
                })
            return;
        } else {
            const album = new Album({
                name: req.body.name,
                date_release: req.body.date_release,
                img_url: req.body.img_url,
                artist: req.body.artist,
                genre: req.body.genre,
            })
            album.save((err) => {
                if (err) { return next(err) }
                res.redirect(album.url)
            })
        }
    }
];

exports.album_update_get = (req, res, next) => {
    async.parallel({
            artists: (callback) => {
                Artist.find()
                    .exec(callback)
            },
            genres: (callback) => {
                Genre.find()
                    .exec(callback)
            },
            album: (callback) => {
                Album.findById(req.params.id).exec(callback)
            }
        },
        (err, results) => {
            if (err) { return next(err) }
            res.render('album_update', {
                title: results.album.name,
                album: results.album,
                artists: results.artists,
                genres: results.genres,
            });

        })
}

exports.album_update_post = [
    body("name")
    .isLength({ min: 1 }),

    body("date_release", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            async.parallel({
                    artists: (callback) => {
                        Artist.find(callback)
                    },
                    genres: (callback) => {
                        Genre.find(callback)
                    },
                },
                function(err, results) {
                    if (err) { return next(err) }
                    for (let i = 0; i < results.genres.length; i++) {
                        if (book.genre.indexOf(results.genres[i]._id) > -1) {
                            results.genres[i].checked = 'true';
                        }
                    }
                    res.render('album_update', { title: "Update Album", artists: results.artists, genres: results.genres })
                })
            return;
        } else {
            const album = new Album({
                _id: req.params.id,
                name: req.body.name,
                date_release: req.body.date_release,
                img_url: req.body.img_url,
                artist: req.body.artist,
                genre: req.body.genre,
            })
            Album.findByIdAndUpdate(req.params.id, album, {}, function update(err, result) {
                if (err) { return next(err) }
                res.redirect(result.url);
            })
        }
    }
];


exports.album_delete_get = (req, res, next) => {
    async.parallel({
            album: (callback) => {
                Album.findById(req.params.id).exec(callback);
            },
            songs: (callback) => {
                Song.find({ 'album': req.params.id }).exec(callback)
            },
        },
        (err, results) => {
            if (err) { return next(err); }
            res.render('album_delete', { title: "", album: results.album, songs: results.songs })
        })
}

exports.album_delete_post = (req, res, next) => {
    const Adminpassword = "jossify123";
    if (req.body.password !== Adminpassword) {
        Album.findById(req.params.id, (err, result) => {
            if (err) { return next(err); }
            res.render('album_delete', { title: "Delete Artist", album: result });
        })
    } else {
        Album.findByIdAndRemove(req.params.id, function deleteAlbum(err) {
            if (err) { return next(err) }
            res.redirect('/music/album')
        })
    }
}