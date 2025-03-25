import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users, userRoles, roles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getDb(request);
    
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const userId = `user_${nanoid()}`;
    await db.insert(users).values({
      id: userId,
      name,
      email,
      passwordHash: hashedPassword,
    });

    // Assign default user role
    const userRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'User'),
    });

    if (userRole) {
      await db.insert(userRoles).values({
        userId,
        roleId: userRole.id,
      });
    }

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: { id: userId, name, email }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
