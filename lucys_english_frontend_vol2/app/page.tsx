import { Navbar } from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <main className="home-page">
      <Navbar />

      {/* background dekorativní bloky */}
      <div className="home-bg-block-1" />
      <div className="home-bg-block-2" />

      <section className="home-hero">
        <p className="home-tag">Angličtina pro každého</p>

        <h1 className="home-heading">
          Učte se anglicky
          <span className="pink">chytře a efektivně</span>
          s <span className="blue">Lucy</span>
        </h1>

        <p className="home-description">
          Interaktivní kurzy angličtiny pro všechny úrovně.
          Slovíčka, hry a cvičení navržené tak, aby vás učení opravdu bavilo.
        </p>

        <div className="home-stats">
          <div className="stat-item">
            <span className="stat-number">500<span>+</span></span>
            <span className="stat-label">Slovíček</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">12<span>+</span></span>
            <span className="stat-label">Kurzů</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">7<span>+</span></span>
            <span className="stat-label">Typů her</span>
          </div>
        </div>
      </section>
    </main>
  );
}
