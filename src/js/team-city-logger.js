/**
 * @fileoverview Utilities for reporting to TeamCity
 * @author Evangelia Dendramis
 */
'use strict';


function TeamCityLogger(reportName) {

  /**
   * Adds start of report to output
   * @returns {void}
   */
  this.reportStart = function() {
    this.reportOutput.push('##teamcity[testSuiteStarted name=\'' + this.reportName + '\']\n');
  };

  /**
   * Adds end of report to output
   * @returns {void}
   */
  this.reportEnd = function() {
    this.reportOutput.push('##teamcity[testSuiteFinished name=\'' + this.reportName + '\']\n');
  };

  /**
   * Adds start of test to output
   * @param {string} testName - Name of test
   * @returns {void}
   */
  this.testStart = function(testName) {
    this.reportOutput.push('##teamcity[testStarted name=\'' + this.reportName + ': ' + this.escapeTeamCityString(testName) + '\']\n');
  };

  /**
   * Adds end of test to output
   * @param {string} testName - Name of test
   * @returns {void}
   */
  this.testEnd = function(testName) {
    this.reportOutput.push('##teamcity[testFinished name=\'' + this.reportName + ': ' + this.escapeTeamCityString(testName) + '\']\n');
  };

  /**
   * Adds test failed info to output
   * @param {string} testName - Name of test
   * @param {array} messageList - Array of failed error messages
   * @returns {void}
   */
  this.testFailed = function(testName, messageList) {
    this.reportOutput.push('##teamcity[testFailed name=\'' + this.reportName +
      ': ' + this.escapeTeamCityString(testName) + '\' message=\'' + this.escapeTeamCityString(messageList.join('\n')) + '\']\n');
  };

  /**
   * Escapes a string for valid TeamCity output
   * @param {string} str - String to escape
   * @returns {string} - Escaped string
   */
  this.escapeTeamCityString = function(str) {

    if (!str) {
      return '';
    }

    return str.replace(/\|/g, '||')
      .replace(/\'/g, '|\'')
      .replace(/\n/g, '|n')
      .replace(/\r/g, '|r')
      .replace(/\u0085/g, '|x')
      .replace(/\u2028/g, '|l')
      .replace(/\u2029/g, '|p')
      .replace(/\[/g, '|[')
      .replace(/\]/g, '|]');
  };

  // initialization
  if (!reportName) {
    throw new Error('Report name is not defined');
  }

  this.reportName = this.escapeTeamCityString(reportName);
  this.reportOutput = [];
}


// Exports
module.exports = TeamCityLogger;
