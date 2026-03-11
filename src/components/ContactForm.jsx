import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { MessageCircle, Instagram } from 'lucide-react';
import { studioInfo } from '../data/mock';

const ContactForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [formData, setFormData] = useState({
    name: '',
    idea: '',
    size: '',
    style: '',
    reference: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.idea) {
      toast.error('Por favor, preencha pelo menos seu nome e sua ideia!');
      return;
    }

    // Criar mensagem para WhatsApp
    const message = `Olá! Gostaria de fazer uma tatuagem:\n\n*Nome:* ${formData.name}\n*Ideia:* ${formData.idea}\n*Tamanho:* ${formData.size}\n*Estilo:* ${formData.style}\n*Referência:* ${formData.reference}`;

    const whatsappUrl = `https://wa.me/${studioInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    
    toast.success('Redirecionando para o WhatsApp...');
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    
      setFormData({
        name: '',
        idea: '',
        size: '',
        style: '',
        reference: ''
      });
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section id="contato" className="contact-section" ref={ref}>
      <div className="container">
        <div className="contact-content">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="section-heading"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5 }}
            >
              Vamos criar sua tattoo?
            </motion.h2>
            <motion.p 
              className="contact-description"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Preencha o formulário com sua ideia e entraremos em contato para agendar uma consulta.
            </motion.p>
            <motion.div 
              className="contact-details"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="contact-item">
                <a href={`https://wa.me/${studioInfo.whatsapp}`} className="contact-link contact-with-icon" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={20} className="contact-icon" />
                  <span>{studioInfo.phone}</span>
                </a>
              </div>
              <div className="contact-item">
                <a href={studioInfo.instagram} className="contact-link contact-with-icon" target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} className="contact-icon" />
                  <span>@kauank.art_tattoo</span>
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="contact-form"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6 }}
          >
            <div className="form-group">
              <Label htmlFor="name">Seu Nome *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div className="form-group">
              <Label htmlFor="idea">Sua Ideia *</Label>
              <Textarea
                id="idea"
                name="idea"
                value={formData.idea}
                onChange={handleChange}
                placeholder="Descreva a tatuagem que você deseja"
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <Label htmlFor="size">Tamanho</Label>
              <Input
                id="size"
                name="size"
                type="text"
                value={formData.size}
                onChange={handleChange}
                placeholder="Ex: 10x15cm"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="reference">Referência/Ideia</Label>
              <Textarea
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Cole links de imagens ou descreva mais detalhes"
                rows={3}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button type="submit" className="submit-button">
                Enviar pelo WhatsApp
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
