"use client";

import { useEffect, useState } from "react";
import { getProjectsByUserId, ProjectDTO } from "@/services/project.service";
import { getCurrentUser, User } from "@/services/auth.service";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const projectsData = await getProjectsByUserId(currentUser.id);
        setProjects(projectsData);
      } catch {
        setError("Error al cargar los datos. Por favor, inicia sesión.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white border border-border/30 rounded-2xl shadow-md p-8 w-full">
      <h1 className="text-2xl font-bold text-primary mb-6">Mis proyectos</h1>

      {loading && <p className="text-secondary mb-4">Cargando proyectos...</p>}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div className="text-third mb-4 text-center">
          No tienes proyectos aún.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-dark border border-border/30 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-primary">
                {project.name}
              </h2>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  project.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : project.status === "INACTIVE"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
              {project.description}
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Inicio: {project.startDate}</p>
              <p>Fin: {project.endDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
