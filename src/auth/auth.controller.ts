import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { SuccessClass } from "@shared/classes";
import { ApiConflictResponse, ApiProperty, ApiUnauthorizedResponse } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiProperty({ type: RegisterDto })
    @ApiConflictResponse({ description: 'Email already exists' })
    async register(@Body() registerDto: RegisterDto) {
        const data = await this.authService.register(registerDto);

        return new SuccessClass(data, 'User registered successfully');
    }

    @Post('login')
    @ApiProperty({ type: LoginDto })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        const data = await this.authService.login(loginDto);

        return new SuccessClass(data, 'User logged in successfully');
    }
}
