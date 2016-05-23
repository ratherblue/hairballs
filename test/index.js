'use strict';

var expect = require('chai').expect;
var index = require('../src/index');

describe('main', function() {
  describe('updateFileSummary(file)', function() {
    it('should increment file summary', function() {
      index.updateFileSummary({ errors: 5 });
      index.updateFileSummary({ warnings: 2 });
      index.updateFileSummary({ warnings: 3 });
      index.updateFileSummary({ errors: 0, warnings: 0 });

      expect(index.fileSummary.errors).to.equal(1);
      expect(index.fileSummary.warnings).to.equal(2);
      expect(index.fileSummary.clean).to.equal(1);
      expect(index.fileSummary.total).to.equal(4);
      expect(index.files.length).to.equal(4);
    });
  });

  describe('updateAlertSummary(file)', function() {
    it('should increment alert summary', function() {
      index.updateAlertSummary({ severity: 'error' });
      index.updateAlertSummary({ severity: 'warning' });

      expect(index.alertSummary.errors).to.equal(1);
      expect(index.alertSummary.warnings).to.equal(1);
      expect(index.alertSummary.total).to.equal(2);
    });

    it('should increment alert summary for numbers', function() {
      index.updateAlertSummary({ severity: 2 });
      index.updateAlertSummary({ severity: 1 });
      index.updateAlertSummary({ severity: 'bananas' });

      expect(index.alertSummary.errors).to.equal(2);
      expect(index.alertSummary.warnings).to.equal(2);
      expect(index.alertSummary.total).to.equal(4);
    });
  });

  describe('sortErrors(a, b)', function() {

    it('should sort by errors', function() {
      var a1 = { errors: 4, warnings: 3, path: 'Zebra' };
      var b1 = { errors: 3, warnings: 3, path: 'Banana' };

      expect(index.sortErrors(a1, b1)).to.equal(-1);

      var a2 = { errors: 3, warnings: 4, path: 'Zebra' };
      var b2 = { errors: 4, warnings: 4, path: 'Banana' };

      expect(index.sortErrors(a2, b2)).to.equal(1);
    });

    it('should sort by warnings when errors are equal', function() {
      var a1 = { errors: 0, warnings: 4, path: 'Zebra' };
      var b1 = { errors: 0, warnings: 3, path: 'Banana' };

      expect(index.sortErrors(a1, b1)).to.equal(-1);

      var a2 = { errors: 0, warnings: 4, path: 'Banana' };
      var b2 = { errors: 0, warnings: 4, path: 'Banana' };

      expect(index.sortErrors(a2, b2)).to.equal(0);

      var a3 = { errors: 4, warnings: 3, path: 'Banana' };
      var b3 = { errors: 4, warnings: 4, path: 'Zebra' };

      expect(index.sortErrors(a3, b3)).to.equal(1);
    });

    it('should sort by path when errors and warnings are zero', function() {
      var a1 = { errors: 0, warnings: 0, path: 'Zebra' };
      var b1 = { errors: 0, warnings: 0, path: 'Banana' };

      expect(index.sortErrors(a1, b1)).to.equal(1);

      var a2 = { errors: 0, warnings: 0, path: 'Banana' };
      var b2 = { errors: 0, warnings: 0, path: 'Banana' };

      expect(index.sortErrors(a2, b2)).to.equal(0);

      var a3 = { errors: 0, warnings: 0, path: 'Banana' };
      var b3 = { errors: 0, warnings: 0, path: 'Zebra' };

      expect(index.sortErrors(a3, b3)).to.equal(-1);
    });
  });

  describe('sortOccurrences(a, b)', function() {
    it('should sort', function() {
      var a1 = { count: 4 };
      var b1 = { count: 3 };

      expect(index.sortOccurrences(a1, b1)).to.equal(-1);

      var a2 = { count: 5 };
      var b2 = { count: 6 };

      expect(index.sortOccurrences(a2, b2)).to.equal(1);

      var a3 = { count: 2 };
      var b3 = { count: 2 };

      expect(index.sortOccurrences(a3, b3)).to.equal(0);
    });
  });

  describe('updateOccurrence(key, severity, ruleUrl)', function() {
    it('should update error occurrences', function() {
      index.updateOccurrence('errorKey', 'error', 'url.html');

      expect(index.errorOccurrences[0].name).to.equal('errorKey');
      expect(index.errorOccurrences[0].count).to.equal(1);
      expect(index.errorOccurrences[0].ruleUrl).to.equal('url.html');

      index.updateOccurrence('errorKey', 2, 'url.html');
      index.updateOccurrence('errorKey', 'error', 'url.html');

      expect(index.errorOccurrences[0].count).to.equal(3);
    });

    it('should update warning occurrences', function() {
      index.updateOccurrence('warningKey', 'warning', 'url.html');

      expect(index.warningOccurrences[0].name).to.equal('warningKey');
      expect(index.warningOccurrences[0].count).to.equal(1);
      expect(index.warningOccurrences[0].ruleUrl).to.equal('url.html');

      index.updateOccurrence('warningKey', 1, 'url.html');
      index.updateOccurrence('warningKeyOther', 1, 'url.html');

      expect(index.warningOccurrences[0].count).to.equal(2);
      expect(index.warningOccurrences[1].count).to.equal(1);
    });
  });

});
