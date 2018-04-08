
var RUNNING_STATE_RUNS = 1;
var RUNNING_STATE_PAUSED = 2;
var RUNNING_STATE_STOPPED = 3;

ko.components.register('timer', {
    viewModel: function(params) {
			
			var self = this;
			
			this.onTimerEnded = params.onTimerEnded || function() { alert('Timer ended.'); };
			this.onTimerStartedByUser = params.onTimerStartedByUser || function() { alert('Timer started by user.'); };
			this.onTimerStoppedByUser = params.onTimerStoppedByUser || function() { alert('Timer stopped by user.'); };
			this.onTimerPausedByUser = params.onTimerPausedByUser || function() { alert('Timer paused by user.'); };
			this.onTimerTick = params.onTimerTick || function(remainingSeconds) { };
			
			function setRemainingSeconds() {
				var s = parseInt(self.settingsTimerValueMinutes() * 60) + parseInt(self.settingsTimerValueSeconds());
				
				if (s <= 0 || isNaN(s)) {
					self.settingsTimerValueMinutes(5);
					self.settingsTimerValueSeconds(0);
					return;
				}
				
				self.remainingSeconds(s);
			}
			this.TIMER_VALUE_MINUTES_OPTIONS = (function() { var x = []; for (var i = 0; i <= 120; i+=5) x.push(i); return x; })();
			this.TIMER_VALUE_SECONDS_OPTIONS = (function() { var x = []; for (var i = 0; i <= 45; i+=15) x.push(i); return x; })();
			this.settingsTimerValueMinutes = ko.observable(15);
			this.settingsTimerValueMinutes.subscribe(setRemainingSeconds);
			this.settingsTimerValueSeconds = ko.observable(0);
			this.settingsTimerValueSeconds.subscribe(setRemainingSeconds);
    
			this.runningState = ko.observable(RUNNING_STATE_STOPPED);
			this.remainingSeconds = ko.observable(self.startValue);
			this.remainingTime = ko.computed(function () {
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
			
			
			self.startValue = 60 * 60;

			self.timeUnits = window.TIME_UNITS;
			self.timeUnitsDisabled = ko.computed(function () { return self.runningState() != RUNNING_STATE_STOPPED; });
			self.timerTimeUnit = ko.observable(window.TIME_UNITS[0]);

			self.timerTimeUnit.subscribe(function() {
					self.startValue = window.TIME_UNITS.find(x => x.key == self.timerTimeUnit()).value || 15 * 60;

					self.stop();
			});
			
			self.alert = function () {
        var audioElement = document.getElementById('audiostuff');
        audioElement.play();
				
				self.onTimerEnded(self.remainingSeconds());
			}

			self.soundTestClick = function () {
				var audioElement = document.getElementById('audiostuff');
				audioElement.play();
			}
			
			
			self.runningInterval = function () {
				if (self.runningState() === RUNNING_STATE_RUNS) {
					var remainingSeconds = self.remainingSeconds();
					if (remainingSeconds > 0) {
						remainingSeconds -= 1;
						self.remainingSeconds(remainingSeconds);
						self.onTimerTick(self.remainingSeconds());
					}

					if (remainingSeconds <= 0) {
						self.stop();
						self.alert();
					}
				}
			}
			
			this.stop = function() {
				self.runningState(RUNNING_STATE_STOPPED);
				self.remainingSeconds(self.startValue);
			}
			
			self.handleStartClick = function () {
        if (self.remainingSeconds() > 0 && self.runningState != RUNNING_STATE_RUNS) {
					self.runningState(RUNNING_STATE_RUNS);
					
					self.onTimerStartedByUser();
					//self.note("pomodoro running...");
        }
			}

			self.handlePauseClick = function () {
					if (self.runningState() === RUNNING_STATE_RUNS) {
						
						//self.note("pomodoro paused.");
						self.runningState(RUNNING_STATE_PAUSED);
						
						self.onTimerPausedByUser();
					}
			}

			self.handleStopClick = function () {
				//self.note("reset at " + self.remainingTime() + "min");
				self.stop();
				
				self.onTimerStoppedByUser(self.remainingSeconds());
			}
			
			window.setInterval(self.runningInterval, 1000);
		},
    template: `

			<div class="card box-shadow">
				<div class="card-header">
					<h4 class="my-0 font-weight-normal">Start a Timer</h4>
				</div>
				<div class="card-body">
					<div class="countdown-timer-display" data-bind="with: remainingTime">
						<span data-bind="text: minutes + ':' + seconds"></span>
					</div>


					<div class="countdown-timer-buttons">
						<button type="button" class="btn btn-lg btn-success" type="button" data-bind="click: handleStartClick, attr: { disabled: runningState() == 1 }, text: runningState() == 2 ? 'Resume' : 'Start'">Start</button>
						<button type="button" class="btn btn-lg btn-warning" type="button" data-bind="click: handlePauseClick, attr: { disabled: runningState() != 1 }">Pause</button>
						<button type="button" class="btn btn-lg btn-danger" type="button" data-bind="click: handleStopClick">Reset</button>
					</div>
				</div>
			</div>

			<div class="card box-shadow countdown-timer-settings">
				<div class="card-header">
					<h4 class="my-0 font-weight-normal">Settings</h4>
				</div>
				<div class="card-body">
						<div>
							Time Unit:
							<select data-bind="foreach: timeUnits, value: timerTimeUnit, disabled: timeUnitsDisabled, attr: { disabled: timeUnitsDisabled }">
								<option data-bind="text: caption, attr: { value: key, selected: $data == $parents[0].timerTimeUnit() ? '' : null }"></option>
							</select>
						</div>
						<div data-bind="if: timerTimeUnit() == 'any'">
							Timer Value:
							<select data-bind="foreach: TIMER_VALUE_MINUTES_OPTIONS, value: settingsTimerValueMinutes">
								<option data-bind="text: $data, attr: { value: $data, selected: $data == $parent.settingsTimerValueMinutes() ? '' : null }"></option>
							</select>
							<select data-bind="foreach: TIMER_VALUE_SECONDS_OPTIONS, value: settingsTimerValueSeconds">
								<option data-bind="text: $data, attr: { value: $data, selected: $data == $parent.settingsTimerValueSeconds() ? '' : null }"></option>
							</select>
						</div>
						<div>
							<button type="button" class="btn btn-lg btn-default" type="button" data-bind="click: soundTestClick">Sound-Test</button>
						</div>
				</div>
			</div>
	`
});