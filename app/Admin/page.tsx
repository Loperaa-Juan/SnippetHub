// app/dashboardAdmin/page.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { UserPlus2, UserRoundCheck, UsersRound, FileCheck2, UserCheck2, Newspaper } from "lucide-react";
import axios from "axios";

const DashboardAdminPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSnippets: 0,
    totalPublicaciones: 0,
    totalComentarios: 0,
    snippetsAprobados: 0,
    usuariosActivos: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
  
    const fetchStats = async () => {
      try {
        const response = await fetch("api/admin/informe", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
  
        const data = await response.json();
  
        setStats(prevStats => ({
          ...prevStats,
          totalUsers: data.total_usuarios,
          totalSnippets: data.total_snippets,
          totalPublicaciones: data.total_publicaciones,
          totalComentarios: data.total_comentarios,
          snippetsAprobados: data.snippets_aprobados,
          usuariosActivos: data.usuarios_activos,
        }));
  
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };
  
    fetchStats();
  }, []);
  

  const handleDownloadPDFReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Reporte de Estadísticas", 20, 20);

    doc.setFontSize(14);
    let y = 40;

    const statsList = [
      { label: "Usuarios Registrados", value: stats.totalUsers },
      { label: "Snippets Creados", value: stats.totalSnippets },
      { label: "Publicaciones Totales", value: stats.totalPublicaciones },
      { label: "Comentarios Totales", value: stats.totalComentarios },
      { label: "Snippets Aprobados", value: stats.snippetsAprobados },
      { label: "Usuarios Activos", value: stats.usuariosActivos },
    ];

    statsList.forEach((stat) => {
      doc.text(`${stat.label}: ${stat.value}`, 20, y);
      y += 10;
    });

    doc.save("reporte_estadisticas.pdf");
  };

  const StatCard = ({ title, value, Icon }) => (
    <Card>
      <CardContent className="p-6 flex justify-center items-center flex-col">
        <h2 className="mb-6 text-center text-2xl font-bold">{title}</h2>
        <Icon className="mb-6 h-20 w-20 text-muted-foreground" />
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>

      <section className="border-t bg-muted/40 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          <StatCard title="Usuarios Registrados" value={stats.totalUsers} Icon={UsersRound} />
          <StatCard title="Snippets Creados" value={stats.totalSnippets} Icon={FileCheck2} />
          <StatCard title="Publicaciones Totales" value={stats.totalPublicaciones} Icon={Newspaper} />
          <StatCard title="Comentarios Totales" value={stats.totalComentarios} Icon={UserRoundCheck} />
          <StatCard title="Snippets Aprobados" value={stats.snippetsAprobados} Icon={FileCheck2} />
          <StatCard title="Usuarios Activos" value={stats.usuariosActivos} Icon={UserCheck2} />

        </div>

        <div className="flex justify-center items-center flex-col mb-10">
          <Button onClick={handleDownloadPDFReport}>Descargar Reporte en PDF</Button>
        </div>
      </section>
    </div>
  );
};

export default DashboardAdminPage;
