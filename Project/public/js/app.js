(function ($) {
  // This is the model in backbone that holds the basic JSON object we use
  var Item = Backbone.Model.extend({
    defaults: {
      name: 'unknown name',
      points: '0'
    },
    // The backbone id attribute default is 'id', but we use MongoDB on the back end that uses '_id'
    idAttribute: '_id'
  });

  // A backbone collection contains a model type
  // Also, we put a url here that we can tie this collection to a RESTful API
  var ItemLibrary = Backbone.Collection.extend({
    model: Item,
    url:'/items'
  });

  // The view here defines the template that we want to use for the model
  // This is used later on in the view for the collection to create a few for each item in the collection
  var ItemView = Backbone.View.extend({
    // tagName and className set some of the defaults of the 'template'
    // They wrap the template with a 'div' here and set the class to 'itemContainer'
    tagName: 'div',
    className: 'itemContainer',
    // This is the actual HTML that gets wrapped inside of the tag and class above as the template
    template: $('#itemTemplate').html(),

    // Actually renders the template with the model as JSON
    render: function () {
      // Uses underscore to generate the template
      var tmpl = _.template(this.template);
      // $el is actually what tagName, className, and template created
      // The variables in the HTML template are filled out with the model JSON
      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    }
  });

  // This view encapsulates a collection
  var ItemLibraryView = Backbone.View.extend({
    // Pulls in the whole items div to use as the collections HTML element
    el: $('#items'),

    initialize: function () {
      // Our views collection is the library model collection
      this.collection = new ItemLibrary();
      this.collection.fetch();
      this.render();

      // Register event for when the collection gets added to in order to register the item that got added
      this.collection.on('add', this.renderItem, this);
      this.collection.on('reset', this.render, this);
    },

    render: function () {
      // Just saves the view for use out of this scope
      var thisView = this;
      // Calls renderItem for each model in the views collection of models
      // Third param provides the 'this' for the renderItem function
      _.each(this.collection.models, function(item) {
        thisView.renderItem(item);
      }, this);
    },

    // Actually renders the item by creating a new view
    renderItem: function (item) {
      var itemView = new ItemView({
        model: item
      });
      this.$el.append(itemView.render().el);
    }
  });

  var itemLibraryView = new ItemLibraryView();
  itemLibraryView.on('faye', function () {
    itemLibraryView.collection.fetch();
    itemLibraryView.collection.reset();
    itemLibraryView.render();
  });

  var fayeClient = new Faye.Client('http://localhost:3001/faye');
  var sub = fayeClient.subscribe('/faye', function() {
    console.log("message received!");
    itemLibraryView.trigger('faye');
  });
})(jQuery);
