import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { Movie } from '../movies/interfaces/movie.interface'; 

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>,
              @InjectModel('Movie') private movieModel: Model<Movie>
            ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    const newUser = new this.userModel({ email, password: hashedPassword });
    return newUser.save();
  }

  async addFavorite(userId: string, movieId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: movieId } },
      { new: true }
    ).exec();
  }

  async removeFavorite(userId: string, movieId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: movieId } },
      { new: true }
    ).exec();
  }

  async getFavorites(userId: string): Promise<Movie[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    // Fetch movie details for the user's favorite movies
    const favoriteMovies = await this.movieModel.find({
      _id: { $in: user.favorites }
    }).exec();

    return favoriteMovies;
  }
}