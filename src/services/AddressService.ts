import { Address, UserAddress } from '@/models/sequelize';

class AddressService {
  async getUserAddress(userId: number) {
    const userAddress = await UserAddress.findOne({
      where: { userId },
      include: [
        {
          model: Address,
          as: 'address',
        },
      ],
    });
    return userAddress?.address;
  }
}

export default new AddressService();
