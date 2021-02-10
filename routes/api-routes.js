const db = require("../models");

module.exports = app => {
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

    app.post("/api/workouts", (req, res) => {
        db.Workout.create(req.body, (err, data) => {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            };
        });
    });

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