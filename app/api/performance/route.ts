import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}

export async function GET(request: Request) {
  try {
    // Authentication check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return unauthorizedResponse();
    
    const token = authHeader.split(' ')[1];
    if (!token) return unauthorizedResponse();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Only managers and above can view performance data
    if (decoded.role !== 'MANAGER' && decoded.role !== 'HR' && decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Manager access required' },
        { status: 403 }
      );
    }

    const performances = await prisma.performance.findMany({
      include: {
        employee: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        reviewDate: 'desc'
      }
    });

    const averageRating = await prisma.performance.aggregate({
      _avg: {
        rating: true
      }
    });

    return NextResponse.json({
      performances,
      stats: {
        averageRating: averageRating._avg.rating || 0,
        totalReviews: performances.length
      }
    });
  } catch (error: any) {
    console.error('Error fetching performances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Authentication check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return unauthorizedResponse();
    
    const token = authHeader.split(' ')[1];
    if (!token) return unauthorizedResponse();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Only managers and above can create reviews
    if (decoded.role !== 'MANAGER' && decoded.role !== 'HR' && decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Manager access required' },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.employeeId || !data.rating || !data.feedback) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const performance = await prisma.performance.create({
      data: {
        rating: parseInt(data.rating),
        feedback: data.feedback,
        reviewDate: new Date(),
        employeeId: data.employeeId,
        reviewerId: decoded.userId // Track who created the review
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(performance, { status: 201 });
  } catch (error: any) {
    console.error('Error creating performance review:', error);

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create performance review' },
      { status: 500 }
    );
  }
}