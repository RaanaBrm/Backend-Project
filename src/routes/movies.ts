import express, { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { httpResponse } from '../lib/httpResponse.ts';

import Movie from '../models/Movie.ts';

const router = express.Router();


//fetch all movie
router.get('/', async (req: Request<{}, {}, {}, {
    page?: number;
    limit?: number;
    originalTitle?: string;
    overview?: string;
    relaseDate?: string;
    voteAverage?: string;
}>, res: Response): Promise<any> => {
    try {
        let {
            page = 1,
            limit = 10,
            originalTitle = null,
            overview = null,
            relaseDate = null,
            voteAverage = null
        } = req.query;

        const skip = (page - 1) * limit;


        let query: {
            originalTitle?: { $regex: string; $options: string; };
            overview?: { $regex: string; $options: string; };
            relaseDate?: {
                $gte?: Date;
                $lte?: Date;
            },
            voteAverage?: {
                $gte?: number;
                $lte?: number;
            };
        } = {};

        if (originalTitle) {
            query.originalTitle = { $regex: originalTitle, $options: 'i' };
        }
        if (overview) {
            query.overview = { $regex: overview, $options: 'i' };
        }
        if (relaseDate) {
            query.relaseDate = {
                $gte: new Date(relaseDate),
                $lte: new Date(relaseDate)
            };
        }
        if (voteAverage) {
            query.voteAverage = {
                $gte: Number(voteAverage),
                $lte: Number(voteAverage)
            };
        }


        const movies = await Movie
            .find(query)
            .skip(skip).limit(limit)
            .sort({ relaseDate: -1 });

        const total = await Movie.countDocuments(query);

        const pagination = {
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            pageSize: limit
        };

        return httpResponse(200, "Success", { movies, pagination }, res)
    }
    catch (error: any) {
        console.error(error);
        return httpResponse(500, "Internal Server Error", {}, res)
    }
});

//fetch movie by id
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);
        return httpResponse(200, "Success", movie, res)

    }
    catch (error: any) {
        console.error(error);
        return httpResponse(500, "Internal Server Error", {}, res)
    }
});

//create movie
router.post('/', async (req: Request<{}, {}, { originalTitle: string; overview: string; relaseDate: Date; voteAverage: number }>, res: Response): Promise<any> => {
    try {

        //validate input
        const { originalTitle, overview, relaseDate, voteAverage } = req.body;

        if (!originalTitle) {
            return httpResponse(400, "Bad Request", {}, res)
        }

        //create new movie
        const newMovie = new Movie({
            originalTitle,
            overview,
            relaseDate,
            voteAverage
        });

        //save movie
        await newMovie.save();

        // return success response
        return httpResponse(201, "Movie created", { _id: newMovie._id }, res)
    }

    catch (error: any) {
        console.error(error);
        return httpResponse(500, "Internal Server Error", {}, res)
    }
});

//Todo: update movie
router.put('/:id', async (req: Request<{ id: ObjectId }, {}, { originalTitle: string; overview: string; relaseDate: Date; voteAverage: number }>, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { originalTitle, overview, relaseDate, voteAverage } = req.body;

        const movie = await Movie.findById(id);

        if (!movie) {
            return httpResponse(404, "Movie not found", {}, res)
        }

        movie.originalTitle = originalTitle || movie.originalTitle;
        movie.overview = overview || movie.overview;
        movie.relaseDate = relaseDate || movie.relaseDate;
        movie.voteAverage = voteAverage || movie.voteAverage;

        await movie.save();

        return httpResponse(200, "Movie updated", { _id: movie._id }, res)
    }
    catch (error: any) {
        console.error(error);
        return httpResponse(500, "Internal Server Error", {}, res)
    }
});

// delete movie
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        await Movie.findByIdAndDelete(id);
        return httpResponse(200, "Movie deleted", {}, res);
    }
    catch (error: any) {
        console.error(error);
        return httpResponse(500, "Internal Server Error", {}, res)
    }
});


export default router;