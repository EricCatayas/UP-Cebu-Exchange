import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Artwork, Artist } from '@/models/sequelize';
import { getCurrentUser, isAdmin } from '@/lib/auth';

// TODO: Test API
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin authorization
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!isAdmin(currentUser)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // TODO: handle image uploads

    // Parse request body
    const { title, artistId, description, medium, heightCm, widthCm, status } = await request.json();
    
    // Validate required fields
    if (!medium || !heightCm || !widthCm) {
      return NextResponse.json(
        { error: 'Medium, height, and width are required' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (isNaN(Number(heightCm)) || isNaN(Number(widthCm))) {
      return NextResponse.json(
        { error: 'Height and width must be valid numbers' },
        { status: 400 }
      );
    }

    if (Number(heightCm) <= 0 || Number(widthCm) <= 0) {
      return NextResponse.json(
        { error: 'Height and width must be positive numbers' },
        { status: 400 }
      );
    }

    // Validate artistId if provided
    if (artistId !== undefined && artistId !== null) {
      if (isNaN(Number(artistId))) {
        return NextResponse.json(
          { error: 'Artist ID must be a valid number' },
          { status: 400 }
        );
      }

      // Check if artist exists
      const artist = await Artist.findByPk(artistId);
      if (!artist) {
        return NextResponse.json(
          { error: 'Artist not found' },
          { status: 404 }
        );
      }
    }

    // Create artwork
    const newArtwork = await Artwork.create({
      title: title.trim(),
      artistId: artistId || null,
      description: description.trim(),
      medium: medium.trim(),
      heightCm: Number(heightCm),
      widthCm: Number(widthCm),
      status: status || 'available',
    });

    // Fetch the created artwork with artist information
    const createdArtwork = await Artwork.findByPk(newArtwork.id, {
      include: [{
        model: Artist,
        as: 'artist',
        attributes: ['id', 'name', 'bio'],
      }],
    });

    return NextResponse.json({
      message: 'Artwork created successfully',
      artwork: {
        id: createdArtwork!.id,
        title: createdArtwork!.title,
        artistId: createdArtwork!.artistId,
        artist: (createdArtwork as any).artist || null,
        description: createdArtwork!.description,
        medium: createdArtwork!.medium,
        heightCm: createdArtwork!.heightCm,
        widthCm: createdArtwork!.widthCm,
        status: createdArtwork!.status,
        createdAt: createdArtwork!.createdAt,
        updatedAt: createdArtwork!.updatedAt,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Artwork creation error:', error);
    
    // Handle Sequelize validation errors
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      return NextResponse.json(
        { error: 'Validation error: ' + error.message },
        { status: 400 }
      );
    }
    
    // Handle Sequelize foreign key constraint errors
    if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
      return NextResponse.json(
        { error: 'Invalid artist reference' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// TODO: Test API
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const artistId = searchParams.get('artistId');
    const search = searchParams.get('search');

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause: any = {};

    if (status !== null && status !== undefined) {
      whereClause.status = status === 'true' ? 'available' : 'unavailable';
    }
    
    if (artistId) {
      whereClause.artistId = parseInt(artistId);
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { medium: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch artworks with pagination
    const { count, rows: artworks } = await Artwork.findAndCountAll({
      where: whereClause,
      include: [{
        model: Artist,
        as: 'artist',
        attributes: ['id', 'name', 'bio'],
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      artworks: artworks.map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        artistId: artwork.artistId,
        artist: (artwork as any).artist || null,
        description: artwork.description,
        medium: artwork.medium,
        heightCm: artwork.heightCm,
        widthCm: artwork.widthCm,
        status: artwork.status,
        createdAt: artwork.createdAt,
        updatedAt: artwork.updatedAt,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      }
    });

  } catch (error) {
    console.error('Artworks fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// TODO: Test API
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and admin authorization
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    if (!isAdmin(currentUser)) {
        return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    // Parse request body
    const { artworkId } = await request.json();
    if (!artworkId || isNaN(Number(artworkId))) {
      return NextResponse.json(
        { error: 'Valid artworkId is required' },
        { status: 400 }
      );
    }
    // Find the artwork
    const artwork = await Artwork.findByPk(artworkId);
    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // TODO: handle deletion of associated images

    // Delete the artwork
    await artwork.destroy();
    return NextResponse.json( 
      { message: 'Artwork deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Artwork deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}