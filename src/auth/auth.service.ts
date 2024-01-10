import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly commonService: CommonService,
  ) {}

  async registerUser(payload) {
    try {
      const getUser = await this.userModel.findOne({ email: payload.email });
      if (getUser) {
        throw new Error('Email Already registed!!');
      }
      let full_name: any = new Object();
      full_name.firstName = payload.first_name;
      full_name.lastName = payload.last_name;
      let hashPassword = await this.commonService.hashingPassword(
        payload.password,
      );
      const userObj = new User();
      userObj.full_name = full_name;
      userObj.email = payload.email;
      userObj.password = hashPassword;
      userObj.role = payload.role;

      return this.userModel.create(userObj);
    } catch (error) {
      throw new Error(error);
    }
  }

  async loginUser(payload) {
    try {
      const getUser = await this.userModel.findOne({ email: payload.email });
      if (!getUser) {
        throw new Error(
          'Can not find email!! Please login with registered email',
        );
      }
      let authorizePassword = await this.commonService.doesPasswordMatch(
        payload.password,
        getUser.password,
      );

      if (authorizePassword) {
        return getUser;
      } else {
        throw new Error('Unauthorised access!!');
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
