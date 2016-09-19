/*
  Apparently, the new api.export takes care of issues here. No need to attach to global namespace.
  See http://shiggyenterprises.wordpress.com/2013/09/09/meteor-packages-in-coffeescript-0-6-5/

  We may want to make UserSessions a server collection to take advantage of indices.
  Will implement if someone has enough online users to warrant it.
 */
var StatusInternals, UserConnections, UserStatus, activeSession, addSession, idleSession, loginSession, onStartup, removeSession, statusEvents, tryLogoutSession;

UserConnections = new Mongo.Collection("user_status_sessions", {
  connection: null
});

statusEvents = new (Npm.require('events').EventEmitter)();


/*
  Multiplex login/logout events to status.online

  'online' field is "true" if user is online, and "false" otherwise

  'idle' field is tri-stated:
  - "true" if user is online and not idle
  - "false" if user is online and idle
  - null if user is offline
 */

statusEvents.on("connectionLogin", function(advice) {
  
  var conns, update;
  update = {
    $set: {
      'status.online': true,
      'status.lastLogin': {
        date: advice.loginTime,
        ipAddr: advice.ipAddr,
        userAgent: advice.userAgent
      }
    }
  };
  conns = UserConnections.find({
    userId: advice.userId
  }).fetch();
  if (!_.every(conns, function(c) {
    return c.idle;
  })) {
    update.$set['status.idle'] = false;
    update.$unset = {
      'status.lastActivity': null
    };
  }
  Meteor.users.update(advice.userId, update);
});

statusEvents.on("connectionLogout", function(advice) {
  var conns;
  conns = UserConnections.find({
    userId: advice.userId
  }).fetch();
  if (conns.length === 0) {
    Meteor.users.update(advice.userId, {
      $set: {
        'status.online': false
      },
      $unset: {
        'status.idle': null,
        'status.lastActivity': null
      }
    });
  } else if (_.every(conns, function(c) {
    return c.idle;
  })) {

    /*
      All remaining connections are idle:
      - If the last active connection quit, then we should go idle with the most recent activity
    
      - If an idle connection quit, nothing should happen; specifically, if the
        most recently active idle connection quit, we shouldn't tick the value backwards.
        This may result in a no-op so we can be smart and skip the update.
     */
    if (advice.lastActivity != null) {
      return;
    }
    Meteor.users.update(advice.userId, {
      $set: {
        'status.idle': true,
        'status.lastActivity': _.max(_.pluck(conns, "lastActivity"))
      }
    });
  }
});


/*
  Multiplex idle/active events to status.idle
  TODO: Hopefully this is quick because it's all in memory, but we can use indices if it turns out to be slow

  TODO: There is a race condition when switching between tabs, leaving the user inactive while idle goes from one tab to the other.
  It can probably be smoothed out.
 */

statusEvents.on("connectionIdle", function(advice) {
  var conns;
  conns = UserConnections.find({
    userId: advice.userId
  }).fetch();
  if (!_.every(conns, function(c) {
    return c.idle;
  })) {
    return;
  }
  Meteor.users.update(advice.userId, {
    $set: {
      'status.idle': true,
      'status.lastActivity': _.max(_.pluck(conns, "lastActivity"))
    }
  });
});

statusEvents.on("connectionActive", function(advice) {
  Meteor.users.update(advice.userId, {
    $set: {
      'status.idle': false
    },
    $unset: {
      'status.lastActivity': null
    }
  });
});

onStartup = function(selector) {
  if (selector == null) {
    selector = {};
  }
  return Meteor.users.update(selector, {
    $set: {
      "status.online": false
    },
    $unset: {
      "status.idle": null,
      "status.lastActivity": null
    }
  }, {
    multi: true
  });
};


/*
  Local session modifification functions - also used in testing
 */

addSession = function(connection) {
  console.log(connection);
  UserConnections.upsert(connection.id, {
    $set: {
      ipAddr: connection.clientAddress,
      userAgent: connection.httpHeaders['user-agent']
    }
  });
};

loginSession = function(connection, date, userId) {
  UserConnections.upsert(connection.id, {
    $set: {
      userId: userId,
      loginTime: date
    }
  });
  statusEvents.emit("connectionLogin", {
    userId: userId,
    connectionId: connection.id,
    ipAddr: connection.clientAddress,
    userAgent: connection.httpHeaders['user-agent'],
    loginTime: date
  });
};

tryLogoutSession = function(connection, date) {
  var conn;
  if ((conn = UserConnections.findOne({
    _id: connection.id,
    userId: {
      $exists: true
    }
  })) == null) {
    return false;
  }
  UserConnections.upsert(connection.id, {
    $unset: {
      userId: null,
      loginTime: null
    }
  });
  return statusEvents.emit("connectionLogout", {
    userId: conn.userId,
    connectionId: connection.id,
    lastActivity: conn.lastActivity,
    logoutTime: date
  });
};

removeSession = function(connection, date) {
  tryLogoutSession(connection, date);
  UserConnections.remove(connection.id);
};

idleSession = function(connection, date, userId) {
  UserConnections.update(connection.id, {
    $set: {
      idle: true,
      lastActivity: date
    }
  });
  statusEvents.emit("connectionIdle", {
    userId: userId,
    connectionId: connection.id,
    lastActivity: date
  });
};

activeSession = function(connection, date, userId) {
  UserConnections.update(connection.id, {
    $set: {
      idle: false
    },
    $unset: {
      lastActivity: null
    }
  });
  statusEvents.emit("connectionActive", {
    userId: userId,
    connectionId: connection.id,
    lastActivity: date
  });
};


/*
  Handlers for various client-side events
 */

Meteor.startup(onStartup);

Meteor.onConnection(function(connection) {
  addSession(connection);
  return connection.onClose(function() {
    return removeSession(connection, new Date());
  });
});

Accounts.onLogin(function(info) {
  return loginSession(info.connection, new Date(), info.user._id);
});

Meteor.publish(null, function() {
  if (this._session == null) {
    return [];
  }
  if (this.userId == null) {
    tryLogoutSession(this._session.connectionHandle, new Date());
  }
  return [];
});

Meteor.methods({
  "user-status-idle": function(timestamp) {
    var date;
    check(timestamp, Match.OneOf(null, void 0, Date, Number));
    date = timestamp != null ? new Date(timestamp) : new Date();
    idleSession(this.connection, date, this.userId);
  },
  "user-status-active": function(timestamp) {
    var date;
    check(timestamp, Match.OneOf(null, void 0, Date, Number));
    date = timestamp != null ? new Date(timestamp) : new Date();
    activeSession(this.connection, date, this.userId);
  }
});

UserStatus = {
  connections: UserConnections,
  events: statusEvents
};

StatusInternals = {
  onStartup: onStartup,
  addSession: addSession,
  removeSession: removeSession,
  loginSession: loginSession,
  tryLogoutSession: tryLogoutSession,
  idleSession: idleSession,
  activeSession: activeSession
};




process.env.HTTP_FORWARDED_COUNT = 1;
  Meteor.publish(null, function() {
    return [
      Meteor.users.find({
        "status.online": true
      }, {
        fields: {
          status: 1,
          username: 1
        }
      }), UserStatus.connections.find()
    ];
  });
