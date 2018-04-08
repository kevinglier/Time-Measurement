
function Note() {
	
	this.text = '';
	this.time = new Date();// Date
	this.duration = 0; // seconds
	this.finished = false;
	
	this.getTextFormatted = function() { return this.text; };
	this.getTimeFormatted = function() { return this.time.toLocaleTimeString(); };
	this.getDurationFormatted = function() {
		var m = parseInt(this.duration / 60);
		var s = (this.duration % 60);
		return (m ? m + 'm' : '') + s + 's';
	};
}

var ViewModel = function () {
    "use strict";
    var self = {};

		var noteListService = window.SERVICES['NoteListService'];
		
		self.activeNote = new Note();
		
		self.timerStarted = function() {
			self.activeNote = new Note();
			self.activeNote.time = new Date();
			self.activeNote.duration = 0;
			noteListService.addNote(self.activeNote);
		};
		self.timerPaused = function() { };
		self.timerStopped = function(remainingSeconds) {
			self.totalToday(self.totalToday() + 1);
			
			var editedNote = Object.assign({}, self.activeNote);
			editedNote.duration =  Math.ceil((new Date() - editedNote.time) / 1000);
			editedNote.finished = true;
			noteListService.editNote(self.activeNote, editedNote);
			
			self.activeNote = new Note();
		};
		self.timerTick = function(remainingSeconds) {
			//if (remainingSeconds % 15 === 0) {
				var editedNote = Object.assign({}, self.activeNote);
				editedNote.duration = Math.ceil((new Date() - editedNote.time) / 1000);
				
				self.activeNote = noteListService.editNote(self.activeNote, editedNote);
			//}
		}
		
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
		
    return self;
};

 
