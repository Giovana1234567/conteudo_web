"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../../config";
import "./criar.css";

/**
 * CADASTRO DE ESTUDANTE (MONGODB + UPLOAD DE FOTO)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINTS:
 *    - Upload de Imagem: 'POST /estudante/upload' (Multipart Form-Data com campo 'file')
 *    - Criar Estudante: 'POST /estudante' (JSON contendo o link retornado)
 * 3. DTO / CAMPOS ENVIADOS: { name, age, courseId, photoUrl }
 * 
 * --- FLUXO DE UPLOAD DE ARQUIVO EM JS PURO: ---
 * 1. Obtenha a referência do input de arquivo: `fileInput.files[0]`.
 * 2. Crie um objeto FormData: `const formData = new FormData()`.
 * 3. Anexe o arquivo usando a chave esperada pelo Multer: `formData.append("file", file)`.
 * 4. Envie o FormData via Fetch SEM definir o header Content-Type (o browser definirá automaticamente com o boundary correto).
 * 5. Pegue a URL retornada e adicione no DTO JSON final para salvar no banco.
 */
export default function CriarEstudantePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [courseId, setCourseId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let photoUrl = undefined;

      if (selectedFile) {
        console.log("[HTTP REQUEST] POST /estudante/upload (Multipart/Form-Data)");
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);

        const uploadResponse = await fetch(`${API_BASE_URL}/estudante/upload`, {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || "Falha ao realizar upload da foto");
        }

        console.log("[HTTP RESPONSE] Upload com sucesso:", uploadResult);
        photoUrl = uploadResult.url;
      }

      const studentPayload = {
        name,
        age: age !== "" ? Number(age) : undefined,
        courseId,
        photoUrl,
      };

      console.log("[HTTP REQUEST] POST /estudante:", studentPayload);

      const studentResponse = await fetch(`${API_BASE_URL}/estudante`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentPayload),
      });

      const studentResult = await studentResponse.json();

      if (!studentResponse.ok) {
        throw new Error(studentResult.message || "Falha ao salvar estudante");
      }

      console.log("[HTTP RESPONSE] Estudante salvo:", studentResult);
      setSuccess("Estudante cadastrado com sucesso!");

      setTimeout(() => {
        router.push("/estudante/listar");
      }, 1500);
    } catch (err: any) {
      console.error("[HTTP ERROR] Fluxo Estudante:", err.message);
      setError(err.message || "Erro de conexão com o servidor");
    }
  };

  return (
    <div className="criar-container">
      <div className="criar-card">
        <h1 className="criar-title">Novo Estudante</h1>
        <p className="criar-subtitle">Cadastre um estudante no banco MongoDB com upload de foto</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* NOME */}
          <div className="form-group">
            <label className="form-label">Nome do Estudante</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Pedro Henrique"
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
              placeholder="Ex: 21"
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
              placeholder="Ex: SIS-2026"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            />
          </div>

          {/* UPLOAD FOTO (MULTER INTEGRATION) */}
          <div className="form-group">
            <label className="form-label">Foto de Perfil (Opcional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-file"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="btn-submit">
            Confirmar e Enviar
          </button>
        </form>

        <div className="criar-footer">
          <Link href="/">Voltar ao Portal</Link>
          <Link href="/estudante/listar">Ver Listagem</Link>
        </div>
      </div>
    </div>
  );
}
