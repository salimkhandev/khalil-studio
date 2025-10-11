import { connectToDatabase } from '@/lib/mongodb';
import Skill from '@/models/Skill';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch a specific skill
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;
    
    if (!adminAuth) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid skill ID' }, { status: 400 });
    }

    const skill = await Skill.findOne({ 
      _id: id, 
      userId: adminAuth 
    });

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ skill });
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}

// PUT - Update a skill
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;
    
    if (!adminAuth) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid skill ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, tools, order, isActive } = body;

    const skill = await Skill.findOneAndUpdate(
      { _id: id, userId: adminAuth },
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(tools !== undefined && { tools }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ skill });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a skill (soft delete by setting isActive to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;
    
    if (!adminAuth) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid skill ID' }, { status: 400 });
    }

    const skill = await Skill.findOneAndUpdate(
      { _id: id, userId: adminAuth },
      { isActive: false },
      { new: true }
    );

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
