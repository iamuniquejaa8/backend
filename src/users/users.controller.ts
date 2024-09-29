import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('favorites/:movieId')
  addFavorite(@Request() req, @Param('movieId') movieId: string) {
    console.log("here")
    return this.usersService.addFavorite(req.user.userId, movieId);
  }

  @Delete('favorites/:movieId')
  removeFavorite(@Request() req, @Param('movieId') movieId: string) {
    return this.usersService.removeFavorite(req.user.userId, movieId);
  }

  @Get('favorites')
  getFavorites(@Request() req) {
    return this.usersService.getFavorites(req.user.userId);
  }
}