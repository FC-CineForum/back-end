const { Router } = require('express');
const router = Router();

router.use(require('./authRoute'));
router.use(require('./entryRoute'));
router.use(require('./playlistRoute'));

module.exports = router;
