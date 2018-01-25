// SETUP:

// to be replaced with a valid path (been trying both absolute and relative paths)
var jsonPath = "/path/to/serviceAccountKey.json";

// version 5.8.1
var admin = require("firebase-admin");

var serviceAccount = require(jsonPath);

// also been trying manually specifying project ID, key ID etc.
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://free-speech-ads.firebaseio.com"
});

admin.database.enableLogging(true);

/**********************************************************************************/

function registerNewUser({emails, url, name, externalId}){
    /*
    PRE:
    Takes the following arguments (all as an object!):
        * emails (array) - email(s) to contact person(s)
        * url (string) - the url to the site
        * name (string) - display/nice name of the user
        * wordpressId (string) - external ID
        
    POST:
    Inserts the user info into the ref userInfo, puts the assigned key-value in IDchecker (as a lookup table)
    and outputs an alert message with the siteId.
	*/
  
    // Get a push key
    const newUserId = admin.database().ref('Lookup').push(externalId).key;

    // input-data:
    const data = {
        emails: emails,
        url: url,
        name: name,
        registered: new Date(),
        siteId: newUserId
    };
    Promise.resolve(newUserId).then(newUserId => {
        // Write the new post's data simultaneously:
        var updates = {};
        updates[`userInfo/${externalId}`] = data;
        updates[`IDchecker/${newUserId}`] = true;

        console.log("Update successful!\n\nThe ID for the inserted user is:\n" + newUserId);
        return admin.database().ref().update(updates);
    }).catch(err => {
        console.log(err);
    });
 }

 /**********************************************************************************/
 // Calling the function which produces the error

registerNewUser({
    emails: ['test@gmail.com'],
    url: 'htts://myurl.com',
    name: 'Me',
    externalId: '1119'});
