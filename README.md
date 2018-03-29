# friend-management-app
Requirements at https://gist.github.com/winston/51d26e4587b5e0bbf03fcad558111c08

Author: [Lim Chooi Guan](https://www.linkedin.com/in/cgl88/) (Team Cloud Lead @ Scania AB, Senior Software Engineer)

## Pre-requisites
* Docker
* Shell environment to run scripts (like bash!)
* Curl (for manual testing)

## Quick start
Clone the repo, change directory to the root directory and run `docker-compose up --build`

## Docker-compose
I made modifications which only start the API containers after the MySQL container has finished loading, i.e. port 3306 is accesible.

## Database
Running MySQL.  Scripts located in the database folder are executed in ascending order and dated according to YYYYMMDDHHMMSS format.  This allows for easy migration and testing.
I have added scripts to prepopulate the database.  In a real production environment this would not be done, but schema changes would be added in the same way.  Whenever possible I am using views as both a security mechanism and serving as an abstraction layer away from the underlying tables.  This makes it easier to modify the underlying tables while maintaining core functionality.

## Design overview
Small APIs divided into commands and queries (CQS pattern).
All APIs which are commands are part of the app-command project folder, and all queries are part of the app-query project folder.
This makes the application highly scalable when deployed as microservices allowing one to scale read and write components separately.
Each endpoint is placed in its own controller following the Single Responsibility design principle making it easy to modify.  

## Testing and further refactoring
I have only done manual testing, but the next step would be to add automated tests.
I did not get time to push written SQL statements into models, but at least all SQL queries specific to endpoints are placed in their own file.
It would also be nice to add Swagger documentation, I didn't get time to do this either.
And what would be really nice would be to get this into a pipe and then have AWS cloudformation deploy it automatically, but this is way out of scope. :)

### Test cases for the APIs
I am using curl to deliver POST/GET payloads to the various APIs.  SQL injection attacks are twarted by escaping all input through the use of ? character as a placeholder for values when performing queries.  This is documented in the [mysql](https://github.com/mysqljs/mysql) client documentation.

#### Friendslist endpoint
`curl -d '{  "email": "andy@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/friendslist"`

`curl -d '{  "email": "john@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/friendslist"`

`curl -d '{  "email": "nonuser@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/friendslist"`

#### Commonfriendslist endpoint
`curl -d '{  "friends": [ "andy@example.com", "john@example.com" ]}' -H 'content-type:application/json' -X GET "http://localhost:8000/api/commonfriendslist"`

`curl -d '{  "friends": [ "andy@example.com", "john2@example.com" ]}' -H 'content-type:application/json' -X GET "http://localhost:8000/api/commonfriendslist"`

`curl -d '{  "friends": [ "andy@example.com", "nonuser@example.com" ]}' -H 'content-type:application/json' -X GET "http://localhost:8000/api/commonfriendslist"`

#### Receiveupdatesrecipientslist endpoint
`curl -d '{  "sender": "andy@example.com", "text": "Hello World! kate@example.com john2@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"`

`curl -d '{  "sender": "andy@example.com", "text": "Hello World! bobby@example.com kate@example.com john2@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"`

`curl -d '{  "sender": "andy@example.com", "text": "" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"`

`curl -d '{  "sender": "andy@example.com", "text": " " }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"`

`curl -d '{  "sender": "nonuser@example.com", "text": "Hello World! bobby@example.com john2@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"`

#### Friendconnection endpoint
`curl -d '{  "friends": [ "andy@example.com", "john@example.com" ]}' -H 'content-type:application/json' "http://localhost:8001/api/friendconnection"`

`curl -d '{  "friends": [ "andy1@example.com", "john@example.com" ]}' -H 'content-type:application/json' "http://localhost:8001/api/friendconnection"`

`curl -d '{  "friends": [ "andy@example.com", "john2@example.com" ]}' -H 'content-type:application/json' "http://localhost:8001/api/friendconnection"`

`curl -d '{  "friends": [ "andy@example.com", "nonuser@example.com" ]}' -H 'content-type:application/json' "http://localhost:8001/api/friendconnection"`

#### Blockupdates endpoint
`curl -d '{  "requestor": "andy@example.com",  "target": "common@example.com" }' -H 'content-type:application/json' "http://localhost:8001/api/blockupdates"`

`curl -d '{  "requestor": "andy@example.com",  "target": "bobby@example.com" }' -H 'content-type:application/json' "http://localhost:8001/api/blockupdates"`

`curl -d '{  "requestor": "andy@example.com",  "target": "nonuser@example.com" }' -H 'content-type:application/json' "http://localhost:8001/api/blockupdates"`

#### Subscribeupdates endpoint
`curl -d '{  "requestor": "andy@example.com",  "target": "common@example.com" }' -H 'content-type:application/json' "http://localhost:8001/api/subscribeupdates"`

`curl -d '{  "requestor": "andy@example.com",  "target": "bobby@example.com" }' -H 'content-type:application/json' "http://localhost:8001/api/subscribeupdates"`

`curl -d '{  "requestor": "andy@example.com",  "target": "nonuser@example.com" }' -H 'content-type:application/json' "http://localhost:8001/api/subscribeupdates"`
