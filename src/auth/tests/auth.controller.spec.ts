import { Test, TestingModule } from '@nestjs/testing';
import { SuccessClass } from '@shared/classes';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RegisterDto, LoginDto } from '../dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = () => ({
    register: jest.fn(),
    login: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call authService.register and return SuccessClass', async () => {
      const dto: RegisterDto = {
        email: 'test@test.com',
        password: '123456',
      };

      const serviceResult = {
        id: '3d99f919-d454-4fff-88ff-eed52b66c0b1',
        email: dto.email,
        token: 'jwt-token',
      };

      authService.register.mockResolvedValue(serviceResult as any);

      const result = await authController.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toBeInstanceOf(SuccessClass);
      expect(result).toEqual(
        new SuccessClass(serviceResult, 'User registered successfully'),
      );
    });
  });

  describe('login', () => {
    it('should call authService.login and return SuccessClass', async () => {
      const dto: LoginDto = {
        email: 'test@test.com',
        password: '123456',
      };

      const serviceResult = {
        id: '3d99f919-d454-4fff-88ff-eed52b66c0b1',
        email: dto.email,
        token: 'jwt-token',
      };

      authService.login.mockResolvedValue(serviceResult as any);

      const result = await authController.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toBeInstanceOf(SuccessClass);
      expect(result).toEqual(
        new SuccessClass(serviceResult, 'User logged in successfully'),
      );
    });
  });
});
