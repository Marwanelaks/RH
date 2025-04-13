import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Helper function for unauthorized responses
function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}

// Initialize Prisma Client
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error);
  throw new Error('Database connection failed');
}

export async function GET(request: Request) {
  try {
    // Authentication check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return unauthorizedResponse();
    
    const token = authHeader.split(' ')[1];
    if (!token) return unauthorizedResponse();

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Only ADMIN and HR can view payroll
    if (decoded.role !== 'ADMIN' && decoded.role !== 'HR') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or HR access required' },
        { status: 403 }
      );
    }

    // Verify Prisma client is initialized
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }

    // Get payroll data
    const payrolls = await prisma.payroll.findMany({
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
        paymentDate: 'desc'
      }
    });

    // Get employees for stats
    const employees = await prisma.employee.findMany({
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Calculate statistics
    const totalSalaries = payrolls
      .filter(p => p.type === 'SALARY')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalBonuses = payrolls
      .filter(p => p.type === 'BONUS')
      .reduce((sum, p) => sum + p.amount, 0);

    const averageSalary = employees.length > 0 
      ? employees.reduce((sum, e) => sum + e.salary, 0) / employees.length
      : 0;

    return NextResponse.json({
      payrolls,
      stats: {
        totalSalaries,
        totalBonuses,
        averageSalary,
        employeeCount: employees.length
      }
    });
  } catch (error: any) {
    console.error('Error fetching payroll:', error);

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch payroll data' },
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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Only HR can create payroll records
    if (decoded.role !== 'HR') {
      return NextResponse.json(
        { error: 'Unauthorized - HR access required' },
        { status: 403 }
      );
    }

    // Verify Prisma client is initialized
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.employeeId || !data.amount || !data.paymentDate || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    if (isNaN(parseFloat(data.amount))) {
      return NextResponse.json(
        { error: 'Amount must be a valid number' },
        { status: 400 }
      );
    }

    // Create payroll record
    const payroll = await prisma.payroll.create({
      data: {
        amount: parseFloat(data.amount),
        type: data.type,
        paymentDate: new Date(data.paymentDate),
        status: 'PAID',
        employeeId: data.employeeId,
        notes: data.notes || null
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

    return NextResponse.json(payroll, { status: 201 });
  } catch (error: any) {
    console.error('Error creating payroll:', error);

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
      { 
        error: error.message || 'Failed to create payroll record',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}