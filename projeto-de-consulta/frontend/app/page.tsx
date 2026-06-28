"use client";

import Link from "next/link";
import "./home.css";

/**
 * PORTAL PRINCIPAL (INDEX)
 * 
 * Este arquivo serve como menu centralizador de rotas da aplicação frontend.
 * Ele contém atalhos para todas as páginas modulares de criação, listagem e atualização.
 * Na prova, você pode copiar os arquivos individuais das pastas (autenticacao, usuario, aula, estudante)
 * para obter funcionalidades isoladas e funcionais de forma imediata.
 */
export default function HomePage() {
  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1 className="portal-title">WEB II - Portal de Consulta</h1>
        <p className="portal-subtitle">Selecione uma das opções abaixo para realizar operações no sistema.</p>
      </header>

      <main className="modules-grid">
        {/* MÓDULO AUTENTICAÇÃO */}
        <section className="module-card">
          <div className="module-icon-container">🔑</div>
          <h2 className="module-title">Autenticação</h2>
          <ul className="links-list">
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/autenticacao/login">Efetuar Login</Link>
            </li>
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/autenticacao/registrar">Registrar Credenciais</Link>
            </li>
            <li className="link-item">
              <span className="link-arrow">→</span>
              <Link href="/autenticacao/perfil">Visualizar Perfil & CEP</Link>
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
