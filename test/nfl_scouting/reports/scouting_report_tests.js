var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var ScoutingReportPage = require('../../../pages/nfl_scouting/reports/scouting_report_page.js');
var playerPage, reportsPage;

// Update Data
var observationsUpdate = {
  jagsPosition: 'FB',
  height: '5900i',
  flex: 'WR',
  weight: '250v',
  stPos1: 'KR',
  stPos2: 'LS',
  speed: '5.50e',
  stGrade: '4 Average',
  frameText: 'muscular',
  specialTeamsText: 'st test',
  alignmentText: 'left'
};

var profileUpdate = {
  firstName: 'Dakota-Test',
  lastName: 'Cornwell-Test',
  hometown: 'Mobile, AL',
  reportDateObject: {year: 2012, month: 'Jun', day: 15},
  reportDate: '06/15/2012',
  reportType: 'Fall',
  draftYear: 2018,
  classAbbr: 'JR',
  dobDateObject: {year: 2012, month: 'May', day: 11},
  dob: '05/11/2012',
  height: '6010v',
  weight: '240i',
  speed: '5.40i',
  juco: true,
  rs: true,
  transfer: true,
  tFlag: true,
  starter: true,
  position: 'RB',
  jersey: 15,
  alerts: 'ac',
  grade: '9.0 1ˢᵗ Year Starter'
};

var profileData = {
  firstName: 'Dakota',
  lastName: 'Cornwell',
  hometown: '',
  draftYear: 2017,
  classAbbr: 'SR',
  juco: false,
  rs: false,
  transfer: false,
  starter: false,
  position: 'QB',
  jersey: 11,
  dobDateObject: {year: 2014, month: 'Jun', day: 15}
};

var notesUpdate = {
  gameReportsText: 'game reports text test',
  runText: 'run text test',
  passText: 'pass text test',
  summaryText: 'summary text test',
  helpJagsText: 'help jags text test',
  oneLinerText: 'one liner text test',
  footballCharacterText: 'football character text test',
  productionText: 'production text test',
  personalCharacterText: 'personal character text test',
  durabilityText: 'durability text test',
  mentalLearningText: 'mental learning text test',
  notesText: 'notes text test',
  runGrade: 6,
  passGrade: 5,
  footballCharacterGrade: 4,
  personalCharacterGrade: 3,
  mentalLearningGrade: 2,
  helpJagsChecked: true
};             
           
