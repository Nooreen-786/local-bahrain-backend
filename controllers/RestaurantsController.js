const Restaurant = require('../models/Restaurant');


const GetRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('user', 'name email');
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('GetRestaurants error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const GetRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('user', 'name email');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(restaurant);
  } catch (error) {
    console.error('GetRestaurantById error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const CreateRestaurant = async (req, res) => {
  try {
    const { name, description, location, image, rating } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      location,
      image,
      rating,
      user: req.user.id,
      comments: [],
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('CreateRestaurant error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const UpdateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    if (restaurant.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(restaurant, req.body);
    const updatedRestaurant = await restaurant.save();
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error('UpdateRestaurant error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const DeleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    if (restaurant.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await restaurant.deleteOne();
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('DeleteRestaurant error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const UpdateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    restaurant.rating = rating;
    await restaurant.save();
    res.status(200).json({ message: 'Rating updated', rating });
  } catch (error) {
    console.error('UpdateRating error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const AddComment = async (req, res) => {
  try {
    const { text } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const comment = {
      user: req.user.id,
      text,
    };

    restaurant.comments.push(comment);
    await restaurant.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    console.error('AddComment error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const EditComment = async (req, res) => {
  try {
    const { text } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const comment = restaurant.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = text;
    await restaurant.save();
    res.status(200).json({ message: 'Comment updated', comment });
  } catch (error) {
    console.error('EditComment error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const DeleteComment = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const comment = restaurant.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await restaurant.save();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('DeleteComment error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  GetRestaurants,
  GetRestaurantById,
  CreateRestaurant,
  UpdateRestaurant,
  DeleteRestaurant,
  UpdateRating,
  AddComment,
  EditComment,
  DeleteComment,
};
