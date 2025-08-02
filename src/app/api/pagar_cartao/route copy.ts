// import { NextResponse } from "next/server";
// import { db } from "@/lib/firebase";
// const mercadopago = require("mercadopago");

// export const runtime = "nodejs";

// export async function POST(req: Request) {
//   try {
//     console.log("📥 Requisição recebida em /api/pagar_cartao");

//     const body = await req.json();
//     console.log("📦 Dados recebidos:", body);

//     const mpVersion = require("mercadopago/package.json").version;
//     console.log("🧪 Mercado Pago versão:", mpVersion);
//     console.log("🧪 Chaves do módulo:", Object.keys(mercadopago));
//     console.log("🔐 Token de acesso usado:", process.env.MP_ACCESS_TOKEN);

//     // Inicializa o client e Payment
//     const client = new mercadopago.MercadoPagoConfig({
//       accessToken: process.env.MP_ACCESS_TOKEN,
//     });

//     const payment = new mercadopago.Payment(client);

//     const valorFixo = 3; // R$ 2,00 fixo
//     console.log("🧪 Tipo do valor fixo:", typeof valorFixo);

//     const result = await payment.create({
//       body: {
//         transaction_amount: Number(valorFixo),
//         token: body.token,
//         installments: body.installments || 1,
//         payment_method_id: body.tipo_pagamento,
//         issuer_id: body.issuer_id,
//         payer: {
//           email: body.email,
//           identification: {
//             type: "CPF",
//             number: body.cpf || body.cardholder_cpf,
//           },
//         },
//       },
//     });

//     console.log("💳 Resposta do Mercado Pago:", result);

//     await db.collection("compras").add({
//       pagamento_id: result.id,
//       status: result.status,
//       status_detail: result.status_detail,
//       nome: body.nome,
//       email: body.email,
//       cpf: body.cpf,
//       telefone: body.telefone,
//       igreja: body.igreja,
//       metodo: "cartao",
//       createdAt: new Date(),
//     });

//     console.log("✅ Compra salva no Firestore");

//     return NextResponse.json({
//       status: result.status,
//       status_detail: result.status_detail,
//       id: result.id,
//     });
//   } catch (err: unknown) {
//     console.error("❌ Erro no processamento:", err);
//     return NextResponse.json(
//       {
//         erro: "Erro ao processar pagamento",
//         detalhe: typeof err === "object" ? JSON.stringify(err) : String(err),
//       },
//       { status: 500 }
//     );
//   }
// }
