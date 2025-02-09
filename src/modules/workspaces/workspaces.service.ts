import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './entities/workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
  ) {}

  async create(
    userId: number,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    const slug = slugify(createWorkspaceDto.slug, { lower: true });
    const slugExists = await this.workspacesRepository.findOne({
      where: { slug },
    });

    if (slugExists) {
      throw new ConflictException('Slug already exists');
    }

    const workspace = this.workspacesRepository.create({
      ...createWorkspaceDto,
      user: { id: userId },
    });

    return this.workspacesRepository.save(workspace);
  }

  async findAll(userId: number): Promise<Workspace[]> {
    return this.workspacesRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Workspace> {
    const workspace = await this.workspacesRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  async update(
    id: number,
    userId: number,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    const workspace = await this.findOne(id, userId);
    Object.assign(workspace, updateWorkspaceDto);
    return this.workspacesRepository.save(workspace);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const workspace = await this.findOne(id, userId);
    await this.workspacesRepository.remove(workspace);

    return {
      message: 'Workspace Deleted',
    };
  }

  async checkSlugAvailability(
    slug: string,
  ): Promise<{ available: boolean; suggestion?: string }> {
    const generatedSlug = slugify(slug, { lower: true });
    const existingSlug = await this.workspacesRepository.findOne({
      where: { slug: generatedSlug },
    });

    if (!existingSlug) {
      return { available: true };
    }

    let suggestion = generatedSlug;
    let counter = 1;
    while (
      await this.workspacesRepository.findOne({ where: { slug: suggestion } })
    ) {
      suggestion = `${generatedSlug}${counter}`;
      counter++;
    }

    return { available: false, suggestion };
  }
}
