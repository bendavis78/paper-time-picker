(function() {
  Polymer("paper-time-picker", {
    publish: {
      hour: 0,
      minute: 0,
      responsiveWidth: '640px',
      narrow: {type: 'boolean', value: false, reflect: true},
      isTouch: {type: 'boolean', value: false, reflect: true}
    },
    ready: function() {
      this.isTouch = 'ontouchstart' in window;
      this.hourChanged();
      this.minuteChanged();
      this.createClock();
      this.$.timePartSelector.selected = 'hour';
    },
    hourChanged: function() {
      this.hourDisplay = this.hour % 12 == 0 ? 12 : this.hour % 12
      this.period = ['AM', 'PM'][Math.floor(this.hour / 12) % 2]
    },
    minuteChanged: function() {
      this.minuteDisplay = ("0" + this.minute).substr(-2,2)
    },
    createClock: function() {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      var face = document.createElement('circle');
      this.$.chooseHour.appendChild(svg);
    },
    selectTimePart: function() {
      this.$.pages.selected = this.$.timePartSelector.selected;
    },
    changePeriod: function() {
      if (this.period == 'AM') {
        this.hour += 12;
      } else if (this.period == 'PM') {
        this.hour -= 12;
      }
    },
  });
})();
