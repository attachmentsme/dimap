var _ = require('underscore'),
  http = require('http'),
  AttachmentGrabber = require('./attachment-grabber').AttachmentGrabber,
  Promise = require('node-promise').Promise;

function Proxy(opts) {
  _.extend(this, {
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    attachmentGrabberSettings: null,
    onConnection: function(url, settings, settingsCallback) {
      // this callback can be used to override the settings
      // that are passed to the class that downloads attachments
      // over IMAP. This is useful if, for instance, we want
      // to build an authentication system on top of dimap.
      settingsCallback(settings);
    }
  }, opts);
};

Proxy.prototype.start = function() {

  var _this = this,
    server = http.createServer(function(req, res) {
      var msgId = req.url.split('/')[1],
        filename = decodeURIComponent( req.url.split('/')[2] );

      // having a /ping endpoint is 
      // useful for load balancers.
      if (msgId == 'ping') {
        res.writeHead(200);
        res.end();
      } else { // otherwise we should proxy to gmail.
        _this.proxyToAttachment(res, msgId, filename, req.url);
      }

    });
  
  server.addListener('error', function(err) {
    console.log(err.stack);
  });
  
  console.log('listening on', this.port, this.host)
  server.listen(this.port, this.host);  
};

Proxy.prototype.proxyToAttachment = function(res, msgId, filename, originalUrl) {
  var proxyAttachment = new Promise();

  this.onConnection(originalUrl, this.attachmentGrabberSettings, function(settings) {

    // allow the filename/msgId parsed from the URL to be
    // overridden by just-in-time generated settings.
    if (settings.msgId) msgId = settings.msgId;
    if (settings.filename) filename = settings.filename;

    var ag = new AttachmentGrabber(settings);

    ag.connect().then(selectAllMail, function(err) {proxyAttachment.reject(err);} );

    function selectAllMail() {
      ag.selectAllMail().then(getAttachmentByGMSGID, function(err) { proxyAttachment.reject(err);});
    }

    function getAttachmentByGMSGID() {
      ag.getAttachmentByGMSGID(msgId, filename).then(function(attachment) {proxyAttachment.resolve(attachment);}, function(err) { proxyAttachment.reject(err);});
    }

    proxyAttachment.then(
      function(attachment) {
        ag.logout();

        res.writeHead(200, {
          'Content-Type': attachment.contentType
        });
        res.write( attachment.content );
        res.end();
      },
      function(err) {
        console.log(err);
        ag.logout();

        res.writeHead(404);
        res.end();
      }
    );
  });
};

exports.Proxy = Proxy;