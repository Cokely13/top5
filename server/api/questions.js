

const router = require('express').Router();
const { models: { Question, Answer, Guess }} = require('../db');
const { S3Client } = require('@aws-sdk/client-s3'); // AWS SDK v3
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Configure multer-s3 to use the S3 client for storage
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
});

module.exports = router;

// GET: fetch all questions with related data
router.get('/', async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      include: [{
        model: Answer,
        as: 'answers'
         // Must match the alias defined in the association
      }, Guess]
    });
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

// POST: add a new Question with optional image uploads
router.post('/', upload.fields([{ name: 'imageA' }, { name: 'imageB' }]), async (req, res, next) => {
  try {
    // Handle image uploads
    const imageAUrl = req.files.imageA ? req.files.imageA[0].location : null;
    const imageBUrl = req.files.imageB ? req.files.imageB[0].location : null;

    // Create a new question with optional images
    const newQuestion = await Question.create({
      ...req.body,
      imageA: imageAUrl,
      imageB: imageBUrl,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    next(error);
  }
});

// PUT: update a Question with optional image uploads
router.put('/:id', upload.fields([{ name: 'imageA' }, { name: 'imageB' }]), async (req, res, next) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).send('Question not found');
    }

    // Handle image uploads
    const imageAUrl = req.files.imageA ? req.files.imageA[0].location : question.imageA;
    const imageBUrl = req.files.imageB ? req.files.imageB[0].location : question.imageB;

    // Update question with new data and optional images
    await question.update({
      ...req.body,
      imageA: imageAUrl,
      imageB: imageBUrl,
    });

    res.json(question);
  } catch (error) {
    next(error);
  }
});

// GET: fetch a single question by ID
router.get('/:id', async (req, res, next) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [{
        model: Answer,
        as: 'answers' // Must match the alias defined in the association
      }, Guess]
    });
    res.json(question);
  } catch (err) {
    next(err);
  }
});

// DELETE: delete a Question
router.delete('/:id', async (req, res, next) => {
  try {
    const question = await Question.findByPk(req.params.id);
    await question.destroy();
    res.send(question);
  } catch (error) {
    next(error);
  }
});
