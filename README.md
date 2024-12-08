# Express-Project
A lightweight and easy-to-understand implementation of a CRUD (Create, Read, Update, Delete) application. This project demonstrates the fundamental operations in any application that interacts with a database, making it ideal for learning and quick prototyping.

# Features ✨
-Create: Add new records to the database.
- Read: Retrieve and display existing records.
- Update: Modify existing records.
- Delete: Remove records from the database.

# Technologies Used 🛠️
- Programming Language: JavaScript
- Framework: Express
- Database: MongoDB
Frontend: HTML (Jade Templates), CSS, JavaScript  


# Installation and Setup ⚙️

Follow these steps to get the project running on your local machine:

1. Clone the repository:
```markdown
git clone https://github.com/Josafath/Simple-CRUD-project.git
cd Simple-CRUD-project
```

2. Install dependencies:
```markdown
npm install 
```

3. Configure the database:
  You will first need to create an account with MongoDB Atlas (this is free, and just requires that you enter basic contact details and acknowledge their terms of service).
  After logging in, you'll be taken to the home screen:
    - Click the + Create button in the Overview section.
    - This will open the Deploy your cluster screen. Click on the M0 FREE option template.
    - Scroll down the page to see the different options you can choose.
    - You can change the name of your Cluster under Cluster Name. We are keeping it as Cluster0 for this tutorial.
        - Deselect the Preload sample dataset checkbox, as we'll import our own sample data later on
        - Select any provider and region from the Provider and Region sections. Different regions offer different providers.
        - Tags are optional. We will not use them here.
        - Click the Create deployment button (creation of the cluster will take some minutes).
    - This will open the Security Quickstart section.
      - Enter a username and password for your application to use to access the database (above we have created a new login "cooluser"). Remember to copy and store the credentials safely as we will need them later on. Click the Create User button.
      - Select Add by current IP address to allow access from your current computer
      - Enter 0.0.0.0/0 in the IP Address field and then click the Add Entry button. This tells MongoDB that we want to allow access from anywhere.
        
    -  Click on the Database section under the Deployment menu on the left. Click the Browse Collections button.
    -  This will open the Collections section. Click the Add My Own Data button.
    -  This will open the Create Database screen.
        - Enter the name for the new database.
        - Enter the name of the collection as Collection0.
        - Click the Create button to create the database.
          
    - You will return to the Collections screen with your database created.
      - Click the Overview tab to return to the cluster overview.
     
    - From the Cluster0 Overview screen click the Connect button.
      
    - This will open the Connect to Cluster0 screen.
      - Select your database user.
      - Select the Drivers category, then the Driver Node.js and Version as shown.
      - DO NOT install the driver as suggested.
      - Click the Copy icon to copy the connection string.
      - Paste this in your local text editor.
      - Replace <password> placeholder in the connection string with your user's password.
      - Insert the database name "local_library" in the path before the options (...mongodb.net/<database_name>?retryWrites...)
      - Save the file containing this string somewhere safe.
You have now created the database, and have a URL (with username and password) that can be used to access it. This will look something like: 
```markdown
mongodb+srv://your_user_name:your_password@cluster0.cojoign.mongodb.net/<db_name>?retryWrites=true&w=majority&appName=Cluster0
```
You have to insert in line 18 from file app.js

4. Start application

```markdown
npm start
```

5. Open your browser and navigate to:
```markdown
http://localhost:3000
```


You can see the project [here](https://knowledgeable-speckle-juice.glitch.me)



The password to delete items is: jossify123


