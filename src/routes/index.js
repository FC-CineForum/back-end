const { Router } = require('express');
const router = Router();

router.use(require('./authRoute'));
router.use(require('./entryRoute'));
router.use(require('./userRoute'));
router.use(require('./celebrityRoute'));
router.use(require('./playlistRoute'));
router.use(require('./minerRoute'));

module.exports = router;