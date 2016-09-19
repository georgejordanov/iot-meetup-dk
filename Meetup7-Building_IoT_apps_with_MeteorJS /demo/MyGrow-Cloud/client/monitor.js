/*
  The idle monitor watches for mouse, keyboard, and blur events,
  and reports idle status to the server.

  It uses TimeSync to report accurate time.

  Everything is reactive, of course!
 */
var MonitorInternals, UserStatus, activityDep, focused, idle, idleDep, isIdle, isMonitoring, lastActivity, lastActivityTime, monitor, monitorDep, monitorId, start, stop, touch;

monitorId = null;

idle = false;

lastActivityTime = void 0;

monitorDep = new Deps.Dependency;

idleDep = new Deps.Dependency;

activityDep = new Deps.Dependency;

focused = true;

MonitorInternals = {
  idleThreshold: null,
  idleOnBlur: false,
  computeState: function(lastActiveTime, currentTime, isWindowFocused) {
    var inactiveTime;
    inactiveTime = currentTime - lastActiveTime;
    if (MonitorInternals.idleOnBlur && !isWindowFocused) {
      return true;
    }
    if (inactiveTime > MonitorInternals.idleThreshold) {
      return true;
    } else {
      return false;
    }
  },
  connectionChange: function(isConnected, wasConnected) {
    if (isConnected && !wasConnected && idle) {
      return MonitorInternals.reportIdle(lastActivityTime);
    }
  },
  onWindowBlur: function() {
    focused = false;
    return monitor();
  },
  onWindowFocus: function() {
    focused = true;
    return monitor(true);
  },
  reportIdle: function(time) {
    return Meteor.call("user-status-idle", time);
  },
  reportActive: function(time) {
    return Meteor.call("user-status-active", time);
  }
};

start = function(settings) {
  var interval;
  if (!TimeSync.isSynced()) {
    throw new Error("Can't start idle monitor until synced to server");
  }
  if (monitorId) {
    throw new Error("Idle monitor is already active. Stop it first.");
  }
  settings = settings || {};
  MonitorInternals.idleThreshold = settings.threshold || 60000;
  interval = Math.max(settings.interval || 1000, 1000);
  MonitorInternals.idleOnBlur = settings.idleOnBlur != null ? settings.idleOnBlur : false;
  monitorId = Meteor.setInterval(monitor, interval);
  monitorDep.changed();
  if (lastActivityTime == null) {
    lastActivityTime = Deps.nonreactive(function() {
      return TimeSync.serverTime();
    });
    activityDep.changed();
  }
  monitor();
};

stop = function() {
  if (!monitorId) {
    throw new Error("Idle monitor is not running.");
  }
  Meteor.clearInterval(monitorId);
  monitorId = null;
  lastActivityTime = void 0;
  monitorDep.changed();
  if (idle) {
    idle = false;
    idleDep.changed();
    MonitorInternals.reportActive(Deps.nonreactive(function() {
      return TimeSync.serverTime();
    }));
  }
};

monitor = function(setAction) {
  var currentTime, newIdle;
  if (!monitorId) {
    return;
  }
  currentTime = Deps.nonreactive(function() {
    return TimeSync.serverTime();
  });
  if (currentTime == null) {
    return;
  }
  if (setAction && (focused || !MonitorInternals.idleOnBlur)) {
    lastActivityTime = currentTime;
    activityDep.changed();
  }
  newIdle = MonitorInternals.computeState(lastActivityTime, currentTime, focused);
  if (newIdle !== idle) {
    idle = newIdle;
    idleDep.changed();
  }
};

touch = function() {
  if (!monitorId) {
    Meteor._debug("Cannot touch as idle monitor is not running.");
    return;
  }
  return monitor(true);
};

isIdle = function() {
  idleDep.depend();
  return idle;
};

isMonitoring = function() {
  monitorDep.depend();
  return monitorId != null;
};

lastActivity = function() {
  if (!isMonitoring()) {
    return;
  }
  activityDep.depend();
  return lastActivityTime;
};

Meteor.startup(function() {
  var wasConnected;
  $(window).on("click keydown", function() {
    return monitor(true);
  });
  $(window).blur(MonitorInternals.onWindowBlur);
  $(window).focus(MonitorInternals.onWindowFocus);
  if (Meteor.isCordova) {
    document.addEventListener("pause", MonitorInternals.onWindowBlur);
    document.addEventListener("resume", MonitorInternals.onWindowFocus);
  }
  focused = document.hasFocus();
  Deps.autorun(function() {
    if (!isMonitoring()) {
      return;
    }
    if (isIdle()) {
      MonitorInternals.reportIdle(lastActivityTime);
    } else {
      MonitorInternals.reportActive(lastActivityTime);
    }
  });
  wasConnected = Meteor.status().connected;
  return Deps.autorun(function() {
    var connected;
    connected = Meteor.status().connected;
    MonitorInternals.connectionChange(connected, wasConnected);
    wasConnected = connected;
  });
});

UserStatus = {
  startMonitor: start,
  stopMonitor: stop,
  pingMonitor: touch,
  isIdle: isIdle,
  isMonitoring: isMonitoring,
  lastActivity: lastActivity
};
