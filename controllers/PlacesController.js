const Place = require('../models/Place');


const GetPlaces = async (req, res) => {
  try {
    const places = await Place.find().populate('user', 'name email');
    res.status(200).json(places);
  } catch (error) {
    console.error('GetPlaces error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const GetPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('user', 'name email');
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(place);
  } catch (error) {
    console.error('GetPlaceById error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const CreatePlace = async (req, res) => {
  try {
    const { name, description, location, image, rating } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    const place = await Place.create({
      name,
      description,
      location,
      image,
      rating,
      user: req.user.id,
      comments: [],
    });

    res.status(201).json(place);
  } catch (error) {
    console.error('CreatePlace error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const UpdatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    if (place.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(place, req.body);
    const updatedPlace = await place.save();
    res.status(200).json(updatedPlace);
  } catch (error) {
    console.error('UpdatePlace error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const DeletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    if (place.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await place.deleteOne();
    res.status(200).json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('DeletePlace error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const UpdateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    place.rating = rating;
    await place.save();
    res.status(200).json({ message: 'Rating updated', rating });
  } catch (error) {
    console.error('UpdateRating error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const AddComment = async (req, res) => {
  try {
    const { text } = req.body;
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const comment = {
      user: req.user.id,
      text,
    };

    place.comments.push(comment);
    await place.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    console.error('AddComment error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const EditComment = async (req, res) => {
  try {
    const { text } = req.body;
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const comment = place.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = text;
    await place.save();
    res.status(200).json({ message: 'Comment updated', comment });
  } catch (error) {
    console.error('EditComment error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const DeleteComment = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const comment = place.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await place.save();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('DeleteComment error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  GetPlaces,
  GetPlaceById,
  CreatePlace,
  UpdatePlace,
  DeletePlace,
  UpdateRating,
  AddComment,
  EditComment,
  DeleteComment,
};
