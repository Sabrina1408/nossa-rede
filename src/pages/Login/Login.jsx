// CSS
import styles from './Login.module.css';
// React Router
import { Link } from "react-router-dom";
// Hooks
import { useAuthentication } from "../../hooks/useAuthentication";
import { useEffect, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Firebase
  const {login, error: authError, loading} = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const user = {
      email,
      password
    }

    const res = await login(user);
    console.log(res);
  }

  // Mapear error
  useEffect(() => {
    if(authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className={styles.login}>
      <h1>Já tem cadastro?</h1>
      <p>Faça seu login para compartilhar memes!</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Email:</span>
          <input
            type="email"
            name="email"
            required
            placeholder="Email do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Senha:</span>
          <input
            type="password"
            name="password"
            required
            placeholder="Insira sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <Link to="/reset/email">Esqueceu sua senha?</Link>
        {!loading && <button className="btn">Entrar</button>}
        {loading && <button className="btn" disabled>Aguarde...</button>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}

export default Login;