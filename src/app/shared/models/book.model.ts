import { CategoryBriefDto } from './category.model';

export interface BookBriefDto {
    id: string;
    name: string;
    bookCategories: CategoryBriefDto[];
}

export interface BookCreateDto {
    name: string;
    categoryIds: number[];
}

export interface BookUpdateDto {
    id: string;
    name: string;
    categoryIds: string[];
}