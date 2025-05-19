import { User } from './user';

export interface Blog {
  _id: string;
  title: string;
  content: string;
  thumbnail: string;
  author: User;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
  updatedAt: string;
} 