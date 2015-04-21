'use strict';

var expect = require('chai').expect;
var TeamCityLogger = require('../src/js/team-city-logger');

var reportName = 'Custom Report Name';

describe('TeamCityLogger(reportName)', function() {

  it('should initialize with a report name', function() {
    var teamCityLogger = new TeamCityLogger(reportName);

    expect(teamCityLogger.reportName).to.equal('Custom Report Name');
  });

  it('should escape the report name', function() {
    expect(new TeamCityLogger('Invalid\r\nName').reportName).to.equal('Invalid|r|nName');
    expect(new TeamCityLogger('Invalid\'Name').reportName).to.equal('Invalid|\'Name');
    expect(new TeamCityLogger('Invalid\u0085\u2028\u2029Name').reportName).to.equal('Invalid|x|l|pName');
    expect(new TeamCityLogger('Invalid|Name').reportName).to.equal('Invalid||Name');
    expect(new TeamCityLogger('[Invalid|Name]').reportName).to.equal('|[Invalid||Name|]');
  });

  it('should throw an error if no report name is passed in', function() {
    expect(function() {
      new TeamCityLogger();
    }).to.throw(Error);
  });

  describe('reportStart()', function() {
    it('should print testSuiteStarted with report name', function() {
      var teamCityLogger = new TeamCityLogger(reportName);

      teamCityLogger.reportStart();

      expect(teamCityLogger.reportOutput[0])
        .to.equal('##teamcity[testSuiteStarted name=\'Custom Report Name\']');
    });
  });

  describe('reportEnd()', function() {

    it('should print testSuiteFinished with report name', function() {
      var teamCityLogger = new TeamCityLogger(reportName);

      teamCityLogger.reportEnd();

      expect(teamCityLogger.reportOutput[0])
        .to.equal('##teamcity[testSuiteFinished name=\'Custom Report Name\']');
    });
  });

  describe('testStart(testName)', function() {

    it('should print testStarted with report name and test name', function() {
      var teamCityLogger = new TeamCityLogger(reportName);

      teamCityLogger.testStart('Test Name');

      expect(teamCityLogger.reportOutput[0])
        .to.equal('##teamcity[testStarted name=\'Custom Report Name: Test Name\']');
    });
  });

  describe('testEnd(testName)', function() {

    it('should print testFinished with report name and test name', function() {
      var teamCityLogger = new TeamCityLogger(reportName);

      teamCityLogger.testEnd('Test Name');

      expect(teamCityLogger.reportOutput[0])
        .to.equal('##teamcity[testFinished name=\'Custom Report Name: Test Name\']');
    });

  });

  describe('logMessage(text, errorDetails, status)', function() {

    it('should print a message', function() {
      var teamCityLogger = new TeamCityLogger(reportName);

      teamCityLogger.logMessage('Message Text', 'Error Details', 'ERROR');

      expect(teamCityLogger.reportOutput[0])
        .to.equal('##teamcity[message text=\'Message Text\' errorDetails=\'Error Details\' status=\'ERROR\']');

      teamCityLogger.logMessage('Message Text', 'Error Details');

      expect(teamCityLogger.reportOutput[1])
        .to.equal('##teamcity[message text=\'Message Text\' errorDetails=\'Error Details\']');

      teamCityLogger.logMessage('Message Text');

      expect(teamCityLogger.reportOutput[2])
        .to.equal('##teamcity[message text=\'Message Text\']');
    });

    it('should throw if text is undefined', function() {
      expect(function() {
        var teamCityLogger = new TeamCityLogger(reportName);
        teamCityLogger.logMessage();
      }).to.throw(Error);
    });

    it('should throw if the status is invalid', function() {
      expect(function() {
        var teamCityLogger = new TeamCityLogger(reportName);
        teamCityLogger.logMessage('Message Text', 'Error Details', 'invalid error');
      }).to.throw(Error);
    });

  });

  describe('testFailed(testName, messageList)', function() {

    it('should print testFailed with report name, test name, and concatenate errors', function() {
      var teamCityLogger = new TeamCityLogger(reportName);

      var messageList = ['Error'];

      teamCityLogger.testFailed('Test Name', messageList);

      expect(teamCityLogger.reportOutput[0])
        .to.equal('##teamcity[testFailed name=\'Custom Report Name: Test Name\' message=\'Error\']');
    });

    it('should print testFailed with report name, test name, and escape concatenated errors', function() {
      var teamCityLogger = new TeamCityLogger(reportName);

      var messageList = ['Error1: \'escape me\'', 'Error2', 'Error3'];

      teamCityLogger.testFailed('Test Name', messageList);

      expect(teamCityLogger.reportOutput[0])
        .to.equal('##teamcity[testFailed name=\'Custom Report Name: Test Name\' message=\'Error1: |\'escape me|\'|nError2|nError3\']');
    });
  });

  describe('escapeTeamCityString(str)', function() {

    it('should escape strings for valid TeamCity output', function() {
      var teamCityLogger = new TeamCityLogger('Report Name');

      expect(teamCityLogger.escapeTeamCityString()).to.equal('');
    });
  });
});
