import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Building2, Users, LogOut, Home } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg group-hover:shadow-md transition-all">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-extrabold text-gray-900 tracking-tight">Inmueble INC</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center text-sm font-medium text-gray-500">
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
                Hola, {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              <LogOut className="h-5 w-5 mr-1.5" />
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
