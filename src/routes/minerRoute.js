const express = require('express');

const { minerController } = require('../controllers');
const { minerValidator } = require('../validators');

const router = express.Router();

router.post('/miner',  
minerValidator.miner, minerController.miner);

module.exports = router;