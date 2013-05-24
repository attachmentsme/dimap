DIMAP
===============

An HTTP REST interface to attachments in your Gmail account.

Word of Warning
---------------

DIMAP is a proof of concept, I wanted to get a feel for how fast attachments could be proxied over HTTP.

I built this during one hack day at work, this is probably not production ready.

Usage
-----

```bash
npm install dimap -g
dimap -u bencoe@gmail.com -p password
```

Once you've installed DIMAP:

* Find an email in your __All Mail__ folder with an attachment.
* Inside a web-browser navigate to 127.0.0.1:8000/MSGID/FILENAME
  * e.g., here's a URL that works on my account: http://127.0.0.1:8000/13ecdddc67300f2a/bencoe.jpg

Have fun.

Copyright
---------

Copyright (c) 2013 Attachments.me. See LICENSE.txt for further details.