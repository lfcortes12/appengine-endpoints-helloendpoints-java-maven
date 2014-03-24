/**
 * @fileoverview
 * Provides methods for the Hello Endpoints sample UI and interaction with the
 * Hello Endpoints API.
 *
 * @author danielholevoet@google.com (Dan Holevoet)
 */

/** google global namespace for Google projects. */
var google = google || {};

/** devrel namespace for Google Developer Relations projects. */
google.devrel = google.devrel || {};

/** samples namespace for DevRel sample code. */
google.devrel.samples = google.devrel.samples || {}; 

/** hello namespace for this sample. */
google.devrel.samples.hello = google.devrel.samples.hello || {};

/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
google.devrel.samples.hello.CLIENT_ID =
    'psyched-oxide-525';

/**
 * Scopes used by the application.
 * @type {string}
 */
google.devrel.samples.hello.SCOPES =
    'https://www.googleapis.com/auth/118044331955@developer.gserviceaccount.com';

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
google.devrel.samples.hello.signedIn = false;

/**
 * Prints a message log.
 * param {String} message to print.
 */
google.devrel.samples.hello.print = function(message, className) {
  
  
  var messageDiv = document.getElementById('outputLog');
  messageDiv.classList.add('alert');
  messageDiv.classList.add(className);
  messageDiv.classList.add('alert-dismissable');
  messageDiv.innerHTML = message + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
  
};

/**
 * Add user object to table
 * param {Object} user to add.
 */
google.devrel.samples.hello.addTable = function(user) {
	var table = document.getElementById("userTable");

	var rowCount = table.rows.length;
	var row = table.insertRow(rowCount);
	row.className = "rowclass";

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);

	// Add some text to the new cells:
	cell1.innerHTML = user.name;
	cell2.innerHTML = user.email;
	cell3.innerHTML = user.password;
	cell4.innerHTML = '<button type="button" class="btn btn-default btn-lg" id="google.devrel.samples.hello.userremove" onclick="google.devrel.samples.hello.userremove(this);"><span class="glyphicon glyphicon-minus"></span>Delete</button>';
};

/**
 * Add user object to table
 * param {Object} user to add.
 */
google.devrel.samples.hello.userremove = function(item) {
	var d = item.parentNode.parentNode.rowIndex;
	var id = document.getElementById("userTable").rows[d].cells[1].childNodes[0].data;
	
	if(id) {
		gapi.client.helloworld.ensename.user.remove({ "id": id}).execute(
	      function(resp) {
	    	  if(resp) {
	    		  google.devrel.samples.hello.print("User removed", 'alert-success');
	    		  google.devrel.samples.hello.listUsers();
	    		  
	    	  }
	      });
	}
	
};

/**
 * Add user object to table
 * param {Object} user to add.
 */
google.devrel.samples.hello.list = function(items) {
	if (items) {
		
		$("#userTable .rowclass").remove();
		
		for (var i = 0; i < items.length; i++) {
			google.devrel.samples.hello.addTable(items[i]);
		}
    }
};

/**
 * Get user name via the API.
 */
google.devrel.samples.hello.getUserName = function(name, email, password) {
	user = new Object();
	user.name = name;
	user.email = email;
	user.password = password;
  gapi.client.helloworld.ensename.user.create(user).execute(
      function(resp) {
    	  if(resp) {
    		  google.devrel.samples.hello.print("User added", 'alert-success');
    		  google.devrel.samples.hello.listUsers();
    	  } else {
    		  google.devrel.samples.hello.print("exists an user with this email", 'alert-warning');
    	  }
      });
};

/**
 * Query for all user elements
 * 
 */
google.devrel.samples.hello.listUsers = function() {
	gapi.client.helloworld.ensename.user.list().execute(
      function(resp) {
        google.devrel.samples.hello.list(resp.items);
      });
};

/**
 * Enables the button callbacks in the UI.
 */
google.devrel.samples.hello.enableButtons = function() {
   
  document.getElementById('userForm').onclick = function() {
	  google.devrel.samples.hello.restartLogDiv();
	  google.devrel.samples.hello.getUserName(
			  	document.getElementById('exampleInputName1').value,
		        document.getElementById('exampleInputEmail1').value,
		        document.getElementById('exampleInputPassword1').value);
  }
  

};

/**
 * Reconfigure log div
 * 
 */
google.devrel.samples.hello.restartLogDiv = function() {
	var messageDiv = document.getElementById('outputLog');
	  messageDiv.classList.remove('alert');
	  messageDiv.classList.remove('alert-dismissable');
	  if(messageDiv.classList.contains('alert-success')) messageDiv.classList.remove('alert-success');
	  if(messageDiv.classList.contains('alert-warning')) messageDiv.classList.remove('alert-warning');
	  if(messageDiv.classList.contains('alert-info')) messageDiv.classList.remove('alert-info');
	  messageDiv.innerHTML = ''; 
};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
google.devrel.samples.hello.init = function(apiRoot) {
  // Loads the OAuth and helloworld APIs asynchronously, and triggers login
  // when they have completed.
  var apisToLoad;
  var callback = function() {
    if (--apisToLoad == 0) {
      google.devrel.samples.hello.enableButtons();
      google.devrel.samples.hello.print("Loading content ...", 'alert-info');
      google.devrel.samples.hello.listUsers();
      google.devrel.samples.hello.restartLogDiv();
      
    }
    
  }

  apisToLoad = 1; // must match number of calls to gapi.client.load()
  gapi.client.load('helloworld', 'v1', callback, apiRoot);
  //gapi.client.load('oauth2', 'v2', callback);
};
