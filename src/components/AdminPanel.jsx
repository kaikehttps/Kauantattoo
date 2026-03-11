import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { tattooCategories as defaultCategories } from '../data/mock';

const AdminPanel = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [allImages, setAllImages] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [editingSource, setEditingSource] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    category: 'realismo',
    image: '',
    alt: '',
    price: ''
  });
  const [uploadPreview, setUploadPreview] = useState(null);

  const ADMIN_PASSWORD = 'aai0KAFuz\\£/33ygAU!';

  const loadAllImages = () => {
    const customImages = localStorage.getItem('portfolioImages');
    const customList = customImages ? JSON.parse(customImages) : [];
    
    const deletedImages = localStorage.getItem('deletedDefaultImages');
    const deletedList = deletedImages ? JSON.parse(deletedImages) : [];
    
    const allImgs = [];
    
    Object.keys(defaultCategories).forEach(category => {
      defaultCategories[category].forEach(img => {
        if (!deletedList.includes(img.id)) {
          allImgs.push({ ...img, source: 'default' });
        }
      });
    });
    
    customList.forEach(img => {
      allImgs.push({ ...img, source: 'custom' });
    });
    
    return allImgs;
  };

  useEffect(() => {
    if (isAuthenticated) {
      setAllImages(loadAllImages());
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      setActiveTab('dashboard');
    } else {
      setError('Senha incorreta');
      setPassword('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setUploadPreview(base64);
      setFormData(prev => ({ ...prev, image: base64 }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    
    if (!formData.image || !formData.alt || !formData.category || !formData.price) {
      setError('Preencha todos os campos incluindo o preço');
      return;
    }

    if (editingId) {
      if (editingSource === 'default') {
        const editedDefaults = localStorage.getItem('editedDefaultImages');
        const editedList = editedDefaults ? JSON.parse(editedDefaults) : {};
        
        editedList[editingId] = {
          ...formData,
          id: editingId,
          source: 'default'
        };
        
        localStorage.setItem('editedDefaultImages', JSON.stringify(editedList));
      } else {
        const customImages = localStorage.getItem('portfolioImages');
        const customList = customImages ? JSON.parse(customImages) : [];
        
        const updated = customList.map(img =>
          img.id === editingId ? { ...formData, id: editingId } : img
        );
        localStorage.setItem('portfolioImages', JSON.stringify(updated));
      }
      
      setEditingId(null);
      setEditingSource(null);
    } else {
      const newImage = {
        id: Date.now().toString(),
        ...formData,
        source: 'custom'
      };
      
      const customImages = localStorage.getItem('portfolioImages');
      const customList = customImages ? JSON.parse(customImages) : [];
      const updated = [...customList, newImage];
      localStorage.setItem('portfolioImages', JSON.stringify(updated));
    }

    window.dispatchEvent(new Event('portfolioUpdated'));
    setAllImages(loadAllImages());
    setFormData({ id: '', category: 'realismo', image: '', alt: '', price: '' });
    setUploadPreview(null);
    setError('');
  };

  const handleEdit = (image) => {
    setFormData(image);
    setEditingId(image.id);
    setEditingSource(image.source);
    if (image.image && image.image.startsWith('data:')) {
      setUploadPreview(image.image);
    }
    setActiveTab('images');
  };

  const handleDelete = (id, source) => {
    if (window.confirm('Tem certeza que deseja deletar esta imagem?')) {
      if (source === 'default') {
        const deletedImages = localStorage.getItem('deletedDefaultImages');
        const deletedList = deletedImages ? JSON.parse(deletedImages) : [];
        
        if (!deletedList.includes(id)) {
          deletedList.push(id);
        }
        
        localStorage.setItem('deletedDefaultImages', JSON.stringify(deletedList));
      } else {
        const customImages = localStorage.getItem('portfolioImages');
        const customList = customImages ? JSON.parse(customImages) : [];
        
        const updated = customList.filter(img => img.id !== id);
        localStorage.setItem('portfolioImages', JSON.stringify(updated));
      }
      
      window.dispatchEvent(new Event('portfolioUpdated'));
      setAllImages(loadAllImages());
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError('');
    setEditingId(null);
    setEditingSource(null);
    setFormData({ id: '', category: 'realismo', image: '', alt: '', price: '' });
    setUploadPreview(null);
    setActiveTab('dashboard');
    onClose();
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Styles
  const panelStyles = {
    background: '#18181b',
    color: '#ffffff',
    borderColor: '#27272a'
  };

  const inputStyles = {
    background: '#27272a',
    borderColor: '#3f3f46',
    color: '#ffffff'
  };

  const buttonPrimary = {
    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    color: '#ffffff'
  };

  const buttonDanger = {
    background: '#dc2626',
    color: '#ffffff'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            style={{
              background: panelStyles.background,
              borderColor: panelStyles.borderColor,
              borderWidth: '1px',
              borderRadius: '12px'
            }}
            className="w-full max-w-2xl max-h-[90vh] overflow-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              borderBottom: `1px solid ${panelStyles.borderColor}`,
              position: 'sticky',
              top: 0,
              background: panelStyles.background,
              zIndex: 10
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
                {isAuthenticated ? 'Painel Admin' : 'Acesso Admin'}
              </h2>
              <button
                onClick={onClose}
                style={{
                  padding: '0.25rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} color="#a1a1aa" />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {!isAuthenticated ? (
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#a1a1aa',
                      marginBottom: '0.5rem'
                    }}>
                      Senha de Administrador
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite a senha"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: `1px solid ${inputStyles.borderColor}`,
                        background: inputStyles.background,
                        color: inputStyles.color,
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <div style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '500' }}>{error}</div>
                  )}
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      ...buttonPrimary
                    }}
                  >
                    Entrar
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid #8B5CF6',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <p style={{ color: '#8B5CF6', fontWeight: '600' }}>
                      ✓ Autenticado com sucesso
                    </p>
                  </div>

                  {/* Tabs */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    borderBottom: `1px solid ${panelStyles.borderColor}`,
                    paddingBottom: '0.5rem'
                  }}>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      style={{
                        padding: '0.5rem 1rem',
                        fontWeight: '500',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: activeTab === 'dashboard' ? '#8B5CF6' : '#a1a1aa',
                        borderBottom: activeTab === 'dashboard' ? '2px solid #8B5CF6' : '2px solid transparent'
                      }}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('images')}
                      style={{
                        padding: '0.5rem 1rem',
                        fontWeight: '500',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: activeTab === 'images' ? '#8B5CF6' : '#a1a1aa',
                        borderBottom: activeTab === 'images' ? '2px solid #8B5CF6' : '2px solid transparent'
                      }}
                    >
                      Gerenciar Imagens
                    </button>
                  </div>

                  {/* Dashboard Tab */}
                  {activeTab === 'dashboard' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{
                        background: inputStyles.background,
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}>
                        <h3 style={{ fontWeight: '600', color: '#ffffff' }}>Informações do Site:</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                          <p style={{ color: '#a1a1aa' }}><strong style={{ color: '#ffffff' }}>Versão:</strong> 1.0.0</p>
                          <p style={{ color: '#a1a1aa' }}><strong style={{ color: '#ffffff' }}>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                          <p style={{ color: '#a1a1aa' }}><strong style={{ color: '#ffffff' }}>Total de Imagens:</strong> {allImages.length}</p>
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem'
                      }}>
                        <h3 style={{ fontWeight: '600', color: '#8B5CF6', marginBottom: '0.5rem' }}>Funcionalidades:</h3>
                        <ul style={{ fontSize: '0.875rem', color: '#a1a1aa', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <li>✓ Adicionar novas imagens ao portfólio</li>
                          <li>✓ Editar imagens existentes</li>
                          <li>✓ Excluir qualquer imagem</li>
                          <li>✓ Upload de imagens do dispositivo</li>
                          <li>✓ Organizar por categorias</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Images Tab */}
                  {activeTab === 'images' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <form onSubmit={handleAddImage} style={{
                        background: inputStyles.background,
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}>
                        <h3 style={{ fontWeight: '600', color: '#ffffff' }}>
                          {editingId ? 'Editar Imagem' : 'Adicionar Nova Imagem'}
                        </h3>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#a1a1aa',
                            marginBottom: '0.25rem'
                          }}>
                            Categoria
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              border: `1px solid ${inputStyles.borderColor}`,
                              background: panelStyles.background,
                              color: '#ffffff',
                              fontSize: '1rem',
                              outline: 'none'
                            }}
                          >
                            <option value="realismo">Realismo</option>
                            <option value="arteSacra">Arte Sacra</option>
                            <option value="blackwork">Blackwork</option>
                            <option value="outros">Outros</option>
                          </select>
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#a1a1aa',
                            marginBottom: '0.25rem'
                          }}>
                            Upload de Imagem
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer'
                              }}
                            />
                            <div style={{
                              padding: '0.75rem 1rem',
                              border: `1px solid ${inputStyles.borderColor}`,
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              background: panelStyles.background,
                              color: '#a1a1aa',
                              cursor: 'pointer'
                            }}>
                              <Upload size={18} color="#8B5CF6" />
                              <span>
                                {uploadPreview ? 'Imagem carregada ✓' : 'Clique para selecionar uma imagem'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {uploadPreview && (
                          <div style={{ border: `1px solid ${inputStyles.borderColor}`, borderRadius: '8px', padding: '0.5rem' }}>
                            <img 
                              src={uploadPreview} 
                              alt="Preview" 
                              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                          </div>
                        )}

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#a1a1aa',
                            marginBottom: '0.25rem'
                          }}>
                            Descrição (Alt)
                          </label>
                          <input
                            type="text"
                            value={formData.alt}
                            onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                            placeholder="Descrição da tatuagem"
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              border: `1px solid ${inputStyles.borderColor}`,
                              background: panelStyles.background,
                              color: '#ffffff',
                              fontSize: '1rem',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#a1a1aa',
                            marginBottom: '0.25rem'
                          }}>
                            Preço Estimado
                          </label>
                          <input
                            type="text"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="Ex: R$ 500"
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              border: `1px solid ${inputStyles.borderColor}`,
                              background: panelStyles.background,
                              color: '#ffffff',
                              fontSize: '1rem',
                              outline: 'none'
                            }}
                          />
                        </div>

                        {error && (
                          <div style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '500' }}>{error}</div>
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="submit"
                            style={{
                              flex: 1,
                              padding: '0.75rem',
                              borderRadius: '8px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              ...buttonPrimary
                            }}
                          >
                            <Plus size={18} />
                            {editingId ? 'Salvar Alterações' : 'Adicionar Imagem'}
                          </button>
                          {editingId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditingSource(null);
                                setFormData({ id: '', category: 'realismo', image: '', alt: '', price: '' });
                                setUploadPreview(null);
                              }}
                              style={{
                                padding: '0.75rem 1rem',
                                background: '#3f3f46',
                                color: '#ffffff',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                border: 'none'
                              }}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </form>

                      {/* Lista de imagens */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h3 style={{ fontWeight: '600', color: '#ffffff' }}>
                          Todas as Imagens ({allImages.length})
                        </h3>
                        {allImages.length === 0 ? (
                          <p style={{ color: '#71717a', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                            Nenhuma imagem disponível
                          </p>
                        ) : (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '0.75rem',
                            maxHeight: '400px',
                            overflowY: 'auto'
                          }}>
                            {allImages.map((image) => (
                              <div
                                key={image.id}
                                style={{
                                  border: `1px solid ${inputStyles.borderColor}`,
                                  borderRadius: '8px',
                                  overflow: 'hidden'
                                }}
                              >
                                <img
                                  src={image.image}
                                  alt={image.alt}
                                  style={{ width: '100%', height: '128px', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%2327272a" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="%2371717a"%3EErro%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                                <div style={{ padding: '0.5rem', background: panelStyles.background, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  <p style={{ fontSize: '0.75rem', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <span style={{ fontWeight: '600', color: '#ffffff' }}>Cat:</span> {image.category}
                                  </p>
                                  <p style={{ fontSize: '0.75rem', color: '#71717a' }}>
                                    {image.source === 'default' ? '📌 Padrão' : '✨ Customizada'}
                                  </p>
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                      onClick={() => handleEdit(image)}
                                      style={{
                                        flex: 1,
                                        padding: '0.25rem',
                                        background: '#F59E0B',
                                        color: '#000000',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.25rem'
                                      }}
                                    >
                                      <Edit2 size={12} />
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => handleDelete(image.id, image.source)}
                                      style={{
                                        flex: 1,
                                        padding: '0.25rem',
                                        background: '#dc2626',
                                        color: '#ffffff',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.25rem'
                                      }}
                                    >
                                      <Trash2 size={12} />
                                      Deletar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      marginTop: '1.5rem',
                      ...buttonDanger
                    }}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;

