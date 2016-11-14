// Pre Init
var App = {
  Collections: {},
  Models: {},
  Views: {},
  Templates: {},
  Routers: {},
  Instances: {}
}

// Template
var failedObjectTemplate;

$.get("/html/error-panel.html", function(html) { 
  failedObjectTemplate = Handlebars.compile(html);
})

// Models
App.Models.FailedTest = Backbone.Model.extend();

App.Models.TestRun = Backbone.Model.extend({
  url: function() {
    return "/api/test-runs/"+this.get('id');  
  },
  initialize: function(params) {
    this.failedTestList = params.failedTestList;
  },
  parse: function(response, options) {
    var thiz = this;
    console.log('fetched');
    if (response.success == false) {
      return
    }

    response.data.errorObjects.forEach(function(obj) {      
      var failedTest = thiz.failedTestList.findWhere({
        fullTitle: obj.fullTitle,
        title: obj.title
      })
      if (failedTest) {
        failedTest.set({imgFiles: obj.imgFiles})
      } else {
        thiz.failedTestList.add(new App.Models.FailedTest(obj))
      }
    })

    delete response.data.errorObjects;
    return response.data;
  }
});

// Collections
App.Collections.FailedTestList = Backbone.Collection.extend({
  model: App.Models.FailedTest
})

// Views
App.Views.TestResultView = Backbone.View.extend({
  el: '#testResultsPanel',
  events: {
    'click .stack-link': 'toggleStackTraces'
  },
  initialize: function() {    
    this.model.on('change', this.updateDOM, this);
    this.render();
  },
  render: function() {
    this.updateDOM();
      
    return this;
  },
  updateDOM: function() {
    var thiz = this;

    $('#passedCount').text(this.model.get('passedCount'));
    $('#failedCount').text(this.model.get('failedCount'));

    // set readable time
    $('#startTime').text(moment(this.model.get('startedAt')).local().format('dddd, L LT'));
    if (this.model.get('endedAt')) {
      var endedAt = moment(this.model.get('endedAt')).local().format('dddd, L LT')
      $('#endTime').text(endedAt);  
    }

    // set flash color
    $('#testStatus').text(this.model.get('status'));
    switch(this.model.get('status')) {
      case 'ongoing':
        $('#statusFlash').attr('class', 'alert alert-warning');
        break;
      case 'finished':
        $('#statusFlash').attr('class', 'alert alert-success');
        break;
      case 'error':
        $('#statusFlash').attr('class', 'alert alert-danger');
        break;
    }
  },
  toggleStackTraces: function(e) {
    var el = $(e.currentTarget);

    if (el.hasClass('show')) {
      $('a.stack-link').removeClass('show');
      $('a.stack-link').text("[SHOW STACK]");
      $('.stack-row').addClass('hidden');
    } else {
      $('a.stack-link').addClass('show');
      $('a.stack-link').text("[HIDE STACK]");
      $('.stack-row').removeClass('hidden');
    }
  }
});

App.Views.FailedTestsContainer = Backbone.View.extend({
  el: '#failedTestsContainer',
  initialize: function() {    
    this.collection.on('add', this.addDOM, this);
  },
  addDOM: function(failedTest) {
    var view = new App.Views.FailedTestPanel({model: failedTest})
    $('#failedTestsContainer').append(view.render().el);
  }
});

App.Views.FailedTestPanel = Backbone.View.extend({
  className: "panel panel-default error-panel",
  events: {
    'click .error-img': 'openImageModal',
    'click .expander': 'toggleExpander'
  },
  initialize: function() {    
    this.model.on('change', this.render, this);
  },
  render: function() {
    var data = this.model.attributes;
    data.testRunID = App.Instances.testRun.get('id');
    this.$el.html(failedObjectTemplate(data));

    return this;
  },
  openImageModal: function(e) {
    var el = $(e.currentTarget)
    var src = el.attr('src');
    $('#imageModal img').attr('src', src);
    var msg = el.closest('.panel').find('.main').text();
    $('#imageModal .title').text(msg);
    $('#imageModal').focus();
  },
  toggleExpander: function(e) {
    var el = $(e.currentTarget);  
    if (el.hasClass('minimized')) {
      el.removeClass('minimized');
      el.text("[MIN]");
      el.closest('.error-panel').children('.panel-body').show();
    } else {
      el.addClass('minimized')
      el.text("[MAX]");
      el.closest('.error-panel').children('.panel-body').hide();
    }
  }
});

// Router
App.Routers.Workspace = Backbone.Router.extend({
  routes: {
    "test-results/:id": "testResult"
  },
  testResult: function(id) {
    App.Instances.failedTestList = new App.Collections.FailedTestList();
    App.Instances.testRun = new App.Models.TestRun({
      id: id,
      failedTestList: App.Instances.failedTestList
    });

    var failedTestContainer = new App.Views.FailedTestsContainer({
      collection: App.Instances.failedTestList
    });

    App.Instances.testRun.fetch({
      success: function() {
        this.currentView = new App.Views.TestResultView({model: App.Instances.testRun});    
      }
    });

    setInterval(function() {
      if(App.Instances.testRun.get('status') == 'ongoing') {
        App.Instances.testRun.fetch();
      }
    }, 10000); 
  }
})


// Init
App.Instances.workspace = new App.Routers.Workspace();
Backbone.history.start({pushState: true});