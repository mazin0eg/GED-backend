import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { use } from 'passport';
import { User } from 'src/users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { registerDto } from './dto/registerDto';

@Injectable()
export class AuthService {
        constructor(@InjectModel(User.name) private userModel: Model<User>,
                    private jwtservice: JwtService,
        ) { }

    async register(dto:registerDto){
        const hashedPassword =  await bcrypt.hash(dto.password, 10)
        const user = await this.userModel.create({
            ...dto,
            password : hashedPassword
        })

        return{
            token: this.jwtservice.sign({sub: user._id})
        }

    }

    async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

    async login(user:any){
        const payload = {sub: user.id,email:user.email};
        return{
            message: "u logged in",
            accec_token : this.jwtservice.sign(payload)
        }
    }
}
