"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../../../config";
import "./atualizar.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * EDIÇÃO DE USUÁRIO (POSTGRESQL - TABELA USUARIO)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINTS:
 *    - Obter Dados Atuais: 'GET /usuario/:id'
 *    - Atualizar Registro: 'PATCH /usuario/:id'
 * 3. CAMPOS ENVIADOS: { name, email, age }
 * 
 * --- COMO ADAPTAR PARA QUALQUER ENTIDADE DE EDIÇÃO: ---
 * 1. Obtenha o id via params (Next.js usa a Promise para params no App Router).
 * 2. Mapeie os estados para corresponderem aos campos do banco de dados.
 * 3. Modifique o body do Fetch e use o verbo HTTP correto (PUT ou PATCH, conforme seu controller).
 */
export default function AtualizarUsuarioPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [name, setName] = useState("");
  const [status, setStatus] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // 1. CARREGAR DADOS ATUAIS DO REGISTRO
  useEffect(() => {
    const fetchUser = async () => {
      console.log(`[HTTP REQUEST] GET /usuario/${id}`);
      try {
        const response = await fetch(`${API_BASE_URL}/usuario/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar usuário");
        }

        console.log("[HTTP RESPONSE] Carregado:", data);
        setName(data.name);
        setStatus(data.status ?? true);
      } catch (err: any) {
        console.error("[HTTP ERROR] Carregamento:", err.message);
        setError(err.message);
      }
    };

    if (id) fetchUser();
  }, [id]);

  // 2. ENVIAR DADOS ATUALIZADOS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      name,
      status,
    };

    console.log(`[HTTP REQUEST] PUT /usuario/${id}:`, payload);

    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar usuário");
      }

      console.log("[HTTP RESPONSE] Atualizado:", data);
      setSuccess("Cadastro atualizado com sucesso!");

      setTimeout(() => {
        router.push("/usuario/listar");
      }, 1500);
    } catch (err: any) {
      console.error("[HTTP ERROR] Atualização:", err.message);
      setError(err.message || "Erro de conexão com o servidor");
    }
  };

  return (
    <div className="atualizar-container">
      <div className="atualizar-card">
        <h1 className="atualizar-title">Editar Usuário</h1>
        <p className="atualizar-subtitle">Modifique os dados do usuário (ID: {id})</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* NOME */}
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className="form-input"
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
            Salvar Alterações
          </button>
        </form>

        <div className="atualizar-footer">
          <Link href="/usuario/listar">Voltar à Listagem</Link>
          <Link href="/">Ir ao Portal</Link>
        </div>
      </div>
    </div>
  );
}
