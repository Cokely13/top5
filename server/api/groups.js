const router = require('express').Router();
const { models: { Group, GroupMember, User }} = require('../db');
const { S3Client } = require('@aws-sdk/client-s3'); // AWS SDK v3
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();
module.exports = router;

// Instantiate S3Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer to use S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

router.get('/', async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: GroupMember,
          include: [{ model: User, attributes: ['id', 'username'] }], // Include the User details
        },
      ],
    });
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    // If an image is uploaded, set its URL in the group data
    if (req.file) {
      req.body.image = req.file.location; // URL of the uploaded image in S3
    }

    const newGroup = await Group.create(req.body);
    res.status(201).json(newGroup); // Send the created group back to the client
  } catch (error) {
    next(error);
  }
});

router.put('/:id', upload.single('image'), async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);

    // If an image is uploaded, update the image path
    if (req.file) {
      req.body.image = req.file.location; // URL of the uploaded file in S3
    }

    const updatedGroup = await group.update(req.body);
    res.json(updatedGroup);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        {
          model: GroupMember,
          include: [{ model: User, attributes: ['id', 'username'] }], // Include the User details
        },
      ],
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);
    await group.destroy();
    res.send(group);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
