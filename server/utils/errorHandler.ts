import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(`Error occurred: ${err.message}`);
    res.status(500).json({ error: err.message || 'An unexpected error occurred' });
};
