"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../../config";
import "./login.css";

/**
 * TELA DE LOGIN
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINT: 'POST /autenticacao/login'
 * 3. DTO / CAMPOS ENVIADOS: { email, password }
 * 
 * --- COMO ADAPTAR PARA LOGIN POR CPF: ---
 * Se na prova pedir CPF e Senha:
 * 1. Substitua o campo 'email' por 'cpf' no estado (useState).
 * 2. No formulário HTML, mude o input para CPF.
 * 3. No body do Fetch: body: JSON.stringify({ cpf, password })
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("[HTTP REQUEST] POST /autenticacao/login:", { email, password });

    try {
      // CHAMADA FETCH PARA A API DO NESTJS
      const response = await fetch(`${API_BASE_URL}/autenticacao/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, // <-- Se for CPF na prova, mude para: cpf
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciais inválidas");
      }

      console.log("[HTTP RESPONSE] Sucesso:", data);
      setSuccess("Login efetuado com sucesso!");

      // SALVAR O TOKEN JWT NO LOCALSTORAGE
      localStorage.setItem("token", data.access_token);

      // Redireciona para o portal principal após login
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      console.error("[HTTP ERROR]:", err.message);
      setError(err.message || "Erro de conexão com o servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Acessar Sistema</h1>
        <p className="login-subtitle">Entre com suas credenciais de acesso</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* CAMPO EMAIL / CPF */}
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="text"
              className="form-input"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* CAMPO SENHA */}
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            Entrar
          </button>
        </form>

        <footer className="login-footer">
          Não possui cadastro? <Link href="/autenticacao/registrar">Registre-se</Link>
          <div style={{ marginTop: "1rem" }}>
            <Link href="/">Voltar ao Portal</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
