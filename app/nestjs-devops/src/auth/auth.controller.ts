import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    // local sign in
    @Post('/local/signin')
    signInLocal(@Body() dto: AuthDTO){
        this.authService.signInLocal();
    }
    // local sing up
    @Post('/local/signup')
    signUpLocal(@Body() dto: AuthDTO){
        this.authService.signUpLocal(dto);
    }
    // logout 
    @Post('/logout')
    logout() {
        this.authService.logout();
    }
    // refresh
    @Post('/refresh')
    refresh(){
        this.authService.refresh();
    }
}
