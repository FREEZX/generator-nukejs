'use strict';
var crossroads = require('crossroads');
var <%= slugifiedPluralName %> = require('../controllers/<%= slugifiedPluralName %>.controller.js');
var users = require('../controllers/users.controller.js');

module.exports = function(app) {
  crossroads.addRoute('/<%= slugifiedSingularName %>/list', [users.requiresLogin, <%= slugifiedPluralName %>.list]);
  crossroads.addRoute('/<%= slugifiedSingularName %>/create', [users.requiresLogin, <%= slugifiedPluralName %>.create]);
  crossroads.addRoute('/<%= slugifiedSingularName %>/update/{<%= slugifiedSingularName %>Id}', [users.requiresLogin, <%= slugifiedPluralName %>.hasAuthorization, <%= slugifiedPluralName %>.update]);
  crossroads.addRoute('/<%= slugifiedSingularName %>/delete/{<%= slugifiedSingularName %>Id}', [users.requiresLogin, <%= slugifiedPluralName %>.hasAuthorization, <%= slugifiedPluralName %>.delete]);
  crossroads.addRoute('/<%= slugifiedSingularName %>/{<%= slugifiedSingularName %>Id}', <%= slugifiedPluralName %>.read);

  crossroads.param('<%= slugifiedSingularName %>Id', <%= slugifiedPluralName %>.<%= slugifiedSingularName %>ByID);
};
