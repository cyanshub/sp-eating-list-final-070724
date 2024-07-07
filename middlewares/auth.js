const { ensureAuthenticated } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // 確保使用者經過登入驗證
  if (ensureAuthenticated(req)) {
    return next()
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated
}
