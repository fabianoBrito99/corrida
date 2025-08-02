// /app/ingressos/page.tsx
"use client";

import { useState } from "react";
import styles from "./ingressos.module.css";

type Ingresso = {
  id: string;
  tipo: string;
  transaction_amount: number;
  metodo: string;
  status: string;
  participaEquipe: boolean;
  nomeEquipe?: string | null;
  shirtSize: string;
  parcelas?: number;
  timestamp?: string;
  createdAt?: { seconds: number };
};

export default function IngressosPage() {
  const [cpf, setCpf] = useState("");
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [error, setError] = useState("");

  const buscaIngressos = async () => {
    setError("");
    try {
      const res = await fetch(`/api/ingressos?cpf=${cpf}`);
      if (!res.ok) {
        // Especifica tipo esperado do JSON de erro
        const errJson = (await res.json()) as { erro?: string };
        throw new Error(errJson.erro ?? res.statusText);
      }
      const json = (await res.json()) as { tickets: Ingresso[] };
      setIngressos(json.tickets);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao buscar ingressos");
      }
      setIngressos([]);
    }
  };

  const formatDate = (t: Ingresso) => {
    if (t.timestamp) {
      return new Date(t.timestamp).toLocaleString();
    }
    if (t.createdAt?.seconds) {
      return new Date(t.createdAt.seconds * 1000).toLocaleString();
    }
    return "-";
  };

  return (
    <div className={styles.container}>
      <h1>Meus Ingressos</h1>

      <div className={styles.searchBox}>
        <label>
          CPF:
          <input
            type="text"
            value={cpf}
            onChange={(e) =>
              setCpf(e.target.value.replace(/\D/g, "").slice(0, 11))
            }
            placeholder="Somente números"
            maxLength={11}
          />
        </label>
        <button onClick={buscaIngressos} disabled={cpf.length !== 11}>
          Buscar
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <ul className={styles.list}>
        {ingressos.map((i) => (
          <li key={i.id} className={styles.item}>
            <p>
              <strong>Tipo:</strong> {i.tipo}
            </p>
            <p>
              <strong>Valor:</strong> R$ {i.transaction_amount},00
            </p>
            <p>
              <strong>Método:</strong> {i.metodo}
            </p>
            <p>
              <strong>Status:</strong> {i.status}
            </p>
            <p>
              <strong>Data:</strong> {formatDate(i)}
            </p>
            <p>
              <strong>Participa de equipe:</strong>{" "}
              {i.participaEquipe ? "Sim" : "Não"}
            </p>
            {i.participaEquipe && (
              <p>
                <strong>Nome da equipe:</strong> {i.nomeEquipe}
              </p>
            )}
            <p>
              <strong>Tamanho da camiseta:</strong> {i.shirtSize}
            </p>
            {i.parcelas !== undefined && (
              <p>
                <strong>Parcelas:</strong> {i.parcelas}x
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
