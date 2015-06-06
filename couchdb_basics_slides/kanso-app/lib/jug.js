exports.attendees = function () {
  return 'Uwe, a bunch of Java geeks and Andy.';  
}

var db = require('db').current();

exports.get_data = function () {
  var $get_data = $('.js_get_data');
  var mod = this;

  mod.init = function () {
    $get_data.on('click', function (e) {
      e.preventDefault();
      mod.get_data();
    });
  }

  mod.get_data = function () {
    db.getView('jug-kanso', 'attendees', function (err, data) {
      if (err) {
        mod.write_data(err);
      }
      var out = '';
      for (var i = 0; i < data.rows.length; i++) {
        out += data.rows[i].key[1] + ', ' + 
               data.rows[i].key[0] + ': ' +  
               data.rows[i].value  + '<br />';
      }
      mod.write_data(out);
    });
  }

  mod.write_data = function (data) {
    $('#data').html(data);
  }

  return {
    init: mod.init()
  }
}