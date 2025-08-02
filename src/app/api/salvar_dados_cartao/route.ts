import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Monta os dados para salvar no Firebase
    const dataToSave = {
      email: body.email,
      nome: body.nome,
      cpf: body.cpf,
      telefone: body.telefone,
      igreja: body.igreja,
      tipoCartao: body.tipoCartao, // "credito" ou "debito"
      metodo: "cartao",
      status: body.status, // "approved", "rejected", etc.
      payment_id: body.payment_id || null,
      status_detail: body.status_detail || null,
      timestamp: new Date().toISOString(),
    };

    const ref = await db.collection("pagamentos_cartao").add(dataToSave);

    return NextResponse.json({ success: true, id: ref.id });
  } catch (error) {
    console.error("Erro ao salvar no Firebase:", error);
    return NextResponse.json({ error: "Erro ao salvar no Firebase" }, { status: 500 });
  }
}
