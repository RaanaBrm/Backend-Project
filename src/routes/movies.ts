import express, { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { httpResponse } from '../lib/httpResponse.ts';

import authenticateToken from './../middleware/authMiddleware.ts';

import Movie from '../models/Movie.ts';

const router = express.Router();


//fetch all movie
router.get('/', async (req: Request<{}, {}, {}, {
    page?: number;
    limit?: number;
    original_title?: string;
    overview?: string;
    release_date?: string;
    vote_average?: string;
}>, res: Response): Promise<any> => {
    try {
        let {
            page = 1,
            limit = 10,
            original_title: original_title = null,
            overview = null,
            release_date: release_date = null,
            vote_average: vote_average = null
        } = req.query;

        const skip = (page - 1) * limit;


        let query: {
            original_title?: { $regex: string; $options: string; };
            overview?: { $regex: string; $options: string; };
            release_date?: {
                $gte?: Date;
                $lte?: Date;
            },
            vote_average?: {
                $gte?: number;
                $lte?: number;
            };
        } = {};

        if (original_title) {
            query.original_title = { $regex: original_title, $options: 'i' };
        }
        if (overview) {
            query.overview = { $regex: overview, $options: 'i' };
        }
        if (release_date) {
            query.release_date = {
                $gte: new Date(release_date),
                $lte: new Date(release_date)
            };
        }
        if (vote_average) {
            query.vote_average = {
                $gte: Number(vote_average),
                $lte: Number(vote_average)
            };
        }


        const movies = await Movie
            .find(query)
            .skip(skip).limit(limit)
            .sort({ release_date: -1 });

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
router.post('/', async (req: Request<{}, {}, {
    movie_id: number;
    original_title: string;
    overview: string;
    release_date: Date;
    vote_average: number;
    poster_path: string;
    backdrop_path: string;
    original_language: string;
    adult: boolean;
}>, res: Response): Promise<any> => {
    try {
        //validate input
        const { original_title,
            overview,
            release_date,
            vote_average,
            poster_path,
            backdrop_path,
            original_language,
            adult
        } = req.body;

        if (!original_title) {
            return httpResponse(400, "Bad Request", {}, res)
        }

        //create new movie
        const newMovie = new Movie({
            original_title,
            overview,
            release_date,
            vote_average,
            poster_path,
            backdrop_path,
            original_language,
            adult
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

        movie.original_title = originalTitle || movie.original_title;
        movie.overview = overview || movie.overview;
        movie.release_date = relaseDate || movie.release_date;
        movie.vote_average = voteAverage || movie.vote_average;

        await movie.save();

        return httpResponse(200, "Movie updated", { _id: movie._id }, res)
    }
    catch (error: any) {
        console.error(error);
        return httpResponse(500, "Internal Server Error", {}, res)
    }
});

// delete movie
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<any> => {
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