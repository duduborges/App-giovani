import { useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function UserProfiles() {
  const { isAuthenticated, loading, user } = useUser();
  const navigate = useNavigate();

  // Verificar se o usuário está autenticado, caso contrário redirecionar para o login
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <>
      <PageMeta
        title="Perfil do Usuário | Sistema"
        description="Página de perfil do usuário"
      />
      <PageBreadcrumb pageTitle="Perfil" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Meu Perfil
        </h3>
        {user ? (
          <div className="space-y-6">
            <UserMetaCard />
            <UserInfoCard />
            <UserAddressCard />
          </div>
        ) : (
          <div className="p-4 text-center">
            Não foi possível carregar os dados do usuário.
          </div>
        )}
      </div>
    </>
  );
}