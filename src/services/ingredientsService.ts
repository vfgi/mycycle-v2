import { apiService } from "./api";

export interface IngredientTemplate {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  is_active: boolean;
}

export interface IngredientsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IngredientsResponse {
  data: IngredientTemplate[];
  pagination: IngredientsPagination;
}

class IngredientsService {
  async searchIngredients(
    search: string,
    page: number = 1,
    limit: number = 50,
    tableBase: string = "insa_tca"
  ): Promise<IngredientsResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        table_base: tableBase,
        ...(search && { search }),
      });

      const response = await apiService.get<IngredientsResponse>(
        `/ingredients-template?${queryParams.toString()}`
      );

      if (response.error) {
        console.error("Error searching ingredients:", response.error);
        return {
          data: [],
          pagination: {
            page: 1,
            limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      return response.data || {
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      console.error("Error in searchIngredients:", error);
      return {
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }
}

export const ingredientsService = new IngredientsService();

