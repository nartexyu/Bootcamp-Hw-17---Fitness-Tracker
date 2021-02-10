const db = require("../models");

module.exports = app => {
    // Get route to grab all documents in the workouts collection and add up each exercise's duration into a new field called 'totalDuration'
    app.get("/api/workouts", (req, res) => {
        db.Workout.aggregate([
            {
                $addFields: {
                    totalDuration: {
                        $sum: "$exercises.duration"
                    }
                }
            }
        ], (err, data) => {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            };
        });
    });

    // Post route to create a new document in the workouts collection
    app.post("/api/workouts", (req, res) => {
        db.Workout.create(req.body, (err, data) => {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            };
        });
    });

    // Put route to add exercises to an existing workout document
    app.put("/api/workouts/:id", (req, res) => {
        db.Workout.updateOne({
            _id: req.params.id
        }, 
        {
            $push: {
                exercises: req.body
            }
        }, (err, data) => {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            };
        });
    });

    // Get route to grab the 7 most recent workouts and add up the duration of all exercises inside each document into the 'totalDuration' field
    app.get("/api/workouts/range", (req, res) => {
        db.Workout.aggregate([
            {
                $sort: {
                    day: -1
                }
            },
            {
                $addFields: {
                    totalDuration: {
                        $sum: "$exercises.duration"
                    }
                }
            },
            {
                $limit: 7
            }
        ], (err, data) => {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            };
        });
    });
};