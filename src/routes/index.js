const { Router } = require('express');
const router = Router();

router.use(require('./authRoute'));

module.exports = router;
