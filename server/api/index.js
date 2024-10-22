const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/questions', require('./questions'))
router.use('/guesses', require('./guesses'))
router.use('/answers', require('./answers'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
