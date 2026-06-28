"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "../../config";
import "./listar.css";

/**
 * LISTAGEM DE ESTUDANTES (MONGODB - COLEÇÃO STUDENT)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINTS:
 *    - Listar Todos: 'GET /estudante/all'
 *    - Excluir Registro: 'DELETE /estudante/:id'
 * 
 * --- EXIBIÇÃO DE ARQUIVOS / IMAGENS SERVIDAS: ---
 * 1. O NestJS salva o arquivo em '/pictures' localmente e expõe estaticamente em `/img/pictures/`.
 * 2. Para renderizar a imagem no frontend, montamos a URL combinando:
 *    `src={API_BASE_URL + estudante.photoUrl}`
 */
export default function ListarEstudantesPage() {
  const [estudantes, setEstudantes] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // BUSCAR ESTUDANTES
  const fetchEstudantes = async () => {
    console.log("[HTTP REQUEST] GET /estudante/all");
    try {
      const response = await fetch(`${API_BASE_URL}/estudante/all`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao listar estudantes");
      }

      console.log("[HTTP RESPONSE] Lista carregada:", data);
      setEstudantes(data);
    } catch (err: any) {
      console.error("[HTTP ERROR] Listagem Estudantes:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudantes();
  }, []);

  // EXCLUIR ESTUDANTE (MONGODB)
  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este estudante?")) return;

    // No MongoDB, a PK é retornada no campo '_id' ou 'id' dependendo do mapper
    console.log(`[HTTP REQUEST] DELETE /estudante/${id}`);
    try {
      const response = await fetch(`${API_BASE_URL}/estudante/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao excluir estudante");
      }

      console.log("[HTTP RESPONSE] Excluído:", data);
      // Atualiza a lista após exclusão
      setEstudantes(estudantes.filter((e) => e._id !== id && e.id !== id));
    } catch (err: any) {
      console.error("[HTTP ERROR] Exclusão:", err.message);
      alert(err.message);
    }
  };

  return (
    <div className="listar-container">
      <div className="listar-card">
        <header className="listar-header">
          <h1 className="listar-title">Estudantes (MongoDB)</h1>
          <Link href="/estudante/criar" className="btn-new">
            + Cadastrar Estudante
          </Link>
        </header>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Carregando dados...</p>
        ) : estudantes.length === 0 ? (
          <div className="no-data">Nenhum estudante cadastrado no MongoDB.</div>
        ) : (
          <div className="student-grid">
            {estudantes.map((est) => {
              // Garante ler o ID correto do Mongo (_id)
              const studentId = est._id || est.id;
              
              // Monta o caminho absoluto da foto servida pelo NestJS
              const imageSrc = est.photoUrl.startsWith("http") 
                ? est.photoUrl 
                : `${API_BASE_URL}${est.photoUrl}`;

              return (
                <div key={studentId} className="student-card">
                  {/* FOTO DO ESTUDANTE */}
                  <div className="student-image-container">
                    <img 
                      src={imageSrc} 
                      alt={est.name} 
                      className="student-img"
                      onError={(e) => {
                        // Fallback em caso de falha de imagem
                        (e.target as HTMLImageElement).src = "https://placehold.co/300x200?text=Sem+Foto";
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div className="student-info">
                    <h3 className="student-name">{est.name}</h3>
                    <div className="student-meta">Idade: <span>{est.age} anos</span></div>
                    <div className="student-meta">Curso: <span>{est.courseId}</span></div>
                    <div className="student-meta" style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                      ID: {studentId}
                    </div>
                  </div>

                  {/* AÇÕES */}
                  <div className="student-actions">
                    <Link href={`/estudante/atualizar/${studentId}`} className="btn-edit">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(studentId)} className="btn-delete">
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <Link href="/">Voltar ao Portal</Link>
        </div>
      </div>
    </div>
  );
}
