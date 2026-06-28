"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../../config";
import "./perfil.css";

/**
 * TELA DE PERFIL E BUSCA DE CEP (ROTA PROTEGIDA)
 * 
 * --- CONFIGURAÇÕES DA PROVA ---
 * 1. URL DO BACKEND: Definida no arquivo 'config.ts' (API_BASE_URL).
 * 2. ENDPOINTS:
 *    - Buscar Perfil: 'GET /autenticacao/profile'
 *    - Consultar CEP: 'GET /autenticacao/cep?cep=xxxx'
 * 3. TOKEN JWT: Injetado no header das requisições via 'Authorization: Bearer <token>'
 * 
 * --- COMO ADAPTAR PARA QUALQUER ROTA PROTEGIDA DA PROVA: ---
 * Se precisar fazer requisição para qualquer rota que exige autenticação:
 * 1. Recupere o token: const token = localStorage.getItem("token")
 * 2. Adicione nos headers do fetch:
 *    headers: {
 *      "Authorization": `Bearer ${token}`
 *    }
 */
export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null);
  const [cepInput, setCepInput] = useState("");
  const [cepResult, setCepResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [cepError, setCepError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 1. RECUPERAR O TOKEN JWT SALVO NO LOCALSTORAGE
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Você precisa estar logado para acessar esta página.");
      setTimeout(() => {
        router.push("/autenticacao/login");
      }, 1500);
      return;
    }

    // 2. BUSCAR DADOS DO PERFIL DE SESSÃO
    const fetchProfile = async () => {
      console.log("[HTTP REQUEST] GET /autenticacao/profile");

      try {
        const response = await fetch(`${API_BASE_URL}/autenticacao/profile`, {
          method: "GET",
          headers: {
            // INJETAR O TOKEN JWT NO HEADER
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Sessão expirada. Faça login novamente.");
        }

        console.log("[HTTP RESPONSE] Perfil recuperado:", data);
        setProfile(data);
      } catch (err: any) {
        console.error("[HTTP ERROR] Perfil:", err.message);
        setError(err.message);
        localStorage.removeItem("token"); // Limpa o token inválido
      }
    };

    fetchProfile();
  }, [router]);

  // 3. CONSULTAR CEP VIA INTEGRADO BACKEND
  const handleCepLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCepError("");
    setCepResult(null);

    const token = localStorage.getItem("token");
    const sanitizedCep = cepInput.replace(/\D/g, "");

    if (sanitizedCep.length !== 8) {
      setCepError("O CEP deve conter exatamente 8 dígitos.");
      return;
    }

    console.log(`[HTTP REQUEST] GET /autenticacao/cep?cep=${sanitizedCep}`);

    try {
      const response = await fetch(`${API_BASE_URL}/autenticacao/cep?cep=${sanitizedCep}`, {
        method: "GET",
        headers: {
          // A rota de consulta de CEP também é protegida por JWT
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao consultar CEP");
      }

      console.log("[HTTP RESPONSE] Dados do CEP:", data);
      setCepResult(data);
    } catch (err: any) {
      console.error("[HTTP ERROR] CEP:", err.message);
      setCepError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/autenticacao/login");
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h1 className="perfil-title">Dados de Acesso</h1>

        {error && <div className="error-message">{error}</div>}

        {profile ? (
          <div>
            <div className="info-grid">
              <span className="info-label">Nome:</span>
              <span className="info-value">{profile.name}</span>

              <span className="info-label">E-mail:</span>
              <span className="info-value">{profile.email}</span>

              <span className="info-label">Identificador de Usuário (Sub):</span>
              <span className="info-value">{profile.userId}</span>
            </div>

            <button onClick={handleLogout} className="btn-logout">
              Desconectar (Sair)
            </button>

            {/* SEÇÃO CONSULTA CEP */}
            <div className="cep-section">
              <h2 className="cep-title">Consulta de Endereço (ViaCEP)</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                Insira o CEP para buscar as informações de endereço consultando a API externa via integração backend.
              </p>

              {cepError && <div className="error-message">{cepError}</div>}

              <form onSubmit={handleCepLookup} className="cep-input-group">
                <input
                  type="text"
                  maxLength={9}
                  className="cep-input"
                  placeholder="Ex: 88801-000"
                  value={cepInput}
                  onChange={(e) => setCepInput(e.target.value)}
                  required
                />
                <button type="submit" className="btn-cep">
                  Consultar
                </button>
              </form>

              {cepResult && (
                <div className="cep-results">
                  <div className="info-grid" style={{ gridTemplateColumns: "1fr 2fr", gap: "0.5rem", fontSize: "0.95rem" }}>
                    <span className="info-label">Logradouro:</span>
                    <span className="info-value">{cepResult.logradouro || "N/A"}</span>

                    <span className="info-label">Bairro:</span>
                    <span className="info-value">{cepResult.bairro || "N/A"}</span>

                    <span className="info-label">Cidade / UF:</span>
                    <span className="info-value">{cepResult.localidade} - {cepResult.uf}</span>

                    <span className="info-label">CEP:</span>
                    <span className="info-value">{cepResult.cep}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Carregando dados da sessão...</p>
        )}

        <div className="nav-links">
          <Link href="/">Voltar ao Portal</Link>
          {profile && <Link href="/usuario/listar">Ver Listagem de Usuários</Link>}
        </div>
      </div>
    </div>
  );
}
