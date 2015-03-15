'use strict';
var yeoman = require('yeoman-generator');
var inflection = require('inflection');

module.exports = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.slugifiedName = this._.slugify(this.name);

    this.slugifiedPluralName = inflection.pluralize(this.slugifiedName);
    this.slugifiedSingularName = inflection.singularize(this.slugifiedName);

    this.camelizedPluralName = this._.camelize(this.slugifiedPluralName);
    this.camelizedSingularName = this._.camelize(this.slugifiedSingularName);

    this.classifiedPluralName = this._.classify(this.slugifiedPluralName);
    this.classifiedSingularName = this._.classify(this.slugifiedSingularName);

    this.humanizedPluralName = this._.humanize(this.slugifiedPluralName);
    this.humanizedSingularName = this._.humanize(this.slugifiedSingularName);

    this.log('You called the Nukejs subgenerator with the argument ' + this.name + '.');
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('_controller.js'),
      this.destinationPath('app/controllers/' + this.slugifiedPluralName + '.controller.js'),
      this
    );
    this.fs.copyTpl(
      this.templatePath('_model.js'),
      this.destinationPath('app/models/' + this.slugifiedSingularName + '.model.js'),
      this
    );
    this.fs.copyTpl(
      this.templatePath('_routes.js'),
      this.destinationPath('app/routes/' + this.slugifiedSingularName + '.routes.js'),
      this
    );
    this.fs.copyTpl(
      this.templatePath('_model.test.js'),
      this.destinationPath('app/tests/models/' + this.slugifiedSingularName + '.model.test.js'),
      this
    );
    this.fs.copyTpl(
      this.templatePath('_routes.test.js'),
      this.destinationPath('app/tests/routes/' + this.slugifiedSingularName + '.routes.test.js'),
      this
    );
  }
});
