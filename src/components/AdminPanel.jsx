import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Upload, Grid, BarChart3, Trash2 } from 'lucide-react';
import TattooUpload from './TattooUpload';
import { useTattoos } from '../hooks/useTattoos';
import { useToast } from '../hooks/use-toast';

const AdminPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const { tattoos, loading, deleteTattoo } = useTattoos();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleDeleteTattoo = async (tattooId) => {
    if (window.confirm('Tem certeza que deseja excluir esta tattoo?')) {
      try {
        await deleteTattoo(tattooId);
        toast({
          title: "Sucesso",
          description: "Tattoo excluída com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir tattoo.",
          variant: "destructive",
        });
      }
    }
  };

  const getTotalTattoos = () => {
    return Object.values(tattoos || {}).reduce((total, category) => total + category.length, 0);
  };

  const getCategoryStats = () => {
    const stats = {};
    Object.entries(tattoos || {}).forEach(([category, items]) => {
      stats[category] = items.length;
    });
    return stats;
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <h3>Painel Administrativo</h3>
          <button onClick={onClose} className="admin-close-btn">
            <X size={20} />
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="admin-tabs">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload size={16} />
              Upload
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Grid size={16} />
              Gerenciar
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="admin-tab-content">
            <Card>
              <CardHeader>
                <CardTitle>Upload de Tattoos</CardTitle>
              </CardHeader>
              <CardContent>
                <TattooUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="admin-tab-content">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Tattoos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando tattoos...</p>
                ) : (
                  <div className="manage-grid">
                    {Object.entries(tattoos || {}).map(([category, items]) => (
                      <div key={category} className="category-section">
                        <h4 className="category-title">{category} ({items.length})</h4>
                        <div className="tattoos-grid">
                          {items.map((tattoo) => (
                            <div key={tattoo.id} className="tattoo-item">
                              <img
                                src={tattoo.image_url}
                                alt={tattoo.alt}
                                className="tattoo-thumb"
                              />
                              <div className="tattoo-actions">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteTattoo(tattoo.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="admin-tab-content">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{getTotalTattoos()}</div>
                    <div className="stat-label">Total de Tattoos</div>
                  </div>
                  {Object.entries(getCategoryStats()).map(([category, count]) => (
                    <div key={category} className="stat-item">
                      <div className="stat-number">{count}</div>
                      <div className="stat-label">{category}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
