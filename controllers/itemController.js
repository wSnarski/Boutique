module.exports = function(app, Items){
  /**
  * GET /api/items/count
  * Returns the total number of items.
  */
  app.get('/api/items/count', function(req, res, next) {
    Items.count({}, function(err, count) {
      if (err) return next(err);
      res.send({ count: count });
    });
  });

  /**
  * GET /api/items/search
  * Looks up a item by name. (case-insensitive)
  */
  app.get('/api/items/search', function(req, res, next) {
    var itemName = new RegExp(req.query.name, 'i');

    Items.findOne({ name: itemName }, function(err, item) {
      if (err) return next(err);

      if (!item) {
        return res.status(404).send({ message: 'Item not found.' });
      }

      res.send(item);
    });
  });

  app.get('/api/items/:id', function(req, res, next) {
    var id = req.params.id;

    Items.findOne({'_id':id }, function(err, item) {
      if (err) return next(err);

      if (!item) {
        return res.status(404).send({ message: 'Item not found.' });
      }

      res.send(item);
    });
  });
}
