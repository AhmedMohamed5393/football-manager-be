import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUserRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user if exists', async () => {
      const user: User = {
        id: '3d99f919-d454-4fff-88ff-eed52b66c0b1',
        email: 'test@test.com',
        password: 'hashed',
      } as User;
      userRepository.findOne.mockResolvedValue(user);

      const result = await userService.findByEmail('test@test.com');

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: "test@test.com" } });
      expect(result).toEqual(user);
    });

    it('should return null if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await userService.findByEmail('notfound@test.com');

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: "notfound@test.com" } });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const email = 'test@test.com';
      const password = 'hashedPassword';
      const createdUser: User = {
        id: '3d99f919-d454-4fff-88ff-eed52b66c0b1',
        email,
        password,
      } as User;
      userRepository.create.mockResolvedValue({ email, password } as User as never);
      userRepository.save.mockResolvedValue(createdUser);

      const result = await userService.createUser(email, password);

      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual(createdUser);
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user: User = {
        id: '3d99f919-d454-4fff-88ff-eed52b66c0b1',
        email: 'test@test.com',
        password: 'hashed',
      } as User;
      userRepository.findOne.mockResolvedValue(user);

      const result = await userService.findById('3d99f919-d454-4fff-88ff-eed52b66c0b1');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '3d99f919-d454-4fff-88ff-eed52b66c0b1' },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await userService.findById('999');

      expect(result).toBeNull();
    });
  });
});
