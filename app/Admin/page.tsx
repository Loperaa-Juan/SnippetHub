"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Chart from "chart.js/auto";
import {
  UserRoundCheck,
  UsersRound,
  FileCheck2,
  UserCheck2,
  Newspaper,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

const DashboardAdminPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSnippets: 0,
    totalPublicaciones: 0,
    totalComentarios: 0,
    snippetsAprobados: 0,
    usuariosActivos: 0,
    barrasDiagrama: "",
    tortaDiagrama: ""

  });
  const [loading, setLoading] = useState(true);


  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartInstanceRef = useRef<Chart | null>(null);
  const pieChartInstanceRef = useRef<Chart | null>(null);


  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      setLoading(false);
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

        setStats({
          totalUsers: data.total_usuarios,
          totalSnippets: data.total_snippets,
          totalPublicaciones: data.total_publicaciones,
          totalComentarios: data.total_comentarios,
          snippetsAprobados: data.snippets_aprobados,
          usuariosActivos: data.usuarios_activos,
          barrasDiagrama: data.barras,
          tortaDiagrama: data.torta
        });

      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

        

    fetchStats();
  }, []);

  useEffect(() => {
    const barCtx = barChartRef.current?.getContext("2d");

    if (barCtx && barChartInstanceRef.current) {
      barChartInstanceRef.current.destroy();
    }

  }, [stats, loading]);

  useEffect(() => {
    if (loading || !stats.totalUsers) return;
  
    const barCtx = barChartRef.current?.getContext("2d");
    const pieCtx = pieChartRef.current?.getContext("2d");
  
    // 🧨 DESTRUIR instancias anteriores si existen
    if (barChartInstanceRef.current) {
      barChartInstanceRef.current.destroy();
      barChartInstanceRef.current = null;
    }
    if (pieChartInstanceRef.current) {
      pieChartInstanceRef.current.destroy();
      pieChartInstanceRef.current = null;
    }
  
    // 🎨 CREAR nuevos gráficos
    if (barCtx) {
      barChartInstanceRef.current = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: [
            "Usuarios",
            "Snippets",
            "Publicaciones",
            "Comentarios",
            "Aprobados",
            "Activos",
          ],
          datasets: [
            {
              label: "Totales",
              data: [
                stats.totalUsers,
                stats.totalSnippets,
                stats.totalPublicaciones,
                stats.totalComentarios,
                stats.snippetsAprobados,
                stats.usuariosActivos,
              ],
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  
    if (pieCtx) {
      pieChartInstanceRef.current = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: [
            "Usuarios",
            "Snippets",
            "Publicaciones",
            "Comentarios",
            "Aprobados",
            "Activos",
          ],
          datasets: [
            {
              data: [
                stats.totalUsers,
                stats.totalSnippets,
                stats.totalPublicaciones,
                stats.totalComentarios,
                stats.snippetsAprobados,
                stats.usuariosActivos,
              ],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [stats, loading]);
  

  const handleDownloadPDFReport = async () => {
    const doc = new jsPDF("p", "mm", "a4");
  
    
    // Portada
    doc.setFillColor(4, 18, 37); // Fondo oscuro del logo SnippetHub
    doc.rect(0, 0, 210, 297, "F"); // Fondo completo

  
  
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE ESTADÍSTICAS", 105, 80, { align: "center" });
  
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Este documento ha sido generado automáticamente por la plataforma \nadministrativa de SnippetHub\n\n", 105, 95, { align: "center" });
  
    doc.setFontSize(10);
    const date = new Date().toLocaleString();
    doc.text(`Fecha de generación: ${date}`, 105, 110, { align: "center" });
  
    doc.addPage();
  
    // Sección de Estadísticas
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RESUMEN GENERAL", 15, 20);
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
  
    const statsList = [
      ["Usuarios Registrados", stats.totalUsers],
      ["Snippets Creados", stats.totalSnippets],
      ["Publicaciones Totales", stats.totalPublicaciones],
      ["Comentarios Totales", stats.totalComentarios],
      ["Snippets Aprobados", stats.snippetsAprobados],
      ["Usuarios Activos", stats.usuariosActivos],
    ];
  
    let y = 30;
    doc.setFillColor(243, 244, 246); 
    statsList.forEach(([label, value], i) => {
      const rowY = y + i * 10;
      if (i % 2 === 0) {
        doc.setFillColor(255, 255, 255); 
      } else {
        doc.setFillColor(243, 244, 246); 
      }
       // Alternar filas
      doc.rect(15, rowY - 6, 180, 8, "F");
  
      doc.setTextColor(51);
      doc.text(`${label}:`, 20, rowY);
      doc.setFont("helvetica", "bold");
      doc.text(`${value}`, 180, rowY, { align: "right" });
      doc.setFont("helvetica", "normal");
    });
  
    // Canvas a imagen
    const barCanvas = barChartRef.current;
    const pieCanvas = pieChartRef.current;
  
    if (!barCanvas || !pieCanvas) {
      console.error("Canvas no disponible.");
      return;
    }
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
  
      const barImage = await html2canvas(barCanvas, { useCORS: true }).then((canvas) =>
        canvas.toDataURL("image/png")
      );
      const pieImage = await html2canvas(pieCanvas, { useCORS: true }).then((canvas) =>
        canvas.toDataURL("image/png")
      );
  
      // Página de Gráfico de Barras
      doc.addPage();
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Visualización: Gráfico de Barras", 15, 20);
      doc.addImage(barImage, "PNG", 15, 30, 180, 100);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(stats.barrasDiagrama, 15, 140, { maxWidth: 180, align: "justify" });


  
      // Página de Gráfico de Torta
      doc.addPage();
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Visualización: Gráfico de Torta", 15, 20);
      doc.addImage(pieImage, "PNG", 15, 30, 180, 100);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(stats.tortaDiagrama, 15, 140, { maxWidth: 180, align: "justify"});


  
      // Guardar PDF
      doc.save("reporte_estadisticas.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Error al generar el reporte. Verifica que los gráficos estén disponibles.");
    }
  };
  
  

  const StatCard = ({ title, value, Icon }) => (
    <Card>
      <CardContent className="p-6 flex justify-center items-center flex-col">
        <h2 className="mb-6 text-center text-2xl font-bold dark:neon-text">{title}</h2>
        <Icon className="mb-6 h-20 w-20 text-muted-foreground" />
        <p className="text-2xl font-bold dark:neon-text">{value}</p>
      </CardContent>
    </Card>
  );

  return (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
      <section className="border-t bg-muted/40 py-16 align-middle flex-1 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-full text-xl font-semibold">
            Cargando estadísticas y generando reporte...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                title="Usuarios Registrados"
                value={stats.totalUsers}
                Icon={UsersRound}
              />
              <StatCard
                title="Snippets Creados"
                value={stats.totalSnippets}
                Icon={FileCheck2}
              />
              <StatCard
                title="Publicaciones Totales"
                value={stats.totalPublicaciones}
                Icon={Newspaper}
              />
              <StatCard
                title="Comentarios Totales"
                value={stats.totalComentarios}
                Icon={UserRoundCheck}
              />
              <StatCard
                title="Snippets Aprobados"
                value={stats.snippetsAprobados}
                Icon={FileCheck2}
              />
              <StatCard
                title="Usuarios Activos"
                value={stats.usuariosActivos}
                Icon={UserCheck2}
              />
            </div>
            <div className="flex justify-center items-center flex-col mb-10">
              <Button className="dark:neon-text" onClick={handleDownloadPDFReport}>
                Descargar Reporte en PDF
              </Button>
            </div>
            <div
              style={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -1,
                width: 400,
                height: 400,
                overflow: "hidden",
              }}
            >
              <canvas ref={barChartRef} width="400" height="400" />
              <canvas ref={pieChartRef} width="400" height="400" />
            </div>
          </>
        )}
      </section>
    </div>
  </div>
);

};

export default DashboardAdminPage;
