"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../../src/app/inscricao/page.module.css";
import Input from "../forms/input";
import Button from "../forms/button";
import Image from "next/image";


type TicketType = "adulto" | "crianca";



export interface PixFormProps {
  tipo: TicketType;
  valor: number;
  participaEquipe: boolean;
  nomeEquipe: string;
  shirtSize: string;
}
export function PixForm({
  tipo,
  valor,
  participaEquipe,
  nomeEquipe,
  shirtSize,
}: PixFormProps) {
  const [form, setForm] = useState({
    email: "",
    nome: "",
    cpf: "",
    telefone: "",
    igreja: "",
  });
  const { email, nome, cpf, telefone, igreja } = form;
  const [qrCode, setQrCode] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [status, setStatus] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    const ok =
      email.length > 0 &&
      nome.trim().length >= 6 &&
      /^[0-9]{11}$/.test(cpf) &&
      telefone.length > 0 &&
      igreja.length > 0;
    setIsReady(ok);
  }, [email, nome, cpf, telefone, igreja]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const v = name === "cpf" ? value.replace(/\D/g, "").slice(0, 11) : value;
    setForm((prev) => ({ ...prev, [name]: v }));
  };

  const salvarDados = useCallback(
    async (pid: string) => {
      try {
        await fetch("/api/salvar_dados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            nome,
            cpf,
            telefone,
            igreja,
            tipo,
            transaction_amount: valor,
            metodo: "pix",
            status: "approved",
            paymentId: pid,
            participaEquipe,
            nomeEquipe: participaEquipe ? nomeEquipe : null,
            shirtSize,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error("Erro ao salvar dados Pix:", err);
      }
    },
    [
      email,
      nome,
      cpf,
      telefone,
      igreja,
      tipo,
      valor,
      participaEquipe,
      nomeEquipe,
      shirtSize,
    ]
  );

  const pagarPix = async () => {
    setStatus("Gerando QR Code...");
    const res = await fetch("/api/pagar_pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tipo, transaction_amount: valor }),
    });
    if (!res.ok) {
      const errJson = await res.json();
      setStatus(`Erro: ${errJson.message || res.statusText}`);
      return;
    }
    const data = (await res.json()) as {
      qr_code: string;
      qr_code_base64: string;
      payment_id: string;
    };
    setQrCode(data.qr_code_base64);
    setPixKey(data.qr_code);
    setPaymentId(data.payment_id);
    setStatus("QR Code gerado");
  };

  useEffect(() => {
    if (!paymentId) return;
    const iv = setInterval(async () => {
      const r = await fetch(`/api/verificar_pagamento?id=${paymentId}`);
      const d = (await r.json()) as { status: string };
      if (d.status === "approved") {
        clearInterval(iv);
        setStatus("Pagamento aprovado!");
        await salvarDados(paymentId);
        window.location.href = "/sucesso";
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [paymentId, salvarDados]);

  return (
    <div className={styles.paymentContainer}>
      <h2>Pix (R$ {valor},00)</h2>
      <Input
        label="E-mail"
        name="email"
        value={email}
        onChange={handleChange}
      />
      <Input
        label="Nome Completo"
        name="nome"
        value={nome}
        onChange={handleChange}
      />
      <Input
        label="CPF (11 dígitos)"
        name="cpf"
        value={cpf}
        onChange={handleChange}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <Input
        label="Telefone"
        name="telefone"
        value={telefone}
        onChange={handleChange}
      />
      <div className={styles.option}>
        <label>Igreja</label>
        <select name="igreja" value={igreja} onChange={handleChange}>
          <option value="">Selecione a igreja</option>
          <option value="IMUB">IMUB presidencial</option>
          <option value="outra">Outra</option>
          <option value="nenhuma">Nenhuma</option>
        </select>
      </div>
      <div className={styles.option}>
        <label>Participa de equipe?</label>
        <span>{participaEquipe ? "Sim" : "Não"}</span>
      </div>
      <div className={styles.option}>
        <label>Tamanho da camiseta</label>
        <span>{shirtSize}</span>
      </div>
      <Button onClick={pagarPix} disabled={!isReady}>
        Gerar QR Code
      </Button>
      {qrCode && (
        <div className={styles.qrBox}>
          <Image
            src={`data:image/png;base64,${qrCode}`}
            alt="QR Code Pix"
            width={200}
            height={200}
          />
          <button
            className={styles.copyBtn}
            onClick={() => {
              navigator.clipboard.writeText(pixKey);
              setStatus("Código Pix copiado!");
            }}
          >
            📋 Copiar
          </button>
          <pre className={styles.pixKey}>{pixKey}</pre>
        </div>
      )}
      <p className={styles.status}>{status}</p>
    </div>
  );
}
