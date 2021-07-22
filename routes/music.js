var express = require('express');
var router = express.Router();

const artistController = require('../controller/artistController');
const genreController = require('../controller/genreController');
const albumController = require('../controller/albumController');
const songController = require('../controller/songController');

router.get('/', artistController.index);

router.get('/artist', artistController.artist_list);

router.get('/artist/create', artistController.artist_create_get)

router.post('/artist/create', artistController.artist_create_post)

router.get('/artist/:id', artistController.artist_details);

router.get('/artist/:id/update', artistController.artist_update_get);

router.post('/artist/:id/update', artistController.artist_update_post);

router.get('/artist/:id/delete', artistController.artist_delete_get);

router.post('/artist/:id/delete', artistController.artist_delete_post);


// ** ROUTERS for SONGS ** 
router.get('/song', songController.song_list);

router.get('/song/create', songController.song_create_get);

router.post('/song/create', songController.song_create_post);

router.get('/song/:id', songController.song_details);

router.get('/song/:id/update', songController.song_update_get);

router.post('/song/:id/update', songController.song_update_post);

router.get('/song/:id/delete', songController.song_delete_get);

router.post('/song/:id/delete', songController.song_delete_post);



// ** ROUTES for ALBUM **
router.get('/album', albumController.album_list);

router.get('/album/create', albumController.album_create_get);

router.post('/album/create', albumController.album_create_post);

router.get('/album/:id', albumController.album_details);

router.get('/album/:id/update', albumController.album_update_get);

router.post('/album/:id/update', albumController.album_update_post);

router.get('/album/:id/delete', albumController.album_delete_get);

router.post('/album/:id/delete', albumController.album_delete_post);


// ** ROUTES for GENRE
router.get('/genre', genreController.genre_list)

router.get('/genre/create', genreController.genre_create_get);

router.post('/genre/create', genreController.genre_create_post);

router.get('/genre/:id', genreController.genre_details);

router.get('/genre/:id/update', genreController.genre_update_get);

router.post('/genre/:id/update', genreController.genre_update_post);

router.get('/genre/:id/delete', genreController.genre_delete_get);

router.post('/genre/:id/delete', genreController.genre_delete_post);

module.exports = router;