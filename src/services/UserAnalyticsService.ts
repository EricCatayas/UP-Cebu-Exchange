import UserService from './UserService';
import sequelize from '@/config/database';
import { Op } from 'sequelize';
import { User, Role, Session } from '@/models/sequelize';
import { UserDTO } from '@/models/User';
import { USER_STATUS } from '@/lib/constants';
import { opTimeframe } from '@/lib/orm';
import { recentTimeframe, getMostRecentTimeframe } from '@/lib/labels';

interface AnalyticsData {
  guests: {
    total: number;
  };
  customers: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    returning: number;
    new: number;
  };
}

class UserAnalyticsService {
  private timeframe?: string;
  private customerRoleId?: number;

  constructor(timeframe?: string, customerRoleId?: number) {
    this.timeframe = timeframe;
    this.customerRoleId = customerRoleId;
  }

  // Ensure customerRoleId is initialized before any method that needs it is called
  private async initializeCustomerRoleId() {
    if (!this.customerRoleId) {
      const userService = new UserService();
      const customerRoleId = await userService.getCustomerRoleId();
      this.customerRoleId = customerRoleId ?? undefined;
    }
  }

  getVisitorMetrics = async (
    year: number,
    month: number,
    unique: boolean = false
  ): Promise<{
    count: {
      total: number;
      registered: number;
      guests: number;
      customers: number;
      newCustomers: number;
      returningCustomers: number;
      admins: number;
    };
    monthly: {
      labels: string[];
      data: number[];
    };
    daily: {
      labels: string[];
      data: number[];
    };
  }> => {
    await this.initializeCustomerRoleId();

    const guests = await this.getGuestVisitorCount();
    const customers = await this.getCustomerVisitorCount(unique);

    const returningCustomers = await this.getReturningCustomersCount();
    const newCustomers = await this.getNewCustomersCount();

    const admins = await this.getAdminVisitorCount(unique);

    const registered = customers + admins;

    const total = guests + registered;

    // Get visitors per month for selected year and month
    const monthlySessionData = await this.getMonthlySessions(year);

    const monthlyLabels = [];
    const monthlyData = [];

    for (let m = 1; m <= 12; m++) {
      const monthData = monthlySessionData.find((data) => parseInt(data.month) === m);
      const date = new Date(year, m - 1, 1);
      monthlyLabels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      monthlyData.push(monthData ? monthData.count : 0);
    }

    // Get visitors per day for selected month
    const dailySessionData = await this.getDailySessions(year, month);

    const dailyLabels = (dailySessionData as any[]).map((row) => {
      return row.day;
    });
    const dailyData = (dailySessionData as any[]).map((row) => parseInt(row.count));

    return {
      count: { total, registered, guests, customers, admins, newCustomers, returningCustomers },
      monthly: { labels: monthlyLabels, data: monthlyData },
      daily: { labels: dailyLabels, data: dailyData },
    };
  };

