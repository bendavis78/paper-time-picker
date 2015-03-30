(function() {
  var CLOCK_TYPE_HOURS = 'hours';
  var CLOCK_TYPE_MINUTES = 'minutes';

  // these values are a percentage of the radius
  var POINTER_LARGE = 32;
  var POINTER_SMALL = 8;
  var CLOCK_FACE_PADDING = 8;
  var PERIOD_CHOOSER = 36;

  Polymer("paper-time-picker", {
    publish: {
      hour: 0,
      minute: 0,
      responsiveWidth: '640px',
      narrow: {type: 'boolean', value: false, reflect: true},
      isTouch: {type: 'boolean', value: false, reflect: true}
    },
    observe: {
      '$.clockFace.selected': 'pageChanged'
    },
    ready: function() {
      this.isTouch = 'ontouchstart' in window;
      this.page = 'hour';
      this._initClock();
    },
    domReady: function() {
      this._updateClockMetrics();
      this.hourChanged();
      this.minuteChanged();
    },
    narrowChanged: function() {
      this.async(function() {
        this._updateClockMetrics();
      });
    },
    _initClock: function() {
      var hoursClock = {}
      var minutesClock = {}

      hoursClock.type = CLOCK_TYPE_HOURS;
      minutesClock.type = CLOCK_TYPE_MINUTES;
      hoursClock.numbers = [];
      minutesClock.numbers = [];

      for (var i=0; i<12; i++) {
        hoursClock.numbers.push({
          number: i,
          numberDisplay: i == 0 ? 12: i,
          visible: true
        });
      }

      for (var i=0; i<60; i++) {
        minutesClock.numbers.push({
          number: i,
          numberDisplay: ('0' + i).substr(-2, 2),
          visible: i % 5 == 0
        });
      }

      hoursClock.selectPeriod = this.selectPeriod.bind(this);
      minutesClock.selectPeriod = this.selectPeriod.bind(this);

      this.$.hoursClock.model = hoursClock;
      this.$.minutesClock.model = minutesClock;
    },
    _updateClockMetrics: function() {
      var hoursClock = this.$.hoursClock.model;
      var minutesClock = this.$.minutesClock.model;
      var radius = this.$.clockFace.offsetWidth / 2;
      var pointerLarge = radius * (POINTER_LARGE / 100);
      var pointerSmall = radius * (POINTER_SMALL / 100);
      var periodChooser = radius * (PERIOD_CHOOSER / 100);
      var padding = radius * (CLOCK_FACE_PADDING / 100);

      hoursClock.periodChooser = periodChooser;
      minutesClock.periodChooser = periodChooser;
      hoursClock.radius = radius;
      hoursClock.pointerLarge = pointerLarge;
      hoursClock.pointerSmall = 0;

      minutesClock.radius = radius;
      minutesClock.pointerLarge = pointerLarge;
      minutesClock.pointerSmall = pointerSmall;

      this._positionClockPoints(hoursClock, pointerLarge, padding);
      this._positionClockPoints(minutesClock, pointerLarge, padding);
    },
    _positionClockPoints: function(model, size, padding) {
      var points = model.numbers.length;
      var angle = (360 / points) * (Math.PI / 180);
      var r = model.radius;
      var r1 = r - padding;
      var r2 = r1 - (size / 2);
      var r3 = r1 - size;
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

        // center
        model.numbers[i].x = r + (sin * r2);
        model.numbers[i].y = r - (cos * r2);

        // inner edge of larger circle
        model.numbers[i].edge = {x: r + (sin * r3), y: r - (cos * r3)};

        model.numbers[i].t1 = {x: r + (sinA * r), y: r - (cosA * r)};
        model.numbers[i].t2 = {x: r + (sinB * r), y: r - (cosB * r)};
        model.numbers[i].t3 = {x: r + (sinB * r3), y: r - (cosB * r3)};
        model.numbers[i].t4 = {x: r + (sinA * r3), y: r - (cosA * r3)};
      }
      model.r1 = r1;
      model.r2 = r2;
      model.r3 = r3;
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
      this.vibrate();
    },
    pageChanged: function() {
      this.$.timePartSelector.selected = this.page;
      this.$.clockFace.selected = this.page;
    },
    hourChanged: function() {
      this.hourDisplay = this.hour % 12 == 0 ? 12 : this.hour % 12
      this.period = ['AM', 'PM'][Math.floor(this.hour / 12) % 2]
      var model = this.$.hoursClock.model;
      var idx = this.period == 'AM' ? this.hour : this.hour - 12;
      console.log(idx);
      console.log(model.numbers[idx]);
      model.selected = model.numbers[idx]
    },
    minuteChanged: function() {
      var model = this.$.minutesClock.model;
      model.selected = model.numbers[this.minute];
      this.minuteDisplay = ('0' + this.minute).substr(-2,2)
    },
    selectTimePart: function() {
      this.page = this.$.timePartSelector.selected;
      this.vibrate();
    },
    changePeriod: function() {
      if (this.period == 'AM') {
        this.hour += 12;
      } else if (this.period == 'PM') {
        this.hour -= 12;
      }
    },
    selectPeriod: function(period) {
      console.log('tapped');
      this.async(function() {
        if (period == 'AM' && this.period == 'PM') {
          this.hour -= 12;
        } else if (period == 'PM' && this.period == 'AM') {
          this.hour += 12;
        }
      });
    },
    vibrate: function() {
      if (navigator.vibrate) {
        navigator.vibrate(300);
      }
    }
  });
})();
