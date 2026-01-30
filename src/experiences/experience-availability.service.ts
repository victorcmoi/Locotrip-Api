import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExperienceAvailabilityDto } from './dto/create-experience-availability.dto';
import { experience_availabilityUncheckedUpdateInput } from '../generated/prisma/models/experience_availability';

@Injectable()
export class ExperienceAvailabilityService {
    constructor(private prisma: PrismaService) { }

    async create(createAvailabilityDto: CreateExperienceAvailabilityDto) {
        return this.prisma.experience_availability.create({
            data: {
                start_date: createAvailabilityDto.start_date,
                end_date: createAvailabilityDto.end_date,
                status: createAvailabilityDto.status,
                experience: {
                    connect: { id: createAvailabilityDto.experience_id },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.experience_availability.findMany({
            include: {
                experience: true,
            },
        });
    }

    async findOne(id: string) {
        const availability = await this.prisma.experience_availability.findUnique({
            where: { id },
            include: {
                experience: true,
            },
        });

        if (!availability) {
            throw new NotFoundException(`Disponibilité avec l'ID ${id} introuvable`);
        }

        return availability;
    }

    async findByExperience(experienceId: string) {
        return this.prisma.experience_availability.findMany({
            where: { experience_id: experienceId },
            orderBy: { start_date: 'asc' },
        });
    }

    async update(id: string, updateData: Partial<CreateExperienceAvailabilityDto>) {
        try {
            const data: experience_availabilityUncheckedUpdateInput = { ...updateData };

            return await this.prisma.experience_availability.update({
                where: { id },
                data,
            });
        } catch {
            throw new NotFoundException(`Disponibilité avec l'ID ${id} introuvable`);
        }
    }

    async delete(id: string) {
        try {
            return await this.prisma.experience_availability.delete({
                where: { id },
            });
        } catch {
            throw new NotFoundException(`Disponibilité avec l'ID ${id} introuvable`);
        }
    }
}
