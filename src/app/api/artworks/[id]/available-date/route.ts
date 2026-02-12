import RentalOrderService from '@/services/RentalOrderService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const artworkId = parseInt((await params).id);
    const rentalOrderService = new RentalOrderService();
    const ongoingRental = await rentalOrderService.getOngoingRentalByArtworkId(artworkId);

    if (!ongoingRental) {
      return NextResponse.json({ availableDate: null }, { status: 200 });
    }

    return NextResponse.json({ availableDate: ongoingRental.endDate }, { status: 200 });
  } catch (error) {
    console.error('Error fetching artwork available date:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
