import EditProfileForm from '@/components/form/Profile/EditProfile';
import AddressService from '@/services/AddressService';
import UserService from '@/services/UserService';
import { getCurrentUser } from '@/lib/auth';
import type { UserDTO, UserUpdateDTO } from '@/models/User';

async function Profile() {
  const currentUser = await getCurrentUser();
  const userService = new UserService();
  const userData: UserDTO | null = currentUser ? await userService.getUserById(currentUser.userId) : null;
  const userAddress = currentUser ? await AddressService.getUserAddress(currentUser.userId) : null;

  return (
    <div className="container px-8 py-6 max-w-2xl">
      <div className="px-4 pt-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <div className="max-w-2xl p-6">
          <div className="mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
                Role
              </label>
              <input
                id="email"
                name="email"
                type="email"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userData?.role.name || ''}
              />
            </div>
            <EditProfileForm user={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
