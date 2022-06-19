const { database } = require('../../database/config/index');

const addMovie = async (req, res) => {
  const {
    title, synopsis, image, release, classification, type, trailer,length,
  } = req.body;
  try {
    const exists = await database.query(
      'SELECT * FROM entry WHERE title = $1', [title]
    );
    if (exists.rowCount !== 0) {
      return res.status(409).json({
        message: 'Entry already exists',
      });
    }
    const movie = await database.query(
    `INSERT INTO entry (title, synopsis, image, release, classification, type)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_entry`,
      [title, synopsis, image, release, classification, type]
    );
    const id = movie.rows[0].id_entry;
    await database.query(
      `INSERT INTO movie (id_movie, trailer, length) VALUES ($1, $2, $3)`,
      [id, trailer, length]);
    return res.status(200).json({
      message: 'Movie added successfully',
      entryId: id,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });  
  }
};

const addSeries = async (req, res) => {
  const {
    title, synopsis, image, release, classification, type, 
    trailer,
  } = req.body;
  try {
    const exists = await database.query(
      'SELECT * FROM entry WHERE title = $1', [title]
    );
    if (exists.rowCount !== 0) {
      return res.status(409).json({
        message: 'Series is already in the database',
      });
    }
    const series = await database.query(
      `INSERT INTO entry (title, synopsis, image, release, classification, type)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_entry`,
      [title, synopsis, image, release, classification, type]
    );
    const id = series.rows[0].id_entry;
    await database.query(
    `INSERT INTO series (id_series, trailer) VALUES ($1, $2)`, [id, trailer]);
    return res.status(200).json({
      message: 'Series added successfully',
      entryId: id,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });  
  }
};

const addEpisode = async (req, res) => {
  const { 
    idSeries, title, synopsis, image, release, classification, type, season, 
    noEp, length } = req.body;
  try {
    const episode = await database.query(
      `INSERT INTO entry (title, synopsis, image, release, classification, type)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_entry`,
      [title, synopsis, image, release, classification, type]
    );
    const id = episode.rows[0].id_entry;
    await database.query(
      `INSERT INTO episode (id_episode, id_series, season, no_ep, length)
      VALUES ($1, $2, $3, $4, $5)`, [id, idSeries, season, noEp, length]);
    return res.status(200).json({
      message: 'Episode added successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error 
    });  
  }
};

getEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await database.query(
    `SELECT title, synopsis, image, release, classification, type
    FROM entry WHERE id_entry = $1`, [id]);
    if (entry.rowCount === 0) return res.status(404).json({message: 'Entry not found'});
    var entryInfo, response;
    switch (entry.rows[0].type) {
      case 'm':
        entryInfo = await database.query(
          'SELECT trailer, length FROM movie WHERE id_movie = $1', [id]);
        response = {
          movie: entryInfo.rows[0],
          entry: entry.rows[0],
        };
        break;
      case 's': 
        entryInfo = await database.query(
          'SELECT trailer FROM series WHERE id_series = $1', [id]);
        let noEpisodes = await database.query(
          'SELECT COUNT(*) FROM episode WHERE id_series = $1', [id]);
        response = {
          series: entryInfo.rows[0],
          entry: entry.rows[0],
          noEpisodes: noEpisodes.rows[0].count,
        };
        break;
      case 'e':
        entryInfo = await database.query(
          'SELECT * FROM episode WHERE id_episode = $1', [id]);
        break;
      default:
        return res.status(404).json({ message: 'Info missing or wrong' });
    }
    const rating = await database.query(
      'SELECT AVG(stars) FROM rating WHERE id_entry = $1', [id]);
      let ratings = [];  
    let comments = await database.query(
      'SELECT * FROM rating WHERE id_entry = $1', [id]);
    for (let i=0; i < comments.rowCount; i++) {
      let reply = await database.query(
        'SELECT username, message FROM reply WHERE id_rating = $1', 
        [comments.rows[i].id_rating]);
        console.log(comments.rows[i].id_rating);
      ratings.push({
        ratingId: comments.rows[i].id_rating,
        username: comments.rows[i].username,
        stars: comments.rows[i].stars,
        message: comments.rows[i].message,
        replies: reply.rows,
      });
    }
    let castRole = await database.query(
      'SELECT id_celebrity, role FROM roles WHERE id_entry = $1', [id]);
      let cast = [];
    for (let i=0; i < castRole.rowCount; i++) {
      let celebrity = await database.query(
        'SELECT * FROM celebrity WHERE id_celebrity = $1', 
        [castRole.rows[i].id_celebrity]);
      cast.push({
        name: celebrity.rows[0].name,
        role: castRole.rows[i].role,
        picture: celebrity.rows[0].picture,
      });
    }    
  response.rating = rating.rows[0].avg === null ? '0' : rating.rows[0].avg.substring(0, 4),
  response.ratings = ratings;
  response.cast = cast;
  return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

getLatest = async (_, res) => {
  try {
    const latest = await database.query(`SELECT * FROM last_inserted_entry`);
    var dashboard = [];
    for (let i = 0; i < latest.rowCount; i++) {
      var entry;
      if(latest.rows[i].type === 'm') {
        entry = await database.query(
          'SELECT * FROM entry WHERE id_entry = $1', [latest.rows[i].id_entry]);
        const movie = await database.query(
          'SELECT * FROM movie WHERE id_movie = $1', [latest.rows[i].id_entry]);
        const rating = await database.query(
          'SELECT AVG(stars) FROM rating WHERE id_entry = $1', 
          [latest.rows[i].id_entry]); 
        dashboard.push({
          id: entry.rows[0].id_entry,
          title: entry.rows[0].title,
          synopsis: entry.rows[0].synopsis,
          image: entry.rows[0].image,
          release: entry.rows[0].release,
          classification: entry.rows[0].classification,
          type: entry.rows[0].type,
          trailer: movie.rows[0].trailer,
          length: movie.rows[0].length,
          rating: rating.rows[0].avg === null ? '0' : rating.rows[0].avg.substring(0, 4),
        }); 
      } 
      if (latest.rows[i].type === 's') {
        entry = await database.query(
          'SELECT * FROM entry WHERE id_entry = $1', [latest.rows[i].id_entry]);
          const series = await database.query(
          'SELECT * FROM series WHERE id_series = $1', [latest.rows[i].id_entry]);
          const rating = await database.query(
            'SELECT AVG(stars) FROM rating WHERE id_entry = $1', 
            [latest.rows[i].id_entry]);   
            console.log(rating);  
        dashboard.push({
          id: entry.rows[0].id_entry,
          title: entry.rows[0].title,
          synopsis: entry.rows[0].synopsis,
          image: entry.rows[0].image,
          release: entry.rows[0].release,
          classification: entry.rows[0].classification,
          type: entry.rows[0].type,
          trailer: series.rows[0].trailer,
          rating: rating.rows[0].avg === null ? '0' : rating.rows[0].avg.substring(0, 4),
        });
      }
    }
    return res.status(200).json(dashboard);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

deleteEntry = async (req, res) => {
  const { id } = req.params;
  try {
    await database.query(
      'DELETE FROM entry WHERE id_entry = $1', [id]);
    return res.status(200).json({
      message: 'Entry deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

module.exports = {
  addMovie,
  addSeries,
  addEpisode,
  getEntry,
  getLatest,
  deleteEntry,
};