import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { aiModels } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get AI models
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to view AI models
    const userRoles = session.user.roles || [];
    const canViewModels = userRoles.some(role => 
      ['Admin', 'Manager', 'User'].includes(role)
    );
    
    if (!canViewModels) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const db = getDb(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let models;
    
    if (status) {
      // Get AI models by status
      models = await db.query.aiModels.findMany({
        where: eq(aiModels.status, status),
      });
    } else {
      // Get all AI models
      models = await db.query.aiModels.findMany();
    }
    
    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching AI models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI models' },
      { status: 500 }
    );
  }
}

// Create a new AI model
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to create AI models
    const userRoles = session.user.roles || [];
    const canCreateModels = userRoles.some(role => 
      ['Admin', 'Manager'].includes(role)
    );
    
    if (!canCreateModels) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { name, description, version, capabilities } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      );
    }
    
    const db = getDb(request);
    const modelId = `model_${nanoid()}`;
    
    await db.insert(aiModels).values({
      id: modelId,
      name,
      description,
      version: version || '1.0',
      capabilities,
      status: 'Active',
    });
    
    return NextResponse.json(
      { 
        message: 'AI model created successfully',
        model: { 
          id: modelId, 
          name, 
          description, 
          version: version || '1.0', 
          capabilities, 
          status: 'Active' 
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating AI model:', error);
    return NextResponse.json(
      { error: 'Failed to create AI model' },
      { status: 500 }
    );
  }
}
