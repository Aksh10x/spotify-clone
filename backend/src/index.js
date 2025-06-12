import dotenv from "dotenv";
import dbConnect from "./db/dbConnect.js";
import { app } from "./app.js";
import { connectRedis } from "./utils/redisClient.js";

dotenv.config({
    path: "./.env",
})


const port = process.env.PORT || 4000

Promise.all([dbConnect(), connectRedis()])
    .then(() => {
        app.listen(port, () => {
            console.log("Listening on port ", port)
        })
    })
    .catch((error) => {
        console.log("Database or Redis connection error occurred", error)
        process.exit(1)
    })


//Passport jwt
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import {User} from "./models/user.model.js" // Adjust the import path based on your project structure

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_SECRET,
};

const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    // Use the field that matches your token's payload structure
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false); // No user found
    }
  } catch (err) {
    return done(err, false); // Handle errors
  }
});

passport.use(jwtStrategy);

export default passport;

