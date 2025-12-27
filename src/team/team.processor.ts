import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { User } from 'src/user/entities';
import { TEAM_QUEUE, CREATE_TEAM_JOB } from './constants';
import { TeamService } from './team.service';

@Processor(TEAM_QUEUE)
export class TeamProcessor {
  constructor(private readonly teamService: TeamService) {}

  @Process(CREATE_TEAM_JOB)
  async handleCreateTeam(job: Job<{ user: User }>) {
    const { user } = job.data;

    await this.teamService.createTeamForUser(user);
  }
}
