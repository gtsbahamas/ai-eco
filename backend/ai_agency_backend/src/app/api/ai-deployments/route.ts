import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { aiModels, aiDeployments, projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get AI deployments
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
    
    // Check if user has permission to view AI deployments
    const userRoles = session.user.roles || [];
    const canViewDeployments = userRoles.some(role => 
      ['Admin', 'Manager', 'User'].includes(role)
    );
    
    if (!canViewDeployments) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const db = getDb(request);
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const modelId = searchParams.get('modelId');
    
    let deployments;
    
    if (projectId && modelId) {
      // Get deployments for specific project and model
      deployments = await db.query.aiDeployments.findMany({
        where: and(
          eq(aiDeployments.projectId, projectId),
          eq(aiDeployments.modelId, modelId)
        ),
        with: {
          model: true,
          project: true
        }
      });
    } else if (projectId) {
      // Get deployments for a project
      deployments = await db.query.aiDeployments.findMany({
        where: eq(aiDeployments.projectId, projectId),
        with: {
          model: true
        }
      });
    } else if (modelId) {
      // Get deployments for a model
      deployments = await db.query.aiDeployments.findMany({
        where: eq(aiDeployments.modelId, modelId),
        with: {
          project: true
        }
      });
    } else {
      // Get all deployments
      deployments = await db.query.aiDeployments.findMany({
        with: {
          model: true,
          project: true
        }
      });
    }
    
    return NextResponse.json(deployments);
  } catch (error) {
    console.error('Error fetching AI deployments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI deployments' },
      { status: 500 }
    );
  }
}

// Create a new AI deployment
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
    
    // Check if user has permission to create AI deployments
    const userRoles = session.user.roles || [];
    const canCreateDeployments = userRoles.some(role => 
      ['Admin', 'Manager'].includes(role)
    );
    
    if (!canCreateDeployments) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { modelId, projectId, performanceMetrics } = body;
    
    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }
    
    const db = getDb(request);
    
    // Verify model exists
    const model = await db.query.aiModels.findFirst({
      where: eq(aiModels.id, modelId),
    });
    
    if (!model) {
      return NextResponse.json(
        { error: 'AI model not found' },
        { status: 404 }
      );
    }
    
    // Verify project exists if projectId is provided
    if (projectId) {
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });
      
      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
    }
    
    const deploymentId = `deployment_${nanoid()}`;
    
    await db.insert(aiDeployments).values({
      id: deploymentId,
      modelId,
      projectId,
      deploymentDate: new Date().toISOString(),
      status: 'Active',
      performanceMetrics: performanceMetrics || '',
    });
    
    return NextResponse.json(
      { 
        message: 'AI deployment created successfully',
        deployment: { 
          id: deploymentId, 
          modelId, 
          projectId, 
          deploymentDate: new Date().toISOString(), 
          status: 'Active', 
          performanceMetrics: performanceMetrics || '' 
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating AI deployment:', error);
    return NextResponse.json(
      { error: 'Failed to create AI deployment' },
      { status: 500 }
    );
  }
}
