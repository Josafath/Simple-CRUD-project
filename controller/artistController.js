const Album = require('../models/album');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const Song = require('../models/song');

const async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = (req, res) => {
    async.parallel({
            albums_count: (callback) => {
                Album.countDocuments({}, callback);
            },
            artists_count: (callback) => {
                Artist.countDocuments({}, callback);
            },
            songs_count: (callback) => {
                Song.countDocuments({}, callback);
            },
            genres_count: (callback) => {
                Genre.countDocuments({}, callback);
            }
        },
        function(err, results) {
            res.render('index', { title: "Jossify", error: err, data: results })
        });
};


exports.artist_list = (req, res, next) => {
    Artist.find({}, (err, artist_list) => {
        if (err) { return next(err) }
        res.render('artist_list', { title: "Artists", artists: artist_list });
    });
};

exports.artist_create_get = (req, res, next) => {
    res.render('create_artist', { title: "Create Artist" });
}

exports.artist_create_post = [
    body("name")
    .isLength({ min: 1 })
    .withMessage("Name must be specified")
    .isAlphanumeric('en-US', { ignore: ' ' }),

    body("birth_date", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

    body("death_date", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),


    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('create_artist', {
                title: "Error. Try again",
                errors: errors.array(),
            });
            return;
        }
        let url_image = 'https://64.media.tumblr.com/7bbf1c87a0d03a8f013e0acd89181513/tumblr_inline_p7269w7g3E1qjo9sc_500.png'
        if (req.body.imagen_url != "") {
            url_image = req.body.imagen_url
        }
        const artist_details = {
            name: req.body.name,
            img_url: url_image,
        }
        if (req.body.birth_date != false) artist_details.date_of_birth = req.body.birth_date
        if (req.body.death_date != false) artist_details.date_of_death = req.body.death_date

        console.log(artist_details);

        const artist = new Artist(artist_details);
        artist.save((err) => {
            if (err) { return next(err) }
            res.redirect(artist.url);
        })
    }
];

exports.artist_details = (req, res, next) => {
    async.parallel({
        artist_results: function(callback) {
            Artist.findById(req.params.id)
                .exec(callback);
        },
        albums: function(callback) {
            Album.find({ 'artist': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err) }
        if (results.artist_results == null) {
            let err = new Error('Artist not Found')
            err.status = 404;
            return next(err);
        }
        res.render('artist_detail', { title: "Details of Artist", artist: results.artist_results, albums: results.albums })
    })
}

exports.artist_update_get = (req, res, next) => {
    Artist.findById(req.params.id, (err, result) => {
        if (err) { return next(err); }
        res.render('artist_update', { title: result.name, artist: result })
    })
}

exports.artist_update_post = [
    body("name")
    .isLength({ min: 1 })
    .withMessage("Name must be specified")
    .isAlphanumeric('en-US', { ignore: ' ' }),

    body("birth_date", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

    body("death_date", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('artist_update', {
                title: "Try Again. Something bad you did.",
                song: errors.array(),
            })
            return;
        } else {
            const artist = new Artist({
                _id: req.params.id,
                name: req.body.name,
                img_url: req.body.imagen_url,
                date_of_birth: req.body.birth_date,
                date_of_death: req.body.death_date,
            })
            Artist.findByIdAndUpdate(req.params.id, artist, {}, function update(err, result) {
                if (err) { return next(err) }
                res.redirect(result.url);
            })
        }
    }
];

exports.artist_delete_get = (req, res, next) => {
    Artist.findById(req.params.id, (err, result) => {
        if (err) { return next(err); }
        res.render('artist_delete', { title: "Delete Artist", artist: result })
    });
}

exports.artist_delete_post = (req, res, next) => {
    const Adminpassword = "jossify123";
    if (req.body.password !== Adminpassword) {
        Artist.findById(req.params.id, (err, result) => {
            if (err) { return next(err); }
            res.render('artist_delete', { title: "Delete Artist", artist: result });
        })
    } else {
        Artist.findByIdAndRemove(req.params.id, function deleteArtist(err) {
            if (err) { return next(err) }
            res.redirect('/music/artist')
        })
    }
}