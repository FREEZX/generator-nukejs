'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  jwt = require('jwt-simple'),
  config = require('../../../config/config.js'),
  User = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function(spark, message) {
  // For security measurement we remove the roles from the req.body object
  delete spark.request.body.roles;

  // Init Variables
  var user = new User(spark.request.body);

  // Add missing user fields
  user.provider = 'jwt';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function(err) {
    if (err) {
      spark.status(400).error({message: errorHandler.getErrorMessage(err)}, message);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      spark.request.login(user, function(err) {
        if (err) {
          spark.status(400).error(err, message);
        } else {
          spark.response(user, message);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function(spark, message) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      spark.status(400).error(info, message);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      spark.request.login(user, function(err) {
        if (err) {
          spark.status(400).error({message: errorHandler.getErrorMessage(err)}, message);
        } else {

          // token expire time
          var expireTime = Date.now() + (2 * 60 * 60 * 1000); // 2 hours from now

          // generate login token
          var tokenPayload = {
            user: user.id,
            username: user.username,
            expires: expireTime
          };
          var token = jwt.encode(tokenPayload, config.sessionSecret);
          user = user.toObject();
          user.token = token;

          spark.response(user, message);
        }
      });
    }
  })(spark.request, console.log, console.log);
};

/**
 * Signout
 */
exports.signout = function(spark, message) {
  spark.request.logout();
  spark.response({}, message);
};

// /**
//  * OAuth callback
//  */
// exports.oauthCallback = function(strategy) {
//  return function(req, res, next) {
//    passport.authenticate(strategy, function(err, user, redirectURL) {
//      if (err || !user) {
//        return res.redirect('/#!/signin');
//      }
//      req.login(user, function(err) {
//        if (err) {
//          return res.redirect('/#!/signin');
//        }

//        return res.redirect(redirectURL || '/');
//      });
//    })(req, res, next);
//  };
// };

// /**
//  * Helper function to save or update a OAuth user profile
//  */
// exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
//  if (!req.user) {
//    // Define a search query fields
//    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
//    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

//    // Define main provider search query
//    var mainProviderSearchQuery = {};
//    mainProviderSearchQuery.provider = providerUserProfile.provider;
//    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

//    // Define additional provider search query
//    var additionalProviderSearchQuery = {};
//    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

//    // Define a search query to find existing user with current provider profile
//    var searchQuery = {
//      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
//    };

//    User.findOne(searchQuery, function(err, user) {
//      if (err) {
//        return done(err);
//      } else {
//        if (!user) {
//          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

//          User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
//            user = new User({
//              firstName: providerUserProfile.firstName,
//              lastName: providerUserProfile.lastName,
//              username: availableUsername,
//              displayName: providerUserProfile.displayName,
//              email: providerUserProfile.email,
//              provider: providerUserProfile.provider,
//              providerData: providerUserProfile.providerData
//            });

//            // And save the user
//            user.save(function(err) {
//              return done(err, user);
//            });
//          });
//        } else {
//          return done(err, user);
//        }
//      }
//    });
//  } else {
//    // User is already logged in, join the provider data to the existing user
//    var user = req.user;

//    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
//    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
//      // Add the provider data to the additional provider data field
//      if (!user.additionalProvidersData) user.additionalProvidersData = {};
//      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

//      // Then tell mongoose that we've updated the additionalProvidersData field
//      user.markModified('additionalProvidersData');

//      // And save the user
//      user.save(function(err) {
//        return done(err, user, '/#!/settings/accounts');
//      });
//    } else {
//      return done(new Error('User is already connected using this provider'), user);
//    }
//  }
// };

// /**
//  * Remove OAuth provider
//  */
// exports.removeOAuthProvider = function(req, res, next) {
//  var user = req.user;
//  var provider = req.param('provider');

//  if (user && provider) {
//    // Delete the additional provider
//    if (user.additionalProvidersData[provider]) {
//      delete user.additionalProvidersData[provider];

//      // Then tell mongoose that we've updated the additionalProvidersData field
//      user.markModified('additionalProvidersData');
//    }

//    user.save(function(err) {
//      if (err) {
//        return res.status(400).send({
//          message: errorHandler.getErrorMessage(err)
//        });
//      } else {
//        req.login(user, function(err) {
//          if (err) {
//            res.status(400).send(err);
//          } else {
//            res.json(user);
//          }
//        });
//      }
//    });
//  }
// };
