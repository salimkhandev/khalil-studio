import { connectToDatabase } from '@/lib/mongodb';
import Skill from '@/models/Skill';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all active skills (public)
export async function GET() {
  try {
    await connectToDatabase();

    const skills = await Skill.find({ 
      isActive: true 
    }).sort({ order: 1, createdAt: 1 });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST - Create a new skill
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;
    
    if (!adminAuth) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, tools, order } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Skill title is required' },
        { status: 400 }
      );
    }

    // Get the next order number if not provided
    let skillOrder = order;
    if (skillOrder === undefined) {
      const lastSkill = await Skill.findOne({ userId: adminAuth }).sort({ order: -1 });
      skillOrder = lastSkill ? lastSkill.order + 1 : 0;
    }

    const skill = new Skill({
      title,
      description,
      tools: tools || [],
      userId: adminAuth,
      order: skillOrder
    });

    await skill.save();

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}
