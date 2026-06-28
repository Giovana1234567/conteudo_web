"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../../config";
import "./registrar.css";

/**
 * TELA DE REGISTRO DE CREDENCIAIS
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINT: 'POST /autenticacao'
 * 3. DTO / CAMPOS ENVIADOS: { email, password, name }
 * 
 * --- COMO ADAPTAR PARA ADICIONAR CPF NO CADASTRO: ---
 * Se na prova pedir CPF, Nome, Email e Senha:
 * 1. Adicione a variável `cpf` no estado (useState).
 * 2. Adicione o input do formulário correspondente ao CPF.
 * 3. Adicione `cpf` no objeto enviado: body: JSON.stringify({ name, email, cpf, password })
 */
export default function RegistrarPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("[HTTP REQUEST] POST /autenticacao:", { name, email, password });

    try {
      const response = await fetch(`${API_BASE_URL}/autenticacao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email, // <-- Se a prova pedir login por CPF e você adicionou cpf na entidade: adicione 'cpf' aqui
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao realizar cadastro");
      }

      console.log("[HTTP RESPONSE] Sucesso:", data);
      setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...");

      setTimeout(() => {
        router.push("/autenticacao/login");
      }, 1500);
    } catch (err: any) {
      console.error("[HTTP ERROR]:", err.message);
      setError(err.message || "Erro de conexão com o servidor");
    }
  };

  return (
    <div className="registrar-container">
      <div className="registrar-card">
        <h1 className="registrar-title">Criar Conta</h1>
        <p className="registrar-subtitle">Preencha os dados abaixo para registrar-se</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* NOME COMPLETO */}
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className="form-input"
              placeholder="Maria da Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              placeholder="maria@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* SENHA */}
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            Cadastrar
          </button>
        </form>

        <footer className="registrar-footer">
          Já possui conta? <Link href="/autenticacao/login">Faça Login</Link>
          <div style={{ marginTop: "1rem" }}>
            <Link href="/">Voltar ao Portal</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
