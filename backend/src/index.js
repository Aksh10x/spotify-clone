import dotenv from "dotenv";
import dbConnect from "./db/dbConnect.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env",
})


const port = process.env.PORT

dbConnect().then(() => {
    app.listen(port, () => {
        console.log("Listening on port ",port)
    })
}).catch( (error) => {
    console.log("Database error occured", error)
}
)


//Passport jwt
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import {User} from "./models/user.model.js" // Adjust the import path based on your project structure

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PASSPORT_SECRET;

const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ id: jwt_payload.sub });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false); // Optionally, create a new account here
    }
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtStrategy);

export default passport;

