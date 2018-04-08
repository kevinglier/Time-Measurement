ko.components.register('note-list', {
    viewModel: function(params) {
			
			var self = this;

			this.noteService = window.SERVICES['NoteListService'];
			this.notes = this.noteService.noteList;

			this.editNote = ko.observable(new Note());
			this.newNote = ko.observable(new Note());


			this.handleAddNoteButtonClick = function() {
				if (self.newNote().text !== "") {
					add(self.newNote());
					self.newNote(new Note());
				}
			}.bind(this);
			
			this.handleEditNoteButtonClick = function(note) {
				edit(note, this.editNote);
			}.bind(this);
			
			this.handleRemoveNoteButtonClick = function(note) {
				if (confirm('Do you really want to delete the note?')) {
					remove(note);
				}
			}.bind(this);


			function add(note) {
				self.noteService.addNote(note);
			}
			function remove(note) {
				self.noteService.removeNote(note);
			}
			function edit(originalNote, newNote) {
				self.noteService.editNote(originalNote, newNote);
			}
    },
    template: `
	
			<table class="table table-bordered">
				<thead class="thead-light">
					<tr>
						<th style="width: 12%">Start-Time</th>
						<th style="width: 12%">Duration</th>
						<th>Note</th>
						<th style="width: 1%"></th>
					</tr>
				</thead>
				<tbody data-bind="foreach: notes">
					<tr>
						<td data-bind="text: getTimeFormatted()"></th>
						<td data-bind="text: getDurationFormatted()"></th>
						<td data-bind="text: getTextFormatted()"></th>
						<td class="note-options">
							<button type="button" class="btn btn-sm btn-warning" data-bind="click: $parent.handleEditNoteButtonClick">?</button>
							<button type="button" class="btn btn-sm btn-danger" data-bind="click: $parent.handleRemoveNoteButtonClick">-</button>
						</td>
					</tr>
				</tbody>
				<tbody>
					<tr data-bind="with: newNote">
						<td></td>
						<td></td>
						<td><input type="text" data-bind="value: text"></td>
						<td>
							<button type="button" class="btn btn-sm btn-success" data-bind="click: $parent.handleAddNoteButtonClick">+</button>
						</td>
					</tr>
				</tbody>
			</table>

	`
});