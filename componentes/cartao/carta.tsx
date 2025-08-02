import styles from "../../src/app/inscricao/page.module.css";
import Input from "../forms/input";
import { useCallback, useEffect, useRef, useState } from "react";

interface CardData {
  token: string;
  paymentMethodId: string;
  issuerId: string;
}
type TicketType = "adulto" | "crianca";

interface PixFormProps {
  tipo: TicketType;
  valor: number;
  participaEquipe: boolean;
  nomeEquipe: string;
  shirtSize: string;
}

export function CardForm({
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
    parcelas: 1,
  });
  const [status, setStatus] = useState("");
  const [brickReady, setBrickReady] = useState(false);
  const brickLoaded = useRef(false);

  useEffect(() => {
    const { email, nome, cpf, telefone, igreja } = form;
    const ok =
      Boolean(email) &&
      nome.trim().length >= 6 &&
      /^[0-9]{11}$/.test(cpf) &&
      Boolean(telefone) &&
      Boolean(igreja);
    setBrickReady(ok);
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const v: string | number =
      name === "cpf"
        ? value.replace(/\D/g, "").slice(0, 11)
        : name === "parcelas"
        ? parseInt(value, 10) || 1
        : value;
    setForm((prev) => ({ ...prev, [name]: v }));
  };

  const salvarDadosCard = useCallback(
    async (pid: string) => {
      try {
        await fetch("/api/salvar_dados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            nome: form.nome,
            cpf: form.cpf,
            telefone: form.telefone,
            igreja: form.igreja,
            tipo,
            transaction_amount: valor,
            metodo: "cartao",
            status: "approved",
            paymentId: pid,
            participaEquipe,
            nomeEquipe: participaEquipe ? nomeEquipe : null,
            shirtSize,
            parcelas: form.parcelas,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error("Erro ao salvar dados Cartão:", err);
      }
    },
    [form, tipo, valor, participaEquipe, nomeEquipe, shirtSize]
  );

  useEffect(() => {
    if (!brickReady || brickLoaded.current) return;
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (!publicKey) return;

    // @ts-expect-error window.MercadoPago pode não existir no typing
    const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });
    const bricks = mp.bricks();
    bricks
      .create("cardPayment", "form-checkout", {
        initialization: { amount: valor },
        customization: { visual: { style: { theme: "default" } } },
        callbacks: {
          onReady: () => {
            brickLoaded.current = true;
          },
          onSubmit: async (cardData: CardData) => {
            try {
              setStatus("Processando pagamento...");
              const res = await fetch("/api/pagar_cartao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...form,
                  tipo,
                  transaction_amount: valor,
                  token: cardData.token,
                  payment_method_id: cardData.paymentMethodId,
                  issuer_id: Number(cardData.issuerId),
                  parcelas: form.parcelas,
                }),
              });
              const data = (await res.json()) as {
                status: string;
                status_detail?: string;
                id: string;
              };
              if (data.status === "approved") {
                setStatus("Pago com sucesso!");
                await salvarDadosCard(data.id);
                window.location.href = "/sucesso";
              } else {
                setStatus(`Erro: ${data.status_detail}`);
              }
            } catch (error) {
              console.error("Erro no pagamento cartão:", error);
              setStatus("Erro no pagamento");
            }
          },
          onError: (error: unknown) => {
            console.error("Erro no Brick:", error);
            setStatus("Erro ao carregar formulário");
          },
        },
      })
      .catch(console.error);
  }, [brickReady, valor, salvarDadosCard, form, tipo]);

  return (
    <div className={styles.paymentContainer}>
      <h2>Cartão (R$ {valor},00)</h2>
      <Input
        label="E-mail"
        name="email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        label="Nome Completo"
        name="nome"
        value={form.nome}
        onChange={handleChange}
      />
      <Input
        label="CPF (11 dígitos)"
        name="cpf"
        value={form.cpf}
        onChange={handleChange}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <Input
        label="Telefone"
        name="telefone"
        value={form.telefone}
        onChange={handleChange}
      />
      <div className={styles.option}>
        <label>Igreja</label>
        <select name="igreja" value={form.igreja} onChange={handleChange}>
          <option value="">Selecione a igreja</option>
          <option value="IMUB">IMUB presidencial</option>
          <option value="outra">Outra</option>
          <option value="nenhuma">Nenhuma</option>
        </select>
      </div>
      <div className={styles.option}>
        <label>Parcelas</label>
        <select name="parcelas" value={form.parcelas} onChange={handleChange}>
          <option value={1}>1x sem juros</option>
          <option value={2}>2x sem juros</option>
        </select>
      </div>
      {brickReady ? (
        <div id="form-checkout" className={styles.brickContainer} />
      ) : (
        <p>Preencha todos os campos para iniciar</p>
      )}
      <p className={styles.status}>{status}</p>
    </div>
  );
}