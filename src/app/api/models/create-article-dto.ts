/* tslint:disable */
/* eslint-disable */
import { Category } from './category';
import { User } from './user';
export interface CreateArticleDto {
  author?: User;
  category?: Category;
  content?: string;
  creation_date?: number;
  image?: string;
  title?: string;
}
