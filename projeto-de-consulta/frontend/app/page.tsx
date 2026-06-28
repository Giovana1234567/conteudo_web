"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./home.css";

/**
 * PORTAL PRINCIPAL (DASHBOARD DO SISTEMA REAL)
 * 
 * --- PROTEÇÃO DE ROTA NO SISTEMA REAL ---
 * 1. No carregamento (useEffect), verificamos se existe um token JWT no localStorage.
 * 2. Se não existir, redirecionamos imediatamente o usuário para a tela de login (/autenticacao/login).
 * 3. Se existir, o portal é liberado com todos os caminhos para as categorias do sistema.
 */
export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se existe o token no localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("[AUTH GUARD] Token não encontrado. Redirecionando para login...");
      router.push("/autenticacao/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    console.log("[AUTH LOGOUT] Limpando token e saindo...");
    localStorage.removeItem("token");
    router.push("/autenticacao/login");
  };

  // Se não estiver autenticado, não renderiza o menu para evitar flash de tela
  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ color: "var(--text-secondary)" }}>Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <header className="portal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1200px", marginBottom: "3.5rem" }}>
        <div>
          <h1 className="portal-title" style={{ textAlign: "left", marginBottom: "0.2rem" }}>WEB II - Portal de Consulta</h1>
          <p className="portal-subtitle" style={{ textAlign: "left" }}>Selecione uma das opções abaixo para gerenciar as categorias.</p>
        </div>
        <button onClick={handleLogout} className="btn-logout" style={{
          padding: "0.6rem 1.2rem",
          borderRadius: "8px",
          backgroundColor: "var(--danger-accent)",
          color: "#ffffff",
          fontWeight: 600,
          fontSize: "0.95rem",
          transition: "background-color 0.2s ease"
        }}>
          Sair do Sistema
        </button>
      </header>

      <main className="modules-grid">
        {/* MÓDULO PERFIL */}
        <section className="module-card">
          <div className="module-icon-container">🔑</div>
          <h2 className="module-title">Minha Conta</h2>
          <ul className="links-list">
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/autenticacao/perfil">Visualizar Meu Perfil & CEP</Link>
            </li>
          </ul>
        </section>

        {/* MÓDULO USUÁRIO (POSTGRESQL) */}
        <section className="module-card">
          <div className="module-icon-container">👤</div>
          <h2 className="module-title">Usuários (Postgres)</h2>
          <ul className="links-list">
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/usuario/criar">Cadastrar Usuário</Link>
            </li>
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/usuario/listar">Listar Usuários</Link>
            </li>
          </ul>
        </section>

        {/* MÓDULO AULA (POSTGRESQL FK) */}
        <section className="module-card">
          <div className="module-icon-container">📚</div>
          <h2 className="module-title">Aulas (Postgres FK)</h2>
          <ul className="links-list">
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/aula/criar">Agendar Aula</Link>
            </li>
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/aula/listar">Listar Aulas</Link>
            </li>
          </ul>
        </section>

        {/* MÓDULO ESTUDANTE (MONGODB) */}
        <section className="module-card">
          <div className="module-icon-container">🎓</div>
          <h2 className="module-title">Estudantes (MongoDB)</h2>
          <ul className="links-list">
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/estudante/criar">Cadastrar Estudante (Upload)</Link>
            </li>
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/estudante/listar">Listar Estudantes</Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
