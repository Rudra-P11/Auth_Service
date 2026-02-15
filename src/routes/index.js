const express = require('express');

const v1ApiRoputes = require('./v1/index')

const router = express.Router();


router.use('/v1', v1ApiRoputes);

module.exports = router;