// Tests
test.describe('#Page: ScoutingReports', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    reportPage = new ScoutingReportPage(driver);
    browser.visit(url + 'player/31686');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();
    reportPage.waitForPageToLoad();
  });

  test.describe("#observations", function() {
    test.before(function() {
      reportPage.changeObservationsDropdown('Jags. Pos.', observationsUpdate.jagsPosition);
      reportPage.changeObservationsDropdown('Flex', observationsUpdate.flex);
      reportPage.changeObservationsDropdown('ST Pos. 1', observationsUpdate.stPos1);
      reportPage.changeObservationsDropdown('ST Pos. 2', observationsUpdate.stPos2);
      reportPage.changeObservationsDropdown('ST Grade', observationsUpdate.stGrade);
      reportPage.changeObservationsInput('Height', observationsUpdate.height);
      reportPage.changeObservationsInput('Weight', observationsUpdate.weight);
      reportPage.changeObservationsInput('Speed', observationsUpdate.speed);
      reportPage.changeObservationsText('frame', observationsUpdate.frameText);
      reportPage.changeObservationsText('specialTeams', observationsUpdate.specialTeamsText);
      reportPage.changeObservationsText('alignment', observationsUpdate.alignmentText);
      browser.refresh();
    });

    test.it('Jags. Pos. should persist on reload', function() {
      reportPage.getObservationsDropdown('Jags. Pos.').then(function(stat) {
        assert.equal(stat, observationsUpdate.jagsPosition, 'Observations - Jags. Pos.');
      });
    });

    test.it('Flex should persist on reload', function() {
      reportPage.getObservationsDropdown('Flex').then(function(stat) {
        assert.equal(stat, observationsUpdate.flex, 'Observations - Flex');
      });
    });

    test.it('ST Pos. 1 should persist on reload', function() {
      reportPage.getObservationsDropdown('ST Pos. 1').then(function(stat) {
        assert.equal(stat, observationsUpdate.stPos1, 'Observations - ST Pos. 1');
      });
    });

    test.it('ST Pos. 2 should persist on reload', function() {
      reportPage.getObservationsDropdown('ST Pos. 2').then(function(stat) {
        assert.equal(stat, observationsUpdate.stPos2, 'Observations - ST Pos. 2');
      });
    });

    test.it('ST Grade should persist on reload', function() {
      reportPage.getObservationsDropdown('ST Grade').then(function(stat) {
        assert.equal(stat, observationsUpdate.stGrade, 'Observations - ST Grade');
      });
    }); 

    test.it('Height should persist on reload', function() {
      reportPage.getObservationsInput('Height').then(function(stat) {
        assert.equal(stat, observationsUpdate.height, 'Observations - Height');
      });
    }); 

    test.it('Weight should persist on reload', function() {
      reportPage.getObservationsInput('Weight').then(function(stat) {
        assert.equal(stat, observationsUpdate.weight, 'Observations - Weight');
      });
    }); 

    test.it('Speed should persist on reload', function() {
      reportPage.getObservationsInput('Speed').then(function(stat) {
        assert.equal(stat, observationsUpdate.speed, 'Observations - Speed');
      });
    }); 

    test.it('Frame text should persist on reload', function() {
      reportPage.getObservationsText('frame').then(function(stat) {
        assert.equal(stat, observationsUpdate.frameText, 'Observations - Frame');
      });
    });     

    test.it('Special Teams text should persist on reload', function() {
      reportPage.getObservationsText('specialTeams').then(function(stat) {
        assert.equal(stat, observationsUpdate.specialTeamsText, 'Observations - Special Teams');
      });
    });     

    test.it('Alignment text should persist on reload', function() {
      reportPage.getObservationsText('alignment').then(function(stat) {
        assert.equal(stat, observationsUpdate.alignmentText, 'Observations - Alignment');
      });
    });     
  });

  test.describe("#profile", function() {
    test.it('changing profile inputs', function() {
      this.timeout(120000)
      reportPage.changeProfileInput('First Name', profileUpdate.firstName);
      reportPage.changeProfileInput('Last Name', profileUpdate.lastName);
      reportPage.changeProfileInput('Hometown', profileUpdate.hometown);
      reportPage.changeProfileInput('Height', profileUpdate.height);
      reportPage.changeProfileInput('Weight', profileUpdate.weight);
      reportPage.changeProfileInput('Speed', profileUpdate.speed);
      reportPage.changeProfileInput('player.number', profileUpdate.jersey);
      reportPage.changeProfileInput('flags', profileUpdate.alerts);
      reportPage.changeProfileDropdown('Report Type', profileUpdate.reportType);
      reportPage.changeProfileDropdown('Class', profileUpdate.classAbbr);
      reportPage.changeProfileDropdown('position', profileUpdate.position);
      reportPage.changeProfileDropdown('overallGrade', profileUpdate.grade);
      reportPage.changeProfileDate('Report Date', profileUpdate.reportDateObject);
      reportPage.changeProfileDate('DOB', profileUpdate.dobDateObject);
      reportPage.changeProfileCheckbox('JUCO', profileUpdate.juco);
      reportPage.changeProfileCheckbox('RS', profileUpdate.rs);
      reportPage.changeProfileCheckbox('Transfer', profileUpdate.transfer);
      reportPage.changeProfileCheckbox('T', profileUpdate.tFlag);
      reportPage.changeProfileCheckbox('Starter', profileUpdate.starter);
      reportPage.changeProfileDraftYear(profileUpdate.draftYear);

      browser.refresh();
      reportPage.waitForPageToLoad();
    });

    test.it('First name should persist on reload', function() {
      reportPage.getProfileInput('First Name').then(function(stat) {
        assert.equal(stat, profileUpdate.firstName, 'Profile - First Name');
      });
    }); 

    test.it('Last Name should persist on reload', function() {
      reportPage.getProfileInput('Last Name').then(function(stat) {
        assert.equal(stat, profileUpdate.lastName, 'Profile - Last Name');
      });
    }); 

    test.it('Hometown should persist on reload', function() {
      reportPage.getProfileInput('Hometown').then(function(stat) {
        assert.equal(stat, profileUpdate.hometown, 'Profile - Hometown');
      });
    }); 

    test.it('Weight should persist on reload', function() {
      reportPage.getProfileInput('Weight').then(function(stat) {
        assert.equal(stat, profileUpdate.weight, 'Profile - Weight');
      });
    }); 

    test.it('Height should persist on reload', function() {
      reportPage.getProfileInput('Height').then(function(stat) {
        assert.equal(stat, profileUpdate.height, 'Profile - Height');
      });
    }); 

    test.it('Speed should persist on reload', function() {
      reportPage.getProfileInput('Speed').then(function(stat) {
        assert.equal(stat, profileUpdate.speed, 'Profile - Speed');
      });
    }); 

    test.it('Jersey should persist on reload', function() {
      reportPage.getProfileInput('player.number').then(function(stat) {
        assert.equal(stat, profileUpdate.jersey, 'Profile - Jersey');
      });
    });     

    test.it('Alerts should persist on reload', function() {
      reportPage.getProfileInput('flags').then(function(stat) {
        assert.equal(stat, profileUpdate.alerts, 'Profile - Alerts');
      });
    });      

    test.it('Report Type should persist on reload', function() {
      reportPage.getProfileDropdown('display.type').then(function(stat) {
        assert.equal(stat, profileUpdate.reportType, 'Profile - Report Type');
      });
    }); 

    test.it('Class should persist on reload', function() {
      reportPage.getProfileDropdown('player.class').then(function(stat) {
        assert.equal(stat, profileUpdate.classAbbr, 'Profile - Class');
      });
    }); 

    test.it('Overall Grade should persist on reload', function() {
      reportPage.getProfileDropdown('overallGrade').then(function(stat) {
        assert.equal(stat, profileUpdate.grade, 'Profile - Overall Grade');
      });
    });     

    test.it('Position should persist on reload', function() {
      reportPage.getProfileDropdown('position').then(function(stat) {
        assert.equal(stat, profileUpdate.position, 'Profile - Position');
      });
    });      

    test.it('Report Date should persist on reload', function() {
      reportPage.getProfileDate('Report Date').then(function(stat) {
        assert.equal(stat, profileUpdate.reportDate, 'Profile - Report Date');
      });
    }); 

    test.it('DOB should persist on reload', function() {
      reportPage.getProfileDate('DOB').then(function(stat) {
        assert.equal(stat, profileUpdate.dob, 'Profile - DOB');
      });
    }); 

    test.it('JUCO should persist on reload', function() {
      reportPage.getProfileCheckbox('JUCO').then(function(stat) {
        assert.equal(stat, profileUpdate.juco, 'Profile - JUCO');
      });
    });     

    test.it('RS should persist on reload', function() {
      reportPage.getProfileCheckbox('RS').then(function(stat) {
        assert.equal(stat, profileUpdate.rs, 'Profile - RS');
      });
    });     

    test.it('Transfer should persist on reload', function() {
      reportPage.getProfileCheckbox('Transfer').then(function(stat) {
        assert.equal(stat, profileUpdate.transfer, 'Profile - Transfer');
      });
    });     

    test.it('T Flag should persist on reload', function() {
      reportPage.getProfileCheckbox('T').then(function(stat) {
        assert.equal(stat, profileUpdate.tFlag, 'Profile - T Flag');
      });
    });     

    test.it('Starter should persist on reload', function() {
      reportPage.getProfileCheckbox('Starter').then(function(stat) {
        assert.equal(stat, profileUpdate.starter, 'Profile - Starter');
      });
    });

    test.it('Draft Year should persist on reload', function() {
      reportPage.getProfileInput('Draft Year').then(function(stat) {
        assert.equal(stat, profileUpdate.draftYear, 'Profile - Draft Year');
      });
    });           

    test.it('changing back profile inputs', function() {
      reportPage.changeProfileInput('First Name', profileData.firstName);
      reportPage.changeProfileInput('Last Name', profileData.lastName);
      reportPage.changeProfileInput('Hometown', profileData.hometown);
      reportPage.changeProfileInput('player.number', profileData.jersey);

      reportPage.changeProfileDropdown('Class', profileData.classAbbr);
      reportPage.changeProfileDropdown('position', profileData.position);

      reportPage.changeProfileDate('DOB', profileData.dobDateObject);      

      reportPage.changeProfileCheckbox('JUCO', profileData.juco);
      reportPage.changeProfileCheckbox('RS', profileData.rs);
      reportPage.changeProfileCheckbox('Transfer', profileData.transfer);
      reportPage.changeProfileCheckbox('T', profileData.tFlag);
      reportPage.changeProfileCheckbox('Starter', profileData.starter);

      reportPage.changeProfileDraftYear(profileData.draftYear);
      
    });
  });

  test.describe("#notes", function() {
    test.before(function() {
      reportPage.clickGameReportsSpacer();
      reportPage.changeNotesText('Game Reports', notesUpdate.gameReportsText);
      reportPage.changeNotesText('Run', notesUpdate.runText);
      reportPage.changeNotesText('Pass', notesUpdate.passText);
      reportPage.changeNotesText('Summary', notesUpdate.summaryText);
      reportPage.changeNotesText('Help Jags', notesUpdate.helpJagsText);
      reportPage.changeNotesText('One Liner', notesUpdate.oneLinerText);
      reportPage.changeNotesText('Football Character', notesUpdate.footballCharacterText);
      reportPage.changeNotesText('Production', notesUpdate.productionText);
      reportPage.changeNotesText('Personal Character', notesUpdate.personalCharacterText);
      reportPage.changeNotesText('Durability', notesUpdate.durabilityText);
      reportPage.changeNotesText('Mental/Learning', notesUpdate.mentalLearningText);
      reportPage.changeNotesText('Notes', notesUpdate.notesText);

      reportPage.changeNotesGrade('Run', notesUpdate.runGrade);
      reportPage.changeNotesGrade('Pass', notesUpdate.passGrade);
      reportPage.changeNotesGrade('Football Character', notesUpdate.footballCharacterGrade);
      reportPage.changeNotesGrade('Personal Character', notesUpdate.personalCharacterGrade);
      reportPage.changeNotesGrade('Mental/Learning', notesUpdate.mentalLearningGrade);

      reportPage.changeNotesHelpJagsCheckbox(notesUpdate.helpJagsChecked);      

      browser.refresh();
    });

    test.it('Game Reports text should persist on reload', function() {
      reportPage.clickGameReportsSpacer();
      reportPage.getNotesText('Game Reports').then(function(text) {
        assert.equal(text, notesUpdate.gameReportsText, 'Notes - Game Reports text');
      });
    }); 

    test.it('Run text should persist on reload', function() {
      reportPage.getNotesText('Run').then(function(text) {
        assert.equal(text, notesUpdate.runText, 'Notes - Run text');
      });
    }); 

    test.it('Pass text should persist on reload', function() {
      reportPage.getNotesText('Pass').then(function(text) {
        assert.equal(text, notesUpdate.passText, 'Notes - Pass text');
      });
    }); 

    test.it('Summary text should persist on reload', function() {
      reportPage.getNotesText('Summary').then(function(text) {
        assert.equal(text, notesUpdate.summaryText, 'Notes - Summary text');
      });
    }); 

    test.it('Help Jags text should persist on reload', function() {
      reportPage.getNotesText('Help Jags').then(function(text) {
        assert.equal(text, notesUpdate.helpJagsText, 'Notes - Help Jags text');
      });
    }); 

    test.it('One Liner text should persist on reload', function() {
      reportPage.getNotesText('One Liner').then(function(text) {
        assert.equal(text, notesUpdate.oneLinerText, 'Notes - One Liner text');
      });
    }); 

    test.it('Football Character text should persist on reload', function() {
      reportPage.getNotesText('Football Character').then(function(text) {
        assert.equal(text, notesUpdate.footballCharacterText, 'Notes - Football Character text');
      });
    }); 

    test.it('Production text should persist on reload', function() {
      reportPage.getNotesText('Production').then(function(text) {
        assert.equal(text, notesUpdate.productionText, 'Notes - Production text');
      });
    });     

    test.it('Personal Character text should persist on reload', function() {
      reportPage.getNotesText('Personal Character').then(function(text) {
        assert.equal(text, notesUpdate.personalCharacterText, 'Notes - Personal Character text');
      });
    }); 

    test.it('Durability text should persist on reload', function() {
      reportPage.getNotesText('Durability').then(function(text) {
        assert.equal(text, notesUpdate.durabilityText, 'Notes - Durability text');
      });
    });     

    test.it('Mental/Learning text should persist on reload', function() {
      reportPage.getNotesText('Mental/Learning').then(function(text) {
        assert.equal(text, notesUpdate.mentalLearningText, 'Notes - Mental/Learning text');
      });
    }); 

    test.it('Notes text should persist on reload', function() {
      reportPage.getNotesText('Notes').then(function(text) {
        assert.equal(text, notesUpdate.notesText, 'Notes - Notes text');
      });
    }); 

    test.it('Run grade should persist on reload', function() {
      reportPage.getNotesGrade('Run').then(function(grade) {
        assert.equal(grade, notesUpdate.runGrade, 'Notes - Run grade');
      });
    });     

    test.it('Pass grade should persist on reload', function() {
      reportPage.getNotesGrade('Pass').then(function(grade) {
        assert.equal(grade, notesUpdate.passGrade, 'Notes - Pass grade');
      });
    });     

    test.it('Football Character grade should persist on reload', function() {
      reportPage.getNotesGrade('Football Character').then(function(grade) {
        assert.equal(grade, notesUpdate.footballCharacterGrade, 'Notes - Football Character grade');
      });
    });     

    test.it('Personal Character grade should persist on reload', function() {
      reportPage.getNotesGrade('Personal Character').then(function(grade) {
        assert.equal(grade, notesUpdate.personalCharacterGrade, 'Notes - Personal Character grade');
      });
    });     

    test.it('Mental/Learning grade should persist on reload', function() {
      reportPage.getNotesGrade('Mental/Learning').then(function(grade) {
        assert.equal(grade, notesUpdate.mentalLearningGrade, 'Notes - Mental/Learning grade');
      });
    });  

    test.it('Help Jags checkbox should persist on reload', function() {
      reportPage.getNotesHelpJagsCheckbox().then(function(checked) {
        assert.equal(checked, notesUpdate.helpJagsChecked, 'Notes - Help Jags checked');
      });
    });  
  });

  test.describe("#character/injury", function() {
    test.it('selecting character/injury attributes', function() {
      this.timeout(120000);
      reportPage.changeCharacterCheckbox('Conc(s)', true);
      reportPage.changeCharacterCheckbox('+Test', true);
      reportPage.changeCharacterCheckbox('+Test(s)', true);
      reportPage.changeCharacterCheckbox('Arrest', true);
      reportPage.changeCharacterCheckbox('DV', true);
      reportPage.changeCharacterCheckbox('DUI', true);
      reportPage.changeCharacterCheckbox('Suspension', true);
      reportPage.changeCharacterCheckbox('Jags Fit', true);
      reportPage.changeCharacterCheckbox('Conc', true);
      reportPage.changeCharacterCheckbox('ACL', true);
      reportPage.changeCharacterCheckbox('Skill Foot', true);
      reportPage.changeCharacterCheckbox('JUCO', true);
      reportPage.changeCharacterCheckbox('RS', true);
      reportPage.changeCharacterCheckbox('Transfer', true);

      browser.refresh();
    });

    test.it('+Test checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('+Test').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - +Test');
      });
    });  

    test.it('+Test(s) checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('+Test(s)').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - +Test(s)');
      });
    });  

    test.it('Arrest checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('Arrest').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - Arrest');
      });
    });  

    test.it('DV checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('DV').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - DV');
      });
    });  

    test.it('DUI checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('DUI').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - DUI');
      });
    });  

    test.it('Suspension checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('Suspension').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - Suspension');
      });
    });  

    test.it('Jags Fit checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('Jags Fit').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - Jags Fit');
      });
    });  

    test.it('Conc checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('Conc').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - Conc');
      });
    });  

    test.it('Conc(s) checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('Conc(s)').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - Conc(s)');
      });
    });  

    test.it('ACL checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('ACL').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - ACL');
      });
    });  

    test.it('Skill Foot checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('Skill Foot').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - Skill Foot');
      });
    });  

    test.it('JUCO checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('JUCO').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - JUCO');
      });
    });  

    test.it('RS checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('RS').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - RS');
      });
    });  

    test.it('Transfer checkbox should persist on reload', function() {
      reportPage.getCharacterCheckbox('Transfer').then(function(checked) {
        assert.equal(checked, true, 'Character/Injury - Transfer');
      });
    }); 

    test.it('unselecting attributes for character/injury', function() {
      this.timeout(120000);

      reportPage.changeCharacterCheckbox('Conc(s)', false);
      reportPage.changeCharacterCheckbox('+Test', false);
      reportPage.changeCharacterCheckbox('+Test(s)', false);
      reportPage.changeCharacterCheckbox('Arrest', false);
      reportPage.changeCharacterCheckbox('DV', false);
      reportPage.changeCharacterCheckbox('DUI', false);
      reportPage.changeCharacterCheckbox('Suspension', false);
      reportPage.changeCharacterCheckbox('Jags Fit', false);
      reportPage.changeCharacterCheckbox('Conc', false);
      reportPage.changeCharacterCheckbox('ACL', false);
      reportPage.changeCharacterCheckbox('Skill Foot', false);
      reportPage.changeCharacterCheckbox('JUCO', false);
      reportPage.changeCharacterCheckbox('RS', false);
      reportPage.changeCharacterCheckbox('Transfer', false);
    }); 
  });  

  test.describe('#metrics', function() {
    var metricInputs = [
      { title: 'Football Character', value: 6 },
      { title: 'Personal Character', value: 8 },
      { title: 'Work Ethic', value: 4 },
      { title: 'Compete & Toughness', value: 5 },
      { title: 'Durability', value: 9 },
      { title: 'Mental/Learning', value: 2 },
      { title: 'Productivity', value: 7 },
      { title: 'Athletic Ability', value: 8 },
      { title: 'Explosion', value: 6 },
      { title: 'Instincts', value: 4 },
      { title: 'Speed', value: 8 },
      { title: 'Size', value: 5 },
      { title: 'Play Strength', value: 9 },
      { title: 'ACC Short', value: 6 },
      { title: 'ACC Long', value: 8 },
      { title: 'Arm Strength', value: 5 },
      { title: 'Leadership', value: 3 },
      { title: 'Dependability', value: 4 },
      { title: 'Awareness', value: 6 },
      { title: 'Security', value: 5 },
      { title: 'Pocket Str', value: 4 },
      { title: 'Drop Set', value: 8 },
      { title: 'Mechanics', value: 5 },
      { title: 'Release', value: 7 },
      { title: 'Delivery', value: 4 },
      { title: 'Mobility', value: 8 },
      { title: 'Throw on Move', value: 5 }
    ];

    var metricsSectionAverages = [
      { title: 'Major Factors', value: 5.9 },
      { title: 'Critical Factors', value: 6.0 },
      { title: 'Position Skills', value: 5.8 }
    ];

    var gradeGroupSkills = [
      { title: 'Top Starter', inject: 'topStarterSkills', value: ['Personal Character', 'Durability', 'Productivity', 'Athletic Ability', 'Speed', 'Play Strength', 'ACC Long', 'Drop Set', 'Release', 'Mobility'] },
      { title: 'Starter', inject: 'starterSkills', value: ['Run Game', 'Football Character', 'Explosion', 'ACC Short', 'Awareness'] },
      { title: 'Backup', inject: 'backupSkills', value: ['Pass Game', 'Compete & Toughness', 'Size', 'Arm Strength', 'Security', 'Mechanics', 'Throw on Move'] }
    ]; 

    test.describe("#position: QB", function() {
      test.before(function() {
        metricInputs.forEach(function(attribute) {
          reportPage.changeMetricsInput(attribute.title, attribute.value);
        });
        browser.refresh();
      });

      metricInputs.forEach(function(attribute) {
        test.it(attribute.title + ' should persist on reload', function() {
          reportPage.getMetricsInput(attribute.title).then(function(stat) {
            assert.equal(stat, attribute.value, 'Metrics - ' + attribute.title);
          });
        }); 
      });

      metricsSectionAverages.forEach(function(section) {
        test.it(section.title + ' average should persist on reload', function() {
          reportPage.getMetricsSectionAverage(section.title).then(function(stat) {
            assert.equal(stat, section.value, section.title + ' avg');
          });
        });
      });

      gradeGroupSkills.forEach(function(group) {
        test.it(group.title + ' skills should show correct skills', function() {
          reportPage.getGradeGroupSkills(group.inject).then(function(skills) {
            assert.sameMembers(skills, group.value, group.title + ' skills');
          });
        });
      });
    });

    var positionMetrics = [
      {
        position: 'DC', // FS, SS
        inputs: [
          { title: 'Concentration', value: 4 },
          { title: 'Coverage Press Man', value: 8 },
          { title: 'Coverage Off Man', value: 3 },
          { title: 'Coverage Zone', value: 6 },
          { title: 'Close', value: 2 },
          { title: 'Pedal', value: 7 },
          { title: 'Transition', value: 9 },
          { title: 'Range', value: 1 },
          { title: 'Ball Skills', value: 5 },
          { title: 'Run Support', value: 8 },
          { title: 'Tackling', value: 7 }
        ], 
        sectionAvg: 5.5
      },
      {
        position: 'DE', // DT, LEO, NT
        inputs: [
          { title: 'First Step Explosion', value: 4 },
          { title: '1 Gap Ability', value: 8 },
          { title: '2 Gap Ability', value: 3 },
          { title: 'Lateral Leverage', value: 6 },
          { title: 'Disengage/UOH', value: 2 },
          { title: 'Pursuit', value: 7 },
          { title: 'Tackling', value: 9 },
          { title: 'Pass Rush Power', value: 1 },
          { title: 'Pass Rush Speed', value: 5 },
          { title: 'Pass Rush Moves', value: 8 }
        ], 
        sectionAvg: 5.3
      },
      {
        position: 'FB',
        inputs: [
          { title: 'Start', value: 4 },
          { title: 'Adjust', value: 8 },
          { title: 'Blocking', value: 3 },
          { title: 'Blocking Run', value: 6 },
          { title: 'Blocking Pass', value: 2 },
          { title: 'Routes', value: 7 },
          { title: 'Catching Skills', value: 9 },
          { title: 'RAC', value: 1 },
          { title: 'Ball Security', value: 5 },
          { title: 'Hands', value: 8 },
        ], 
        sectionAvg: 5.0
      },       
      {
        position: 'K', // P
        inputs: [
          { title: 'RightLeft', value: 4 },
          { title: 'Leg Speed', value: 8 },
          { title: 'Leg Strength', value: 3 },
          { title: 'Accuracy Short', value: 6 },
          { title: 'Accuracy Long', value: 2 },
          { title: 'Rise', value: 7 },
          { title: 'In Elements', value: 9 },
          { title: 'Pressure Kicks', value: 1 },
          { title: 'Kickoffs', value: 5 },
          { title: 'Coverage', value: 8 },
        ], 
        sectionAvg: 5.3
      },   
      {
        position: 'KR', // PR, RS, ST-D, ST-O
        inputs: [
          { title: 'Catching Skills', value: 4 },
          { title: 'Run Skills', value: 8 },
          { title: 'Ball Security', value: 3 },
          { title: 'Courage', value: 6 },
          { title: 'Key Plays', value: 2 }
        ], 
        sectionAvg: 4.6
      },   
      {
        position: 'LS',
        inputs: [
          { title: 'Accuracy', value: 4 },
          { title: 'Velocity', value: 8 },
          { title: 'Blocking', value: 3 },
          { title: 'Coverage Ability', value: 6 },
          { title: 'Tackling', value: 2 },
          { title: 'Position Versatility', value: 9 }
        ], 
        sectionAvg: 5.3
      }, 
      {
        position: 'LT', // OC, OG, RT
        inputs: [
          { title: 'Initial Quickness', value: 4 },
          { title: 'Second Level', value: 8 },
          { title: 'Pull', value: 3 },
          { title: 'Sustain', value: 6 },
          { title: 'Pass Set', value: 2 },
          { title: 'Pass Set vs Power', value: 9 },
          { title: 'Pass Set vs Speed', value: 4 },
          { title: 'Pass Set vs Counter', value: 8 },
          { title: 'Pass Set vs Blitz', value: 8 },
          { title: 'Second Position Value', value: 7 }
        ], 
        sectionAvg: 5.9
      },     
      {
        position: 'MB', // OTTO, WB
        inputs: [
          { title: 'Stack Ability', value: 8 },
          { title: 'Disengage/UOH', value: 5 },
          { title: 'Lateral Ability', value: 3 },
          { title: 'Pursuit', value: 6 },
          { title: 'Tackling', value: 2 },
          { title: 'Coverage Man', value: 9 },
          { title: 'Coverage Zone', value: 4 },
          { title: 'Ball Skills', value: 8 },
          { title: 'Blitz', value: 8 }
        ], 
        sectionAvg: 5.9
      }, 
      {
        position: 'RB',
        inputs: [
          { title: 'Inside Run', value: 8 },
          { title: 'Outside Run', value: 5 },
          { title: 'Start', value: 3 },
          { title: 'Vision', value: 6 },
          { title: 'Elude', value: 2 },
          { title: 'YAC', value: 9 },
          { title: 'Ball Security', value: 4 },
          { title: 'Routes', value: 8 },
          { title: 'Catching Skills', value: 7 },
          { title: 'Blocking', value: 9 },
          { title: 'Hands', value: 8 },
        ], 
        sectionAvg: 6.1
      }, 
      {
        position: 'TEF', // TEY
        inputs: [
          { title: 'Initial Quickness', value: 4 },
          { title: 'Blocking Run', value: 8 },
          { title: 'Blocking Pass', value: 3 },
          { title: 'Release', value: 6 },
          { title: 'Routes', value: 2 },
          { title: 'Separation Ability', value: 9 },
          { title: 'Vertical Threat', value: 4 },
          { title: 'Catching Skills', value: 8 },
          { title: 'RAC', value: 8 },
          { title: 'Key Plays', value: 7 }
        ], 
        sectionAvg: 5.9
      },        
      {
        position: 'WR',
        inputs: [
          { title: 'Release', value: 8 },
          { title: 'Routes', value: 5 },
          { title: 'Separation', value: 3 },
          { title: 'Vertical Threat', value: 6 },
          { title: 'Catching Skills', value: 2 },
          { title: 'RAC', value: 9 },
          { title: 'Key Plays', value: 4 },
          { title: 'Blocking', value: 9 },
          { title: 'Hands', value: 8 },
        ], 
        sectionAvg: 5.8
      },       
    ]
    
    positionMetrics.forEach(function(positionAttributes) {
      test.describe("#position: "+ positionAttributes.position, function() {
        test.it('should be able to input values into position skills', function() {
          reportPage.changeProfileDropdown('position', positionAttributes.position);
          positionAttributes.inputs.forEach(function(attribute) {
            reportPage.changeMetricsInput(attribute.title, attribute.value);
          });
          browser.refresh();
        });

        positionAttributes.inputs.forEach(function(attribute) {
          test.it(attribute.title + ' should persist on reload', function() {
            reportPage.getMetricsInput(attribute.title).then(function(stat) {
              assert.equal(stat, attribute.value, 'Metrics - ' + attribute.title);
            });
          }); 
        });

        test.it('Position Skills average should persist on reload', function() {
          reportPage.getMetricsSectionAverage('Position Skills').then(function(stat) {
            assert.equal(stat, positionAttributes.sectionAvg, 'Position Skills avg');
          });
        });
      });
    });

    test.after(function() {
      reportPage.changeProfileDropdown('position', profileData.position);
    });
  });

  test.describe("#submitting", function() {
    test.it('clicking save button updates the report type & removes the save button', function() {
      reportPage.clickSubmitButton();
      reportPage.getProfileDropdown('display.type').then(function(reportType) {
        assert.equal(reportType, 'Fall (Locked)', 'report type');
      });

      reportPage.isSubmitButtonDisplayed().then(function(displayed) {
        assert.equal(displayed, false, 'submit button displayed?');
      });
    });
  });
});