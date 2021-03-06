const db = require("../models");
const moment = require("moment");
const betterOptions = require("../models/BetterOptions");

const viceController = {
  getVicesForUser: (request, response) => {
    console.log("viceController.getVicesForUser ", request.params.email);
    db.Vice.find({ email: request.params.email })
      .sort({ name: 1 })
      .then(result => {
        console.log(`Found ${result.length} vices`);
        response.json(result);
      })
      .catch(err => {
        console.log(err);
        response.send(err);
      });
  },

  createVice: (request, response) => {
    console.log("viceController.createVice ", request.body);
    // Check if vice exists. If it does, don't panic, just return object without creating
    db.Vice.findOne({ email: request.body.email, name: request.body.name })
      .then(result => {
        if (result && result.email) {
          console.log("Found existing vice: ", result);
          response.sendStatus(409);
        } else {
          db.Vice.create(request.body)
            .then(result => {
              console.log("Created new vice: ", result);
              response.sendStatus(201);
            })
            .catch(err => {
              console.log(err);
              response.sendStatus(500);
            });
        }
      })
      .catch(err => {
        console.log(err);
        response.send(err);
      });
  },

  updateVice: (request, response) => {
    console.log("viceController.updateVice ", request.body);
    db.Vice.findOneAndUpdate({ _id: request.body._id }, request.body, {
      useFindAndModify: false
    })
      .then(result => {
        console.log("Updated vice: ", result);
        response.sendStatus(200);
      })
      .catch(err => {
        console.log(err);
        response.sendStatus(500);
      });
  },

  deleteVice: (request, response) => {
    console.log("viceController.deleteVice ", request.params);
    db.Vice.findOneAndDelete({
      _id: request.params.id
    })
      .then(result => {
        console.log("Deleted vice: ", result);
        response.sendStatus(200);
      })
      .catch(err => {
        console.log(err);
        response.sendStatus(500);
      });
  },

  createViceEvent: (request, response) => {
    console.log("viceController.createViceEvent ");

    let today = moment();
    let thisMonth = today.format("YYYY-MM");
    let thisWeek = today.weekday(0).format("YYYY-MM-DD");

    db.Vice.findOne({ _id: request.body._id })
      .then(vice => {
        let monthCount = vice.monthly.find(
          monthEntry => thisMonth == monthEntry.month
        );
        if (monthCount) {
          monthCount.count++;
        } else {
          monthCount = { month: thisMonth, count: 1 };
          vice.monthly.push(monthCount);
        }

        let weekCount = vice.weekly.find(
          weekEntry => thisWeek == weekEntry.week
        );
        if (weekCount) {
          weekCount.count++;
        } else {
          weekCount = { week: thisWeek, count: 1 };
          vice.weekly.push(weekCount);
        }

        // Save document back to database. Easy, huh?
        db.Vice.findOneAndUpdate({ _id: request.body._id }, vice, {
          useFindAndModify: false
        })
          .then(result => {
            console.log("Create vice event", vice.name, "for", vice.email);
            response.sendStatus(200);
          })
          .catch(err => {
            console.log(err);
            response.sendStatus(500);
          });
      })
      .catch(err => {
        console.log(err);
        response.sendStatus(500);
      });
  },

  getBetterOptions: (request, response) => {
    console.log("getBetterOptions Called");
    response.json(betterOptions);
  }
};

module.exports = viceController;
