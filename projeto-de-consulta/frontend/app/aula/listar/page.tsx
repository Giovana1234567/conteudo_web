"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "../../config";
import "./listar.css";

/**
 * LISTAGEM DE AULAS (POSTGRESQL - COM FK RELACIONAL)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINTS:
 *    - Listar Todos: 'GET /aula/all'
 *    - Excluir Registro: 'DELETE /aula/:id'
 * 
 * --- EXIBIÇÃO DE CAMPOS VINCULADOS (CHAVE ESTRANGEIRA): ---
 * Na API, o relacionamento carrega o objeto do lado "Um" (ex: aula.usuario).
 * No frontend, renderizamos usando `aula.usuario?.name || 'Não vinculado'` para evitar quebras se o objeto for nulo.
 */
export default function ListarAulasPage() {
  const [aulas, setAulas] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // BUSCAR AULAS
  const fetchAulas = async () => {
    console.log("[HTTP REQUEST] GET /aula/all");
    try {
      const response = await fetch(`${API_BASE_URL}/aula/all`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao listar aulas");
      }

      console.log("[HTTP RESPONSE] Lista carregada:", data);
      setAulas(data);
    } catch (err: any) {
      console.error("[HTTP ERROR] Listagem:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAulas();
  }, []);

  // EXCLUIR AULA
  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este agendamento?")) return;

    console.log(`[HTTP REQUEST] DELETE /aula/${id}`);
    try {
      const response = await fetch(`${API_BASE_URL}/aula/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao excluir aula");
      }

      console.log("[HTTP RESPONSE] Excluído:", data);
      // Atualiza a lista após a exclusão
      setAulas(aulas.filter((a) => a.id !== id));
    } catch (err: any) {
      console.error("[HTTP ERROR] Exclusão:", err.message);
      alert(err.message);
    }
  };

  return (
    <div className="listar-container">
      <div className="listar-card">
        <header className="listar-header">
          <h1 className="listar-title">Aulas Agendadas</h1>
          <Link href="/aula/criar" className="btn-new">
            + Agendar Aula
          </Link>
        </header>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Carregando dados...</p>
        ) : aulas.length === 0 ? (
          <div className="no-data">Nenhuma aula agendada no PostgreSQL.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Duração</th>
                  <th>Responsável (FK)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {aulas.map((aula) => (
                  <tr key={aula.id}>
                    <td>{aula.id}</td>
                    <td>{aula.name}</td>
                    <td>{aula.description}</td>
                    <td>{aula.duration} min</td>
                    <td>{aula.user ? `${aula.user.name} (${aula.user.email})` : "N/A"}</td>
                    <td>
                      <div className="action-buttons">
                        <Link href={`/aula/atualizar/${aula.id}`} className="btn-edit">
                          Editar
                        </Link>
                        <button onClick={() => handleDelete(aula.id)} className="btn-delete">
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
