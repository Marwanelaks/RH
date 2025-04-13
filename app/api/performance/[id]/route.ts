import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const performance = await prisma.performance.update({
      where: { id: params.id },
      data: {
        rating: parseInt(data.rating),
        feedback: data.feedback,
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error updating performance review:', error);
    return NextResponse.json(
      { error: 'Failed to update performance review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.performance.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Performance review deleted successfully' });
  } catch (error) {
    console.error('Error deleting performance review:', error);
    return NextResponse.json(
      { error: 'Failed to delete performance review' },
      { status: 500 }
    );
  }
}