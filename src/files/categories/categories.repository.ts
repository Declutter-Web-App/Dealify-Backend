import pagination, { IPagination } from "../../constants"
import { ICategories } from "./categories.interface"
import Category from "./categories.model"

const { LIMIT, SKIP, SORT } = pagination

export default class CategoryRepository {
  static async create(categoryPayload: ICategories): Promise<ICategories> {
    return Category.create(categoryPayload)
  }

  static async validateCategory(
    query: Partial<ICategories> | { $or: Partial<ICategories>[] }
  ) {
    return Category.exists(query)
  }

  static async findCategoryWithParams(
    categoryPayload: Partial<ICategories & IPagination>,
    select: Partial<Record<keyof ICategories, number | boolean | object>> = { isDeleted: 0 }
  ) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = categoryPayload

    return await Category.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
  }

  static async findSingleCategoryByParams(
    referralPayload: Partial<ICategories>
  ): Promise<ICategories | null> {
    const referral: Awaited<ICategories | null> = await Category.findOne({
      ...referralPayload,
    })
    return referral
  }
}
