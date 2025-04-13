import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        salary: parseFloat(data.salary),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error updating salary:', error);
    return NextResponse.json(
      { error: 'Failed to update salary' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        salary: 0,
      },
    });

    return NextResponse.json({ message: 'Salary reset successfully' });
  } catch (error) {
    console.error('Error resetting salary:', error);
    return NextResponse.json(
      { error: 'Failed to reset salary' },
      { status: 500 }
    );
  }
}