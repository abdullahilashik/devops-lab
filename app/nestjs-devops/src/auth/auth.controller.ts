import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    // local sign in
    @Post('/local/signin')
    signInLocal(){
        this.authService.signInLocal();
    }
    // local sing up
    @Post('/local/signup')
    signUpLocal(){
        this.authService.signUpLocal();
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
