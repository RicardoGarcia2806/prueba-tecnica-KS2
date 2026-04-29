import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Home, MapPin, DollarSign, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface House {
  id: number;
  address: string;
  price: string | number;
  status: 'disponible' | 'vendido';
  seller?: {
    id: number;
    name: string;
  };
}

const InmuebleList = () => {
  const { user } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'disponible' | 'vendido'>('todos');
  
  // Modal states for adding/editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ address: '', price: '', status: 'disponible' });

  const fetchHouses = async () => {
    try {
      const response = await api.get('/houses');
      setHouses(response.data);
    } catch (error) {
      console.error('Error fetching houses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este inmueble?')) {
      try {
        await api.delete(`/houses/${id}`);
        setHouses(houses.filter((house) => house.id !== id));
      } catch (error) {
        console.error('Error deleting house:', error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/houses/${editingId}`, formData);
        setHouses(houses.map(h => h.id === editingId ? { ...h, ...res.data } : h));
      } else {
        const res = await api.post('/houses', formData);
        setHouses([res.data, ...houses]);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ address: '', price: '', status: 'disponible' });
    } catch (error) {
      console.error('Error saving house:', error);
    }
  };

  const openEditModal = (house: House) => {
    setEditingId(house.id);
    setFormData({ address: house.address, price: house.price.toString(), status: house.status });
    setIsModalOpen(true);
  };

  const filteredHouses = houses.filter(house => {
    const matchesSearch = house.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || house.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por dirección..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponibles</option>
              <option value="vendido">Vendidos</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ address: '', price: '', status: 'disponible' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all transform hover:-translate-y-0.5 shadow-md"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Nuevo Inmueble
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHouses.map((house) => (
            <div key={house.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-40 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} 
                  alt="Casa" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                    house.status === 'disponible' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {house.status.toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="font-bold text-xl">${Number(house.price).toLocaleString()}</h3>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-start mb-4 text-gray-600 text-sm">
                  <MapPin className="w-5 h-5 mr-1.5 text-gray-400 flex-shrink-0" />
                  <p className="line-clamp-2">{house.address}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Registrado por: <span className="font-medium text-gray-700">{house.seller?.name || 'Usuario'}</span>
                  </div>
                  <div className="flex space-x-2">
                    {(house.seller?.id === user?.id || user?.role === 'admin' || user?.role === 'editor') && (
                      <>
                        <button onClick={() => openEditModal(house)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(house.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredHouses.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No se encontraron inmuebles.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Editar Inmueble' : 'Registrar Venta'}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="disponible">Disponible</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InmuebleList;
