#!/usr/bin/env node

var AttachmentGrabber = require('../lib').AttachmentGrabber,
  Proxy = require('../lib').Proxy
  optimist = require('optimist');

var argv = optimist
  .options('u', {
    alias: 'gmail_user',
    describe: 'Gmail, .e.g., example@gmail.com'
  })
  .options('p', {
    alias: 'gmail_password',
    describe: 'Gmail password'
  })
  .options('s', {
    alias: 'host',
    default: '127.0.0.1',
    describe: 'Host to bind to, e.g., 127.0.0.1'
  })
  .options('o', {
    alias: 'port',
    default: 8000,
    describe: 'Port to bind to, e.g., 8000'
  })
  .options('h', {
    alias: 'help',
    describe: 'show help.'
  })
  .options('x', {
    alias: 'xoauth',
    describe: 'authenticate using an xoauth string'
  })
  .usage("dimap -u exmaple@gmail.com -p mypass -o 5000 -h 0.0.0.0")
  .argv;

var user = argv.gmail_user || process.env.GMAIL_USER,
  password = argv.gmail_password || process.env.GMAIL_PASSWORD;

if (argv.help || ! ( (user && password) || argv.xoauth) ) {
  console.log(optimist.help());
} else {
  new Proxy({
    host: argv.host,
    port: argv.port,
    attachmentGrabberSettings: {
      user: user,
      password: password,
      xoauth: argv.xoauth
    }
  }).start();
}