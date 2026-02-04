export interface EventAttributes {
  id: number;
  sessionId: number;
  name: string;
  category: string;
  entityType?: string | null;
  entityId?: number | null;
  metadata?: string | null; // JSON string
  createdAt: Date;
}

/* 
Example Event names:
  visit_site
  browse_artworks
  search_artworks
  view_artwork
  create_account
  verify_email
  login
  set_address
  add_to_cart
  add_to_wishlist
  begin_checkout
  sign_rental_agreement
  place_order
  complete_payment
  ...

Example Event categories:
  discovery (e.g., visit site, browsing)
  engagement (e.g., view artwork)
  interest (e.g., add to cart, add to wishlist)
  intent (e.g., begin checkout, create account, verify email, sign rental agreement, place order)
  conversion (e.g., complete payment)

Example entity_types:
  artwork
  rental_order
  payment
  user

Sample event:
{
  id: 1,
  sessionId: 42,  
  name: 'view_artwork',
  category: 'engagement',
  entityType: 'artwork',
  entityId: 101,
  createdAt: new Date('2024-01-01T12:00:00Z')
},
{
  id: 2,
  sessionId: 42,  
  name: 'add_to_cart',
  category: 'interest',
  entityType: 'artwork',
  entityId: 101,
  createdAt: new Date('2024-01-01T12:05:00Z')
}


*/
