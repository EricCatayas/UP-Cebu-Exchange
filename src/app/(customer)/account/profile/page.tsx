import AddressProfileForm from '@/components/form/Profile/AddressProfile';
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
        <div className="max-w-2xl bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <EditProfileForm user={userData} />
          </div>
        </div>
      </div>
      <div className="px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout Address</h1>
        <div className="max-w-2xl bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4"></div>
          <AddressProfileForm address={userAddress} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
