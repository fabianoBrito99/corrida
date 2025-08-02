// /app/api/ingressos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";   

export async function GET(req: NextRequest) {
  const cpf = req.nextUrl.searchParams.get("cpf");
  if (!cpf) {
    return NextResponse.json(
      { erro: "CPF é obrigatório" },
      { status: 400 }
    );
  }

  try {
    // Usa o admin SDK diretamente, sem importar firebase/firestore
    const snapshot = await db
      .collection("pagamentos")
      .where("cpf", "==", cpf)
      .orderBy("timestamp", "desc")   // opcional, ordena do mais recente
      .get();

    const tickets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ tickets });
  } catch (err) {
    console.error("Erro ao buscar ingressos:", err);
    return NextResponse.json(
      { erro: "Falha ao buscar ingressos" },
      { status: 500 }
    );
  }
}
