import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Property } from '../property/entities/property.entity'; // ✅ Import Property Entity
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * ✅ Create New User (Includes Empty Properties)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { fullName, email, phone, password, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash Password Before Saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: role || UserRole.SELLER, // Default role is seller
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
      relations: ['properties'] // ✅ Ensure properties are always included
    });
  }

  /**
   * ✅ Get a Single User by ID (Includes Properties)
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['properties'], // ✅ Ensures properties are included
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
    const user = await this.findOne(id);

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
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
    const user = await this.findOne(id);

    if (updateUserDto.fullName) user.fullName = updateUserDto.fullName;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.phone) user.phone = updateUserDto.phone;

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    if (updateUserDto.picture) user.picture = updateUserDto.picture;

    return await this.userRepository.save(user);
  }

  /**
   * ✅ Find User by Email (Includes Properties)
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['properties'], // ✅ Ensures properties are included
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
    const payload = { id: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }), // Token expires in 1 hour
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        properties: user.properties, // ✅ Ensure properties are included in login response
      },
    };
  }
}
