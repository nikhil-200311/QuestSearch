
# QuestSearch

QuestSearch is a real-time question search application built with Node.js and Express, utilizing gRPC for microservices communication and MongoDB Atlas for data storage. It features a responsive frontend interface that allows users to search through a database of questions and view their details.

## Features

- Real-time search functionality
- Minimum 5-character search requirement
- Expandable question details with options and correct answers
- Responsive design with modern UI
- MongoDB Atlas integration
- gRPC communication between frontend and backend
- Pagination support

## Important Notes

- **Known Bug**: There is a current issue where the correct answer may show as "not specified" despite attempts to fix it. 
- The data has already been loaded into the MongoDB server online. If additional data needs to be added, a separate `js` file is available (`add-sample-question.js`), where single questions can be added to the server at a time.
- This project is built using only Express and Node.js. No React.js is involved.
- gRPC is used extensively for the microservice architecture of this application.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nikhil-200311/QuestSearch.git
cd QuestSearch
```

2. Install the required dependencies:
```bash
npm install
```

## Starting the Project

To start the application, you need to run both the frontend and backend servers. 

1. **Frontend server**: In one terminal window, run the following command:
```bash
nodemon frontend/server.js
```

2. **Backend server**: In another terminal window, run the following command:
```bash
nodemon backend/server.js
```

This will start both the frontend and backend servers. Make sure that both are running simultaneously to ensure full functionality.
