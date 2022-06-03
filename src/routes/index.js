const { Router } = require('express');
const router = Router();

router.use(require('./authRoute'));
router.use(require('./entryRoute'));
router.use(require('./userRoute'));
router.use(require('./celebrityRoute'));

module.exports = router;