import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X, Upload, Grid, BarChart3, Trash2 } from 'lucide-react';
import TattooUpload from './TattooUpload';
import { useTattoos } from '../hooks/useTattoos';

const CATEGORY_LABELS = {
  realismo: 'Realismo',
  arteSacra: 'Arte Sacra',
  blackwork: 'Blackwork',
  outros: 'Outros'
};

const AdminPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const { tattoos, loading, deleteTattoo } = useTattoos();

  if (!isOpen) return null;

  const handleDeleteTattoo = async (tattooId) => {
    if (window.confirm('Tem certeza que deseja excluir esta tattoo?')) {
      try {
        await deleteTattoo(tattooId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getTotalTattoos = () => {
    return Object.values(tattoos || {}).reduce((total, items) => total + items.length, 0);
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <div>
            <h3>Painel Administrativo</h3>
            <p className="admin-subtitle">Adicione, gerencie e visualize suas tattoos rapidamente.</p>
          </div>
          <button onClick={onClose} className="admin-close-btn">
            <X size={20} />
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="admin-tabs">
          <TabsList className="admin-tabs-list">
            <TabsTrigger value="upload" className="admin-tab-trigger">
              <Upload size={16} />
              Upload
            </TabsTrigger>
            <TabsTrigger value="manage" className="admin-tab-trigger">
              <Grid size={16} />
              Gerenciar
            </TabsTrigger>
            <TabsTrigger value="stats" className="admin-tab-trigger">
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
                        <h4 className="category-title">{CATEGORY_LABELS[category] || category} ({items.length})</h4>
                        {items.length > 0 ? (
                          <div className="tattoos-grid">
                            {items.map((tattoo) => (
                              <div key={tattoo.id} className="tattoo-item">
                                <img
                                  src={tattoo.image}
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
                        ) : (
                          <p className="empty-category-text">Nenhuma tattoo nesta categoria ainda.</p>
                        )}
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
                  {Object.entries(tattoos || {}).map(([category, items]) => (
                    <div key={category} className="stat-item">
                      <div className="stat-number">{items.length}</div>
                      <div className="stat-label">{CATEGORY_LABELS[category] || category}</div>
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
