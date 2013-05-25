DIMAP
===============

An HTTP REST interface for attachments in your Gmail account.

Word of Warning
---------------

DIMAP is a proof of concept, I wanted to get a feel for how fast attachments could be proxied from IMAP over HTTP.

I built this during one hack day at work, i.e., this is probably not production ready.

Usage
-----

```bash
npm install dimap -g
dimap -u bencoe@gmail.com -p password
```

Once you've installed DIMAP:

* Find an message in your __All Mail__ folder with Attachments.
* Inside a web-browser navigate to 127.0.0.1:8000/MSGID/FILENAME.
  * Here's a URL that works for my account: http://127.0.0.1:8000/13ecdddc67300f2a/bencoe.jpg

Have fun.

Copyright
---------

Copyright (c) 2013 Attachments.me. See LICENSE.txt for further details.