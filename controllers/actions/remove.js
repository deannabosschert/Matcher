const User = require("../models/user.js");

module.exports = function removeProfile(req, res) { // look up profile in MongoDB-db by id and delete entry
    User.findOne({
      _id: req.session.sessionID
    }, (err, user) => {
      if (err) {
        console.log('MongoDB removeprofile Error:' + err)
      }
      if (user) {
        if (req.body.removePassword == user.password) {
            User.deleteOne({
            '_id': req.session.sessionID
          })

          req.session.destroy((err) => {
            if (err) {
              console.log('Err deleting user:' + err)
            }
  
            res.clearCookie(sessionID)
            res.redirect('/login')
          })
        } else {
          res.render("register", {
            data: 'Password incorrect.'
          })
        }
  
      } else {
        res.redirect('/')
      }
    })
  }