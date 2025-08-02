// /app/api/pagar_pix/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body: {
      email: string;
      nome: string;
      cpf: string;
      tipo?: "adulto" | "crianca";
      transaction_amount?: number;
    } = await req.json();

    // determina valor conforme tipo: criança R$55, adulto R$75
    const amount =
      body.transaction_amount ??
      (body.tipo === "crianca" ? 55 : 75);

    const description = `Inscrição ${body.tipo === "crianca" ? "Criança" : "Adulto"} – Night Run Rockets`;

    const payment = new Payment(client);
    const result = await payment.create({
      body: {
        transaction_amount: amount,
        description,
        payment_method_id: "pix",
        payer: {
          email: body.email,
          first_name: body.nome,
          identification: {
            type: "CPF",
            number: body.cpf,
          },
        },
      },
    });

    const transactionData = result.point_of_interaction?.transaction_data;
    if (!transactionData) {
      return NextResponse.json(
        { status: "erro", message: "QR Code indisponível" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      qr_code: transactionData.qr_code,
      qr_code_base64: transactionData.qr_code_base64,
      payment_id: result.id,
      transaction_amount: amount,
      tipo: body.tipo ?? "adulto",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Erro no pagamento Pix:", error.message);
      return NextResponse.json(
        { status: "erro", message: error.message },
        { status: 500 }
      );
    }
    console.error("❌ Erro desconhecido no Pix:", error);
    return NextResponse.json(
      { status: "erro", message: "Erro desconhecido" },
      { status: 500 }
    );
  }
}
