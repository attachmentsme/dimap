DIMAP
===============

An HTTP REST interface for attachments in your Gmail account.

Usage
-----

```bash
npm install dimap -g
dimap -u bencoe@gmail.com -p password
```

You can also run dimap with XOAUTH credentials (which can be generated using my fork of [node-oauth](https://github.com/bcoe/node-oauth), or a similar library).

```bash
dimap -x qwerty=
```

Once You've Got DIMAP up and running:

* Find a message in your __All Mail__ folder with Attachments.
* Inside a web-browser navigate to 127.0.0.1:8000/MSGID/FILENAME.
  * Here's a URL that works for my account: http://127.0.0.1:8000/13ecdddc67300f2a/bencoe.jpg

onConnection() Hook
-------------------

The onConnection hook fires when a connection is made to the IMAP proxy, prior to negotiating a connection to Gmail through IMAP.

We've used this hook at Attachments.me to build an authentication system on top of DIMAP.

To Do
-----

* Add hooks for $statsd event logging.
* Make it so dimap can support multiple mailboxes based on tag, e.g., "ALL MAIL", "TRASH".

Have fun, and be careful!

Copyright
---------

Copyright (c) 2013 Attachments.me. See LICENSE.txt for further details.