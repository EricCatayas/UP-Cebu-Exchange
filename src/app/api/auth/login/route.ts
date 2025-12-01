import { NextRequest, NextResponse } from 'next/server';
import { User, Role } from '@/models/sequelize';
import { isAdmin, verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { ERROR_MESSAGE } from '@/lib/constants';

// TODO: Test API
export async function POST(request: NextRequest) {
  try {
    const { email, password, remember } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user with role
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if user is active
    if (user.status !== 'Active') {
      return NextResponse.json({ error: ERROR_MESSAGE.EMAIL_VERIFICATION_REQUIRED }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const roleName = (user as any).role.name;

    // Generate JWT token
    const token = generateToken(
      {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        roleName: roleName,
      },
      remember
    );

    // Set auth cookie
    await setAuthCookie(token, remember);

    let callbackUrl = '/';

    if (isAdmin(user)) {
      callbackUrl = '/dashboard';
    } else {
      // Check for callbackUrl in referer header
      const referer = request.headers.get('referer');
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          const refererCallback = refererUrl.searchParams.get('callbackUrl');
          if (refererCallback) {
            callbackUrl = refererCallback;
          }
        } catch (e) {
          // Invalid referer URL, ignore
        }
      }
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roleName: roleName,
      },
      callbackUrl,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
