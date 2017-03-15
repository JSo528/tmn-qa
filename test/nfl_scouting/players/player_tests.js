var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var navbar, playerPage, incidentReportdivNum;

// Tests
test.describe('#Page: Player', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    browser.visit(url + 'player/31685');
  })

  test.describe('#sorting', function() {
    test.before(function() {
      playerPage.waitForPageToLoad();
      playerPage.clickIncidentReportSpacer();
    });

    test.describe('#scoutingReports', function() {
      test.it('should be sorted by report report date asc initially', function() {
        playerPage.getStatsForReportAndCol('scouting', 2).then(function(stats) {
          var sortedArray = extensions.customSortDates(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by report date desc', function() {
        playerPage.clickSortIconForReport('scouting', 2);
        playerPage.getStatsForReportAndCol('scouting', 2).then(function(stats) {
          var sortedArray = extensions.customSortDates(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by report type asc', function() {
        playerPage.clickRemoveSortIconForReport('scouting', 2);
        playerPage.clickReportTableHeader('scouting', 3);
        playerPage.getStatsForReportAndCol('scouting', 3).then(function(stats) {
          var sortedArray = extensions.customSortDates(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by report type desc', function() {
        playerPage.clickSortIconForReport('scouting', 3);
        playerPage.getStatsForReportAndCol('scouting', 3).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by author asc', function() {
        playerPage.clickRemoveSortIconForReport('scouting', 3);
        playerPage.clickReportTableHeader('scouting', 4);
        playerPage.getStatsForReportAndCol('scouting', 4).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by author desc', function() {
        playerPage.clickSortIconForReport('scouting', 4);
        playerPage.getStatsForReportAndCol('scouting', 4).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });
    });

    test.describe('#interviewReports', function() {
      test.it('should be sorted by report date asc initially', function() {
        playerPage.getStatsForReportAndCol('interview', 2).then(function(stats) {
          var sortedArray = extensions.customSortDates(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by report date desc', function() {
        playerPage.clickSortIconForReport('interview', 2);
        playerPage.getStatsForReportAndCol('interview', 2).then(function(stats) {
          var sortedArray = extensions.customSortDates(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by author asc', function() {
        playerPage.clickRemoveSortIconForReport('interview', 2);
        playerPage.clickReportTableHeader('interview', 3);
        playerPage.getStatsForReportAndCol('interview', 3).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by author desc', function() {
        playerPage.clickSortIconForReport('interview', 3);
        playerPage.getStatsForReportAndCol('interview', 3).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });
    });

    test.describe('#evaluationReports', function() {
      test.it('should be sorted by report date asc initially', function() {
        playerPage.getStatsForReportAndCol('evaluation', 2).then(function(stats) {
          var sortedArray = extensions.customSortDates(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by report date desc', function() {
        playerPage.clickSortIconForReport('evaluation', 2);
        playerPage.getStatsForReportAndCol('evaluation', 2).then(function(stats) {
          var sortedArray = extensions.customSortDates(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by author asc', function() {
        playerPage.clickRemoveSortIconForReport('evaluation', 2);
        playerPage.clickReportTableHeader('evaluation', 3);
        playerPage.getStatsForReportAndCol('evaluation', 3).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by author desc', function() {
        playerPage.clickSortIconForReport('evaluation', 3);
        playerPage.getStatsForReportAndCol('evaluation', 3).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });
    });

    test.describe('#statistics', function() {

    });

    test.describe('#incidentReports', function() {
      test.it('sorting by week asc', function() {
        playerPage.clickIncidentReportsTableHeader(1);
        playerPage.getIncidentReportsTableValues('week').then(function(stats) {
          var sortedArray = extensions.customSortEnumerated(stats, 'asc', playerPage.INCIDENT_REPORTS_WEEK_ENUMERATION);
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by week desc', function() {
        playerPage.clickIncidentReportsSortIcon(1);
        playerPage.getIncidentReportsTableValues('week').then(function(stats) {
          var sortedArray = extensions.customSortEnumerated(stats, 'desc', playerPage.INCIDENT_REPORTS_WEEK_ENUMERATION);
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by date asc', function() {
        playerPage.clickIncidentReportsRemoveSortIcon(1);
        playerPage.clickIncidentReportsTableHeader(2);
        playerPage.getIncidentReportsTableValues('date').then(function(stats) {
          var sortedArray = extensions.customSortDates(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by date desc', function() {
        playerPage.clickIncidentReportsSortIcon(2);
        playerPage.getIncidentReportsTableValues('date').then(function(stats) {
          var sortedArray = extensions.customSortDates(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by type asc', function() {
        playerPage.clickIncidentReportsRemoveSortIcon(2);
        playerPage.clickIncidentReportsTableHeader(3);
        playerPage.getIncidentReportsTableValues('type').then(function(stats) {
          var sortedArray = extensions.customSortEnumerated(stats, 'asc', playerPage.INCIDENT_REPORTS_TYPE_ENUMERATION);
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by type desc', function() {
        playerPage.clickIncidentReportsSortIcon(3);
        playerPage.getIncidentReportsTableValues('type').then(function(stats) {
          var sortedArray = extensions.customSortEnumerated(stats, 'desc', playerPage.INCIDENT_REPORTS_TYPE_ENUMERATION);
          assert.deepEqual(stats, sortedArray);
        });
      });
    });
  });

  // test.describe('#stats', function() {
  //   test.it('stats table shows the correct headers', function() {
  //     playerPage.getStatTableHeader(2).then(function(header) {
  //       assert.equal(header, 'Season', '2nd Col header');
  //     });

  //     playerPage.getStatTableHeader(4).then(function(header) {
  //       assert.equal(header, 'QBStart', '4th Col header');
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

  test.describe('#updatesProfile', function() {
    test.before(function() {
      playerPage = new PlayerPage(driver);
      browser.visit(url + 'player/31682');
    });

    var attributes = [
      { field: 'First Name', type: 'input', originalValue: 'DAKOTA', updatedValue: 'Dakota-Test' },
      { field: 'Last Name', type: 'input', originalValue: 'CORNWELL', updatedValue: 'Cornwell-Test' },
      { field: 'Class', type: 'dropdown', originalValue: 'SR', updatedValue: 'JR' },
      { field: 'Hometown', type: 'input', originalValue: '', updatedValue: 'Montgomery, AL' },
      { field: 'Jersey', type: 'input', originalValue: 11, updatedValue: 16 },
      // { field: 'Draft Year', type: 'date', originalValue: 2017, updatedValue: 2018 },
      { field: 'Starter', type: 'checkbox', originalValue: false, updatedValue: true },
      { field: 'Pos', type: 'dropdown', originalValue: 'QB', updatedValue: 'RB' }
    ];

    attributes.forEach(function(attr) {
      test.it(attr.field + ' should have correct initial value', function() {
        playerPage.getProfileField(attr.type, attr.field).then(function(value) {
          assert.equal(value, attr.originalValue, attr.field);
        });
      });
    });

    test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
      attributes.forEach(function(attr) {
        playerPage.changeProfileField(attr.type, attr.field, attr.updatedValue );
      });
      playerPage.addProfileList('TEST');
      playerPage.addProfileList('GI');

      browser.refresh();
      playerPage.waitForPageToLoad();
    });

    attributes.forEach(function(attr) {
      test.it('updating ' + attr.field + ' should persist on reload', function() {
        playerPage.getProfileField(attr.type, attr.field).then(function(value) {
          assert.equal(value, attr.updatedValue, attr.field);
        });
      });
    });

    test.it('adding lists should persist on reload', function() {
      playerPage.getProfileLists().then(function(lists) {
        assert.sameMembers(['TEST', 'GI'], lists, 'lists');
      });
    });

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        playerPage.changeProfileField(attr.type, attr.field, attr.originalValue );
      });
      playerPage.removeProfileList('TEST');
      playerPage.removeProfileList('GI');

      browser.refresh();
      playerPage.waitForPageToLoad();
    });
  });

  test.describe('#incidentReports', function() {
    test.it('creating an incidence report should persist on reload', function() {
      var initialCount;
      incidentReportdivNum = playerPage.NEW_INCIDENT_REPORT_DIV_NUM;
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

      playerPage.getIncidentReportValue(incidentReportdivNum,'week').then(function(value) {
        assert.equal(value, 'TC', 'week value');
      });

      playerPage.getIncidentReportValue(incidentReportdivNum,'date').then(function(value) {
        assert.equal(value, '02/11/2015', 'date value');
      });

      playerPage.getIncidentReportValue(incidentReportdivNum,'type').then(function(value) {
        assert.equal(value, 'X', 'type value');
      });

      playerPage.getIncidentReportValue(incidentReportdivNum,'comment').then(function(value) {
        assert.equal(value, 'test report', 'comment value');
      });
    });

    test.it('delete incident report', function() {
      playerPage.toggleDeleteIncidentReport(incidentReportdivNum);
    });
  });
});