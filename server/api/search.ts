// src/routes/search.ts
import {Router} from 'express';
import {config} from '../config';
import {esClient} from "../index";
import {SEARCH_TYPES} from "../models/searchTypes";

const router = Router();

const getElasticQuery = (query: string, searchType: SEARCH_TYPES) => {
    let esQuery: any = {
        size: 1500,
    };

    if (searchType === SEARCH_TYPES.FREE) {
        esQuery.query = {
            match: {
                "שם ראשי": query,
            },
        };
    } else if (searchType === SEARCH_TYPES.EXACT) {
        esQuery.query = {
            multi_match: {
                query,
                type: 'phrase_prefix',
                fields: ['*'],
            },
        };
    } else if (searchType === SEARCH_TYPES.PHRASE) {
        esQuery.query = {
            multi_match: {
                query,
                type: 'phrase',
                fields: ['*'],
            },
        };
    }

    return esQuery;
};

router.post('/search', async (req, res, next) => {
    const {query, searchType} = req.body;

    let esQuery = getElasticQuery(query, searchType);

    try {
        const searchResponse = await esClient.search({
            index: config.indexName,
            body: esQuery,
        });

        const results = searchResponse.hits.hits
            .map((hit: any) => ({
                id: hit._id,
                ...hit._source,
            }))
            .filter((result: any) => !result.deleted);

        console.log(`Search successful for ${searchType} query: ${query}, got [${results.length}] results.`);
        res.json({results});
    } catch (error) {
        console.log(`Search failed for query: ${query}`, error);
        next(error); // Forward to error handler
    }
});

export default router;
