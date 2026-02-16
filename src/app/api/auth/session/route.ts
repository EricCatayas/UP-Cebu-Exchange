import { NextRequest, NextResponse } from 'next/server';
import { UserCookiePreference } from '@/models/sequelize';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    //#region For now, we will not include it in the response since it's not needed on the client side at this moment.
    // const cookiePreference = await UserCookiePreference.findOne({
    //   where: { userId: user.userId },
    //   attributes: ['preference'],
    //   raw: true,
    // });
    //#endregion

    return NextResponse.json({
      user: {
        id: user.userId,
        email: user.email,
        roleId: user.roleId,
        roleName: user.roleName,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
