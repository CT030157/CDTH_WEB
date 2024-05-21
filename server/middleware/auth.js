const { User } = require('../models/User');

let auth = (req, res, next) => {
  let token;
  let tokenCookie = req.cookies.w_auth;

  if (tokenCookie) {
    token = tokenCookie
  } else {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
      token = ''
    } else {
      let parts = authHeader.split(' ');
  
      if (!parts.length === 2) {
        token = ''
      } else {
        let [ scheme, tokenBearer ] = parts;
    
        if (!/^Bearer$/i.test(scheme)) {
          token = ''
        } else {
          token = tokenBearer
        }
      }
    }
  }

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
