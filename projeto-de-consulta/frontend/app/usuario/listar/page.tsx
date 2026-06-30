"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "../../config";
import "./listar.css";

/**
 * LISTAGEM DE USUÁRIOS (POSTGRESQL - TABELA USUARIO)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINTS:
 *    - Listar Todos: 'GET /usuario/all'
 *    - Excluir Registro: 'DELETE /usuario/:id'
 * 
 * --- COMO ADAPTAR PARA QUALQUER ENTIDADE DE LISTAGEM: ---
 * 1. Mude o estado 'usuarios' para refletir a sua entidade.
 * 2. Na tabela HTML, troque os cabeçalhos (th) e campos de dados (td) pelos campos correspondentes da sua entidade.
 * 3. Garanta que o botão 'Editar' envie para a rota de atualizar com o ID correto (?id=...).
 */
export default function ListarUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // BUSCAR USUARIOS
  const fetchUsuarios = async () => {
    console.log("[HTTP REQUEST] GET /usuario/all");
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/all`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao listar usuários");
      }

      console.log("[HTTP RESPONSE] Lista carregada:", data);
      setUsuarios(data);
    } catch (err: any) {
      console.error("[HTTP ERROR] Listagem:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // EXCLUIR USUARIO
  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este usuário?")) return;

    console.log(`[HTTP REQUEST] DELETE /usuario/${id}`);
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao excluir usuário");
      }

      console.log("[HTTP RESPONSE] Excluído:", data);
      // Atualiza a lista após exclusão
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error("[HTTP ERROR] Exclusão:", err.message);
      alert(err.message);
    }
  };

  return (
    <div className="listar-container">
      <div className="listar-card">
        <header className="listar-header">
          <h1 className="listar-title">Usuários</h1>
          <Link href="/usuario/criar" className="btn-new">
            + Cadastrar Novo
          </Link>
        </header>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Carregando dados...</p>
        ) : usuarios.length === 0 ? (
          <div className="no-data">Nenhum usuário cadastrado no PostgreSQL.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      <span className={`status-badge ${user.status ? "active" : "inactive"}`}>
                        {user.status ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link href={`/usuario/atualizar/${user.id}`} className="btn-edit">
                          Editar
                        </Link>
                        <button onClick={() => handleDelete(user.id)} className="btn-delete">
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <Link href="/">Voltar ao Portal</Link>
        </div>
      </div>
    </div>
  );
}
