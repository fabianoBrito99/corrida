"use client";
import React, { useState } from "react";
import Script from "next/script";
import styles from "./page.module.css";
import Input from "../../../componentes/forms/input";

// Estoque e preços
const STOCK = { adulto: 100, crianca: 30 };
const PRICE = { adulto: 75, crianca: 55 };

type TicketType = "adulto" | "crianca";




import { PixForm } from "../../../componentes/pix/pix";
import { CardForm } from "../../../componentes/cartao/carta";


//--- Main Page ---
export default function InscricaoPage() {
  type ShirtSize = "" | "P" | "M" | "G" | "GG";
  const [ticketType, setTicketType] = useState<TicketType | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao" | "">("");
  const [participaEquipe, setParticipaEquipe] = useState(false);
  const [nomeEquipe, setNomeEquipe] = useState("");
  const [shirtSize, setShirtSize] = useState<"P" | "M" | "G" | "GG" | "">("");
  const price = ticketType ? PRICE[ticketType] : 0;

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        strategy="beforeInteractive"
      />
      <div className={styles.container}>
        <h1>Night Run Rockets</h1>
        <section className={styles.section}>
          <h2>Tipo de Ingresso</h2>
          <p>
            Adulto: {STOCK.adulto} | Marratoninha: {STOCK.crianca}
          </p>
          <label>
            <input
              type="radio"
              name="ticket"
              value="adulto"
              checked={ticketType === "adulto"}
              onChange={() => {
                setTicketType("adulto");
                setPaymentMethod("");
              }}
              disabled={STOCK.adulto === 0}
            />{" "}
            Adulto (R$ {PRICE.adulto},00)
          </label>
          <label>
            <input
              type="radio"
              name="ticket"
              value="crianca"
              checked={ticketType === "crianca"}
              onChange={() => {
                setTicketType("crianca");
                setPaymentMethod("");
              }}
              disabled={STOCK.crianca === 0}
            />{" "}
            Marratoninha (R$ {PRICE.crianca},00)
          </label>
        </section>
        {ticketType && (
          <section className={styles.section}>
            <h3>Participa de alguma equipe de corrida?</h3>
            <select
              value={participaEquipe ? "sim" : "nao"}
              onChange={(e) => {
                setParticipaEquipe(e.target.value === "sim");
                setNomeEquipe("");
              }}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
            {participaEquipe && (
              <Input
                label="Nome da Equipe"
                name="nomeEquipe"
                value={nomeEquipe}
                onChange={(e) => setNomeEquipe(e.target.value)}
              />
            )}
            <h3>Tamanho da camiseta</h3>
            <select
              value={shirtSize}
              onChange={(e) => setShirtSize(e.target.value as ShirtSize)}
            >
              <option value="">Selecione</option>
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
            </select>
          </section>
        )}
        {ticketType && (
          <section className={styles.section}>
            <h2>Preço: R$ {price},00</h2>
            <h3>Forma de Pagamento</h3>
            <label>
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={paymentMethod === "pix"}
                onChange={() => setPaymentMethod("pix")}
              />{" "}
              Pix
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cartao"
                checked={paymentMethod === "cartao"}
                onChange={() => setPaymentMethod("cartao")}
              />{" "}
              Cartão
            </label>
          </section>
        )}
        {(ticketType === 'adulto' || ticketType === 'crianca') && paymentMethod === "pix" && (
          <PixForm
            tipo={ticketType}
            valor={price}
            participaEquipe={participaEquipe}
            nomeEquipe={nomeEquipe}
            shirtSize={shirtSize}
          />
        )}
        {(ticketType === 'adulto' || ticketType === 'crianca') && paymentMethod === "cartao" && (
          <CardForm
            tipo={ticketType}
            valor={price}
            participaEquipe={participaEquipe}
            nomeEquipe={nomeEquipe}
            shirtSize={shirtSize}
          />
        )}
      </div>
    </>
  );
}
