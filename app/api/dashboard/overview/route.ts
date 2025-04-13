import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      employeeCount,
      activeContracts,
      pendingLeaves,
      averagePerformance
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.contract.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.leave.count({
        where: { status: 'PENDING' }
      }),
      prisma.performance.aggregate({
        _avg: {
          rating: true
        }
      })
    ]);

    const recentActivities = await prisma.contract.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json({
      stats: {
        employeeCount,
        activeContracts,
        pendingLeaves,
        averagePerformance: averagePerformance._avg.rating || 0
      },
      recentActivities: recentActivities.map(activity => ({
        id: activity.id,
        type: 'CONTRACT',
        employeeName: activity.employee.user.name,
        date: activity.createdAt,
        details: `New ${activity.type} contract created`
      }))
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}