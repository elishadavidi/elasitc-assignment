// src/routes/search.ts
import {Router} from 'express';
import {config} from '../config';
import {esClient} from "../index";
import {SEARCH_TYPES} from "../models/searchTypes";

const router = Router();

const getElasticQuery = (query: string, searchType: SEARCH_TYPES) => {
    let esQuery: any = {
        size: 1500,
        aggs: {
            topNeighborhoods: {
                terms: {
                    field: "שכונה.keyword",  // Use `.keyword` to aggregate on exact terms
                    size: 5,
                },
            },
            topTypes: {
                terms: {
                    field: "סוג.keyword",
                    size: 5,
                },
            },
        },
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
    const { query, searchType, filters } = req.body;

    let esQuery = getElasticQuery(query, searchType);

    if (filters) {
        const { neighborhoods, types } = filters;
        const filterClauses = [];

        if (neighborhoods && neighborhoods.length > 0) {
            filterClauses.push({
                terms: {
                    "שכונה.keyword": neighborhoods
                }
            });
        }

        if (types && types.length > 0) {
            filterClauses.push({
                terms: {
                    "סוג.keyword": types
                }
            });
        }

        if (filterClauses.length > 0) {
            esQuery.query = {
                bool: {
                    must: esQuery.query ? [esQuery.query] : [],
                    filter: filterClauses
                }
            };
        }
    }

    // console.log(`query: ${JSON.stringify(esQuery, null, 2)}`);

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

        let topNeighborhoods, topTypes;

        if (searchResponse.aggregations) {
            let aggregations = searchResponse.aggregations as any;
            topNeighborhoods = aggregations.topNeighborhoods.buckets.map((bucket: any) => ({
                city: bucket.key,
                count: bucket.doc_count,
            }));

            topTypes = aggregations.topTypes.buckets.map((bucket: any) => ({
                street: bucket.key,
                count: bucket.doc_count,
            }));
        }

        console.log(`Search successful for ${searchType} query: ${query}, got [${results.length}] results.`);
        res.json({
            results,
            filters: {
                neighborhoods: topNeighborhoods,
                types: topTypes,
            },
        });
    } catch (error) {
        console.log(`Search failed for query: ${query}`, error);
        next(error); // Forward to error handler
    }
});

export default router;
