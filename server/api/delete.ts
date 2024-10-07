// src/routes/delete.ts
import { Router } from 'express';
import { esClient } from '../index';
import { config } from '../config';

const router = Router();

router.post('/delete', async (req, res, next) => {
    const { id } = req.body;

    try {
        await esClient.update({
            index: config.indexName,
            id: id,
            body: {
                doc: { deleted: true },
            },
        });

        console.log(`Record with id ${id} marked as deleted`);
        res.status(200).send('Record marked as deleted');
    } catch (error) {
        console.log(`Delete failed for record with id: ${id}`, error);
        next(error); // Forward to error handler
    }
});

export default router;
