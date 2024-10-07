# Elasic Assignment

## Overview

This project is a data visualization web application that enables users to perform searches on a dataset stored in Elasticsearch. The application is built using React for the front end, TypeScript for type safety, and Node.js for the back end. The project utilizes Elasticsearch as the database, providing powerful search capabilities and dynamic data retrieval.

## Configuration

### Importing Data to Elasticsearch
For this assignment, I installed Elasticsearch and Kibana locally.
I converted the provided Excel file into a CSV format and imported it into Elasticsearch using Kibana. 
The mapping configuration for the index, along with the CSV file and configuration files for Elasticsearch and Kibana, can be found in the `ELK` directory.

### Configure the connection to Elasticsearch

1. Open the `backend/config.ts` file in your code editor.
2. Update the `node`, `username`, and `password` fields with your Elasticsearch instance details:

```typescript
export const config = {
  elasticsearch: {
    node: 'https://localhost:9200', // Your Elasticsearch URL
    auth: {
      username: 'assignment',         // Your Elasticsearch username
      password: 'assignment',         // Your Elasticsearch password
    },
    tls: {
      rejectUnauthorized: false,      // Disable SSL validation in development
    },
  },
  indexName: 'elastic-assignment'   // Name of your Elasticsearch index
};
```
## Running

### Server
1. Navigate to the client directory `server`
2. Run `npm install`
3. Run `npm start`

### Client
1. Navigate to the client directory `client`
2. Run `npm install`
3. Run `npm start`
4. Navigate to `http://localhost:3000/`