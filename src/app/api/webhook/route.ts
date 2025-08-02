import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const log = {
    timestamp: new Date().toISOString(),
    body
  };

  const filePath = path.join(process.cwd(), 'src/data/payments.json');
  let list = [];
  try {
    list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {}
  list.push(log);
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
  return NextResponse.json({ received: true });
}