"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectDTO, getProjectById } from "@/services/project.service";
import { TeamDTO, getTeamsByProject } from "@/services/team.service";
import { User, getCurrentUser } from "@/services/auth.service";
import { PlusCircle, ArrowLeft } from "lucide-react";

import { GetServerSideProps } from "next";
import { getUserFromRequest } from "@/lib/auth";

import { Settings } from "lucide-react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getUserFromRequest(context.req);

  const safeUser = user
    ? {
        id: user.id ?? null,
        email: user.email ?? null,
        name: user.name ?? null,
        role: user.role ?? null,
      }
    : null;

  return {
    props: {
      user: safeUser,
    },
  };
};

import CreateTeamModal from "@/components/frames/modals/CreateTeamModal";
import ManageTeam from "@/components/frames/ManageTeam";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const projectId = Number(id);
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [team, setTeam] = useState<TeamDTO | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showManageTeam, setShowManageTeam] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const fetchedProject = await getProjectById(projectId);
      setProject(fetchedProject);

      const teams = await getTeamsByProject(projectId);
      if (teams.length > 0) {
        setTeam(teams[0]);
      }
    };

    fetchData();
  }, [projectId]);

  const handleCreateTeamClick = () => {
    setShowModal(true);
  };

  const handleTeamCreated = (newTeam: TeamDTO) => {
    setTeam(newTeam); // ✅ actualiza el equipo en el estado
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!project) return <p className="text-secondary">Cargando proyecto...</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full mx-auto">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-6">
        {/* Botón volver */}
        <div className="bg-primary text-white p-3 rounded-full">
          <PlusCircle size={32} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">{project.name}</h1>
          <p className="text-sm text-muted-foreground text-gray-400 mt-1">
            {project.description}
          </p>
        </div>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1 text-sm text-primary hover:underline hover:cursor-pointer mb-4"
        >
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <hr className="border-border/10 my-4" />

      {/* Grupo asociado */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-third">Grupo asociado:</h2>
        {team ? (
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">{team.name}</span>

            {/* Solo muestra si el usuario actual es el líder del equipo */}
            {user?.id === team.leaderId && (
              <button
                onClick={() => setShowManageTeam(!showManageTeam)}
                className="text-primary hover:text-primary/80 hover:cursor-pointer transition"
                title="Gestionar equipo"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Este proyecto no tiene un grupo asignado.
            </span>
            <button
              onClick={handleCreateTeamClick}
              className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 hover:cursor-pointer transition"
            >
              + Crear grupo
            </button>
          </div>
        )}
      </div>

      {/* Modal de creación de equipo */}
      {showModal && (
        <CreateTeamModal
          projectId={projectId}
          onClose={() => setShowModal(false)}
          onTeamCreated={handleTeamCreated}
          userId={user?.id ?? 0}
        />
      )}

      {/* Manage team */}
      {showManageTeam && team && <ManageTeam teamId={team.id!} />}
    </div>
  );
}
