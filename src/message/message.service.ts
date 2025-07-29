import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import * as nodemailer from 'nodemailer';
import { Property } from '../property/entities/property.entity';
import { User } from '../users/entities/user.entity';
import { Slot } from '../slots/entities/slot.entity'; 

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
  ) {}

  async sendMessage(createMessageDto: CreateMessageDto) {
    console.log('Received message request:', createMessageDto);

    const message = this.messageRepository.create(createMessageDto);
    await this.messageRepository.save(message);

    let propertyOwner: User | undefined;
    let slotOwner: User | undefined;
    let propertyTitle: string | undefined;
    let slotAddress: string | undefined;


    if (createMessageDto.propertyId) {
      const property = await this.propertyRepository.findOne({
        where: { id: createMessageDto.propertyId },
        relations: ['user'],
      });


      console.log('Property found:', property);

      if (property) {
        propertyOwner = property.user;
        propertyTitle = property.title;
      } else {
        console.error('Property not found');
      }
    }

    if (createMessageDto.slotId) {
      const slot = await this.slotRepository.findOne({
        where: { id: createMessageDto.slotId },
        relations: ['user'],
      });

      console.log('Slot found:', slot);

      if (slot) {
        slotOwner = slot.user;
        slotAddress = slot.address;
      } else {
        console.error('Slot not found');
      }
    }

    if (!propertyOwner && !slotOwner) {
      throw new Error('Property owner or Slot owner not found');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fakhar.naveed@gigalabs.co',
        pass: 'rbsi ccdi lwwf dhop',
      },
    });
    if (propertyOwner) {
      const propertyMailOptions = {
        from: createMessageDto.email,
        to: propertyOwner.email,
        subject: `New Message about your property: ${propertyTitle}`,
        text: `
          You have a new message regarding the property "${propertyTitle}" from ${createMessageDto.name}:

          Name : ${createMessageDto.name}
          Email: ${createMessageDto.email}
          Phone: ${createMessageDto.phoneNumber}

          Message:
          ${createMessageDto.message}
        `,
      };

      try {
        await transporter.sendMail(propertyMailOptions);
      } catch (error) {
        console.error('Error sending email to property owner:', error);
        throw new Error('Failed to send email notifications.');
      }
    }

    if (slotOwner) {
      const slotMailOptions = {
        from: createMessageDto.email,
        to: slotOwner.email,
        subject: `New Message about your slot in "${slotAddress}" from ${createMessageDto.name}`,
        text: `
          You have a new booking request for your slot address "${slotAddress}" from ${createMessageDto.name}:

          Name: ${createMessageDto.name}
          Email: ${createMessageDto.email}
          Phone: ${createMessageDto.phoneNumber}

          Message:
          ${createMessageDto.message}
        `,
      };

      try {
        await transporter.sendMail(slotMailOptions);
      } catch (error) {
        console.error('Error sending email to slot owner:', error);
        throw new Error('Failed to send email notifications.');
      }
    }

    return { success: true, message: 'Message sent and saved successfully!' };
  }
}
