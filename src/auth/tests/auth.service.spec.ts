import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { hashPassword, comparePasswords } from '@shared/util';
import { AuthService } from '../auth.service';
import { RegisterDto, LoginDto } from '../dto';

jest.mock('@shared/util', () => ({
  hashPassword: jest.fn(),
  comparePasswords: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUserService = () => ({
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  });

  const mockJwtService = () => ({
    sign: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useFactory: mockUserService,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      userService.findByEmail.mockResolvedValue({} as User);

      const dto: RegisterDto = {
        email: 'test@test.com',
        password: '123456',
      };

      await expect(authService.register(dto)).rejects.toThrow(ConflictException);
    });

    it('should register user successfully and return token', async () => {
      const dto: RegisterDto = {
        email: 'test@test.com',
        password: '123456',
      };

      const hashedPassword = 'hashedPassword';
      const user: User = {
        id: '3d99f919-d454-4fff-88ff-eed52b66c0b1',
        email: dto.email,
        password: hashedPassword,
      } as User;

      userService.findByEmail.mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      userService.createUser.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await authService.register(dto);

      expect(userService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(hashPassword).toHaveBeenCalledWith(dto.password);
      expect(userService.createUser).toHaveBeenCalledWith(dto.email, hashedPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        token: 'jwt-token',
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      const dto: LoginDto = {
        email: 'test@test.com',
        password: '123456',
      };

      await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user: User = {
        id: '3d99f919-d454-4fff-88ff-eed52b66c0b1',
        email: 'test@test.com',
        password: 'hashed',
      } as User;

      userService.findByEmail.mockResolvedValue(user);
      (comparePasswords as jest.Mock).mockResolvedValue(false);

      const dto: LoginDto = {
        email: 'test@test.com',
        password: 'wrong-password',
      };

      await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should login successfully and return token', async () => {
      const user: User = {
        id: '3d99f919-d454-4fff-88ff-eed52b66c0b1',
        email: 'test@test.com',
        password: 'hashed',
      } as User;

      userService.findByEmail.mockResolvedValue(user);
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      const dto: LoginDto = {
        email: 'test@test.com',
        password: '123456',
      };

      const result = await authService.login(dto);

      expect(comparePasswords).toHaveBeenCalledWith(dto.password, user.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        token: 'jwt-token',
      });
    });
  });
});
