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

// Division Names
constants.divisions = {
  al_east: "AL_EAST",
  pcl_as: "PCL_AS"
}

// Timeouts
constants.timeOuts = {
  mocha: 60000
}

// ScreenSize
constants.screenSize = {
  maxWidth: 1920,
  maxHeight: 3000
}

module.exports = constants;