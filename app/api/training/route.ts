import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      include: {
        employee: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    const stats = {
      total: trainings.length,
      completed: trainings.filter(t => t.status === 'COMPLETED').length,
      inProgress: trainings.filter(t => t.status === 'IN_PROGRESS').length,
      notStarted: trainings.filter(t => t.status === 'NOT_STARTED').length
    };

    return NextResponse.json({ trainings, stats });
  } catch (error) {
    console.error('Error fetching trainings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const training = await prisma.training.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        status: data.status || 'NOT_STARTED',
        employeeId: data.employeeId
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    console.error('Error creating training:', error);
    return NextResponse.json(
      { error: 'Failed to create training' },
      { status: 500 }
    );
  }
}