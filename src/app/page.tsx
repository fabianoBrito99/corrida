import Link from "next/link";

import styles from "../../styles/Home.module.css";
import Button from "../../componentes/forms/button";
import { Carousel } from "../../componentes/Carousel";
import Image from "next/image";

export default function Home() {
  const images = [
    "/i1.jpg",
    "/i2.jpg",
    "/i3.jpg",
    "/i4.jpg",
    "/i5.jpg",
    "/i6.jpg",
    "/i7.jpg",
    "/i8.jpg",
  ];
  return (
    <div className={styles.container}>
      <h1>2ª NIGHT RUN ROCKETS 2025 🚀</h1>

      <div className={styles.summary}>
        <p>
          Prepare-se para viver mais uma noite inesquecível de superação, fé e
          comunhão! Após o sucesso da primeira edição, a Rede Rockets convida
          você para a 2ª Night Run Rockets, uma corrida noturna que vai muito
          além do esporte:
        </p>

        <ul className={styles.ul1}>
          <li> Movimente-se! 🏃‍♀️</li>
          <li>Fortaleça seu corpo. 💪 </li>
          <li>Cuide de sua alma. ❤️ </li>
          <li>Desperte seu espírito. 🔥 </li>
        </ul>
      </div>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link href="/inscricao" passHref>
          <Button>Realizar Inscrição</Button>
        </Link>
      </div>

      <h3>Veja um pouquinho de como foi a 1ª edição</h3>
      <video
        autoPlay
        loop
        muted
        playsInline
        controls
        width="100%"
        style={{ marginTop: "1rem" }}
      >
        <source src="/rocketsVideo.mp4" type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      <div style={{ marginTop: "2rem" }}>
        <Carousel photos={images} interval={5000} />
      </div>
      <section className={styles.locationSection}>
        <p>Retirado do Kit:</p>
        <div className={styles.dateLocal}>
          <strong>📅 03 OUT • 10H às 13H</strong>
          <a href="https://maps.app.goo.gl/R61dUAAmpYhvvPKi7">
            Avenida Castelo Branco, 1282
            <br />
            Jardim Presidencial • Ji-Paraná/RO
          </a>
          <p></p>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d346.3210073638364!2d-61.97675808647436!3d-10.874296526337119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93c99b5e19797865%3A0x238cc5c7ba3b5a83!2sAv.%20Castelo%20Branco%2C%201282%20-%20Jardim%20Presidencial%2C%20Ji-Paran%C3%A1%20-%20RO%2C%2076901-066!5e0!3m2!1spt-BR!2sbr!4v1754145278805!5m2!1spt-BR!2sbr"
              className={styles.mapIframe}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p>Concentração e Comunhão:</p>

          <strong>📅 04 OUT • 18H - Largada às 19H</strong>
        </div>
        <p>Nosso Percusso</p>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m54!1m12!1m3!1d7836.261662073818!2d-61.973845654852724!3d-10.87765242101696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m39!3e0!4m5!1s0x93c99afeb8534a43%3A0xa5764a35b3502c1b!2sIgreja%20Mission%C3%A1ria%20Unida%20Jardim%20Presidencial%2C%20Av.%20Castelo%20Branco%2C%201282%20-%20Jardim%20Presidencial%2C%20Ji-Paran%C3%A1%20-%20RO%2C%2076908-332!3m2!1d-10.8742875!2d-61.9765428!4m3!3m2!1d-10.881642699999999!2d-61.967803599999996!4m3!3m2!1d-10.8805005!2d-61.9649321!4m3!3m2!1d-10.879499299999999!2d-61.9607417!4m3!3m2!1d-10.877824!2d-61.963167299999995!4m3!3m2!1d-10.8804315!2d-61.964995599999995!4m3!3m2!1d-10.880064899999999!2d-61.9667992!4m3!3m2!1d-10.8736017!2d-61.975942999999994!4m3!3m2!1d-10.8743565!2d-61.976461199999996!5e0!3m2!1spt-BR!2sbr!4v1754141219481!5m2!1spt-BR!2sbr"
            className={styles.mapIframe}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <p className={styles.mapLink}>
          <a
            href="https://www.google.com/maps/dir/Igreja+Mission%C3%A1ria+Unida+Jardim+Presidencial/-10.8816427,-61.9678036/-10.8805005,-61.9649321/-10.8794993,-61.9607417/-10.877824,-61.9631673/-10.8804315,-61.9649956/-10.8800649,-61.9667992/-10.8736017,-61.975943/-10.8743565,-61.9764612"
            target="_blank"
            rel="noopener noreferrer"
          >
            ▶️ Clique aqui caso queira ver a rota completa no Google Maps
          </a>
        </p>
      </section>

      <section className={styles.shirt}>
        <p>Cada inscrição é composta por:</p>
        <ul className={styles.benefitsList}>
          <li>Camiseta</li>
          <li>Número de Peito</li>
          <li>Medalha</li>
        </ul>
        <p>Confira nossa camiseta abaixo</p>
        <Image
          src="/camiseta.jpeg"
          alt="Camiseta Night Run Rockets"
          width={350}
          height={180}
        />
      </section>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link href="/inscricao" passHref>
          <Button>Realizar Inscrição</Button>
        </Link>
      </div>
    </div>
  );
}
