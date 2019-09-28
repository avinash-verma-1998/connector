const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
app.use('/post', postRoutes);

app.use((req, res) => {
  res.send('<h1>Page not found</h1> ');
});
const PORT = process.env.PORT || 5000;

mongoose
  .connect('mongodb://localhost:27017/app-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(res => {
    console.log('connected to database');
    app.listen(PORT, () => {
      console.log(`server is up and running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
