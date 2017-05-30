const router = require('express').Router();
const controller = require('./controller');

router.route('/')
  .get(controller.getAll)
  .post(controller.create);

router.route('/:id')
  .get(controller.getOne)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;