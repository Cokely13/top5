const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/consensuses', require('./consensuses'))
router.use('/groupMembers', require('./groupMembers'))
router.use('/groupQuestions', require('./groupQuestions'))
router.use('/questions', require('./questions'))
router.use('/groups', require('./groups'))
router.use('/invites', require('./invites'))
router.use('/userResponses', require('./userResponses'))
router.use('/messages', require('./messages'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
