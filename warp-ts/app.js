var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Exercise = (function () {
    function Exercise(displayName, identifier, duration, requiredAttributes) {
        this.displayName = displayName;
        this.identifier = identifier;
        this.duration = duration;
        this.requiredAttributes = requiredAttributes;
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
        _super.call(this, "break", "break", 15, []);
    }
    BreakExercise.prototype.isBreak = function () {
        return true;
    };
    return BreakExercise;
})(Exercise);
var NullExercise = (function (_super) {
    __extends(NullExercise, _super);
    function NullExercise() {
        _super.call(this, "", "NULL", 0, []);
    }
    return NullExercise;
})(Exercise);
var PlayList = (function () {
    function PlayList() {
        this.previous = new NullExercise();
        this.current = new NullExercise();
        this.next = new NullExercise();
    }
    PlayList.prototype.enqueue = function (exercise) {
        this.previous = this.current;
        this.current = this.next;
        this.next = exercise;
    };
    PlayList.prototype.renderTo = function (previous, current, next) {
        this.previous.renderTo(previous);
        this.current.renderTo(current);
        this.next.renderTo(next);
    };
    return PlayList;
})();
var database = [
    new Exercise("Forward Lunge", "lunge-forward", 30, []), 
    new Exercise("Reverse Lunge", "lunge-reverse", 30, []), 
    new Exercise("Side Lunge (left)", "lunge-side-left", 30, []), 
    new Exercise("Side Lunge (right)", "lunge-side-right", 30, []), 
    new Exercise("Squat", "squat", 30, []), 
    new Exercise("Kettlebell Squat", "squat-kettlebell", 30, [
        "Kettlebell"
    ]), 
    new Exercise("Wall Press", "pushup-wall-press", 30, [])
];
var Session = (function () {
    function Session(database) {
        var _this = this;
        this.database = database;
        this.position = 0;
        this.previous = document.getElementById('previous');
        this.next = document.getElementById('next');
        this.current = document.getElementById('current');
        this.timerToken = setInterval(function () {
            return _this.mainLoop();
        }, 100);
        this.playlist = new PlayList();
        this.exerciseTimer = 0;
    }
    Session.prototype.nextStep = function () {
        if(this.playlist.next.isBreak()) {
            this.playlist.enqueue(database[this.position]);
        } else {
            this.playlist.enqueue(new BreakExercise());
        }
        this.playlist.renderTo(this.previous, this.current, this.next);
        this.position++;
        if(this.position >= database.length) {
            this.position = 0;
            this.database.sort(function () {
                return 0.5 - Math.random();
            });
        }
        return this.playlist.current;
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
window.onload = function () {
    var session = new Session(database);
};
//@ sourceMappingURL=app.js.map
