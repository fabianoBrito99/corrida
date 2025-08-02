// /app/api/salvar_dados/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Só grava se o pagamento foi aprovado
    if (body.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Pagamento não aprovado" },
        { status: 400 }
      );
    }

    // Desestrutura apenas os campos que importam pra relatório
    const {
      email,
      nome,
      cpf,
      telefone,
      igreja,
      tipo,
      transaction_amount,
      metodo,
      status,
      paymentId,
      participaEquipe,
      nomeEquipe,
      shirtSize,
      parcelas,
      timestamp,
    } = body;

    const dataToSave = {
      email,
      nome,
      cpf,
      telefone,
      igreja,
      tipo,
      transaction_amount,
      metodo,
      status,
      paymentId,        // apenas o ID do pagamento
      participaEquipe,
      nomeEquipe: participaEquipe ? nomeEquipe : null,
      shirtSize,        // TAMANHO DA CAMISA
      parcelas: parcelas ?? null,
      timestamp: timestamp || new Date().toISOString(),
    };

    const ref = await db.collection("pagamentos").add(dataToSave);
    return NextResponse.json({ success: true, id: ref.id });
  } catch (error) {
    console.error("Erro ao salvar no Firebase:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao salvar no Firebase" },
      { status: 500 }
    );
  }
}
