const express = require('express');
const router = express.Router();
const {
    getEntity,
    postEntity
} = require('../controllers/entity.controllers')

// Route for getting car details
router.get("/entities", getEntity);

// Route for posting car details
router.post("/entities", postEntity);

module.exports = router;