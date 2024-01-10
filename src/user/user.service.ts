import { Injectable } from '@nestjs/common';
import { Cart } from 'src/schema/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schema/product.schema';
import { Order } from 'src/schema/order.schema';
import { ProductReview } from 'src/schema/review.schema';
import { ObjectId } from 'bson';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(ProductReview.name)
    private productReviewModel: Model<ProductReview>,
  ) {}

  async addProductInCart(querydata, user_id) {
    try {
      let getProduct = await this.productModel.findOne({
        _id: querydata.product_id,
        deleted_at: null,
      });
      if (
        !querydata.product_id ||
        !ObjectId.isValid(querydata.product_id || !getProduct)
      ) {
        throw new Error('Something went wrong!! Please try again');
      }
      let checkCart = await this.cartModel.findOne({
        user_id: new ObjectId(user_id),
        product_id: new ObjectId(querydata.product_id),
      });
      if (checkCart) {
        throw new Error('Product already available in cart!!');
      }
      let cartObj = new Cart();
      cartObj.user_id = new ObjectId(user_id);
      cartObj.product_id = new ObjectId(querydata.product_id);
      await this.cartModel.create(cartObj);
      return 'Product added successfully in cart!!';
    } catch (error) {
      throw new Error(error);
    }
  }

  async placeOrder(querydata, user_id) {
    try {
      let getProduct = await this.productModel.findOne({
        _id: querydata.product_id,
        deleted_at: null,
      });
      if (
        !querydata.product_id ||
        !ObjectId.isValid(querydata.product_id || !getProduct)
      ) {
        throw new Error('Something went wrong!! Please try again');
      }
      let checkCart = await this.cartModel.findOne({
        user_id: new ObjectId(user_id),
        product_id: new ObjectId(querydata.product_id),
      });
      if (!checkCart) {
        throw new Error('Please add this product in cart first!!');
      }
      let orderObj = new Order();
      orderObj.product = new ObjectId(querydata.product_id);
      orderObj.user_id = new ObjectId(user_id);
      orderObj.total_price = getProduct.price;
      await this.orderModel.create(orderObj);
      await this.cartModel.deleteOne({
        user_id: new ObjectId(user_id),
        product_id: new ObjectId(querydata.product_id),
      });
      return 'Order Placed successfully';
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOrderHistory(user_id) {
    try {
      let query = [];
      query.push(
        {
          $match: {
            user_id: new ObjectId(user_id),
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'product_list',
            pipeline: [
              {
                $project: {
                  category: 1,
                  name: 1,
                  price: 1,
                  description: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$product_list',
        },
        { $sort: { create_at: -1 } },
      );
      return await this.orderModel.aggregate(query);
    } catch (error) {
      throw new Error(error);
    }
  }

  async giveReviewProduct(user_id, payload) {
    try {
      let getOrder = await this.orderModel.findOne({
        product: new ObjectId(payload.product),
        user_id: new ObjectId(user_id._id),
      });

      if (!getOrder) {
        throw new Error(
          'You can not rate this product, As you have not purchased it!!',
        );
      }

      let getReview = await this.productReviewModel.findOne({
        user_id: new ObjectId(user_id._id),
        product: new ObjectId(payload.product),
      });
      if (getReview) {
        throw new Error('You can not add multiple review to same product');
      }
      let reviewObj = new ProductReview();
      reviewObj.product = new ObjectId(payload.product);
      reviewObj.rating = payload.rating;
      reviewObj.review = payload.review;
      reviewObj.user_id = new ObjectId(user_id._id);
      let saveReview = await this.productReviewModel.create(reviewObj);
      await this.productModel.updateOne(
        { _id: new ObjectId(payload.product) },
        { $push: { reviews: new ObjectId(saveReview._id) } },
      );
      return 'Review added successfully!!';
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProducts(user_id) {
    try {
      let query = [];
      query.push(
        {
          $sort: {
            create_at: -1,
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
      return await this.productModel.aggregate(query);
    } catch (error) {
      throw new Error(error);
    }
  }
}
