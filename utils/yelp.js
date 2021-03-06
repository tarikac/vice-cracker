require("dotenv").config();
const twilio = require("./twilio");
const unirest = require("unirest");
const { storeStatusUpdate } = require("./status");

const YELP_API_KEY = process.env.YELP_API_KEY;
const YELP_GYM = "gym";
const YELP_HEALTH_FOOD_STORE = "health food store";

function sendGym(vice, user) {
  sendYelp(vice, user, YELP_GYM, "Try this local gym for a good workout: ");
}

function sendHealthFoodStore(vice, user) {
  sendYelp(
    vice,
    user,
    YELP_HEALTH_FOOD_STORE,
    "Try this local health food store for healthy shopping: "
  );
}

function sendYelp(vice, user, type, blurb) {
  console.log("Sending yelp to email: ", user.email);
  const location = `${user.address}, ${user.city}, ${user.state}`;
  const url = "https://api.yelp.com/v3/businesses/search";

  let req = unirest("GET", url);
  req.query({
    term: type,
    location
  });

  req.headers({
    Authorization: "Bearer " + YELP_API_KEY
  });

  req.end(function(response) {
    if (response.error) {
      console.log(response.error);
    } else {
      let sorted = response.body.businesses.sort(
        (a, b) => a.distance - b.distance
      );
      const randomItem = sorted[Math.floor(Math.random() * sorted.length)];
      let message =
        "The Vice Cracker says you've exceeded your " +
        vice.name +
        " consumption for the week. " +
        blurb;
      let textMessage = message + randomItem.name + " (" + randomItem.url + ")";
      twilio.sendTextMessage(textMessage, user.phone);
      storeStatusUpdate(message, randomItem.name, randomItem.url, user);
    }
  });
}

module.exports = { sendGym, sendHealthFoodStore };
