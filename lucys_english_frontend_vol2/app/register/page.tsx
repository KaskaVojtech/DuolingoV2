import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="auth-page">
      {/* levý panel - dekorativní */}
      <div className="auth-left">
        <p className="auth-tag">Nový účet</p>
        <h2 className="auth-heading">
          Začněte svou<br />
          <span>anglickou cestu</span>
        </h2>
        <p className="auth-description">
          Zaregistrujte se zdarma a získejte přístup ke všem kurzům,
          slovíčkům a interaktivním hrám.
        </p>
      </div>

      {/* pravý panel - formulář */}
      <div className="auth-right">
        <RegisterForm />
      </div>
    </div>
  );
}
