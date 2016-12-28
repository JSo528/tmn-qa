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
    browser.visit(url + 'player/31686');
    playerPage.clickManageDraftLink();
    manageDraftPage.waitForPageToLoad();

    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /player\/31686\/draft/, 'page URL');
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

    ];

    test.it('changing player profile fields', function() {
      profileAttributes.forEach(function(attribute) {
        if (attribute.type == 'dropdown') {
          manageDraftPage.changeProfileDropdown(attribute.field, attribute.value);  
        } else if (attribute.type == 'checkbox') {
          manageDraftPage.changeProfileCheckbox(attribute.field, attribute.value);  
        }
      });
      browser.refresh();
    });

    profileAttributes.forEach(function(attribute) {
      test.it("changing " + attribute.field + " persists on reload", function() {
        if (attribute.type == 'dropdown') {
          manageDraftPage.getProfileDropdown(attribute.field).then(function(value) {
            assert.equal(value, attribute.value, attribute.field + " field");
          });
        } else if (attribute.type == 'checkbox') {
          manageDraftPage.getProfileCheckbox(attribute.field).then(function(value) {
            assert.equal(value, attribute.value, attribute.field + " field");
          });
        }
      });
    });

    test.it('changing back player profile fields', function() {
      profileAttributes.forEach(function(attribute) {
        if (attribute.type == 'dropdown') {
          manageDraftPage.changeProfileDropdown(attribute.field, attribute.original);
        } else if (attribute.type == 'checkbox') {
          manageDraftPage.changeProfileCheckbox(attribute.field, attribute.original);
        }
      });
    });

    test.it('additional test', function() {
      manageDraftPage.changeProfileDropdown('Draft Position', null);
    });
  });

  test.describe('#SectionFields', function() {

  });

  test.describe('#IncidentReports', function() {

  });
});