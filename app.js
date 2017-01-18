var shuffler = require('./shuffle.js');

var Pair = function (memberOne,memberTwo) {
  var self = this;
  self.memberOne = memberOne;
  self.memberTwo = memberTwo;

  self.toString = function() {
    return self.memberOne+" and "+self.memberTwo;
  }
}

var PairSession = function () {
  var self = this;
  self.pairs = new Array();

  self.isAlreadyScheduled = function(memberName) {
    for (var i=0;i<self.pairs.length;i++) {
       if (self.pairs[i].memberOne == memberName || self.pairs[i].memberTwo == memberName) {
         return true;
       }
    }
    return false;
  }

  self.numPairs = function() {
     return self.pairs.length;
  }

  self.addPair = function(pair) {
    self.pairs.push(pair);
  }

  self.toString = function() {
    var sessionStr='';
    for (var i=0;i<self.pairs.length;i++) {
      sessionStr += "\t" + self.pairs[i].toString() +"\n";
    }
    return sessionStr;
  }

  self.asMap = function() {
    var map = {};
    for (var i=0; i<self.pairs.length; i++) {
      map[self.pairs[i].memberOne] = self.pairs[i].memberTwo;
      map[self.pairs[i].memberTwo] = self.pairs[i].memberOne;
    }
    return map;
  }

}

var PairingSchedule = function(people) {
  var self = this;
  self.people = people;
  self.sessions = [];

  self.getPairs = function(memberNames) {
    var pairs = new Array();
    for (var i=0;i<memberNames.length;i++) {
       var others = memberNames.slice(i+1,memberNames.length);
       for (var j=0;j<others.length;j++) {
        pairs.push(new Pair(memberNames[i],others[j]));
       }
    }
    return pairs;
  }

  self.generate = function() {
    var pairs = self.getPairs(self.people);

    while (pairs.length > 0) {
      var session = new PairSession();
      for (var i=pairs.length-1;i>=0;i--) {
        if (!session.isAlreadyScheduled(pairs[i].memberOne) && !session.isAlreadyScheduled(pairs[i].memberTwo)) {
          session.addPair(pairs[i]);
          pairs.splice(i, 1);
        }
      }
      if (session.numPairs() != self.people.length / 2) {
        self.sessions = [];
        pairs = self.getPairs(self.people);
        shuffler.shuffle(pairs);
      } else {
        self.sessions.push(session);
      }
    }
  }

  self.toString = function() {
    var str = '';
    for (var i=0;i<self.sessions.length;i++) {
      str += "Session "+(i+1)+":\n";
      str += self.sessions[i].toString()+"\n";
    }
    return str;
  }

  self.asMap = function() {
    var map = {};

    for (var i=0; i<self.sessions.length; i++) {
      var sessionMap = self.sessions[i].asMap();
      for (var j=0; j<self.people.length; j++) {
        var person = self.people[j];
        map[person] = map[person] ? map[person] : [];
        map[person].push(sessionMap[person]);
      }
    }
    return map;
  }

}

var people = process.argv.slice(2);
if (people.length%2==1) {
  people.push('bye');
}

var schedule = new PairingSchedule(people);
schedule.generate();
console.log(schedule.toString());
//var map = schedule.asMap();
//console.log(map);
