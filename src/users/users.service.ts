import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Property } from '../property/entities/property.entity'; // ✅ Import Property Entity
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Slot } from 'src/slots/entities/slot.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>, // Add slot repository
    private readonly jwtService: JwtService,
  ) {}

  /**
   * ✅ Create New User (Includes Empty Properties)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { fullName, email, phoneNumber, password, roles } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash Password Before Saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      roles,
    });

    // Save User
    const newUser = await this.userRepository.save(user);

    // ✅ Return user including properties (should be empty initially)
    return await this.findOne(newUser.id);
  }

  /**
   * ✅ Get All Users (Includes Properties)
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['properties', 'slots'],
    });
  }

  /**
   * ✅ Get a Single User by ID (Includes Properties)
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['properties', 'slots'], // Include slots in the relation
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * ✅ Update User Details (Includes Password Hashing)
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Ensure all fields are updated correctly
    user.fullName = updateUserDto?.fullName || user.fullName;
    user.age = updateUserDto?.age || user.age;
    user.address = updateUserDto?.address || user.address;
    user.qualification = updateUserDto?.qualification || user.qualification;
    user.workExperience = updateUserDto?.workExperience || user.workExperience;
    user.inspectorCategory =
      updateUserDto?.inspectorCategory || user.inspectorCategory;
    user.image = updateUserDto?.image || user.image;
    user.experienceLetter =
      updateUserDto?.experienceLetter || user.experienceLetter;
    user.status = updateUserDto?.status || user.status; // Optional field

    return this.userRepository.save(user);
  }

  /**
   * ✅ Delete User (Includes Error Handling)
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  /**
   * ✅ Update User Profile (Includes Picture Update)
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update user profile details without changing image path
    if (updateUserDto.fullName) user.fullName = updateUserDto.fullName;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.phoneNumber) user.phoneNumber = updateUserDto.phoneNumber;

    return await this.userRepository.save(user); // Save the user in the database
  }
  /**
   * ✅ Find User by Email (Includes Properties)
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['properties', 'slots'], // Include slots in the relation
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * ✅ Validate User Login Credentials (Includes Properties)
   */
  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.findByEmail(email); // ✅ Includes properties automatically

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  /**
   * ✅ Login & Generate JWT Token (Includes Properties)
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { id: user.id, roles: user.roles };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }), // Token expires in 1 hour
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      },
    };
  }
  // Add method to get user's slots
  async getUserSlots(userId: number): Promise<Slot[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['slots'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.slots;
  }
}
