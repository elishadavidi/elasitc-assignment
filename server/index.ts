import express from 'express';
import { Client } from '@elastic/elasticsearch';
import cors from 'cors';
import { config } from './config';
import searchRoute from './api/search';
import deleteRoute from './api/delete';
import { errorHandler } from './utils/errorHandler';

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // Instead of body-parser

// Elasticsearch client setup
export const esClient = new Client({
    node: config.elasticsearch.node,
    auth: config.elasticsearch.auth,
    tls: config.elasticsearch.tls,
});

// API routes
app.use(searchRoute);
app.use(deleteRoute);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});
