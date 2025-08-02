"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "./relatorio.module.css";
import Button from "../../../componentes/forms/button";

interface Pessoa {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  igreja: string;
  metodo: string;
  status: string;
  timestamp: string;
}

export default function RelatorioPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listar_pessoas")
      .then((res) => res.json())
      .then((data) => {
        setPessoas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const gerarPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["Nome", "Email", "CPF", "Telefone", "Igreja", "Pagamento", "Status"]],
      body: pessoas.map((pessoa) => [
        pessoa.nome,
        pessoa.email,
        pessoa.cpf,
        pessoa.telefone,
        pessoa.igreja,
        pessoa.metodo,
        pessoa.status,
      ]),
    });

    doc.save("relatorio_pagamentos.pdf");
  };

  return (
    <div className={styles.container}>
      <h1>Relatório de Inscrições</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Igreja</th>
                <th>Método</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((pessoa, idx) => (
                <tr key={idx}>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.email}</td>
                  <td>{pessoa.cpf}</td>
                  <td>{pessoa.telefone}</td>
                  <td>{pessoa.igreja}</td>
                  <td>{pessoa.metodo}</td>
                  <td>{pessoa.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button onClick={gerarPDF}>Baixar PDF</Button>
        </>
      )}
    </div>
  );
}
