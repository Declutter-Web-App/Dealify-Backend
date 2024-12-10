import { IResponse } from "../../constants";
import { queryConstructor } from "../../utils";
import { ICategories } from "./categories.interface";
import { CategoryMessages } from "./categories.messages";
import CategoryRepository from "./categories.repository";

export default class CategoryService {
  static async createCategory(categoryPayload: ICategories): Promise<IResponse> {
    const { title } = categoryPayload;

    const category = await CategoryRepository.validateCategory({
      title,
      isDeleted: false
    })

    if (category) {
      return {
        success: false,
        msg: CategoryMessages.CATEGORY_EXIST,
      }
    }

    const newCategory = await CategoryRepository.create(categoryPayload);

    if (!newCategory)
      return {
        success: false,
        msg: CategoryMessages.CREATE_FAIL,
      }

    return {
      success: true,
      msg: CategoryMessages.CREATE,
    }
  }

  static async fetchCategories(query: Partial<ICategories>): Promise<IResponse> {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Referrer"
    )

    if (error) return { success: false, msg: error }

    const categories = await CategoryRepository.findCategoryWithParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (categories.length < 1)
      return {
        success: false,
        msg: CategoryMessages.NO_CATEGORY_FOUND,
        data: [],
      }

    return {
      success: true,
      msg: CategoryMessages.FETCH,
      data: categories,
    }
  }

  static async fetchSingleCategory(params: { _id: string }): Promise<IResponse> {
    const { _id } = params;

    const categoryData =  await CategoryRepository.findSingleCategoryByParams({ _id });

    if (!categoryData)
      return {
        success: false,
        msg: CategoryMessages.FETCH_FAIL
      }
    
    return {
      success: true,
      msg: CategoryMessages.FETCH
    }
  }
}