const controllers = require('./controllers.js');
const router = require('express').Router();

router.get('/reviews', controllers.getReviews);
router.get('/reviews/meta', controllers.getReviewsMeta);
router.post('/reviews', controllers.postReviews);
router.put('/reviews/:review_id/helpful', controllers.putReviewHelpfullness);
router.put('/reviews/:review_id/report', controllers.putReviewReport);

module.exports = router;