##Get the Repository
Clone the git repository locally

    git clone git@github.com:davidbella/node-meetup.git

Start in the `start` branch and follow along

    git checkout start

##branch 'start'
###Install NPM Packages
Try to run node server.js  

    cd Project
    node server.js

Uh oh! Error that you need mongodb package

    npm install mongodb

###Install Mongo DB and Fire It Up!
On Mac, through `brew`:

    brew install mongodb
    mkdir -p /data/db # Maybe - try the next step first
    mongod

If you don't have brew, I recommend getting it, but there are manual installation instructions on the [MongoDB website](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

On Windows, if you don't have a Mac, I recommend getting one ;) but there are installation instructions [here](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/)

Open a new terminal window and run the server again

    node server.js

You should get a message from Mongo that you can ignore for now  
Open your browser to http://localhost:3000 to verify we are running!

###A Quick Walk Through
#####server.js
Here we require the Express web application framework and a local file that will act as a controller for our routes

We create an `app` variable to work with as our Express app

The fun stuff starts here, with how Express handles routes

    app.get('/', function(req, res) { ... } );
    
This will match any incoming requests to our root path, such as `http://localhost:3000` and run the specified function

Notice the two parameters to our function, `req` and `res`. These stand for request and response and reflect the HTTP request that the client sent us, and the HTTP response that we as the server are preparing to send back to them.

Some common things to pull out of the request are `querystring` parameters, which we will get to.

Some common things to set in the response is the response body, or content, which we have seen already.

In our case, we are telling the response to `end`, with the words "Hello Node!"

As you can see, there are also `post`, `put`, and `delete` functions on the app variable in addition to `get`.

These functions correspond to HTTP verbs that are used to implement a REST API.

The functions on the `items` controller that are called should help explain the function of each one, but here is a quick table:

<table>
	<tr>
		<td>
			Post
		</td>
		<td>
			Create
		</td>
	</tr>
	<tr>
		<td>
			Get
		</td>
		<td>
			Read
		</td>
	</tr>
	<tr>
		<td>
			Put
		</td>
		<td>
			Update
		</td>
	</tr>
		<tr>
		<td>
			Delete
		</td>
		<td>
			Destroy
		</td>
	</tr>
</table>

Notice how the HTTP verbs correspond with `CRUD` - Create, Read, Update, Destroy

####controllers/items.js
This is an abstraction to help us pull the logic out of `server.js` and into a separate file. Since we are keeping this app simple, we are putting the database logic here, as this is the only resource.

First we require the `mongodb` package. Then, we set up a couple of helpers based off of this package.

`Server` will be used to connect to an actual Mongo server, in this case, our local computer on port 27017, the default.

`Db` will be used to create or open the specific database in Mongo.

Finally, `BSON` will be used to help us interact with the data format Mongo uses to store records.

The next few lines setting up the server, db, and opening the db are fairly explanatory.

Each of the lines that start with `export` you will notice match up to the function calls we make on the `items` variable in the `server.js` file.

`export`s allows you to create functions that can be used when someone `require`s this module into their code.

##branch 'controller-actions-to-mongo'
###Controller Actions
We'll start with the `findAll` function and then work our way through the REST of the REST operations, heh. While we do so, we will highlight any differences between the functions.

Now we will start to fill in the items controller's actions to interact with the Mongo DB collection of items.

####findAll
Let's follow along and read the `findAll` function logically.

Take the database connection in variable `db`.

Run the `collection` function on that to retrieve a collection called `itemscollection`.

Providing the following callback for when the collection has been retrieved

Act upon the returned collection by calling the `find` function and then call `toArray` on it to make it into a JavaScript array.

Once that is done, send the newly created array as the response to the browser and end the connection.

####findById
New in this function is pulling the `id` we want to look up from the request object's parameters.

We perform the same collection retrieval as last time, in fact, we perform this on each REST action - perhaps someone would like to abstract it or simplify it somehow?

The difference is that instead of calling `find`, we call `findOne`. But in order to find a specific item, we have to pass in the `id` we got from the request. However, the way Mongo stores data is through BSON, or Binary JSON. We need to convert the `id` given to us to BSON before we can look it up in Mongo.

####addItem
Here we require the use of the request body, which we expect to be a JSON object being sent to us by the client.

In order for Express to know how to handle this, we must explicitly configure it to use the "body parser". We can turn this on in server.js by adding the following line:

    app.use(express.bodyParser());

Again, we ask Mongo for the collection and then we insert the `item`, which is what the client sent to us in the body of the HTTP request.

Here also note that we provide an error message to the user if the insert fails for any reason. It is always good practice to inform the consumers of your API of any failures.

####updateItem
This is basically a combination of `findById` and `addItem`. We first accept an ID of an item to update, and then use the collection update function to modify it with the new body content passed it. Note that this is entirely destructive. It will fully replace the entire item with what you have added.

####deleteItem
This rounds out the RESTful actions of our simple API. It closely resembles `findOne`, but instead of just returning the result, it deletes it, and then returns it.

###Testing the API
Now that we have implemented the API, we should manually make sure that it works. In this section, we will use two tools: one to interact directly with our backend database, and one to interact directly with our RESTful Node server from the command line.

####Mongo Command Line
Like most larger programming languages and tools, Mongo comes with a built in command line program for interacting with the database.

From the command line run:

    mongo

For convenience, here is a mini Mongo cheatsheet to get up and running (I actually still use this personally whenever I work with Mongo, I hope you find it helpful)
    
