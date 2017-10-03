// Generated by CoffeeScript 1.10.0

/*
Created by Robsdedude on 01/10/2017
Virtual gamepad application
 */

(function() {
  var earlyDeathCount, exiting, forever, i, len, log, ref, server, sig;

  forever = require('forever-monitor');

  log = require('./lib/log');

  server = new forever.Monitor('server.js', {
    max: Infinity,
    args: []
  });

  exiting = false;

  server.on('exit', function() {
    return log('warning', 'server.js has exited');
  });

  earlyDeathCount = 0;

  server.on('exit:code', function() {
    var diedAfter;
    if (exiting) {
      return;
    }
    diedAfter = Date.now() - server.ctime;
    log('info', 'diedAfter:', diedAfter);
    earlyDeathCount = diedAfter < 5000 ? earlyDeathCount + 1 : 0;
    log('info', 'earlyDeathCount:', earlyDeathCount);
    if (earlyDeathCount >= 3) {
      log('error', 'Died too often too fast.');
      return server.stop();
    }
  });

  server.on('restart', function() {
    return log('error', 'Forever restarting script for ' + server.times + ' time');
  });

  ref = ['SIGTERM', 'SIGINT', 'exit'];
  for (i = 0, len = ref.length; i < len; i++) {
    sig = ref[i];
    process.on(sig, (function(s) {
      return function() {
        log('info', 'received', s);
        exiting = true;
        return server.stop();
      };
    })(sig));
  }

  server.start();

}).call(this);
