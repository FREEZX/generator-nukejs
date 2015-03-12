'use strict';

module.exports = {
  appName: '<%= appName %>',
  port: process.env.PORT || 3000,
  redis: process.env.REDIS_URL ||'',
  sessionSecret: '<%= sessionSecret %>',
  cookie: {},
  cachebox: {
    ttl: 30
  },
  db: {
    uri: process.env.MONGO_URL || ('mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '<%= appNameSlug %>')
  },
  cdn_base: process.env.CDN_BASE,
  assets: { //All of these must be contained in the public folder
    js: [
      '/primus/primus.js#nomin#nocdn',
      'lib/lodash/lodash.js',
      'lib/q/q.js',
      'lib/jquery/dist/jquery.js',
      'lib/bootstrap/dist/js/bootstrap.js',
      'lib/highcharts-release/highcharts.js',
      'js/bundle.js'
    ],
    css: [
      'css/global.css',
      'lib/fontawesome/css/font-awesome.css',
      'lib/bootstrap/dist/css/bootstrap.css'
    ]
  }
};
