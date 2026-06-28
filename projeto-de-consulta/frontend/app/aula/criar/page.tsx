"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../../config";
import "./criar.css";

/**
 * CADASTRO DE AULA (RELACIONAMENTO POSTGRESQL 1:N - CHAVE ESTRANGEIRA COM USUÁRIO)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINTS:
 *    - Listar Usuários (para o Dropdown): 'GET /usuario/all'
 *    - Salvar Registro: 'POST /aula'
 * 3. DTO / CAMPOS ENVIADOS: { name, description, duration, userId }
 *    * Onde `userId` é a chave estrangeira (número).
 * 
 * --- COMO ADAPTAR PARA QUALQUER CADASTRO COM RELACIONAMENTO (CHAVE ESTRANGEIRA): ---
 * 1. Carregue os registros do lado "Um" (ex: Categoria, Usuário) em um useEffect chamando `/entidade-pai/all`.
 * 2. Preencha uma tag `<select>` com as opções de `<option value={item.id}>{item.nome}</option>`.
 * 3. Capture o id selecionado no estado como número (Number(e.target.value)) e envie no JSON.
 */
export default function CriarAulaPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [userId, setUserId] = useState<number | "">("");
  const [users, setUsers] = useState<any[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // 1. CARREGAR A LISTAGEM DE USUÁRIOS PARA POPULAR O DROPDOWN (CHAVE ESTRANGEIRA)
  useEffect(() => {
    const fetchUsers = async () => {
      console.log("[HTTP REQUEST] GET /usuario/all");
      try {
        const response = await fetch(`${API_BASE_URL}/usuario/all`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Falha ao carregar lista de usuários");
        }
        setUsers(data);
      } catch (err: any) {
        console.error("[HTTP ERROR] Usuários:", err.message);
        setError("Não foi possível carregar os usuários para o agendamento.");
      }
    };
    fetchUsers();
  }, []);

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
      description,
      duration: duration !== "" ? Number(duration) : undefined,
      userId: Number(userId), // Envia a FK associada
    };

    console.log("[HTTP REQUEST] POST /aula:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/aula`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao agendar aula");
      }

      console.log("[HTTP RESPONSE] Sucesso:", data);
      setSuccess("Aula agendada com sucesso!");

      setTimeout(() => {
        router.push("/aula/listar");
      }, 1500);
    } catch (err: any) {
      console.error("[HTTP ERROR] Cadastro:", err.message);
      setError(err.message || "Erro de conexão com o servidor");
    }
  };

  return (
    <div className="criar-container">
      <div className="criar-card">
        <h1 className="criar-title">Agendar Aula</h1>
        <p className="criar-subtitle">Cadastre uma nova aula vinculando a um usuário (PostgreSQL)</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* NOME DA AULA */}
          <div className="form-group">
            <label className="form-label">Título da Aula</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Introdução ao NestJS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Módulos, Controllers e CLI"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* DURAÇÃO */}
          <div className="form-group">
            <label className="form-label">Duração (Minutos)</label>
            <input
              type="number"
              className="form-input"
              placeholder="Ex: 60"
              value={duration}
              onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
              required
            />
          </div>

          {/* USUÁRIO ASSOCIADO (CHAVE ESTRANGEIRA / FOREIGN KEY) */}
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
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-submit">
            Confirmar Agendamento
          </button>
        </form>

        <div className="criar-footer">
          <Link href="/">Voltar ao Portal</Link>
          <Link href="/aula/listar">Ver Listagem</Link>
        </div>
      </div>
    </div>
  );
}
