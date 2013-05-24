DIMAP
-----

Provides an HTTP REST interface to attachments in your Gmail account.

Why I Built It?
===============

DIMAP is a proof of concept of something I'd like to build at Attachments.me.

I built this during a hack day at work, this is by now means production ready!

Usage
=====

```bash
npm install dimap -g
dimap -u bencoe@gmail.com -p password
```

Once you've installed DIMAP:

* Find an email in your All Mail folder with an attachment.
* Inside your browser navigate to 127.0.0.1:8000/MSGID/filename
  * e.g., here's a URL that works on my account:

Have fun!

Copyright
---------

Copyright (c) 2013 Attachments.me. See LICENSE.txt for further details.