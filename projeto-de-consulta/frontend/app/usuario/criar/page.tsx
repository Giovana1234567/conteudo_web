"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../../config";
import "./criar.css";

/**
 * CADASTRO DE USUÁRIO (POSTGRESQL - TABELA USUARIO)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINT: 'POST /usuario'
 * 3. DTO / CAMPOS ENVIADOS: { name, email, age }
 * 
 * --- COMO ADAPTAR PARA QUALQUER ENTIDADE DE CADASTRO: ---
 * 1. Adicione os campos desejados no estado (useState).
 * 2. Crie os campos correspondentes no formulário (inputs).
 * 3. Altere o body do Fetch para enviar todos os campos necessários.
 */
export default function CriarUsuarioPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      name,
      status,
    };

    console.log("[HTTP REQUEST] POST /usuario:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar usuário");
      }

      console.log("[HTTP RESPONSE] Sucesso:", data);
      setSuccess("Usuário cadastrado com sucesso!");

      setTimeout(() => {
        router.push("/usuario/listar");
      }, 1500);
    } catch (err: any) {
      console.error("[HTTP ERROR]:", err.message);
      setError(err.message || "Erro de conexão com o servidor");
    }
  };

  return (
    <div className="criar-container">
      <div className="criar-card">
        <h1 className="criar-title">Novo Usuário</h1>
        <p className="criar-subtitle">Cadastre um novo usuário no banco PostgreSQL</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* NOME */}
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: João da Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* STATUS */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status ? "true" : "false"}
              onChange={(e) => setStatus(e.target.value === "true")}
              required
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">
            Confirmar Cadastro
          </button>
        </form>

        <div className="criar-footer">
          <Link href="/">Voltar ao Portal</Link>
          <Link href="/usuario/listar">Ver Listagem</Link>
        </div>
      </div>
    </div>
  );
}
