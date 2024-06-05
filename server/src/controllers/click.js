// import ClickVolume from '../models/clickVolume';

/**
 * Fetch 24h Surf Volume
 */
export const fetchClickVolume = (req, res, next) => {
  ClickVolume.estimatedDocumentCount({}, (err, count) => {
    if (err) { return next(err); }
    console.log(count); // this will print the count to console
    res.json(count);
  });
};

/**
 * Fetch 24h Surf Volume
 */
export const clickComplete = (req, res, next) => {
  const entry = new ClickVolume({
  	time: Math.floor(Date.now() / 1000),
  });
  entry.save((err, savedSurf) => {
  	if (err) { return next(err); }
    res.status(201).send({ data: savedSurf });
  });
};
