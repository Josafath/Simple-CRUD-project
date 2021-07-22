const Album = require('../models/album');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const Song = require('../models/song');

const async = require('async');
const { body, validationResult } = require('express-validator');


exports.genre_list = (req, res, next) => {
    Genre.find({}, (err, genre) => {
        if (err) { return next(err) }
        res.render('genre_list', { title: "Genres", genres: genre });
    })
};

exports.genre_details = (req, res, next) => {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },
        albums: function(callback) {
            Album.find({ 'genre': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err) }
        if (results.genre == null) {
            const err = new Error('Genre not Found');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail', { title: "Genre Details", genre: results.genre, albums: results.albums });
    });
};

exports.genre_create_get = (req, res, next) => {
    res.render('create_genre', { title: "Create Genre" })
}

exports.genre_create_post = [
    body("name")
    .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre({ name: req.body.name });

        if (!errors.isEmpty()) {
            res.render('create_genre', {
                title: "ERROR. Try again",
                author: req.body,
                errors: errors.array(),
            })
            return;
        } else {
            Genre.findOne({ name: req.body.name }).exec(function(err, genre_found) {
                if (err) {
                    return next(err)
                }

                if (genre_found) {
                    res.redirect(genre_found.url);
                } else {
                    genre.save((err) => {
                        if (err) {
                            return next(err);
                        }
                        res.redirect(genre.url);
                    })
                }
            })
        }
    }
];

exports.genre_update_get = (req, res, next) => {
    Genre.findById(req.params.id, (err, results) => {
        if (err) { return next(err) }

        res.render('genre_update', { title: results.name, genre: results })
    })
}

exports.genre_update_post = [
    body("name")
    .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('genre_update', {
                title: "Try Again. Something bad you did.",
                genre: errors.array(),
            })
            return;
        } else {
            const genre = new Genre({ _id: req.params.id, name: req.body.name })
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function update(err, result) {
                if (err) { return next(err) }
                res.redirect(result.url);
            })
        }
    }
];

exports.genre_delete_get = (req, res, next) => {
    Genre.findById(req.params.id, (err, result) => {
        if (err) { return next(err) }
        res.render('genre_delete', { title: "Delete Genre", genre: result })
    })
}

exports.genre_delete_post = (req, res, next) => {

    const Adminpassword = "jossify123";
    if (req.body.password !== Adminpassword) {
        Genre.findById(req.params.id, (err, result) => {
            if (err) { return next(err); }
            res.render('genre_delete', { title: "Delete Genre", genre: result });
        })
    } else {
        Genre.findByIdAndRemove(req.params.id, function deleteGenre(err) {
            if (err) { return next(err) }
            res.redirect('/music/genre')
        })
    }
}