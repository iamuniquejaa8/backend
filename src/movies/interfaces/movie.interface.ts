import { Document } from 'mongoose';

export interface Movie extends Document {
  title: string;
  description: string;
  image: string;
  imdbId: string;
}