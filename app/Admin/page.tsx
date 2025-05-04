"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Chart from "chart.js/auto";
import {
  UserPlus2,
  UserRoundCheck,
  UsersRound,
  FileCheck2,
  UserCheck2,
  Newspaper,
} from "lucide-react";

const DashboardAdminPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSnippets: 0,
    totalPublicaciones: 0,
    totalComentarios: 0,
    snippetsAprobados: 0,
    usuariosActivos: 0,
  });
  const [loading, setLoading] = useState(true);

  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);

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
    if (loading || !stats.totalUsers) return;

    // Diagrama de Barras
    const barCtx = barChartRef.current?.getContext("2d");
    if (barCtx) {
      new Chart(barCtx, {
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

    // Diagrama de Torta
    const pieCtx = pieChartRef.current?.getContext("2d");
    if (pieCtx) {
      new Chart(pieCtx, {
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

    const barCanvas = barChartRef.current;
    const pieCanvas = pieChartRef.current;

    if (!barCanvas || !pieCanvas) {
      console.error("No se pudo encontrar uno o ambos canvas.");
      return;
    }

    try {
      const barImage = await html2canvas(barCanvas, {
        useCORS: true,
        backgroundColor: "#fff",
      }).then((canvas) => canvas.toDataURL("image/png"));

      const pieImage = await html2canvas(pieCanvas, {
        useCORS: true,
        backgroundColor: "#fff",
      }).then((canvas) => canvas.toDataURL("image/png"));

      // Validar que las imágenes no estén vacías
      if (!barImage || !barImage.startsWith("data:image/png")) {
        throw new Error("Error al generar la imagen de barras.");
      }

      if (!pieImage || !pieImage.startsWith("data:image/png")) {
        throw new Error("Error al generar la imagen de torta.");
      }

      doc.addPage();
      doc.text("Diagrama de Barras", 20, 20);
      doc.addImage(barImage, "PNG", 15, 30, 180, 100);

      doc.addPage();
      doc.text("Diagrama de Torta", 20, 20);
      doc.addImage(pieImage, "PNG", 15, 30, 180, 100);

      doc.save("reporte_estadisticas.pdf");
    } catch (error) {
      console.error("Error generando imágenes para el PDF:", error);
      alert("Ocurrió un error al generar el PDF. Verifica que los gráficos estén visibles.");
    }
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
          <Button onClick={handleDownloadPDFReport}>
            Descargar Reporte en PDF
          </Button>
        </div>

        {/* Canvas ocultos pero renderizados para generar el PDF */}
        <div
          style={{
            visibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
            width: 0,
            height: 0,
            overflow: "hidden",
          }}
        >
          <canvas ref={barChartRef} width="400" height="400" />
          <canvas ref={pieChartRef} width="400" height="400" />
        </div>
      </section>
    </div>
  );
};

export default DashboardAdminPage;
