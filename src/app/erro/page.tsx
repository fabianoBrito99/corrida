import styles from "./sucesso.module.css";
import { CircleX } from "lucide-react"; // ou use um emoji se preferir

export default function Page() {
  return (
    <div className={styles.container}>
      <CircleX className={styles.icone} />
      <h1 className={styles.titulo}>Pagamento Recusado!</h1>
    </div>
  );
}
