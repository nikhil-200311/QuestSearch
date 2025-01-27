# QuestSearch

QuestSearch is a real-time question search application built with Node.js and Express, utilizing gRPC for microservices communication and MongoDB for data storage. It features a responsive frontend interface that allows users to search through a large database of questions and view their details.

## Features

- Real-time search functionality
- Minimum 5-character search requirement
- Expandable question details with options and correct answers
- Responsive design with modern UI
- MongoDB Compass for local database storage (supports a large dataset)
- MongoDB Atlas integration for smaller datasets or manual uploads
- gRPC communication between frontend and backend
- Pagination support for improved navigation

## Recent Updates

- **Database Change**: Due to the large size of the dataset (1,00,000 questions), the application now uses a local MongoDB database (MongoDB Compass) for storage. MongoDB Atlas can still be used for smaller datasets by uploading the `.json` file.
- **Database Loader**: Added a script to load the database directly. Use the command `node load-data.js` to populate the database with the questions dataset.
- **Reference**: An image of the database structure has been attached for guidance.
- **Bug Fix**: The issue where the correct answer displayed as "not specified" has been resolved.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB Compass (for local database storage)
- MongoDB Atlas account (optional for smaller datasets)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nikhil-200311/QuestSearch.git
cd quest-search
```

2. Install the required dependencies:
```bash
npm install
```

3. Set up your database:
   - **Local Database**: Use MongoDB Compass to set up the local database.
   - **Database Loader**: Run the following command to load the questions dataset into your database:
     ```bash
     node load-data.js
     ```
   - **MongoDB Atlas**: For smaller datasets, you can upload the `questions.json` file to MongoDB Atlas. 

## Starting the Project

To start the application, you need to run both the frontend and backend servers.

1. **Frontend server**: In one terminal window, run:
```bash
nodemon frontend/server.js
```

2. **Backend server**: In another terminal window, run:
```bash
nodemon backend/server.js
```

## Notes

- MongoDB Compass is the recommended database solution for handling the large dataset.
- If using MongoDB Atlas, ensure your dataset is small enough to upload manually.
- To add additional data to the database, use the provided `add-sample-question.js` file. This allows adding questions individually.
- The current application does not use React.js, focusing solely on Node.js and Express.

## Troubleshooting

- **Database Errors**: Ensure MongoDB Compass is properly set up and the database connection string in the project is accurate.
