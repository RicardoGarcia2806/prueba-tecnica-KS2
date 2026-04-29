import React, { useState } from 'react';
import UserList from '../components/UserList';
import InmuebleList from '../components/InmuebleList';
import { Home, Users } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'inmuebles' | 'usuarios'>('inmuebles');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Panel de Control</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona tus ventas y usuarios desde aquí.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('inmuebles')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center ${
              activeTab === 'inmuebles'
                ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5 mr-2" />
            Inmuebles
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center ${
              activeTab === 'usuarios'
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Usuarios
          </button>
        </div>
      </div>

      <div className="transition-all">
        {activeTab === 'inmuebles' ? <InmuebleList /> : <UserList />}
      </div>
    </div>
  );
};

export default Dashboard;
