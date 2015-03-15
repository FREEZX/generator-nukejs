'use strict';

var should = require('should');
var Primus = require('primus');
var mongoose = require('mongoose');
var <%= classifiedSingularName %> = mongoose.model('<%= classifiedSingularName %>');
var User = mongoose.model('User');

var <%= slugifiedSingularName %>;

var go = function(client) {
  describe('<%= humanizedSingularName %> Routes Unit Tests', function() {
    beforeEach(function(done) {
      // Try to login the user via the socket
      var user = new User({
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        email: 'test@test.com',
        username: 'username',
        password: 'password'
      });

      user.save(function(err, user){
        client.request('/auth/signin', { username: user.username, password: 'password' })
        .then(function(){
          <%= slugifiedSingularName %> = {
            title: 'Title',
            content: 'Content',
            user: user.id
          };

          done();
        });
      });
    });
    afterEach(function(done) {
      <%= classifiedSingularName %>.remove().exec(function(){
        User.remove().exec(function(){
          done();
        });
      });
    });

    it('should be able to insert <%= humanizedSingularName %>', function(done){
      client.request('/<%= slugifiedSingularName %>/create', <%= slugifiedSingularName %>)
      .then(function(data){
        data._id.should.be.type('string');
        data.title.should.match(<%= slugifiedSingularName %>.title);
        data.content.should.match(<%= slugifiedSingularName %>.content);
        done();
      })
      .fail(function(data){
        done(new Error(data));
      });
    });

    it('should be able to get <%= humanizedSingularName %> by id', function(done){
      var <%= slugifiedSingularName %>Obj = new <%= classifiedSingularName %>(<%= slugifiedSingularName %>);
      <%= slugifiedSingularName %>Obj.save(function(err, doc){
        client.request('/<%= slugifiedSingularName %>/'+doc.id)
        .then(function(data){
          data._id.should.match(doc.id);
          data.title.should.match(<%= slugifiedSingularName %>.title);
          data.content.should.match(<%= slugifiedSingularName %>.content);
          done();
        })
        .fail(function(data){
          done(new Error(data));
        });
      });
    });

    it('should be able to update <%= humanizedSingularName %> by id', function(done){
      var <%= slugifiedSingularName %>Obj = new <%= classifiedSingularName %>(<%= slugifiedSingularName %>);
      <%= slugifiedSingularName %>Obj.save(function(err, doc){
        <%= slugifiedSingularName %>.title = 'Changed Title';
        client.request('/<%= slugifiedSingularName %>/update/'+doc.id, <%= slugifiedSingularName %>)
        .then(function(data){
          data._id.should.match(doc.id);
          data.title.should.match(<%= slugifiedSingularName %>.title);
          data.content.should.match(<%= slugifiedSingularName %>.content);
          done();
        })
        .fail(function(data){
          done(new Error(data));
        });
      });
    });

    it('should be able to delete <%= humanizedSingularName %> by id', function(done){
      var <%= slugifiedSingularName %>Obj = new <%= classifiedSingularName %>(<%= slugifiedSingularName %>);
      <%= slugifiedSingularName %>Obj.save(function(err, doc){
        client.request('/<%= slugifiedSingularName %>/delete/'+doc.id)
        .then(function(data){
          data._id.should.match(doc.id);
          done();
        })
        .fail(function(data){
          done(new Error(data));
        });
      });
    });



    it('should be able to list <%= humanizedPluralName %>', function(done){
      var <%= slugifiedSingularName %>Obj1 = new <%= classifiedSingularName %>(<%= slugifiedSingularName %>);
      <%= slugifiedSingularName %>Obj1.save(function(err, <%= slugifiedSingularName %>1){
        var <%= slugifiedSingularName %>Obj2 = new <%= classifiedSingularName %>(<%= slugifiedSingularName %>);
        <%= slugifiedSingularName %>Obj2.save(function(err, <%= slugifiedSingularName %>2){
          client.request('/<%= slugifiedSingularName %>/list')
          .then(function(data){
            data[0]._id.should.match(<%= slugifiedSingularName %>2.id);
            data[0].title.should.match(<%= slugifiedSingularName %>2.title);
            data[0].content.should.match(<%= slugifiedSingularName %>2.content);
            data[1]._id.should.match(<%= slugifiedSingularName %>1.id);
            data[1].title.should.match(<%= slugifiedSingularName %>1.title);
            data[1].content.should.match(<%= slugifiedSingularName %>1.content);
            done();
          })
          .fail(function(data){
            done(new Error(data));
          });
        });
      });
    });
  });
};

//Initialize connection and start tests
require('./clientconnection.js')(go);
