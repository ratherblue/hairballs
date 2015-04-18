'use strict';

var expect = require('chai').expect;
var handlebars = require('handlebars');

var templateUtils = require('../src/js/template-utils');

describe('templateUtils', function() {

  describe('applyTemplates(data)', function() {
    it('should throw an error if no data is passed in', function() {
      expect(function() {
        templateUtils.applyTemplates();
      }).to.throw(Error);
    });

    it('should return a compiled template', function() {

      var summary = {
        alerts: { errors: 0, warnings: 0, total: 0 },
        files: { errors: 0, warnings: 0, clean: 0, total: 0 },
        errorTypes: {}
      };

      /*eslint-disable no-unused-expressions */
      expect(templateUtils.applyTemplates({
          summary: summary,
          warningOccurances: [],
          errorOccurances: [],
          files: [],
          fullReport: false,
          pageTitle: 'Page Title'
        }))
        .to.be.ok;

      expect(templateUtils.applyTemplates({ }))
        .to.be.ok;

      /*eslint-enable */
    });
  });

  describe('Helpers', function() {
    describe('formatSeverity(context)', function() {

      it('should format the severity', function() {
        expect(templateUtils.formatSeverity({ severity: 2 }))
          .to.equal('Error');

        expect(templateUtils.formatSeverity({ severity: 'error' }))
          .to.equal('Error');

        expect(templateUtils.formatSeverity({ severity: 1 }))
          .to.equal('Warning');

        expect(templateUtils.formatSeverity({ severity: 'warning' }))
          .to.equal('Warning');

        expect(templateUtils.formatSeverity({ severity: 3 }))
          .to.equal('');
      });
    });

    describe('rowHelper(context, options)', function() {

      it('should return a table row with class name', function() {

        var template = handlebars.compile('{{#row data}}Row content{{/row}}');
        var errorList = ['Error1', 'Error2'];
        var warningList = ['Warning1', 'Warning2'];

        // only errors
        expect(template({ data: { errors: errorList } }))
          .to.equal('<tr class="danger">Row content</tr>');

        // errors and warnings
        expect(template({ data: { errors: errorList, warnings: warningList } }))
          .to.equal('<tr class="danger">Row content</tr>');

        // only warnings
        expect(template({ data: { warnings: warningList } }))
          .to.equal('<tr class="warning">Row content</tr>');

        // clean
        expect(template({ data: { } }))
          .to.equal('<tr class="success">Row content</tr>');
      });

    });


    describe('messageRow(context, options)', function() {
      it('should return a table row with class name', function() {
        var template = handlebars.compile('{{#messageRow data}}Row content{{/messageRow}}');

        // only errors
        expect(template({ data: { severity: 2 } }))
          .to.equal('<tr class="msg-danger">Row content</tr>');
        expect(template({ data: { severity: 'error' } }))
          .to.equal('<tr class="msg-danger">Row content</tr>');

        // warnings
        expect(template({ data: { severity: 1 } }))
          .to.equal('<tr class="msg-warning">Row content</tr>');
        expect(template({ data: { severity: 'warning' } }))
          .to.equal('<tr class="msg-warning">Row content</tr>');

        // clean
        expect(template({ data: { } }))
          .to.equal('<tr>Row content</tr>');

      });
    });
  });
});
