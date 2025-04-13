import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Helper function for unauthorized responses
function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}

export async function GET(request: Request) {
  try {
    // Authentication and authorization check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return unauthorizedResponse();
    
    const token = authHeader.split(' ')[1];
    if (!token) return unauthorizedResponse();

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Only ADMIN and HR can view contracts
    if (decoded.role !== 'ADMIN' && decoded.role !== 'HR') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or HR access required' },
        { status: 403 }
      );
    }

    const contracts = await prisma.contract.findMany({
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
        createdAt: 'desc'
      }
    });

    return NextResponse.json(contracts);
  } catch (error: any) {
    console.error('Error fetching contracts:', error);

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Authentication and authorization check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return unauthorizedResponse();
    
    const token = authHeader.split(' ')[1];
    if (!token) return unauthorizedResponse();

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Only HR can create contracts
    if (decoded.role !== 'HR') {
      return NextResponse.json(
        { error: 'Unauthorized - HR access required' },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.type || !data.startDate || !data.employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.create({
      data: {
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: 'ACTIVE',
        employeeId: data.employeeId
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

    return NextResponse.json(contract, { status: 201 });
  } catch (error: any) {
    console.error('Error creating contract:', error);

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}