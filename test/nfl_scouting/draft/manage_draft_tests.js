var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var ManageDraftPage = require('../../../pages/nfl_scouting/draft/manage_draft_page.js');
var playerPage, manageDraftPage;

test.describe('#Page: ManageDraft', function() {
  test.it('clicking manage draft link', function() {
    manageDraftPage = new ManageDraftPage(driver);
    playerPage = new PlayerPage(driver);
    browser.visit(url + 'player/31682');
    playerPage.clickManageDraftLink();
    manageDraftPage.waitForPageToLoad();

    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /player\/31682\/draft/, 'page URL');
    });
  });

  test.describe('#PlayerProfile', function() {
    var profileAttributes = [
      { field: 'Draft Position', value: 'DC', type: 'dropdown', original: ''},
      { field: 'Dec. Grade', value: '6.9', type: 'dropdown', original: ''},
      { field: 'Feb. Grade', value: '5.9', type: 'dropdown', original: ''},
      { field: 'Final. Grade', value: '4.9', type: 'dropdown', original: ''},
      { field: 'Bowl Game', value: 'PA', type: 'dropdown', original: ''},
      { field: 'SR', value: true, type: 'checkbox', original: false},
      { field: 'NIC', value: true, type: 'checkbox', original: false},
      { field: 'Bowl', value: true, type: 'checkbox', original: false},
      { field: 'Red Dot', value: true, type: 'checkbox', original: false},
      { field: 'T', value: true, type: 'checkbox', original: false},
      { field: 'Blk', value: true, type: 'checkbox', original: false},
      { field: 'Blk+', value: true, type: 'checkbox', original: false},
      { field: 'Underclassman', value: true, type: 'checkbox', original: false},
      { field: 'Jag Head', value: true, type: 'checkbox', original: false},
      { field: 'Skull/Crossbones', value: true, type: 'checkbox', original: false},
      { field: 'Alerts', value: 'cmx', type: 'input', original: ''},
    ];

    profileAttributes.forEach(function(attribute) {
      test.it('changing player profile field: ' + attribute.field, function() {
        manageDraftPage.changeProfileField(attribute.type, attribute.field, attribute.value);
      });
    });

    test.it('refreshing the page after changing attribtues', function() {
      browser.refresh();
    });

    profileAttributes.forEach(function(attribute) {
      test.it("changing " + attribute.field + " persists on reload", function() {
        manageDraftPage.getProfileField(attribute.type, attribute.field).then(function(value) {
          assert.equal(value, attribute.value, attribute.field + " field");
        });
      });
    });

    profileAttributes.forEach(function(attribute) {
      test.it('changing back player profile field: ' + attribute.field, function() {
        manageDraftPage.changeProfileField(attribute.type, attribute.field, attribute.original);
      });
    });
  });

  test.describe('#SectionFields', function() {
    var sections = [
      { field: 'Medical Comments', value: 'medical comments test', original: ''},
      { field: 'Character Comments', value: 'character comments test', original: ''},
      { field: 'Interview Topics', value: 'interview comments test', original: ''},
      { field: 'Director Comments', value: 'director comments test', original: ''},
      { field: 'GM Comments', value: 'gm comments test', original: ''}
    ];

    test.it('changing player profile fields', function() {
      sections.forEach(function(section) {
        manageDraftPage.changeSectionText(section.field, section.value);
      });

      browser.refresh();
    });

    sections.forEach(function(section) {
      test.it('changing ' + section.field + ' persists on reload', function() {
        manageDraftPage.getSectionText(section.field).then(function(value) {
          assert.equal(value, section.value, section.field + " field");
        });
      });
    });

    test.it('changing back player profile fields', function() {
      sections.forEach(function(section) {
        manageDraftPage.changeSectionText(section.field, section.original);
      });
    });
  });

  test.describe('#incidentReports', function() {
    test.it('creating an incidence report should persist on reload', function() {
      var initialCount;
      manageDraftPage.clickIncidentReportSpacer();
      manageDraftPage.getIncidentReportCount().then(function(count) {
        initialCount = count;
      });

      manageDraftPage.createIncidentReport('W4', {year: 2016, month: 'Jun', day: 6}, 'IR', 'test report manage draft page');

      browser.refresh();
      manageDraftPage.waitForPageToLoad();

      manageDraftPage.clickIncidentReportSpacer();
      manageDraftPage.getIncidentReportCount().then(function(count) {
        assert.equal(count, initialCount+1, '# of incident reports');
      });

      manageDraftPage.getIncidentReportValue(1,'week').then(function(value) {
        assert.equal(value, 'W4', 'week value');
      });

      manageDraftPage.getIncidentReportValue(1,'date').then(function(value) {
        assert.equal(value, '06/06/2016', 'date value');
      });

      manageDraftPage.getIncidentReportValue(1,'type').then(function(value) {
        assert.equal(value, 'IR', 'type value');
      });

      manageDraftPage.getIncidentReportValue(1,'comment').then(function(value) {
        assert.equal(value, 'test report manage draft page', 'comment value');
      });
    });

    test.it('delete incident report', function() {
      manageDraftPage.toggleDeleteIncidentReport(2);
    });
  });
});