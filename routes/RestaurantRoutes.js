const express = require('express');
const router = express.Router();
const middleware = require('../middleware'); 
const {
  GetRestaurants,
  GetRestaurantById,
  CreateRestaurant,
  UpdateRestaurant,
  DeleteRestaurant,
  UpdateRating,
  AddComment,
  EditComment,
  DeleteComment,
} = require('../controllers/RestaurantsController');


router.get('/', middleware.stripToken, middleware.verifyToken, GetRestaurants);
router.get('/:id', middleware.stripToken, middleware.verifyToken, GetRestaurantById);
router.post('/', middleware.stripToken, middleware.verifyToken, CreateRestaurant);
router.put('/:id', middleware.stripToken, middleware.verifyToken, UpdateRestaurant);
router.delete('/:id', middleware.stripToken, middleware.verifyToken, DeleteRestaurant);


router.put('/:id/rating', middleware.stripToken, middleware.verifyToken, UpdateRating);

router.post('/:id/comments', middleware.stripToken, middleware.verifyToken, AddComment);
router.put('/:id/comments/:commentId', middleware.stripToken, middleware.verifyToken, EditComment);
router.delete('/:id/comments/:commentId', middleware.stripToken, middleware.verifyToken, DeleteComment);

module.exports = router;
