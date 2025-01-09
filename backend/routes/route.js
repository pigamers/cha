const express = require('express');
const router = express.Router();
const {
    getEntity,
    postEntity,
    getParent
} = require('../controllers/entity.controllers')

// Route for getting entity details
router.get("/entities", getEntity);

// Route for getting parent entity details
router.get("/parent", getParent);

// Route for posting entity details
router.post("/entities", postEntity);

module.exports = router;