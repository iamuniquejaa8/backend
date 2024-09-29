import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  getMovies() {
    console.log('getMovies called');
    return this.moviesService.getMovies();
  }

//   @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }
}