const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const adminUsers = require("../models").adminUsers;

const UserAuth = function (passport) {
  var opts = {};
  // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = CONFIG.jwt_encryption_admin;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {      
      adminUsers.findByPk(jwt_payload.id)
        .then(agent => {          
          if (!agent) {
            done("adminUser Not Found", false);
          }
          done(null, agent);
        });
    })
  );
};

module.exports.UserAuth = UserAuth;


