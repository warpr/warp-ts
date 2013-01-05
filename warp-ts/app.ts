
var debug = false;

class Exercise {
    constructor(public displayName: string, public identifier: string,
        public duration: number) {}

    renderTo(element: HTMLElement) {
        if (element)
        {
            element.innerText = this.displayName;
        }
    }

    isBreak() { return false; }
}

class BreakExercise extends Exercise {
    constructor() {
        super("break", "break", 15);
    }

    isBreak() { return true; }
}

class NullExercise extends Exercise {
    constructor() {
        super("", "NULL", 0);
    }

    isBreak() { return true; }
}

interface Steps {
    previous: Exercise;
    current: Exercise;
    next: Exercise;
    future: Exercise;
}

class PlayList {
    steps: Steps = {
        previous: new NullExercise(),
        current: new NullExercise(),
        next: new NullExercise(),
        future: new NullExercise()
    }
    
    enqueue(exercise: Exercise) {
        this.steps.previous = this.steps.current;
        this.steps.current = this.steps.next;
        this.steps.next = this.steps.future;
        this.steps.future = exercise;
    }

    updateDisplay() {
        for (var step in this.steps)
        {
            this.steps[step].renderTo(document.getElementById(step));
        }
    }
}

class Session {
    database: Exercise[];
    position: number;
    timerToken: number;
    playlist: PlayList;
    exerciseTimer: number;

    constructor(database: Exercise[]) {
        this.database = database;
        this.position = 0;

        this.timerToken = setInterval(() => this.mainLoop (), debug ? 100 : 1000);
        this.playlist = new PlayList();
        this.exerciseTimer = 0;
    }

    nextStep() {
        if (this.playlist.steps.future.isBreak())
        {
            this.playlist.enqueue(this.database[this.position]);
        }
        else
        {
            this.playlist.enqueue(new BreakExercise());
        }

        this.playlist.updateDisplay();
        this.position++;
        if (this.position >= this.database.length)
        {
            this.position = 0;
            this.database.sort(() => 0.5 - Math.random());
        }

        return this.playlist.steps.current;
    }

    mainLoop() {
        if (this.exerciseTimer < 0.5)
        {
            var ex = this.nextStep();
            this.exerciseTimer = ex.duration;
        }

        this.exerciseTimer--;
        document.getElementById('exercise-remaining').innerText = this.exerciseTimer.toString();
    }
}

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
    "plank-row-to-burpee": "Plank Row to Burpee",
};

window.onload = () => {
    var new_database = [];
    var key: string;
    for (key in database)
    {
        new_database.push(new Exercise(database[key], key, 30));
    }

    var session = new Session(new_database);
};
