import { NextRequest, NextResponse } from 'next/server';
const { MongoClient } = require('mongodb'); // Your native driver

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(request) {
  try {
    await client.connect();
    const db = client.db('your-db-name'); // Replace with your DB
    const services = await db.collection('detailed-services').find({}).sort({ order: 1 }).toArray();
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await client.connect();
    const db = client.db('your-db-name');
    const result = await db.collection('detailed-services').insertOne(body);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  } finally {
    await client.close();
  }
}

// Add PUT/DELETE for edit/delete if needed
export async function PUT(request) {
  const body = await request.json();
  await client.connect();
  const db = client.db('your-db-name');
  await db.collection('detailed-services').updateOne({ _id: body.id }, { $set: body });
  await client.close();
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await client.connect();
  const db = client.db('your-db-name');
  await db.collection('detailed-services').deleteOne({ _id: id });
  await client.close();
  return NextResponse.json({ success: true });
}
