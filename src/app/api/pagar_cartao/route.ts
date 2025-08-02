// /app/api/pagar_cartao/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { MercadoPagoConfig, Payment } from "mercadopago";

export const runtime = "nodejs";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body: {
      email: string;
      nome: string;
      cpf: string;
      telefone?: string;
      igreja?: string;
      token: string;
      payment_method_id: string;
      issuer_id: string | number;
      parcelas: string | number;
      tipo?: "adulto" | "crianca";
      transaction_amount?: number;
    } = await req.json();

    // força tipos numéricos
    const issuerId = typeof body.issuer_id === "string"
      ? parseInt(body.issuer_id, 10)
      : body.issuer_id;
    const parcelas = typeof body.parcelas === "string"
      ? parseInt(body.parcelas, 10)
      : body.parcelas;

    // calcula o valor: prioridade para transaction_amount, senão tipo
    const amount =
      body.transaction_amount ??
      (body.tipo === "crianca" ? 55 : 75);

    const description = `Inscrição ${
      body.tipo === "crianca" ? "Criança" : "Adulto"
    } – Night Run Rockets`;

    // cria o pagamento
    const payment = new Payment(mpClient);
    const result = await payment.create({
      body: {
        transaction_amount: amount,
        token: body.token,
        installments: parcelas,
        payment_method_id: body.payment_method_id,
        issuer_id: issuerId,
        payer: {
          email: body.email,
          first_name: body.nome,
          identification: {
            type: "CPF",
            number: body.cpf,
          },
        },
        description,
      },
    });

    // persiste no Firestore
    await db.collection("compras").add({
      pagamento_id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      transaction_amount: amount,
      tipo: body.tipo ?? "adulto",
      description,
      nome: body.nome,
      email: body.email,
      cpf: body.cpf,
      telefone: body.telefone ?? null,
      igreja: body.igreja ?? null,
      metodo: "cartao",
      parcelas,
      createdAt: new Date(),
    });

    return NextResponse.json({
      status: result.status,
      status_detail: result.status_detail,
      id: result.id,
      transaction_amount: amount,
      tipo: body.tipo ?? "adulto",
    });
  } catch (err: unknown) {
    console.error("❌ Erro no processamento do Cartão:", err);
    const message =
      err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { status: "erro", message },
      { status: 500 }
    );
  }
}
