
# Google-OAuth 2.0
Authenticate Google OAuth 2.0 authorization server to upload files or images on the Google Drive. 
Sample implementation of a client site RESTful application using Express Js 

## Getting Started

### Install
clone the application and run using below command

`npm install`

It will be installed all the dependencies

### Google Application

Create a application on [Google Developer Console](https://console.developers.google.com/apis/dashboard?project=first-hearth-290803&pli=1) and use the Client ID, Secret Key and Direction URL in your created client application

or

Download the created application's credential JSON file from the [Google Developer Console](https://console.developers.google.com/apis/dashboard?project=first-hearth-290803&pli=1) dashboard and rename it as (client_secret.json) paste that onthe credential directory. 

### ADD credentials

`"client_id":"<PASTE_YOUR_CLIENT_ID>"`

`"client_secret":"PASTE_YOUR_SECRET_KEY"`

`"redirect_uris":["<TYPE_YOUR_REDIRECT_URL>"]`

### Run Application

Run the application using below command (Before running the application, make sure your port 5000 is empty)

`node index.js`

Open your browser type [http://localhost:5000](http://localhost:5000)

•	GET request: http://localhost:5000/getUrl 


•	POST request: http://localhost:5000/getToken

      Post body:
      {
          “code”: “”
      }
      
•	POST request: http://localhost:5000/userDetails

      Post body:
      {
        “token”: {
                 } 
      }

•	POST request: http://localhost:5000/driveInfo


    Post body:
    {
      “token”: {
                } 
    }
•	POST request: http://localhost:5000/upload


    Post body:
    {
      “files”: “”
      “token”: {
                } 
    }
