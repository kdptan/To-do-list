/**
 * Category Repository Interface
 * Defines the contract for category data operations.
 */
import { Category, CreateCategoryData, UpdateCategoryData } from '../entities/Category';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | null>;
  create(data: CreateCategoryData): Promise<Category>;
  update(id: number, data: UpdateCategoryData): Promise<Category>;
  delete(id: number): Promise<void>;
}
