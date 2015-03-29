(function() {
  var CLOCK_TYPE_HOURS = 'hours';
  var CLOCK_TYPE_MINUTES = 'minutes';

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
      this.$.timePartSelector.selected = 'hour';
    },
    domReady: function() {
      var hours = [];
      var minutes = [];
      var centerX = 98;
      var centerY = 98;
      var r = 80;
      var lineDist = r - 15;
      var a = 30 * (Math.PI / 180);
      var x, y, lineX, lineY, sin, cos;
      for (var i=0; i<12; i++) {
        sin = Math.sin(a * i);
        cos = Math.cos(a * i);
        x = centerX + (sin * r);
        y = centerY - (cos * r); 
        lineX = centerX + (sin * lineDist);
        lineY = centerY - (cos * lineDist);
        hours.push({number: i == 0 ? 12 : i, x: x, y: y, lineX: lineX, lineY: lineY});
        minutes.push({number: i * 5, x: x, y: y, lineX: lineX, lineY: lineY});
      }
      this.$.hoursClock.model = {
        type: CLOCK_TYPE_HOURS,
        numbers: hours
      };
      this.$.minutesClock.model = {
        type: CLOCK_TYPE_MINUTES,
        numbers: minutes,
      };
      this.hourChanged();
      this.minuteChanged();
    },
    selectClockNumber: function(e, n, el) {
      var num = parseInt(el.textContent);
      var type = el.getAttribute('type');
      if (type == CLOCK_TYPE_HOURS) {
        num = num == 12 ? 0 : num;
        if (this.period == 'PM') {
          num += 12;
        }
        this.hour = num;
      } else if (type == CLOCK_TYPE_MINUTES) {
        this.minute = num;
      }
    },
    hourChanged: function() {
      this.hourDisplay = this.hour % 12 == 0 ? 12 : this.hour % 12
      this.period = ['AM', 'PM'][Math.floor(this.hour / 12) % 2]
      var model = this.$.hoursClock.model;
      //console.log(this.period == 'AM' ? this.hour : this.hour - 12);
      model.selection = model.numbers[this.period == 'AM' ? this.hour : this.hour - 12]
    },
    minuteChanged: function() {
      var model = this.$.minutesClock.model;
      model.selection = model.numbers[this.minute / 5];
      this.minuteDisplay = ("0" + this.minute).substr(-2,2)
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
    choosePeriod: function() {
      var selected = this.$.periodSelector.selected;
      if (selected == 'AM' && this.period == 'PM') {
        this.hour -= 12;
      } else if (selected == 'PM' && this.period == 'AM') {
        this.hour += 12;
      }
      console.log(this.hour);
    },
  });
})();
