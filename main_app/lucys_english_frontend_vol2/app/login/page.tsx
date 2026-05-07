import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="auth-page">
      {/* levý panel - dekorativní */}
      <div className="auth-left">
        <p className="auth-tag">Vítejte zpět</p>
        <h2 className="auth-heading">
          Pokračujte ve své<br />
          <span>anglické cestě</span>
        </h2>
        <p className="auth-description">
          Přihlaste se a pokračujte tam, kde jste skončili.
          Vaše slovíčka a pokrok na vás čekají.
        </p>
      </div>

      {/* pravý panel - formulář */}
      <div className="auth-right">
        <LoginForm />
      </div>
    </div>
  );
}
