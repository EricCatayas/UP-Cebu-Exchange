import { seedArtworks } from './artworks';
import { seedDefaultRoles } from './roles';
import { seedEvents } from './events';
import { seedStyles } from './styles';
import { seedUsers } from './users';

export async function seedDatabase() {
  // Seed default roles
  await seedDefaultRoles();

  // Seed styles
  await seedStyles();

  // Seed artworks
  await seedArtworks();

  if (process.env.NODE_ENV !== 'production') {
    // Seed test accounts
    await seedUsers();

    // Seed events
    await seedEvents();
  }
}
