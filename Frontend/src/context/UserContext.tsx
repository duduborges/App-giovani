import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  facebook: string | null;
  x_com: string | null;
  linkedin: string | null;
  instagram: string | null;
  country?: string | null;
  city_state?: string | null;
  postal_code?: string | null;
  tax_id?: string | null;
  created_at: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateUserInfo: (userData: Partial<User>) => Promise<boolean>;
  updateUserAddress: (addressData: { 
    country: string | null, 
    city_state: string | null, 
    postal_code: string | null, 
    tax_id: string | null 
  }) => Promise<boolean>;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const apiUrl = "http://localhost:3000/api";

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        await fetchUser();
      } else {
        setLoading(false);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    // Não incluímos fetchUser na lista de dependências para evitar loops
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      
      if (err.response && err.response.status === 401) {
        // Token expirado ou inválido
        logout();
      }
      
      setError(
        err.response?.data?.error || "Erro ao carregar dados do usuário"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (userData: Partial<User>): Promise<boolean> => {
    setError(null);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Usuário não autenticado");
      return false;
    }

    try {
      await axios.put(
        `${apiUrl}/users/me/info`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Atualiza o estado do usuário com os novos dados
      setUser(prev => prev ? { ...prev, ...userData } : null);
      return true;
    } catch (err: any) {
      console.error("Error updating user info:", err);
      setError(
        err.response?.data?.error || "Erro ao atualizar informações do usuário"
      );
      return false;
    }
  };

  const updateUserAddress = async (addressData: { 
    country: string | null, 
    city_state: string | null, 
    postal_code: string | null, 
    tax_id: string | null 
  }): Promise<boolean> => {
    setError(null);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Usuário não autenticado");
      return false;
    }

    try {
      await axios.put(
        `${apiUrl}/users/me/address`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Atualiza o estado do usuário com os novos dados
      setUser(prev => prev ? { ...prev, ...addressData } : null);
      return true;
    } catch (err: any) {
      console.error("Error updating user address:", err);
      setError(
        err.response?.data?.error || "Erro ao atualizar endereço do usuário"
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        fetchUser,
        updateUserInfo,
        updateUserAddress,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};