/* tslint:disable */
/* eslint-disable */
import { Category } from './category';
import { Image } from './image';
import { User } from './user';
export interface CreateArticleDto {
  author?: User;
  category?: Category;
  content?: string;
  creation_date?: number;
  image?: Image;
  title?: string;
}
