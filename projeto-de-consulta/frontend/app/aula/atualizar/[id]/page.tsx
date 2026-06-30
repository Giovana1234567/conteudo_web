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
 * EDIÇÃO DE AULA (RELACIONAMENTO POSTGRESQL 1:N - CHAVE ESTRANGEIRA COM USUÁRIO)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINTS:
 *    - Obter Dados Atuais: 'GET /aula/:id'
 *    - Listar Usuários (Dropdown): 'GET /usuario/all'
 *    - Atualizar Registro: 'PUT /aula/:id'
 * 3. CAMPOS ENVIADOS: { name, status, idUser }
 */
export default function AtualizarAulaPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [name, setName] = useState("");
  const [status, setStatus] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | "">("");
  const [users, setUsers] = useState<any[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // 1. CARREGAR A LISTAGEM DE USUÁRIOS E DADOS ATUAIS DA AULA
  useEffect(() => {
    const fetchUsersAndClass = async () => {
      try {
        // Carrega usuários
        const usersResponse = await fetch(`${API_BASE_URL}/usuario/all`);
        const usersData = await usersResponse.json();
        if (!usersResponse.ok) throw new Error("Erro ao carregar usuários");
        setUsers(usersData);

        // Carrega aula atual
        console.log(`[HTTP REQUEST] GET /aula/${id}`);
        const classResponse = await fetch(`${API_BASE_URL}/aula/${id}`);
        const classData = await classResponse.json();
        if (!classResponse.ok) throw new Error("Erro ao carregar dados da aula");
        
        console.log("[HTTP RESPONSE] Carregado:", classData);
        setName(classData.name);
        setStatus(classData.status ?? true);
        setUserId(classData.user ? classData.user.id : "");
      } catch (err: any) {
        console.error("[HTTP ERROR] Inicialização:", err.message);
        setError(err.message);
      }
    };

    if (id) fetchUsersAndClass();
  }, [id]);

  // 2. ENVIAR DADOS ATUALIZADOS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (userId === "") {
      setError("Você deve associar um usuário a esta aula.");
      return;
    }

    const payload = {
      name,
      status,
      idUser: Number(userId),
    };

    console.log(`[HTTP REQUEST] PUT /aula/${id}:`, payload);

    try {
      const response = await fetch(`${API_BASE_URL}/aula/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar aula");
      }

      console.log("[HTTP RESPONSE] Atualizado:", data);
      setSuccess("Aula atualizada com sucesso!");

      setTimeout(() => {
        router.push("/aula/listar");
      }, 1500);
    } catch (err: any) {
      console.error("[HTTP ERROR] Atualização:", err.message);
      setError(err.message || "Erro de conexão com o servidor");
    }
  };

  return (
    <div className="atualizar-container">
      <div className="atualizar-card">
        <h1 className="atualizar-title">Editar Aula</h1>
        <p className="atualizar-subtitle">Modifique os dados do agendamento (ID: {id})</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* NOME DA AULA */}
          <div className="form-group">
            <label className="form-label">Título da Aula</label>
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

          {/* SELECIONAR USUÁRIO */}
          <div className="form-group">
            <label className="form-label">Usuário Responsável (FK)</label>
            <select
              className="form-select"
              value={userId}
              onChange={(e) => setUserId(e.target.value === "" ? "" : Number(e.target.value))}
              required
            >
              <option value="">-- Selecione o Usuário --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-submit">
            Salvar Alterações
          </button>
        </form>

        <div className="atualizar-footer">
          <Link href="/aula/listar">Voltar à Listagem</Link>
          <Link href="/">Ir ao Portal</Link>
        </div>
      </div>
    </div>
  );
}
