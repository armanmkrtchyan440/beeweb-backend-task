import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Workspace } from './entities/workspace.entity';

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({
    status: 201,
    description: 'Workspace successfully created',
    type: Workspace,
  })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  create(
    @Request() req: ExpressRequest,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.create(req.user.id, createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces for the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'List of workspaces',
    type: [Workspace],
  })
  findAll(@Request() req: ExpressRequest) {
    return this.workspacesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single workspace by ID' })
  @ApiResponse({ status: 200, description: 'Workspace found', type: Workspace })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  findOne(@Request() req: ExpressRequest, @Param('id') id: string) {
    return this.workspacesService.findOne(+id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing workspace' })
  @ApiResponse({
    status: 200,
    description: 'Workspace updated successfully',
    type: Workspace,
  })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  update(
    @Request() req: ExpressRequest,
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(+id, req.user.id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workspace' })
  @ApiResponse({ status: 200, description: 'Workspace deleted successfully' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  remove(@Request() req: ExpressRequest, @Param('id') id: string) {
    return this.workspacesService.remove(+id, req.user.id);
  }

  @Post('check-slug')
  @ApiOperation({ summary: 'Check slug availability' })
  @ApiResponse({
    status: 200,
    description:
      'Returns whether the slug is available or suggests an alternative',
  })
  async checkSlug(@Body('slug') slug: string) {
    return this.workspacesService.checkSlugAvailability(slug);
  }
}
