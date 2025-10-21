const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// Favorites routes
router.get('/', favoritesController.getAllFavorites);
router.post('/', favoritesController.addFavorite);
router.get('/stats', favoritesController.getFavoritesStats);
router.get('/:id', favoritesController.getFavoriteById);
router.put('/:id', favoritesController.updateFavorite);
router.delete('/:id', favoritesController.removeFavorite);
router.delete('/', favoritesController.clearAllFavorites);

module.exports = router;
