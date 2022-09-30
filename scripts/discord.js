const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const scopes = ['identify', 'email', 'guilds.join'];
const discordUser = require("../scripts/database/schemas/discordSchema");

/*
passport.serializeUser(function(user, done) {
  console.log('serialize user');
  console.log(user);
  done(null, user);
});

passport.deserializeUser(async function(id, done) {
  console.log('deserialize user');
  try {
    const user = await discordUser.findById(id);
    console.log(user);
    if (!user) {
      throw new Error('User not found');
    }
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

 */
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    console.log('serialize User');
    return cb(null, {id: user.id, username: user.username});
  });
});

passport.deserializeUser(function (user, cb) {
  console.log('Deserialize User');
  process.nextTick(function () {
    return cb(null, user);
  });
});


passport.use(
  new DiscordStrategy(
    {
      clientID: 'id',
      clientSecret: 'secret',
      callbackURL: 'http://localhost:3000/login/redirect',
      scope: scopes
    }, (
      async (accessToken, refreshToken, profile, done) => {
        //console.log(accessToken, refreshToken, profile);
        try {
          const discordUserData = await discordUser.findOne({discordId: profile.id});
          if (discordUserData) {
            console.log('Found user');
            return done(null, discordUserData);
          } else {
            console.log('No user found');
            const newUser = await discordUser.create({
              discordId: profile.id,
              username: profile.username,
            });
            console.log('New user created!');
            return done(null, newUser);
          }
        } catch (err) {
          console.log('There was an error!');
          return done(err, null);
        }
      }

    )
  ));
