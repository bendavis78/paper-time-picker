(function() {
  var CLOCK_TYPE_HOURS = 'hours';
  var CLOCK_TYPE_MINUTES = 'minutes';

  // these values are a percentage of the radius
  var POINTER_LARGE = 32;
  var POINTER_SMALL = 8;
  var CLOCK_FACE_PADDING = 4;
  var PERIOD_CHOOSER = 36;

  Polymer.mixin(Polymer.CoreResizable, Polymer("paper-time-picker", {
    publish: {
      hour: 0,
      minute: 0,
      responsiveWidth: '450px',
      narrow: {type: 'boolean', value: false, reflect: true},
      isTouch: {type: 'boolean', value: false, reflect: true}
    },
    eventDelegates: {
      'down': '_down',
      'core-resize': 'updateSize'
    },
    ready: function() {
      this.isTouch = 'ontouchstart' in window;
      this.page = 'hour';
      this._initClock();
    },
    domReady: function() {
      this.updateSize();
      this.hourChanged();
      this.minuteChanged();
    },
    narrowChanged: function() {
      this.async(function() {
        this.updateSize();
      });
    },
    _initClock: function() {
      var clock = {
        hours: [],
        minutes: []
      };

      for (var i=0; i<12; i++) {
        clock.hours.push({
          number: i,
          numberDisplay: i == 0 ? 12: i,
          visible: true
        });
      }

      for (var i=0; i<60; i++) {
        clock.minutes.push({
          number: i,
          numberDisplay: ('0' + i).substr(-2, 2),
          visible: i % 5 == 0
        });
      }

      this.clock = clock;
      this.$.hoursClock.model = {
        type: CLOCK_TYPE_HOURS,
        numbers: clock.hours,
        clock: clock
      };
      this.$.minutesClock.model = {
        type: CLOCK_TYPE_MINUTES,
        numbers: clock.minutes,
        clock: clock
      };
    },
    updateSize: function() {
      var clock = this.clock;
      var clockFace = this.$.clockFace;
      var radius = this.$.clockFace.offsetWidth / 2;
      clock.radius = radius;
      clock.rect = clockFace.getBoundingClientRect();
      clock.pointerLarge = radius * (POINTER_LARGE / 100);
      clock.pointerSmall = radius * (POINTER_SMALL / 100);
      clock.periodChooser = radius * (PERIOD_CHOOSER / 100);
      clock.padding = radius * (CLOCK_FACE_PADDING / 100);
      this._positionClockPoints(clock.hours);
      this._positionClockPoints(clock.minutes);
    },
    _positionClockPoints: function(numbers) {
      var points = numbers.length;
      var angle = (360 / points) * (Math.PI / 180);
      var clock = this.clock;
      var r = clock.radius;
      var r1 = r - clock.padding;
      var r2 = r1 - (clock.pointerLarge / 2);
      var r3 = r1 - clock.pointerLarge;
      var sin, cos, a, aA, aB;
      for (var i=0; i<points; i++) {
        a = angle * i;
        aA = a - (angle / 2);
        aB = a + (angle / 2);

        sin = Math.sin(a);
        cos = Math.cos(a);
        sinA = Math.sin(aA);
        cosA = Math.cos(aA);
        sinB = Math.sin(aB);
        cosB = Math.cos(aB);
        // position of center of selector
        numbers[i].x = r + (sin * r2);
        numbers[i].y = r - (cos * r2);
        // end-point on line from radius to edge of selector
        numbers[i].edge = {x: r + (sin * r3), y: r - (cos * r3)};
      }
      clock.r1 = r1;
      clock.r2 = r2;
      clock.r3 = r3;
    },
    selectClockNumber: function(e, n, el) {
      var num = parseInt(el.getAttribute('value'));
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
      this.page = 'minute';
    },
    startClockSelect: function(e) {
      var clock = this.clock;
      var page = this.page;
      var r = clock.radius;
      var x = e.clientX - clock.rect.left - r;
      var y = e.clientY - clock.rect.top - r;
      var distance = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
      if (distance < clock.r3 || distance > clock.r1) {
        this._startClockSelect = false;
        return;
      }
      this._startClockSelect = true;
      var points = this.page == 'minute' ? 60 : 12;
      var interval = (360 / points) * (Math.PI / 180);

      // find angle, rotate -90deg, then convert to a full circle value;
      var theta = Math.atan(y / x)
      theta = (Math.PI / 2) + (x < 0 ? theta + Math.PI : theta);

      // find the nearest value
      value = Math.round(theta / interval);
      
      // set to zero if max (eg, 12 = 0);
      value = (value == points) ? 0 : value;

      // set the hour/minute property depending on current page
      if (this[page] != value) {
        if (page == 'hour' && this.period == 'PM') {
            value += 12;
        }
        this[this.page] = value;
      }

      this._allowVibrate = true;
    },
    finishClockSelect: function() {
      if (!this._startClockSelect) {
        return;
      }
      if (this.page == 'hour') {
        this.page = 'minute';
      }
      this._startClockSelect = false;
    },
    pageChanged: function() {
      this.$.timePartSelector.selected = this.page;
      this.$.clockFace.selected = this.page;
      this.vibrate();
    },
    hourChanged: function() {
      this.hourDisplay = this.hour % 12 == 0 ? 12 : this.hour % 12
      this.period = ['AM', 'PM'][Math.floor(this.hour / 12) % 2]
      var model = this.$.hoursClock.model;
      var idx = this.period == 'AM' ? this.hour : this.hour - 12;
      model.selected = model.numbers[idx]
      this.vibrate();
    },
    minuteChanged: function() {
      var model = this.$.minutesClock.model;
      model.selected = model.numbers[this.minute];
      this.minuteDisplay = ('0' + this.minute).substr(-2,2)
      this.vibrate();
    },
    periodChanged: function() {
      this.clock.period = this.period;
      this.vibrate();
    },
    selectTimePart: function() {
      this.page = this.$.timePartSelector.selected;
    },
    changePeriod: function() {
      if (this.period == 'AM') {
        this.hour += 12;
      } else if (this.period == 'PM') {
        this.hour -= 12;
      }
    },
    selectPeriod: function(e, n, el) {
      var period = el.getAttribute('value');
      this.async(function() {
        if (period == 'AM' && this.period == 'PM') {
          this.hour -= 12;
        } else if (period == 'PM' && this.period == 'AM') {
          this.hour += 12;
        }
      });
    },
    _down: function() {
      // only vibrate when something is changed by a touch action
      this._allowVibrate = true;
    },
    vibrate: function() {
      if (this._allowVibrate) {
        this.job('vibrate', function() {
          navigator.vibrate && navigator.vibrate(10);
          this._allowVibrate = false;
        });
      }
    }
  }));
})();
