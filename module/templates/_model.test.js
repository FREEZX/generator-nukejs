'use strict';

var should = require('should');
var mongoose = require('mongoose');
var <%= classifiedSingularName %> = mongoose.model('<%= classifiedSingularName %>');
var User = mongoose.model('User');

var <%= slugifiedSingularName %>, user;

/**
 * Globals
 */
var user, <%= slugifiedSingularName %>;

/**
 * Unit tests
 */
describe('<%= humanizedSingularName %> Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      <%= slugifiedSingularName %> = new <%= classifiedSingularName %>({
        title: '<%= humanizedSingularName %> Title',
        content: '<%= humanizedSingularName %> Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return <%= slugifiedSingularName %>.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function(done) {
      <%= slugifiedSingularName %>.title = '';

      return <%= slugifiedSingularName %>.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    <%= classifiedSingularName %>.remove().exec(function() {
      User.remove().exec(done);
    });
  });
});
