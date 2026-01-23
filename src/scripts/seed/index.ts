import { seedDefaultRoles } from './roles';
import { seedUsers } from './users';
import { seedStyles } from './styles';
import { seedArtworks } from './artworks';

export async function seedDatabase() {
  // Seed default roles
  await seedDefaultRoles();

  // Seed test accounts
  await seedUsers();

  // Seed styles
  await seedStyles();

  // Seed artworks
  await seedArtworks();
}
