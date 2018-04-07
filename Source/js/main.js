var TIME_UNITS = [ // "value" in seconds
	{ key: 'pomodoro', caption: 'Pomodoro', value: 25 * 60 },
	{ key: 'hours', caption: 'Hours', value: 60 * 60 },
	{ key: 'any', caption: 'Any', value: null }
];

var RUNNING_STATE_RUNS = 1;
var RUNNING_STATE_PAUSED = 2;
var RUNNING_STATE_STOPPED = 3;

function Note() {
	
	this.text = '';
	this.time = new Date();// Date
	this.duration = 4; // seconds
	
	this.getTextFormatted = function() { return this.text; };
	this.getTimeFormatted = function() { return this.time.toLocaleTimeString(); };
	this.getDurationFormatted = function() {
		var h = parseInt(this.duration / 60);
		var m = (this.duration % 60);
		return (h ? h : 'h') + m + 'm';
	};
}

var ViewModel = function (durationInMinutes) {
    "use strict";
    var self = {};

		self.runningState = ko.observable(RUNNING_STATE_STOPPED);

    self.startValue = durationInMinutes * 60;
		
		self.timeUnits = TIME_UNITS;
		self.timeUnitsDisabled = ko.computed(function () { return self.runningState() != RUNNING_STATE_STOPPED; });
		self.timerTimeUnit = ko.observable(TIME_UNITS[0]);
		
		self.timerTimeUnit.subscribe(function() {
        self.startValue = TIME_UNITS.find(x => x.key == self.timerTimeUnit()).value || 15 * 60;
				
				self.resetClick();
    });
		
		self.totalTodayTimeUnits = TIME_UNITS.slice(0, TIME_UNITS.length - 1); 
    self.totalToday = ko.observable(0); // In seconds
		self.totalTodayUnit = ko.observable(TIME_UNITS[0]);
		self.totalTodayUnitChanged = function() {
			recalculateTotalToday();
		};
		function recalculateTotalToday() {
			var unit = self.totalTodayUnit() || self.totalTodayTimeUnits[0] || null;
			if (unit) {
				var total = self.totalToday() / 60;
				self.totalToday(total / self.totalTodayUnit());
			}
			self.totalToday(0);
		}
		
		
		
		self.remainingSeconds = ko.observable(self.startValue);
   
		
    self.noteText = ko.observable("");
		
		self.notes = ko.observableArray([]); // Array of Notes


    self.remainingTime = ko.computed(function () {
        var remainingSeconds = parseInt(ko.unwrap(self.remainingSeconds), 10);
        var minutes = Math.floor(remainingSeconds / 60);
        var seconds = remainingSeconds % 60;

        var minutesString = minutes.toString();
				minutesString = minutesString.length === 1 ? "0" + minutesString : minutesString;
        var secondsString = seconds.toString();
				secondsString = secondsString.length === 1 ? "0" + secondsString : secondsString;
				
        /* Show remaining time in the pages title */
        $("head title").text(minutesString + ":" + secondsString);
				
				return {
					minutes: minutesString,
					seconds: secondsString
				};
    });



    self.alert = function () {
        self.note("...pomodoro complete!")
        self.totalToday(self.totalToday() + 1);

        var audioElement = document.getElementById('audiostuff');
        audioElement.play();
    }

    self.soundTestClick = function () {
        var audioElement = document.getElementById('audiostuff');
        audioElement.play();
    }

    self.note = function (text) {
			
			var newNote = new Note();
			newNote.text = text;
			newNote.time = new Date();
			newNote.duration = 60;
			
			self.notes.push(newNote);
    }
    self.runningInterval = function () {
        if (self.runningState() === RUNNING_STATE_RUNS) {
            var remainingSeconds = self.remainingSeconds();
            if (remainingSeconds > 0) {
                remainingSeconds -= 1;
                self.remainingSeconds(remainingSeconds);
            }

            if (remainingSeconds === 0) {
                self.stopClick();
                self.alert();
            }
        }
    }

    self.startClick = function () {
        if (self.remainingSeconds() > 0) {
            self.runningState(RUNNING_STATE_RUNS);

            self.note("pomodoro running...");
        }
    }

    self.stopClick = function () {
        if (self.runningState() === RUNNING_STATE_RUNS) {
            self.note("pomodoro paused.");
            self.runningState(RUNNING_STATE_PAUSED);
        }
    }

    self.resetClick = function () {
        self.note("reset at " + self.remainingTime() + "min");
        self.runningState(RUNNING_STATE_STOPPED);
        self.remainingSeconds(self.startValue);
    }




		self.handleAddNoteButtonClick = function(note) {
			if (self.noteText() !== "") {
				self.note(self.noteText());
				self.noteText("");
			}
		};
		self.handleEditNoteButtonClick = function(note) {
			alert('edit');
		};
		self.handleRemoveNoteButtonClick = function(note) {
			if (confirm('Do you really want to delete the note?')) {
				self.notes.remove(note);
			}
		};



    window.setInterval(self.runningInterval, 1000);

    return self;
};

 
