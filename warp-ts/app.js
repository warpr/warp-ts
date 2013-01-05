var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var debug = false;
var Exercise = (function () {
    function Exercise(displayName, identifier, duration) {
        this.displayName = displayName;
        this.identifier = identifier;
        this.duration = duration;
    }
    Exercise.prototype.renderTo = function (element) {
        if(element) {
            element.innerText = this.displayName;
        }
    };
    Exercise.prototype.isBreak = function () {
        return false;
    };
    return Exercise;
})();
var BreakExercise = (function (_super) {
    __extends(BreakExercise, _super);
    function BreakExercise() {
        _super.call(this, "break", "break", 15);
    }
    BreakExercise.prototype.isBreak = function () {
        return true;
    };
    return BreakExercise;
})(Exercise);
var NullExercise = (function (_super) {
    __extends(NullExercise, _super);
    function NullExercise() {
        _super.call(this, "", "NULL", 0);
    }
    NullExercise.prototype.isBreak = function () {
        return true;
    };
    return NullExercise;
})(Exercise);
var PlayList = (function () {
    function PlayList() {
        this.steps = {
            previous: new NullExercise(),
            current: new NullExercise(),
            next: new NullExercise(),
            future: new NullExercise()
        };
    }
    PlayList.prototype.enqueue = function (exercise) {
        this.steps.previous = this.steps.current;
        this.steps.current = this.steps.next;
        this.steps.next = this.steps.future;
        this.steps.future = exercise;
    };
    PlayList.prototype.updateDisplay = function () {
        for(var step in this.steps) {
            this.steps[step].renderTo(document.getElementById(step));
        }
    };
    return PlayList;
})();
var Session = (function () {
    function Session(database) {
        var _this = this;
        this.database = database;
        this.position = 0;
        this.timerToken = setInterval(function () {
            return _this.mainLoop();
        }, debug ? 100 : 1000);
        this.playlist = new PlayList();
        this.exerciseTimer = 0;
        this.randomizeDatabase();
    }
    Session.prototype.randomizeDatabase = function () {
        this.database.sort(function () {
            return 0.5 - Math.random();
        });
    };
    Session.prototype.nextStep = function () {
        if(this.playlist.steps.future.isBreak()) {
            this.playlist.enqueue(this.database[this.position]);
        } else {
            this.playlist.enqueue(new BreakExercise());
        }
        this.playlist.updateDisplay();
        this.position++;
        if(this.position >= this.database.length) {
            this.position = 0;
            this.randomizeDatabase();
        }
        return this.playlist.steps.current;
    };
    Session.prototype.mainLoop = function () {
        if(this.exerciseTimer < 0.5) {
            var ex = this.nextStep();
            this.exerciseTimer = ex.duration;
        }
        this.exerciseTimer--;
        document.getElementById('exercise-remaining').innerText = this.exerciseTimer.toString();
    };
    return Session;
})();
var database = {
    "lunge-forward": "Forward Lunge",
    "lunge-reverse": "Reverse Lunge",
    "lunge-side": "Side Lunge",
    "squat": "Squat",
    "squat-wall": "Wall Squat",
    "squat-kettlebell": "Kettlebell Squat",
    "kettlebell-swing": "Kettlebell Swing",
    "kettlebell-press": "Kettlebell Press",
    "pushup-wall-press": "Wall Press",
    "pushup": "Push-Up",
    "situp": "Sit-Up",
    "plank": "Plank",
    "bent-over-row": "Bent over Row",
    "burpee": "Burpee",
    "plank-row": "Plank Row",
    "plank-row-to-burpee": "Plank Row to Burpee"
};
window.onload = function () {
    var new_database = [];
    var key;
    for(key in database) {
        new_database.push(new Exercise(database[key], key, 30));
    }
    var session = new Session(new_database);
};
//@ sourceMappingURL=app.js.map
