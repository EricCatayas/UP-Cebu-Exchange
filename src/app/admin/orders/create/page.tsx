import ArtworkService from '@/services/ArtworkService';
import UserService from '@/services/UserService';
import CreateOrderForm from '@/components/form/Order/CreateOrder';

async function CreateOrder() {
  const artworkService = new ArtworkService();
  const artworks = await artworkService.getAvailableArtworks();
  const userService = new UserService();
  const customers = await userService.getCustomers();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Rental Order</h1>

      <CreateOrderForm artworks={artworks} customers={customers} />
    </div>
  );
}

export default CreateOrder;
