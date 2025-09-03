const db = require('./db');

const getReviews = async (req, res) => {
  if (!req.query.product_id) {
    res.sendStatus(400);
    return;
  }
  try {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const sort = req.query.sort || '';
    const product_id = req.query.product_id;

    let query = 'SELECT id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews WHERE product_id=? AND reported="false"';
    if (sort === 'relevant' || sort === '') {
      query += ' ORDER BY helpfulness DESC, date DESC';
    } else if (sort === 'helpful') {
      query += ' ORDER BY helpfulness DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY date DESC';
    }
    query += ' LIMIT ? OFFSET ?';
    const result = await db.query(query, [product_id, parseInt(count), (page - 1) * count]);

    // Adding the review photos for each review in the selection
    for (var i = 0; i < result[0].length; i++) {
      let review = result[0][i];
      const query = 'SELECT url FROM reviews_photos WHERE review_id=?'
      const photos = await db.query(query, [review.review_id]) || [];
      review.photos = photos[0];
    }

    const formattedResult = result[0].map(review => ({
      ...review,
      date: new Date(review.date).toISOString(),
      response: review.response === '' ? null : review.response,
      recommend: review.recommend === "true" ? true : false
    }));

    res.send({
      product: product_id,
      page: page,
      count: count,
      results: formattedResult,
    });
  } catch (err) {
      console.error('Error loading reviews:', err);
  }
};

const getReviewsMeta = async (req, res) => {
  if (!req.query.product_id) {
    res.sendStatus(400);
    return;
  }
  try {
    const product_id = req.query.product_id;

    // Fetching from the database
    let recommendQuery = 'SELECT recommend, id FROM reviews WHERE product_id=? AND recommend="false" AND reported="false"';
    const recommendResults = await db.query(recommendQuery, [product_id]);

    let ratingsQuery = 'SELECT rating, recommend FROM reviews WHERE product_id=? AND reported="false"';
    const ratingsResults = await db.query(ratingsQuery, [product_id]);

    let charQuery = 'SELECT name, id FROM characteristics WHERE product_id=?';
    const charResults = await db.query(charQuery, [product_id]);

    // Taking what we need from each query result
    let characteristics = {};
    for (const char of charResults[0]) {
      characteristics[char.id] = {
        name: char.name,
        value: 0
      };
    }

    let charReviews = {};
    for (const review of recommendResults[0]) {
      let charReviewsQuery = 'SELECT value, characteristic_id FROM characteristic_reviews WHERE review_id=?';
      const charReviewsResults = await db.query(charReviewsQuery, [review.id]);
      for (const charReview of charReviewsResults[0]) {
        if (!charReviews[charReview.characteristic_id]) {
          charReviews[charReview.characteristic_id] = {
            total: 1,
            value: charReview.value
          }
        }
        else {
          charReviews[charReview.characteristic_id].total += 1;
          charReviews[charReview.characteristic_id].value += charReview.value;
        }
      }
    }

    // Formatting data
    let formattedChars = {};
    for (const key of Object.keys(charReviews)) {
      formattedChars[characteristics[key].name] = {
        id: parseInt(key),
        value: (charReviews[key].value / charReviews[key].total).toString()
      }
    }

    let ratings = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    for (const review of ratingsResults[0]) {
      if (review.rating < 5) {
        ratings[review.rating] += 1;
      }
    }

    Object.keys(ratings).forEach(key => {
      ratings[key] = String(ratings[key]);
    });

    res.send({
      product_id: product_id.toString(),
      ratings: ratings,
      recommend: {
        true: (ratingsResults[0].length - recommendResults[0].length).toString(),
        false: recommendResults[0].length.toString()
      },
      characteristics: formattedChars
    });
  } catch (err) {
      console.error('Error loading reviews:', err);
  }
};

const postReviews = async (req, res) => {
  try {
    const {product_id, rating, summary, body, recommend, name, email, photos, characteristics} = req.body;

    let query = 'INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await db.query(query, [product_id, rating, summary, body, recommend, name, email]);
    const post = await db.query(`SELECT *
      FROM reviews
      ORDER BY id DESC
      LIMIT 1`);
    for (const [key, value] of Object.entries(characteristics)) {
      query = 'INSERT INTO characteristic_reviews (characteristic_id, review_id, value) VALUES (?, ?, ?)';
      await db.query(query, [key, post[0][0].id, value]);
    }
    for (const url of photos) {
      query = 'INSERT INTO photos (review_id, url) VALUES (?, ?)';
      await db.query(query, [post[0][0].id, url]);
    }
    res.sendStatus(201);
  } catch (err) {
    console.error('Error posting review:', err);
  }
};

const putReviewHelpfullness = async (req, res) => {
  try {
    let query = 'UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ?';
    await db.query(query, [req.query.review_id]);
    res.sendStatus(201);
  } catch (err) {
    console.error('Error updating helpfulness:', err);
    res.sendStatus(400);
  }
};

const putReviewReport = async (req, res) => {
  try {
    let query = 'UPDATE reviews SET reported = "true" WHERE id = ?';
    await db.query(query, [req.query.review_id]);
    res.sendStatus(201);
  } catch (err) {
    console.error('Error updating helpfulness:', err);
    res.sendStatus(400);
  }
};

module.exports = {
  getReviews,
  getReviewsMeta,
  postReviews,
  putReviewHelpfullness,
  putReviewReport
};