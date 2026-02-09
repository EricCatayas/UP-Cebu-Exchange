import { Session } from '@/models/sequelize';
import { opTimeframe } from '@/lib/orm';

class SessionService {
  private timeframe?: string;

  constructor(timeframe?: string) {
    this.timeframe = timeframe;
  }

  async getUserSessionIds(userId: number) {
    const sessions = await Session.findAll({
      where: {
        userId,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      attributes: ['id'],
      raw: true,
    });
    return sessions.map((session) => session.id);
  }
}

export default SessionService;
