/**
 * A Service to manage the notes.
 */
function NoteListService() {
	this.noteList = ko.observableArray([]);
	
	/**
	 * Adds a new note to the note list.
	 * @param {Note} note
	 */
	this.addNote = function(note) {
		this.noteList.push(note);
		return note;
	};
	
	/**
	 * Removes a note from the note list.
	 * @param {Note} note
	 */
	this.removeNote = function(note) {
		this.noteList.remove(note);
		return true;
	};
	
	/**
	 * Edits an existing note.
	 * @param {Note} originalNote The original note
	 * @param {Note} newNote The new note
	 */
	this.editNote = function(originalNote, newNote) {
			console.log('???', originalNote, newNote);
			this.noteList.replace(originalNote, newNote);
			return newNote;

	};
}