import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './interfaces/movie.interface';
import { map } from 'rxjs/operators';

@Injectable()
export class MoviesService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectModel('Movie') private movieModel: Model<Movie>
  ) {}

  async getMovies() {
    const cachedMovies = await this.movieModel.find().exec();
    if (cachedMovies.length > 0) {
      return cachedMovies;
    }

    return this.httpService
      .get(`${this.configService.get<string>('IMDB_API_URL')}`, {
        headers: {
          'x-rapidapi-key': this.configService.get<string>('RAPIDAPI_KEY'),
          'x-rapidapi-host': this.configService.get<string>('RAPIDAPI_HOST'),
        },
      })
      .pipe(
        map(response => response.data),
        map(async (movies) => {
          const savedMovies = await Promise.all(
            movies.map(movie => new this.movieModel(movie).save())
          );
          return savedMovies;
        })
      );
  }

  async getMovieById(id: string): Promise<Movie> {
    return this.movieModel.findById(id).exec();
  }
}