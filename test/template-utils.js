'use strict';

var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var templateUtils = require('../src/js/template-utils');

templateUtils.registerHelpers();
templateUtils.registerPartials();

var handlebars = require('handlebars');

describe('templateUtils', function() {

  describe('applyTemplates(data)', function() {
    it('should throw an error if no data is passed in', function() {
      expect(function() {
        templateUtils.applyTemplates();
      }).to.throw(Error);
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

  describe('Partials', function() {
    describe('summary.hbs', function() {
      var data = {
        alerts: { errors: 12, warnings: 4, total: 16 },
        files: { errors: 5, warnings: 3, clean: 4, total: 12 }
      };

      var template = handlebars.compile('{{> summary}}');

      var partialsPath = path.join(__dirname, 'fixtures', 'templates', 'partials');
      var summary = fs.readFileSync(path.join(partialsPath, 'summary.html'),
        { encoding: 'utf-8' }
      );

      it('should return an html fragment', function() {
        expect(template(data)).to.equal(summary);
      });

    });


  });
});
