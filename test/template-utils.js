'use strict';

var expect = require('chai').expect;
var templateUtils = require('../src/js/template-utils');

templateUtils.registerHelpers();

var handlebars = require('handlebars');

var errorList = ['Error1', 'Error2'];
var warningList = ['Warning1', 'Warning2'];


describe('templateUtils', function() {
  describe('formatSeverity(context)', function() {

    it('should format the severity', function() {
      expect(templateUtils.formatSeverity({ severity: 2 }))
        .to.equal('Error');

      expect(templateUtils.formatSeverity({ severity: 1 }))
        .to.equal('Warning');

      expect(templateUtils.formatSeverity({ severity: 3 }))
        .to.equal('');
    });
  });

  describe('rowHelper(context, options)', function() {

    it('should return a table row with class name', function() {

      var template = handlebars.compile('{{#row data}}Row content{{/row}}');

      // only errors
      expect(template({ data: { errors: errorList }}))
        .to.equal('<tr class="danger">Row content</tr>');

      // errors and warnings
      expect(template({ data: { errors: errorList, warnings: warningList }}))
        .to.equal('<tr class="danger">Row content</tr>');

      // only warnings
      expect(template({ data: { warnings: warningList }}))
        .to.equal('<tr class="warning">Row content</tr>');

      // no errors or warnings
      expect(template({ data: { }}))
        .to.equal('<tr class="success">Row content</tr>');
    });

  });
});
