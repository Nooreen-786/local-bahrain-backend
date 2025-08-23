const express = require('express');
const router = express.Router();
const middleware = require('../middleware'); 
const {
  GetPlaces,
  GetPlaceById,
  CreatePlace,
  UpdatePlace,
  DeletePlace,
  UpdateRating,
  AddComment,
  EditComment,
  DeleteComment,
} = require('../controllers/PlacesController');

router.get('/', middleware.stripToken, middleware.verifyToken, GetPlaces);
router.get('/:id', middleware.stripToken, middleware.verifyToken, GetPlaceById);
router.post('/', middleware.stripToken, middleware.verifyToken, CreatePlace);
router.put('/:id', middleware.stripToken, middleware.verifyToken, UpdatePlace);
router.delete('/:id', middleware.stripToken, middleware.verifyToken, DeletePlace);

router.put('/:id/rating', middleware.stripToken, middleware.verifyToken, UpdateRating);

router.post('/:id/comments', middleware.stripToken, middleware.verifyToken, AddComment);
router.put('/:id/comments/:commentId', middleware.stripToken, middleware.verifyToken, EditComment);
router.delete('/:id/comments/:commentId', middleware.stripToken, middleware.verifyToken, DeleteComment);

module.exports = router;
