import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto} from './dto/registerDto';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService ){}


    @Post('register')
    register(@Body() registerDto : registerDto){
        return this.authService.register(registerDto)
    }

    @Post('login')
    login(@Body() loginDto : any){
       return this.authService.login(LoginDto)
    }

}
