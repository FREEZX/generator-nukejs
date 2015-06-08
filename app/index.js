'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var crypto = require('crypto');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Nukejs') + ' generator!'
    ));

    var prompts = [{
      name: 'appName',
      message: 'What is your app\'s name?',
      default: 'Nuke.js app'
    },{
      type: 'confirm',
      name: 'addArticlesModule',
      message: 'Would you like to generate a demo "articles" module (Recommended)?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.appNameSlug = this._.slugify(props.appName);
      this.addArticlesModule = props.addArticlesModule;

      done();
    }.bind(this));

    //Generate session secret
    this.sessionSecret = crypto.randomBytes(16).toString('hex');
  },

  writing: {
    app: function () {
      this.template('_package.json', 'package.json');
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
      this.copy('nodemon.json');
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
      this.copy('README.md');
      this.copy('LICENSE.md');
      this.fs.copy(
        this.templatePath('public/js/jshintrc'),
        this.destinationPath('public/js/.jshintrc')
      );
    },

    configfiles: function () {
      this.copy('build.js');
      this.copy('server.js');

      //Config folder
      this.copy('config/config.js');
      this.copy('config/init.js');
      this.copy('config/http.js');
      this.copy('config/express.js');
      this.copy('config/primus.js');
      this.copy('config/mongoose.js');
      this.copy('config/passport.js');
      this.copy('config/filters.js');
      this.copy('config/strategies/local.js');
      this.copy('config/middleware/primus-response.js');

      //Env files
      this.template('config/env/_all.js', 'config/env/all.js');
      this.template('config/env/_development.js', 'config/env/development.js');
      this.template('config/env/_test.js', 'config/env/test.js');
      this.copy('config/env/production.js');
    },

    backendfiles: function() {

      //Controllers
      this.copy('app/controllers/core.controller.js');
      this.copy('app/controllers/users.controller.js');
      this.copy('app/controllers/errors.controller.js');
      this.directory('app/controllers/users');

      //Model
      this.copy('app/models/user.model.js');

      //Routes
      this.copy('app/routes/core.routes.js');
      this.copy('app/routes/users.routes.js');

      //Views
      this.directory('app/views');

      //If articles should be generated
      if(this.addArticlesModule){
        this.copy('app/controllers/articles.controller.js');
        this.copy('app/models/article.model.js');
        this.copy('app/routes/article.routes.js');
        this.directory('app/tests');
      }
      this.copy('app/tests/routes/clientconnection.js');
    },

    frontendfiles: function() {
      this.directory('public/css');
      this.directory('public/img');
      this.copy('public/favicon.ico');

      //Js files
      this.directory('public/js/elements');
      this.copy('public/js/stores/AppStore.js');

      this.copy('public/js/components/Benchmarks.js');
      this.template('public/js/components/_Header.js', 'public/js/components/Header.js');
      this.copy('public/js/components/Home.js');
      this.copy('public/js/components/Login.js');
      this.copy('public/js/components/Logout.js');
      this.copy('public/js/components/Signup.js');

      if(this.addArticlesModule) {
        this.copy('public/js/stores/ArticleStore.js');
        this.copy('public/js/components/Articles.js');
      }

      this.template('public/js/_app.js', 'public/js/app.js');
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
