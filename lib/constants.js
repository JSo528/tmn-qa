var constants = {};

// TESTS
constants.tests = {
  1: {
    id: 1,
    name: 'MLB Staging',
    environment: 'staging',
    fileName: 'mlb_staging'
  },
  2: {
    id: 2,
    name: 'MLB Production',
    environment: 'production',
    fileName: 'mlb_production'
  },
  3: {
    id: 3,
    name: 'MLB Example',
    environment: 'staging',
    fileName: 'mlb_example'
  },  
}

// URLs
constants.urls = {
  host: {
    production: 'http://ec2-54-172-26-71.compute-1.amazonaws.com:3000/',
    development: 'http://localhost:3000/'
  },
  nfl: {
    fortyNiners: 'https://49ers.analytics.trumedianetworks.com/',
    cowboys: 'https://cowboys.analytics.trumedianetworks.com/',
    eagles: 'https://eagles.analytics.trumedianetworks.com/'
  },
  mlb: {
    dodgers: 'https://dodgers.trumedianetworks.com/',
    dodgersStaging: 'https://dodgers-staging.trumedianetworks.com:3001',
    phillies: 'https://phillies.trumedianetworks.com/',
    mlbDemo: 'https://mlbdemo.trumedianetworks.com/'
  },
  espn: {
    football: 'https://football.espntrumedia.com/',
    baseball: 'https://baseball.espntrumedia.com/',
    soccer: 'https://www.espntrumedia.com/'
  },
  scouting: {
    jagsStaging: 'http://staging.jags.scouting.trumedianetworks.com/'
  }
};

// Timeouts
constants.timeOuts = {
  mocha: 60000
};

// ScreenSize
constants.screenSize = {
  maxWidth: 1920,
  maxHeight: 3000
};

constants.errorObjects = {
  maxChars: 2000
};

module.exports = constants;