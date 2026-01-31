/**
 * Category API Implementation
 * Handles HTTP requests for categories.
 */
import { apiClient } from './apiClient';
import { Category, CreateCategoryData, UpdateCategoryData } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

class CategoryApi implements ICategoryRepository {
  private readonly basePath = '/categories/';

  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(this.basePath);
    return response.data;
  }

  async getById(id: number): Promise<Category | null> {
    try {
      const response = await apiClient.get<Category>(`${this.basePath}${id}/`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const response = await apiClient.post<Category>(this.basePath, data);
    return response.data;
  }

  async update(id: number, data: UpdateCategoryData): Promise<Category> {
    const response = await apiClient.patch<Category>(`${this.basePath}${id}/`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}${id}/`);
  }
}

export const categoryApi = new CategoryApi();