######Mini MongoDB cheat sheet

    # shows all dbs on the system
    show dbs
    
    # switches to or creates the named database
    use <database_name>
    
    # inserts a new user with key value pair “name” and “david”
    db.users.insert({‘name’: ‘david’})
    
    # displays all entries in the ‘users’ collection
    db.users.find()
    
    # shows all collections in the current database
    show collections
    
    # removes a record from a collection
    db.users.remove({‘name’: ‘david’})
    
    # updates an existing entry
    db.users.update({‘name’: ‘david’}, {$set: {‘title’: ‘programmer’}})

####curl
`curl` is a wonderful utility to work with HTTP requests and responses via the command line. I often feel that GUI programs are more complicated and provide unnecessary complexity, especially when the operations you are trying to perform are simple, and you have a handy cheat sheet :)

######Mini curl REST cheat sheet

    # Create a new item via POST
    curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "first item", "points": "20"}' http://localhost:3000/items
    
    # Gets a list of all items via GET
    curl -i -X GET http://localhost:3000/items
    
    # Gets a specific item via GET
    curl -i -X GET http://localhost:3000/items/52ea3e7444c64da194968f52
    
    # Given an item you know the ID for
    # Updates the specified item via UPDATE
    curl -i -X PUT -H 'Content-Type: application/json' -d '{"points": "40"}' http://localhost:3000/items/52ea3e7444c64da194968f52
    
    # Given an item you know the ID for
    # Deletes the specified item via DELETE
    curl -i -X DELETE http://localhost:3000/items/52ea3e7444c64da194968f52

Notice how each of these URLs will hit a specific route with a specific HTTP verb. We defined all of these routes in our `server.js` file. Further, we provided functions in the `controllers/items.js` controller to handle these requests, namely, interacting with the Mongo back end database.

##branch 'backbone-collection'
###Backbone.js
Backbone.js is a JavaScript library primarily targeted to the front end to help organize and display content. Technically, backbone implements the Model-View-Presenter pattern. Since our backend is just a simple REST API, using something like backbone on the frontend can help give our application more structure.

####Yeah, but why are we using it?
Why not? The great thing about Node and JavaScript everywhere is that things hook up really nicely. As we will see, there isn't too much work that will go into setting up a simple backbone app.

It will also provide some code to set us up with event handling, which we will want for the final part of this presentation.

Also, just having simple reference material to work from when creating new projects can be really helpful.

####Creating index.html
Create a `public/` folder and make a file called `index.html` inside of it.

This file will hold our backbone template. Backbone isn't really as hard as it is made out to be, and this is a good spot to start to understand what's going on.

First, we create a div called `items`. Inside the div, we define a *script*. Now this isn't a script like a JavaScript file, this is just an arbitrary script tag that we are going to give a type "text/template" to. This doesn't mean anything to HTML so it won't get displayed, but it means the world to backbone, which we will see soon.

Inside the script we can use this `<%= %>` syntax to pull the names of our items attributes.

If we were working earlier with `name` and `points` we would want to name things the same way here, so they show up as we expect.

Also note that in our HTML file, we load backbone, jQuery, underscore.js, and `app.js` - which we are going to write now.

####Creating the backbone app.js
Inside the `public/` folder, create a new JavaScript file called `app.js`. This is pretty bad practice in general, but for now we are going to just stick all our backbone code into one file.

#####Item Model
The first and most simple thing to do is to create a backbone model that will mimic the data we have on our backend in the Mongo database.

    var Item = Backbone.Model.extend({ ...

We can also define some defaults here, so if the backend collection doesn't have these attributes for some reason, at least something will be displayed, and it won't throw off our styling in the front end.

#####Item Collection (Library)
Next up we need to define the fact that there will be more than one of these items that we will want to display.

    var ItemLibrary = Backbone.Collection.extend({ ...

The cool thing about this code is that we can point our front end collection to a RESTful API endpoint, in this case `/items` and backbone will automagically load the records in that collection.

#####Item View
This is where things begin to look a little bit complicated, but if we keep in mind that this whole next section of code simply *pulls the template from the HTML index page* to use as our view template, things aren't that difficult.

    var ItemView = Backbone.View.extend({ ...

It does a couple of other things first. Whenever we create an item to display, it is going to create a `div` with class `itemContainer` and it is going to fill the contents of that div with the model we provides JSON attributes. These attributes will match up to the template attributes (the ones in the `<%= %>` syntax) and generate the html properly.

#####Item Collection (Library) View
The last piece is a view to display our entire collection of items. This piece will wrap the collection itself into a view and provide logic to render each item in that collection.

A couple of interesting things are going on here, we are explicitly setting the `el` attribute to be a div existing in our HTML that we want to render this collection of items.

Next up is the `initialize` function which sets this view's collection to be our `ItemLibrary` collection. This collection is the one that is tied to our backend API at `/items`. Now we can pull those items with the `.fetch()` call and finally `.render()`.

Also note that we have registered two events here as well, the `add` and the `reset` events. This allows us to run code when something happens. This is all related to that evented callback world we talk about in Node.

The important call here is the `render` function. This function looks very confusing at first, but when we step through it, it is not so bad. We iterate through each model in the collection we have and run `renderItem` on it.

#####Create it!
Up until this point we have just been doing set up. The key to it all is creating an `ItemLibraryView`. This will kick everything off in its `initialize` function.

###Simple Pub Sub with Faye
