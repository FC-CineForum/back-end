const { Router } = require('express');
const router = Router();

router.use(require('./authRoute'));
router.use(require('./entryRoute'));
router.use(require('./userRoute'));

module.exports = router;
