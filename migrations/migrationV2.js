'use strict';
module.exports = function(app) {
  var mysqldb = app.dataSources.mysqldb;

  // first autoupdate the `Author` model to avoid foreign key constraint failure
  mysqldb.autoupdate('route', function(err) {
    if (err) throw err;
    console.log('\nAutoupdated table `Author`.');
  });
};
