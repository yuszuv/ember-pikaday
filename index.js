/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-pikaday',

  included: function(app) {
    this._super.included(app);

    var options = app.options['ember-pikaday'] || { theme: true };

    if (options.theme) {
      app.import(app.bowerDirectory + '/pikaday/css/pikaday.css');
    }

    // import javascript
    app.import(app.bowerDirectory + '/moment/moment.js');
    app.import(app.bowerDirectory + '/pikaday/pikaday.js');
  }

};
