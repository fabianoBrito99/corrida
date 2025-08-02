import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const snapshot = await db.collection('pagamentos').get();
    const pessoas = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(pessoas);
  } catch (error) {
    console.error("Erro ao listar pagamentos:", error);
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}
