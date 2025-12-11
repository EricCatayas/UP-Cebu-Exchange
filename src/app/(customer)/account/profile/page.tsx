import EditProfileForm from '@/components/form/Profile/EditProfile';
import UserService from '@/services/UserService';
import { USER_ROLES } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';
import type { UserDTO, UserUpdateDTO } from '@/models/User';

async function Profile() {
  const user = await getCurrentUser();
  const userService = new UserService();
  const userData: UserDTO | null = user ? await userService.getUserById(user.userId) : null;

  return (
    <div className="px-8 py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
      </div>
      <EditProfileForm user={userData} />
    </div>
  );
}

export default Profile;
