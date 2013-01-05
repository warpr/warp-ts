
class Exercise {
    constructor(public displayName: string, public identifier: string,
        public duration: number, public requiredAttributes: string[]) {}

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
        super("break", "break", 15, []);
    }

    isBreak() { return true; }
}

class NullExercise extends Exercise {
    constructor() {
        super("", "NULL", 0, []);
    }
}

class PlayList {
    previous: Exercise;
    current: Exercise;
    next: Exercise;

    constructor() {
        this.previous = new NullExercise();
        this.current = new NullExercise();
        this.next = new NullExercise();
    }

    enqueue(exercise: Exercise) {
        this.previous = this.current;
        this.current = this.next;
        this.next = exercise;
    }

    renderTo(previous: HTMLElement, current: HTMLElement, next: HTMLElement) {
        this.previous.renderTo(previous);
        this.current.renderTo(current);
        this.next.renderTo(next);
    }
}

var database = [
    new Exercise("Forward Lunge", "lunge-forward", 30, []),
    new Exercise("Reverse Lunge", "lunge-reverse", 30, []),
    new Exercise("Side Lunge (left)", "lunge-side-left", 30, []),
    new Exercise("Side Lunge (right)", "lunge-side-right", 30, []),
    new Exercise("Squat", "squat", 30, []),
    new Exercise("Kettlebell Squat", "squat-kettlebell", 30, ["Kettlebell"]),
    new Exercise("Wall Press", "pushup-wall-press", 30, [])
];

class Session {
    previous: HTMLElement;
    next: HTMLElement;
    current: HTMLElement;
    database: Exercise[];
    position: number;
    timerToken: number;
    playlist: PlayList;
    exerciseTimer: number;

    constructor(database: Exercise[]) {
        this.database = database;
        this.position = 0;

        this.previous = document.getElementById('previous');
        this.next = document.getElementById('next');
        this.current = document.getElementById('current');

        this.timerToken = setInterval(() => this.mainLoop (), 100);
        this.playlist = new PlayList();
        this.exerciseTimer = 0;
    }

    nextStep() {
        if (this.playlist.next.isBreak())
        {
            this.playlist.enqueue(database[this.position]);
        }
        else
        {
            this.playlist.enqueue(new BreakExercise());
        }

        this.playlist.renderTo(this.previous, this.current, this.next);
        this.position++;
        if (this.position >= database.length)
        {
            this.position = 0;
            this.database.sort(() => 0.5 - Math.random());
        }

        return this.playlist.current;
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

window.onload = () => {
    var session = new Session(database);
};