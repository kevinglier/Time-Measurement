function Settings {
    this.type;
    this.timeUnit;
    this.startValue = {
        minutes: 0,
        seconds: 0
    };
}

ko.components.register('settings', {
    viewModel: function(params) {

        var self = this;


        this.TIMER_VALUE_MINUTES_OPTIONS = (function() { var x = []; for (var i = 0; i <= 120; i+=5) x.push(i); return x; })();
        this.TIMER_VALUE_SECONDS_OPTIONS = (function() { var x = []; for (var i = 0; i <= 45; i+=15) x.push(i); return x; })();

        self.soundTestClick = function () {
            var audioElement = document.getElementById('audiostuff');
            audioElement.play();
        }

    },
    template: `
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
	`
});