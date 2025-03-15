import { Response } from 'express';

export const httpResponse = (status: number, message: string, data: any, res: Response): Response => {
    return res.status(status).json({
        message,
        data
    });
}