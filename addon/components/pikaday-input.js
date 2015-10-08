/* globals Pikaday, moment */

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: ['readonly', 'disabled', 'placeholder', 'type'],
  type: 'text',
  pikaday: null,

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
  i18n: undefined,

  valueMoment: Ember.computed('value', function() {
    let val = this.get('value');
    let format = this.get('format');
    return moment(val, format);
  }),

  didInsertElement() {
    let that = this;
    let firstDay = this.get('firstDay');

    let options = {
      field: this.$()[0],
      onOpen: Ember.run.bind(this, this.onPikadayOpen),
      onClose: Ember.run.bind(this, this.onPikadayClose),
      onSelect: Ember.run.bind(this, this.onPikadaySelect),
      onDraw: Ember.run.bind(this, this.onPikadayRedraw),
      firstDay: (firstDay != null) ? parseInt(firstDay, 10) : 1,
      format: this.get('format'),
      yearRange: that.determineYearRange(),
      minDate: this.get('minDate'),
      maxDate: this.get('maxDate'),
      theme: this.get('theme')
    };

    if (this.get('i18n')) { options.i18n = this.get('i18n'); }

    let pikaday = new Pikaday(options);

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
  },

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
    let selectedDate = this.get('pikaday').getDate();

    if (this.get('useUTC')) {
      selectedDate = moment.utc([selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()]).toDate();
    }

    this.set('value', selectedDate);
  },

  determineYearRange: function() {
    let yearRange = this.get('yearRange');

    if (yearRange) {
      if (yearRange.indexOf(',') > -1) {
        let yearArray = yearRange.split(',');

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
