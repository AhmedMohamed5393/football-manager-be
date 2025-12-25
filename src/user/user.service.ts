import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    createUser(email: string, password: string) {
        const user = this.userRepository.create({ email, password });
        return this.userRepository.save(user);
    }

    findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }
}
