const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

const app = express();


const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use(express.json());


if (!process.env.MONGO_URI) {
  console.error(' MONGO_URI is not defined in .env file');
  process.exit(1);
}


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));


const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const restaurantRoutes = require('./routes/RestaurantRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/restaurants', restaurantRoutes);

app.get('/', (req, res) => {
  res.send('🌍 API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
