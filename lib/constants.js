var constants = {};

// Test User Credentials
constants.testUser = {
  email: 'qa@trumedianetworks.com',
  password: 't3stuser'
};

// URLs
constants.urls = {
  nfl: {
    fortyNiners: 'https://49ers.analytics.trumedianetworks.com/',
    cowboys: 'https://cowboys.analytics.trumedianetworks.com/',
    eagles: 'https://eagles.analytics.trumedianetworks.com/'
  },
  mlb: {
    dodgers: 'https://dodgers.trumedianetworks.com/',
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

module.exports = constants;