
var RUNNING_STATE_RUNS = 1;
var RUNNING_STATE_PAUSED = 2;
var RUNNING_STATE_STOPPED = 3;

ko.components.register('timer', {
    viewModel: function(params) {

		var self = this;

		// EVENTS
		this.onTimerEnded = params.onTimerEnded || function() { alert('Timer ended.'); };
		this.onTimerStartedByUser = params.onTimerStartedByUser || function() { alert('Timer started by user.'); };
		this.onTimerStoppedByUser = params.onTimerStoppedByUser || function() { alert('Timer stopped by user.'); };
		this.onTimerPausedByUser = params.onTimerPausedByUser || function() { alert('Timer paused by user.'); };
		this.onTimerTick = params.onTimerTick || function(remainingSeconds) { };

		this.state = ko.observable(RUNNING_STATE_STOPPED);

		this.remainingSeconds = ko.observable(params.startValue || 25 * 60);

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

		self.alert = function () {
            var audioElement = document.getElementById('audiostuff');
            audioElement.play();

            self.onTimerEnded(self.remainingSeconds());
        }


        self.tick = function () {
            if (self.state() === RUNNING_STATE_RUNS) {
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
            self.state(RUNNING_STATE_STOPPED);
            self.remainingSeconds(self.startValue);
        }

        self.handleStartClick = function () {

            if (self.remainingSeconds() > 0 && self.state != RUNNING_STATE_RUNS) {
                self.state(RUNNING_STATE_RUNS);

                self.onTimerStartedByUser();
            }
        }

        self.handlePauseClick = function () {

            if (self.state() === RUNNING_STATE_RUNS) {

                self.state(RUNNING_STATE_PAUSED);

                self.onTimerPausedByUser();
            }
        }

        self.handleStopClick = function () {

            self.stop();

            self.onTimerStoppedByUser(self.remainingSeconds());
        }

        window.setInterval(self.tick, 1000);
    },
    template: `
		<div class="countdown-timer-display" data-bind="with: remainingTime">
			<span data-bind="text: minutes + ':' + seconds"></span>
		</div>
	
	
		<div class="countdown-timer-buttons">
			<button type="button" class="btn btn-lg btn-success" type="button" data-bind="click: handleStartClick, attr: { disabled: state() == 1 }, text: state() == 2 ? 'Resume' : 'Start'">Start</button>
			<button type="button" class="btn btn-lg btn-warning" type="button" data-bind="click: handlePauseClick, attr: { disabled: state() != 1 }">Pause</button>
			<button type="button" class="btn btn-lg btn-danger" type="button" data-bind="click: handleStopClick">Reset</button>
		</div>
	`
});