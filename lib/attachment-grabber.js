var _ = require('underscore'),
  Imap = require('imap'),
  Promise = require('node-promise').Promise,
  MailParser = require("mailparser").MailParser;

function AttachmentGrabber(opts) {
  _.extend(this, {
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_PASSWORD,
    xoauth: null,
    gmailPrefix: '[Gmail]'
  }, opts);
}

AttachmentGrabber.prototype.connect = function() {
  var _this = this,
    promise = new Promise();

  _this._createIMAPConnection();

  this.connectionError = null;

  this.imap.once('ready', function() {
    console.log('connected');
    promise.resolve();
  });

  this.imap.once('error', function(err) {
    _this.connectionError = err;
  });

  this.imap.once('end', function() {
    console.log('Connection closed');
  });

  this.imap.connect();

  return promise;
};

AttachmentGrabber.prototype._createIMAPConnection = function() {
  var args = {
    host: process.env.GMAIL_HOST || 'imap.googlemail.com',
    port: process.env.GMAIL_PORT || 993,
    secure: true,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  };

  if (this.xoauth) {
    args.xoauth = this.xoauth;
  } else {
    args.user = this.user;
    args.password = this.password;
  }

  this.imap = new Imap(args);
};

// Gmail specific helper for selecting All Mail regardless
// of user's language.
AttachmentGrabber.prototype.selectAllMail = function(p) {
  var _this = this,
    promise = new Promise();

  if (this.connectionError) promise.reject(this.connectionError);

  this.imap.getBoxes(function(err, boxes) {

    if (err) {
      promise.reject(err);
    } else {

      var allMailName = _this._getAllMailName(boxes);

      if (allMailName) {
        _this.imap.openBox(allMailName, true, function (err) {
          if (err) {
            promise.reject(new Error(err));
          } else {
            console.log('Selected mailbox', allMailName);
            promise.resolve();
          }
        });
      } else {
        promise.reject(new Error('Could not find All Mail'));
      }

    }

  });

  return promise;
};

AttachmentGrabber.prototype._getAllMailName = function(boxes) {
  var _this = this,
    children = boxes[this.gmailPrefix].children,
    allMailName = null;

  Object.keys( children ).forEach(function(boxName) {
    if (children[boxName].attribs.indexOf('\\All') > -1) {
      allMailName = _this.gmailPrefix + '/' + boxName;
    }
  });

  return allMailName;
};

AttachmentGrabber.prototype.getAttachmentByGMSGID = function(msgId, filename) {
  var _this = this,
    promise = new Promise();

  if (msgId.length == 16) msgId = parseInt(msgId, 16);

  this._getUID(msgId).then(
    function(results) {
      _this.getAttachmentByUID(results[0], filename, promise);
    },
    function(err) {
      promise.reject(err);
    }
  );

  return promise;
};

AttachmentGrabber.prototype._getUID = function(msgId) {
  var promise = new Promise();

  console.log(msgId);

  try {
    this.imap.search([['X-GM-MSGID', '' + msgId]], function(err, results) {
      if (err) {
        promise.reject(new Error(err));
      } else if (!results || results.length == 0) {
        promise.reject(new Error('Message ' + msgId + ' not found.'));
      } else {
        promise.resolve(results);
      }
    });
  } catch (e) {
    promise.reject(e);
  }

  return promise;
};

AttachmentGrabber.prototype.getAttachmentByUID = function(uid, filename, promise) {
  var _this = this,
    mailparser = new MailParser();

  promise = promise || new Promise();

  // Fetch the raw (unparsed) RFC-2822
  // message from IMAP.
  var fetch = this.imap.fetch([uid], { bodies: '' });

  fetch.on('message', function(msg) {
    msg.on('body', function(stream, info) {
      
      stream.on('data', function(chunk) {
        mailparser.write(chunk);
      });

      stream.on('end', function() {
        mailparser.end();
      });

    });
  });

  fetch.on('error', function() {
    promise.reject(new Error(err));
  });

  // Parse the raw message returned by the IMAP
  // library.
  mailparser.on('end', function(mail) {
    
    var attachmentFound = false;

    mail.attachments.forEach(function(attachment) {
      console.log(attachment.fileName);
      if (attachment.fileName == filename) {
        attachmentFound = true;
        promise.resolve(attachment);
      }
    });

    if (!attachmentFound) promise.reject(new Error('Attachment ' + filename + ' not found on message ' + uid))
  });

  return promise;
};

AttachmentGrabber.prototype.logout = function() {
  try {
    this.imap.end();
  } catch (e) {
    console.log(e);
  }
};

exports.AttachmentGrabber = AttachmentGrabber;