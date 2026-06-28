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
 * EDIÇÃO DE ESTUDANTE (MONGODB - COLEÇÃO STUDENT)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINTS:
 *    - Obter Dados Atuais: 'GET /estudante/:id'
 *    - Upload de Foto Opcional: 'POST /estudante/upload' (se o usuário selecionar novo arquivo)
 *    - Atualizar Registro: 'PATCH /estudante/:id'
 * 3. CAMPOS ENVIADOS: { name, age, courseId, photoUrl }
 */
export default function AtualizarEstudantePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [courseId, setCourseId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // 1. CARREGAR DADOS ATUAIS DO ESTUDANTE
  useEffect(() => {
    const fetchStudent = async () => {
      console.log(`[HTTP REQUEST] GET /estudante/${id}`);
      try {
        const response = await fetch(`${API_BASE_URL}/estudante/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar estudante");
        }

        console.log("[HTTP RESPONSE] Carregado:", data);
        setName(data.name);
        setAge(data.age);
        setCourseId(data.courseId);
        setPhotoUrl(data.photoUrl);
      } catch (err: any) {
        console.error("[HTTP ERROR] Carregamento:", err.message);
        setError(err.message);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 2. ENVIAR DADOS ATUALIZADOS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let finalPhotoUrl = photoUrl;

      // ETAPA 2.1: SE SELECIONOU UM NOVO ARQUIVO, REALIZA O UPLOAD PRIMEIRO
      if (selectedFile) {
        console.log("[HTTP REQUEST] POST /estudante/upload (Novo arquivo)");
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);

        const uploadResponse = await fetch(`${API_BASE_URL}/estudante/upload`, {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || "Falha ao realizar upload da nova foto");
        }

        console.log("[HTTP RESPONSE] Novo upload com sucesso:", uploadResult);
        finalPhotoUrl = uploadResult.url;
      }

      // ETAPA 2.2: SALVA OS DADOS COM A FOTO CORRETA
      const studentPayload = {
        name,
        age: age !== "" ? Number(age) : undefined,
        courseId,
        photoUrl: finalPhotoUrl,
      };

      console.log(`[HTTP REQUEST] PATCH /estudante/${id}:`, studentPayload);

      const studentResponse = await fetch(`${API_BASE_URL}/estudante/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentPayload),
      });

      const studentResult = await studentResponse.json();

      if (!studentResponse.ok) {
        throw new Error(studentResult.message || "Falha ao atualizar estudante");
      }

      console.log("[HTTP RESPONSE] Estudante atualizado:", studentResult);
      setSuccess("Estudante atualizado com sucesso!");

      setTimeout(() => {
        router.push("/estudante/listar");
      }, 1500);
    } catch (err: any) {
      console.error("[HTTP ERROR] Fluxo Estudante:", err.message);
      setError(err.message || "Erro de conexão com o servidor");
    }
  };

  const imageSrc = photoUrl.startsWith("http") ? photoUrl : `${API_BASE_URL}${photoUrl}`;

  return (
    <div className="atualizar-container">
      <div className="atualizar-card">
        <h1 className="atualizar-title">Editar Estudante</h1>
        <p className="atualizar-subtitle">Modifique os dados do estudante (ID: {id})</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* NOME */}
          <div className="form-group">
            <label className="form-label">Nome do Estudante</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* IDADE */}
          <div className="form-group">
            <label className="form-label">Idade</label>
            <input
              type="number"
              className="form-input"
              value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              required
            />
          </div>

          {/* CURSO */}
          <div className="form-group">
            <label className="form-label">Identificador do Curso (courseId)</label>
            <input
              type="text"
              className="form-input"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            />
          </div>

          {/* FOTO ATUAL */}
          {photoUrl && (
            <div className="current-photo-container">
              <span className="form-label" style={{ marginBottom: 0 }}>Foto Atual</span>
              <img 
                src={imageSrc} 
                alt="Foto atual" 
                className="current-photo-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/300x200?text=Sem+Foto";
                }}
              />
            </div>
          )}

          {/* UPLOAD NOVA FOTO */}
          <div className="form-group" style={{ marginTop: "1.5rem" }}>
            <label className="form-label">Substituir Foto de Perfil (Opcional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-file"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="btn-submit">
            Salvar Alterações
          </button>
        </form>

        <div className="atualizar-footer">
          <Link href="/estudante/listar">Voltar à Listagem</Link>
          <Link href="/">Ir ao Portal</Link>
        </div>
      </div>
    </div>
  );
}
