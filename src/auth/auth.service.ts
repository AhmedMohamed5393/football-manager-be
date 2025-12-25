import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { comparePasswords, hashPassword } from "@shared/util";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { RegisterDto, LoginDto } from "./dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    public async register(registerDto: RegisterDto) {
        const { email, password } = registerDto;

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) throw new ConflictException('Email already exists');

        const hashedPassword = await hashPassword(password);

        const user = await this.userService.createUser(email, hashedPassword);
        const token = this.generateToken(user);

        return this.prepareUserResponse(user, token);
    }

    public async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

        const token = this.generateToken(user);

        return this.prepareUserResponse(user, token);
    }

    private generateToken(user: User) {
        const payload = { sub: user.id, email: user.email };

        return this.jwtService.sign(payload);
    }

    private prepareUserResponse(user: User, token: string) {
        const { password, ...userData } = user;
        return { ...userData, token };
    }
}
