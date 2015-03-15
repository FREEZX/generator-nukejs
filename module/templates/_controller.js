'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.controller'),
  <%= classifiedSingularName %> = mongoose.model('<%= classifiedSingularName %>'),
  _ = require('lodash');

/**
 * Create <%= humanizedSingularName %>
 */
exports.create = function(spark, message) {
  var <%= slugifiedSingularName %> = new <%= classifiedSingularName %>(message.data);
  <%= slugifiedSingularName %>.user = spark.request.user;

  <%= slugifiedSingularName %>.save(function(err) {
    if (err) {
      return spark.status(400).error({
        message: errorHandler.getErrorMessage(err)
      }, message);
    } else {
      spark.response(<%= slugifiedSingularName %>, message);
    }
  });
};

/**
 * Show the current <%= humanizedSingularName %>
 */
exports.read = function(spark, message) {
  spark.response(spark.request.<%= slugifiedSingularName %>, message);
};

/**
 * Update <%= humanizedSingularName %>
 */
exports.update = function(spark, message) {
  var <%= slugifiedSingularName %> = spark.request.<%= slugifiedSingularName %>;

  <%= slugifiedSingularName %> = _.extend(<%= slugifiedSingularName %>, message.data);

  <%= slugifiedSingularName %>.save(function(err) {
    if (err) {
      return spark.status(400).error({
        message: errorHandler.getErrorMessage(err)
      }, message);
    } else {
      spark.response(<%= slugifiedSingularName %>, message);
    }
  });
};

/**
 * Delete <%= humanizedSingularName %>
 */
exports.delete = function(spark, message) {
  var <%= slugifiedSingularName %> = spark.request.<%= slugifiedSingularName %>;

  <%= slugifiedSingularName %>.remove(function(err) {
    if (err) {
      return spark.status(400).error({
        message: errorHandler.getErrorMessage(err)
      }, message);
    } else {
      spark.response(<%= slugifiedSingularName %>, message);
    }
  });
};

/**
 * List of <%= humanizedPluralName %>
 */
exports.list = function(spark, message) {
  <%= classifiedSingularName %>.find().sort('-created').limit(30).populate('user', 'displayName').exec(function(err, <%= slugifiedPluralName %>) {
    if (err) {
      return spark.status(400).response({
        message: errorHandler.getErrorMessage(err)
      }, message);
    } else {
      spark.response(<%= slugifiedPluralName %>, message);
    }
  });
};

/**
 * <%= humanizedSingularName %> middleware
 */
exports.<%= slugifiedSingularName %>ByID = function(spark, message, id) {
  var cb = arguments[arguments.length-1];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    var err = {
      message: '<%= humanizedSingularName %> is invalid'
    };
    spark.status(400).error(err, message);

    return cb(err);
  }

  <%= classifiedSingularName %>.findById(id).populate('user', 'displayName').exec(function(err, <%= slugifiedSingularName %>) {
    if (err) return cb(err);
    if (!<%= slugifiedSingularName %>) {
      err = {
          message: '<%= humanizedSingularName %> not found'
        };
      return spark.status(404).error(err, message);
    }
    spark.request.<%= slugifiedSingularName %> = <%= slugifiedSingularName %>;
    cb();
  });
};

/**
 * <%= humanizedSingularName %> authorization middleware
 */
exports.hasAuthorization = function(spark, message) {
  var cb = arguments[arguments.length-1];
  if (spark.request.<%= slugifiedSingularName %>.user.id !== spark.request.user.id) {
    var err = {
      message: 'User is not authorized'
    };
    spark.status(403).error(err, message);
    return cb(err);
  }
  cb();
};
