/* globals Pikaday, moment */

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: ['readonly', 'disabled', 'placeholder', 'type'],
  type: 'text',

  // options
  value: null,
  format: 'DD.MM.YYYY',
  theme: null,
  yearRange: null,
  readOnly: null,
  placeholder: null,
  disabled: null,
  firstDay: null,
  minDate: null,
  maxDate: null,
  useUTC: null,
  i18n: null,

  setupPikaday: Ember.on('didInsertElement', function() {
    let that = this;
    let firstDay = this.get('firstDay');

    let options = {
      field: this.$()[0],
      onOpen: Ember.run.bind(this, this.onPikadayOpen),
      onClose: Ember.run.bind(this, this.onPikadayClose),
      onSelect: Ember.run.bind(this, this.onPikadaySelect),
      onDraw: Ember.run.bind(this, this.onPikadayRedraw),
      firstDay: firstDay ? parseInt(firstDay, 10) : 1,
      format: this.get('format'),
      yearRange: that.determineYearRange(),
      minDate: this.get('minDate'),
      maxDate: this.get('maxDate'),
      theme: this.get('theme'),
      i18n: this.get('i18n')
    };

    var pikaday = new Pikaday(options);

    this.set('pikaday', pikaday);
    this.setPikadayDate();

    this.addObserver('value', function() {
      that.setPikadayDate();
    });

    this.addObserver('minDate', function() {
      this.setMinDate();
    });

    this.addObserver('maxDate', function() {
      this.setMaxDate();
    });
  }),

  teardownPikaday: Ember.on('willDestroyElement', function() {
    this.get('pikaday').destroy();
  }),

  setPikadayDate: function() {
    this.get('pikaday').setDate(this.get('value'), true);
  },

  setMinDate: function() {
    this.get('pikaday').setMinDate(this.get('minDate'));
  },

  setMaxDate: function() {
    this.get('pikaday').setMaxDate(this.get('maxDate'));
  },

  onPikadayOpen: Ember.K,

  onPikadayClose: function() {
    if (this.get('pikaday').getDate() === null) {
      this.set('value', null);
    }
  },

  onPikadaySelect: function() {
    this.userSelectedDate();
  },

  onPikadayRedraw: Ember.K,

  userSelectedDate: function() {
    var selectedDate = this.get('pikaday').getDate();

    if (this.get('useUTC')) {
      selectedDate = moment.utc([selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()]).toDate();
    }

    this.set('value', selectedDate);
  },

  determineYearRange: function() {
    var yearRange = this.get('yearRange');

    if (yearRange) {
      if (yearRange.indexOf(',') > -1) {
        var yearArray = yearRange.split(',');

        if (yearArray[1] === 'currentYear') {
          yearArray[1] = new Date().getFullYear();
        }

        return yearArray;
      } else {
        return yearRange;
      }
    } else {
      return 10;
    }
  },

  autoHideOnDisabled: Ember.observer('disabled', 'pikaday', function () {
    if (this.get('disabled') && this.get('pikaday')) {
      this.get('pikaday').hide();
    }
  })
});