  private async getGuestVisitorCount() {
    return await Session.count({
      where: {
        userId: {
          [Op.is]: null,
        },
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
  }

  private async getCustomerVisitorCount(unique: boolean) {
    const customerSessions = await Session.findAll({
      where: {
        userId: {
          [Op.not]: null,
        },
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          where: {
            roleId: this.customerRoleId,
          },
        },
      ],
    });

    return unique ? new Set(customerSessions.map((session) => session.userId)).size : customerSessions.length;
  }

  private async getAdminVisitorCount(unique: boolean) {
    const adminSessions = await Session.findAll({
      where: {
        userId: {
          [Op.not]: null,
        },
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          where: {
            roleId: { [Op.ne]: this.customerRoleId },
          },
        },
      ],
    });

    return unique ? new Set(adminSessions.map((session) => session.userId)).size : adminSessions.length;
  }

  private async getMonthlySessions(year: number) {
    const monthlySessions = await Session.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['roleId'],
          required: false,
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lt]: new Date(year + 1, 0, 1),
        },
        [Op.or]: [
          { userId: { [Op.is]: null } },
          sequelize.where(sequelize.col('user.roleId'), Op.eq, this.customerRoleId),
        ],
      },
      raw: true,
    });
    // Group by month in JavaScript
    const monthlyMap = new Map<string, number>();
    monthlySessions.forEach((session: any) => {
      const monthNumber = new Date(session.createdAt).getMonth() + 1;
      monthlyMap.set(monthNumber.toString(), (monthlyMap.get(monthNumber.toString()) || 0) + 1);
    });

    const monthlySessionData = Array.from(monthlyMap).map(([month, count]) => ({
      month,
      count,
    }));

    return monthlySessionData;
  }

  private async getDailySessions(year: number, month: number) {
    const dailySessions = await Session.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['roleId'],
          required: false,
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(year, month - 1, 1),
          [Op.lt]: new Date(year, month, 1),
        },
        [Op.or]: [
          { userId: { [Op.is]: null } },
          sequelize.where(sequelize.col('user.roleId'), Op.eq, this.customerRoleId),
        ],
      },
      raw: true,
    });
    // fix: start from 1 to end of month
    const daysInMonth = new Date(year, month, 0).getDate();
    // Group by day in JavaScript
    const dailyMap = new Map<string, number>();
    for (let day = 1; day <= daysInMonth; day++) {
      const daySessions = dailySessions.filter((session: any) => {
        return new Date(session.createdAt).getDate() === day;
      });
      dailyMap.set(day.toString(), daySessions.length);
    }

    const dailySessionData = Array.from(dailyMap).map(([day, count]) => ({
      day,
      count,
    }));

    return dailySessionData;
  }

  async getAnalyticsData(): Promise<AnalyticsData> {
    await this.initializeCustomerRoleId();

    const totalCustomers = await User.count({
      where: { roleId: this.customerRoleId, ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }) },
    });
    const activeCustomers = await User.count({
      where: {
        roleId: this.customerRoleId,
        status: USER_STATUS.ACTIVE,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    const inactiveCustomers = await User.count({
      where: {
        roleId: this.customerRoleId,
        status: USER_STATUS.INACTIVE,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });
    const pendingCustomers = await User.count({
      where: {
        roleId: this.customerRoleId,
        status: USER_STATUS.PENDING,
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
    });

    const newCustomers = await this.getNewCustomersCount();

    const returningCustomers = await this.getReturningCustomersCount();

    const guests = await this.getGuestVisitorCount();

    return {
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        inactive: inactiveCustomers,
        pending: pendingCustomers,
        returning: returningCustomers,
        new: newCustomers,
      },
      guests: {
        total: guests,
      },
    };
  }

  async getNewCustomersCount(): Promise<number> {
    await this.initializeCustomerRoleId();
    const mostRecentTimeframe = getMostRecentTimeframe(this.timeframe, recentTimeframe.value).value;
    return await User.count({
      where: {
        roleId: this.customerRoleId,
        status: USER_STATUS.ACTIVE,
        ...(this.timeframe && { createdAt: opTimeframe(mostRecentTimeframe) }),
      },
    });
  }

  async getReturningCustomersCount(): Promise<number> {
    await this.initializeCustomerRoleId();
    const customerSessions = await Session.findAll({
      where: {
        userId: {
          [Op.not]: null,
        },
        ...(this.timeframe && { createdAt: opTimeframe(this.timeframe) }),
      },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          where: {
            roleId: this.customerRoleId,
          },
        },
      ],
    });

    const userVisitCounts: { [userId: number]: number } = {};
    customerSessions.forEach((session) => {
      const userId = session.userId as number;
      userVisitCounts[userId] = (userVisitCounts[userId] || 0) + 1;
    });

    const returningCustomers = Object.values(userVisitCounts).filter((count) => count > 1).length;

    return returningCustomers;
  }
}

export default UserAnalyticsService;
