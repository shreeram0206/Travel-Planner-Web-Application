const GoogleStrategy = require('passport-google-oauth20').Strategy
const { mongo_bot, mongo_config } = require('./db')


module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        let newUser = {
            google_id: profile.id,
            display_name: profile.displayName,
            fname: profile.name.givenName,
            lname: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile._json.email,
            trips: []
        }

        try {
            let user = await mongo_bot.db.collection(mongo_config.user_collection).findOne({google_id: profile.id})
            if (user) {
                done(null, user)
            }
            else {
                let user = await mongo_bot.db.collection(mongo_config.user_collection).insertOne(newUser)
                done(null, user)
            }
        }
        catch {
            console.error(err)
        }
    }))

    passport.serializeUser((user, cb) => {
        process.nextTick(() => {
        //   return cb(null, {
        //     id: user.id,
        //     username: user.username,
        //     picture: user.picture
        //   });
        cb(null, user)
        });
    });
      
    passport.deserializeUser((user, cb) => {
        process.nextTick(() => {
          cb(null, user);
        });
    });
}