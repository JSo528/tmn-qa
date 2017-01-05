var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var navbar, playerPage;

// Update Data
var originalAttributes = {
  firstName: 'Dakota',
  lastName: 'Cornwell',
  classAbbr: 'SR',
  hometown: ' ',
  position: 'QB',
  jersey: 11,
  draftYear: 2017,
  starter: false
}

var updatedAttributes = {
  firstName: 'Dakota-Test',
  lastName: 'Cornwell-Test',
  classAbbr: 'JR',
  hometown: 'Montgomery, AL',
  position: 'RB',
  jersey: 16,
  draftYear: 2018,
  starter: true
}

// Tests
test.describe('#Page: Player', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    browser.visit(url + 'player/31686');
  })

  test.it('should be on Dakota Cornwell page', function() {
    playerPage.getPlayerName().then(function(name) {
      assert.equal(name, 'CORNWELL, DAKOTA');
    });
  });

  // test.describe('#stats', function() {
  //   test.it('stats table shows the correct headers', function() {
  //     playerPage.getStatTableHeader(2).then(function(header) {
  //       assert.equal(header, 'Season', '2nd Col header');
  //     });

  //     playerPage.getStatTableHeader(4).then(function(header) {
  //       assert.equal(header, 'DSk', '4th Col header');
  //     });

  //     playerPage.getStatTableHeader(8).then(function(header) {
  //       assert.equal(header, 'IRYd', '8th Col header');
  //     });
  //   });

  //   test.it('stats table shows the correct values', function() {
  //     playerPage.getStatTableValue(1,3).then(function(stat) {
  //       assert.equal(stat, '12', '2016 games');
  //     });

  //     playerPage.getStatTableValue(2,5).then(function(stat) {
  //       assert.equal(stat, '2', '2015 DfFF');
  //     });

  //     playerPage.getStatTableValue(3,6).then(function(stat) {
  //       assert.equal(stat, '1', '2014 DfFR');
  //     });
  //   });
  // });

  test.describe('#updates', function() {
    test.describe('#playerProfile', function() {
      test.it('changing profile inputs to new values', function() {
        playerPage.changeProfileInput('First Name', updatedAttributes.firstName);
        playerPage.changeProfileInput('Last Name', updatedAttributes.lastName);
        playerPage.changeProfileCheckbox('Starter', updatedAttributes.starter);
        playerPage.changeProfileDropdown('Class', updatedAttributes.classAbbr);
        playerPage.addProfileList('test');
        playerPage.addProfileList('list1');

        playerPage.changeProfileInput('Hometown', updatedAttributes.hometown);
        playerPage.changeProfileDropdown('Pos', updatedAttributes.position);
        playerPage.changeProfileInput('Jersey', updatedAttributes.jersey);
        playerPage.changeProfileDraftYear(updatedAttributes.draftYear);

        browser.refresh();
        playerPage.waitForPageToLoad();
      })

      test.it('updated name fields should be persisted', function() {
        playerPage.getProfileInput('First Name').then(function(name) {
          assert.equal(name, updatedAttributes.firstName, 'first name');
        });

        playerPage.getProfileInput('Last Name').then(function(name) {
          assert.equal(name, updatedAttributes.lastName, 'last name');
        });
      });

      test.it('toggling starter should persist data', function() {
        playerPage.getProfileCheckbox('Starter').then(function(status) {
          assert.equal(status, 'check_box', 'starter status');
        });  
      });

      test.it('changing draft year should persist data', function() {
        playerPage.getProfileInput('Draft Year').then(function(draftYear) {
          assert.equal(draftYear, updatedAttributes.draftYear, 'draft year');
        });
      });

      test.it('changing class should persist data', function() {
        playerPage.getProfileDropdown('Class').then(function(classAbbr) {
          assert.equal(classAbbr, updatedAttributes.classAbbr, 'class');
        });
      });

      test.it('adding list should persist data', function() {
        playerPage.getProfileLists().then(function(lists) {
          assert.sameMembers(['test', 'list1'], lists, 'lists');
        });
      });

      test.it('changing hometown should persist data', function() {
        playerPage.getProfileInput('Hometown').then(function(hometown) {
          assert.equal(hometown, updatedAttributes.hometown, 'hometown');
        });
      });

      test.it('changing position should persist data', function() {
        playerPage.getProfileDropdown('Pos').then(function(pos) {
          assert.equal(pos, updatedAttributes.position, 'position');
        });
      });

      test.it('changing jersey # should persist data', function() {
        playerPage.getProfileInput('Jersey').then(function(jersey) {
          assert.equal(jersey, updatedAttributes.jersey, 'jersey');
        });
      });

      test.it('changing profile attributes back to original values', function() {
        playerPage.changeProfileInput('First Name', originalAttributes.firstName);
        playerPage.changeProfileInput('Last Name', originalAttributes.lastName);
        playerPage.changeProfileCheckbox('Starter', originalAttributes.starter);
        playerPage.changeProfileDropdown('Class', originalAttributes.classAbbr);

        playerPage.changeProfileInput('Hometown', originalAttributes.hometown);
        playerPage.changeProfileDropdown('Pos', originalAttributes.position);
        playerPage.changeProfileInput('Jersey', originalAttributes.jersey);
        playerPage.changeProfileDraftYear(originalAttributes.draftYear);
        playerPage.removeProfileList('test');
        playerPage.removeProfileList('list1');
      });
    });
  });

  test.describe('#incidentReports', function() {
    test.it('creating an incidence report should persist on reload', function() {
      var initialCount;
      playerPage.clickIncidentReportSpacer();
      playerPage.getIncidentReportCount().then(function(count) {
        initialCount = count;
      });

      playerPage.createIncidentReport('TC', {year: 2015, month: 'Feb', day: 11}, 'X', 'test report');

      browser.refresh();
      playerPage.waitForPageToLoad();

      playerPage.clickIncidentReportSpacer();
      playerPage.getIncidentReportCount().then(function(count) {
        assert.equal(count, initialCount+1, '# of incident reports');
      });

      playerPage.getIncidentReportValue(2,'week').then(function(value) {
        assert.equal(value, 'TC', 'week value');
      });

      playerPage.getIncidentReportValue(2,'date').then(function(value) {
        assert.equal(value, '02/11/2015', 'date value');
      });

      playerPage.getIncidentReportValue(2,'type').then(function(value) {
        assert.equal(value, 'X', 'type value');
      });

      playerPage.getIncidentReportValue(2,'comment').then(function(value) {
        assert.equal(value, 'test report', 'comment value');
      });
    });
  });

  test.describe('#sorting', function() {
  
  });
});