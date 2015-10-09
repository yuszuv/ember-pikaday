/* globals Pikaday, moment */

import Ember from 'ember';

let isDate = function(obj) {
  return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
};

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
  firstDay: 1,
  minDate: null,
  maxDate: null,
  i18n: null,

  // properties
  dateValue: Ember.computed('value', function(){
    return isDate(this.get('value'));
  }),

  didInsertElement() {
    let that = this;

    let options = {
      field: this.$()[0],
      onOpen: Ember.run.bind(this, this.onPikadayOpen),
      onClose: Ember.run.bind(this, this.onPikadayClose),
      onSelect: Ember.run.bind(this, this.onPikadaySelect),
      onDraw: Ember.run.bind(this, this.onPikadayRedraw)
    };

    if (this.get('firstDay') != null) {
      options.firstDay = parseInt(this.get('firstDay'), 10);
    }

    if (this.get('format') != null) {
      options.format = this.get('format');
    }

    if (this.get('yearRange') != null) {
      options.yearRange = this.determineYearRange();
    }

    if (this.get('minDate') != null) {
      options.minDate = this.get('minDate');
    }

    if (this.get('maxDate') != null) {
      options.maxDate = this.get('maxDate');
    }

    if (this.get('theme') != null) {
      options.theme = this.get('theme');
    }

    if (this.get('i18n') != null) { 
      options.i18n = this.get('i18n');
    }


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

  willDestroyElement() {
    this.get('pikaday').destroy();
  },

  setPikadayDate: function() {
    let val = this.get('value');
    if (!isDate(val)) {
      val = moment(val, this.get('format'));
      val = val.toDate();
    }
    this.get('pikaday').setDate(val, true);
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
    if (this.get('dateValue')) {
      this.set('value', this.get('pikaday').getDate());
    }
    else {
      this.set('value', this.get('pikaday').toString());
    }
  },

  onPikadayRedraw: Ember.K,

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
