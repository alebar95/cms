/* tslint:disable */
/* eslint-disable */
import { Category } from './category';
import { User } from './user';
export interface Article {
  author?: User;
  category?: Category;
  content?: string;
  creation_date?: number;
  id?: number;
  image?: string;
  title?: string;
}
