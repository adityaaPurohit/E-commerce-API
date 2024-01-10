import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schema/product.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(payload, querydata) {
    try {
      let getProduct = await this.productModel.findOne({ name: payload.name });
      if (getProduct) {
        throw new Error('Can not create product with the same name!');
      }
      const productObj = new Product();
      if (querydata.product_id) {
        productObj.category = payload.category;
        productObj.name = payload.name;
        productObj.description = payload.description;
        productObj.price = payload.price;

        await this.productModel.updateOne(
          { _id: querydata.product_id },
          productObj,
        );

        return await this.productModel.findOne({ _id: querydata.product_id });
      }
      if (!payload.category) throw new Error('Field category is required!');
      if (!payload.name) throw new Error('Field category is required!');
      if (!payload.description) throw new Error('Field category is required!');
      if (!payload.price) throw new Error('Field category is required!');

      productObj.category = payload.category;
      productObj.name = payload.name;
      productObj.description = payload.description;
      productObj.price = payload.price;

      return this.productModel.create(productObj);
    } catch (error) {
      throw new Error(error);
    }
  }

  async productList(queryData) {
    try {
      let query = [];
      let skip = 0;

      // Get product by id
      if (queryData.product_id) {
        query.push({
          $match: {
            _id: new ObjectId(queryData.product_id),
          },
        });
      } else {
        // Serching data
        if (queryData.filter) {
          query.push({
            $match: {
              $or: [
                {
                  name: { $regex: queryData.filter, $options: 'i' },
                },
                {
                  category: { $regex: queryData.filter, $options: 'i' },
                },
                {
                  price: +queryData.filter,
                },
              ],
            },
          });
        }

        // Sorting data
        query.push(
          {
            $sort: {
              created_at: -1,
            },
          },
          {
            $match: {
              deleted_at: null,
            },
          },
          {
            $lookup: {
              from: 'productreviews',
              localField: 'reviews',
              foreignField: '_id',
              as: 'review_list',
              pipeline: [
                {
                  $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_details',
                    pipeline: [
                      {
                        $project: {
                          _id: 0,
                          full_name: 1,
                          email: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: '$user_details',
                },
              ],
            },
          },
          {
            $addFields: {
              avgRating: {
                $cond: {
                  if: { $gt: [{ $size: '$review_list' }, 0] },
                  then: { $avg: '$review_list.rating' },
                  else: null,
                },
              },
            },
          },
        );

        // Pagination
        if (queryData.limit) {
          query.push({
            $facet: {
              metadata: [
                { $count: 'total' },
                {
                  $addFields: {
                    page: {
                      $ceil: {
                        $divide: [
                          '$total',
                          queryData.limit
                            ? parseInt(queryData.limit)
                            : '$total',
                        ],
                      },
                    },
                  },
                },
              ],
              data: [
                { $skip: queryData.skip ? parseInt(queryData.skip) : skip },
                { $limit: parseInt(queryData.limit) },
              ],
            },
          });
        } else {
          query.push({
            $facet: {
              metadata: [
                { $count: 'total' },
                {
                  $addFields: {
                    page: {
                      $ceil: {
                        $divide: [
                          '$total',
                          queryData.limit
                            ? parseInt(queryData.limit)
                            : '$total',
                        ],
                      },
                    },
                  },
                },
              ],
              data: [
                { $skip: queryData.skip ? parseInt(queryData.skip) : skip },
              ],
            },
          });
        }
      }
      return await this.productModel.aggregate(query);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProduct(querydata) {
    try {
      if (!querydata.product_id || !ObjectId.isValid(querydata.product_id)) {
        throw new Error('Something went wrong!! Please try again');
      }
      await this.productModel.updateOne(
        { _id: querydata.product_id },
        { deleted_at: Date.now() },
      );
      return 'Product deleted successfully!!';
    } catch (error) {
      throw new Error(error);
    }
  }
}
