var assert = require('assert'),
  AttachmentGrabber = require('../lib').AttachmentGrabber,
  sinon = require('sinon');

describe('AttachmentGrabber', function() {
  describe('#selectAllMail', function() {

    beforeEach(function() {
      this.xlist = {
        '[Gmail]': {
          children: {
            Borradores: {
              attribs: [ 'HASNOCHILDREN', 'DRAFTS' ]
            },
            Todos: {
              attribs: [ 'HASNOCHILDREN', 'ALLMAIL' ]
            }
          }
        }
      }
    });

    it('should call #openBox with folder that contains all mail', function(done) {
      var attachmentGrabber = new AttachmentGrabber({
        autoConnect: false
      });

      attachmentGrabber.imap.getBoxes = sinon.mock().callsArgWith(0, null, this.xlist).once();
      attachmentGrabber.imap.openBox = sinon.mock().callsArgWith(2, null).once();

      attachmentGrabber.selectAllMail().then(function() {
        assert( attachmentGrabber.imap.openBox.calledWith('[Gmail]/Todos') );
        done();
      });
    });

  });
});