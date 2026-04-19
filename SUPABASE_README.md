# Configuração do Supabase para Tattoo Portfolio

Este guia mostra como configurar o Supabase para armazenar e gerenciar as imagens do portfólio de tattoos.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Projeto React configurado

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: `tattoo-portfolio` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima (ex: São Paulo, Brazil)
4. Clique em "Create new project"
5. Aguarde a criação do projeto (cerca de 2 minutos)

## 🗄️ Passo 2: Configurar o Banco de Dados

1. No painel do Supabase, vá para **SQL Editor**
2. Copie e execute o conteúdo do arquivo `supabase-setup.sql`
3. Verifique se as tabelas foram criadas corretamente em **Table Editor**

## 🔑 Passo 3: Obter as Credenciais

1. No painel do Supabase, vá para **Settings > API**
2. Copie os valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

1. Renomeie o arquivo `.env.example` para `.env.local`
2. Substitua os valores pelas suas credenciais:

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📁 Passo 5: Configurar Storage Bucket

O bucket `tattoo-images` já foi criado pelo script SQL, mas você pode verificar:

1. Vá para **Storage** no painel do Supabase
2. Verifique se existe o bucket `tattoo-images`
3. As políticas de segurança já estão configuradas

## 🔐 Passo 6: Configurar Autenticação (Opcional)

Para maior segurança, você pode configurar autenticação:

1. Vá para **Authentication > Settings**
2. Configure os provedores de login desejados
3. Ajuste as políticas RLS conforme necessário

## 📤 Como Usar no Código

### Upload de Imagem
```javascript
import { useTattoos } from '../hooks/useTattoos';

const { uploadTattoo } = useTattoos();

// No seu componente
const handleUpload = async (file, category) => {
  await uploadTattoo(file, category, {
    alt: 'Descrição da tattoo',
    price: 150.00
  });
};
```

### Exibir Tattoos
```javascript
import { useTattoos } from '../hooks/useTattoos';

const { tattoos, loading } = useTattoos();

// tattoos será um objeto com as categorias:
// { realismo: [...], arteSacra: [...], blackwork: [...], outros: [...] }
```

## 🛠️ Estrutura do Banco de Dados

### Tabela `tattoos`
- `id`: UUID (chave primária)
- `image_url`: URL pública da imagem
- `image_path`: Caminho no storage
- `category`: Categoria (realismo, arteSacra, blackwork, outros)
- `alt`: Texto alternativo para acessibilidade
- `price`: Preço (opcional)
- `description`: Descrição (opcional)
- `created_at`: Data de criação
- `updated_at`: Data de atualização

## 🔒 Segurança

- **Row Level Security (RLS)** está habilitado
- Políticas configuradas para leitura pública
- Upload, edição e exclusão requerem autenticação
- Storage bucket é público para leitura, mas protegido para escrita

## 🚀 Próximos Passos

1. Teste o upload de imagens através do painel admin
2. Verifique se as imagens aparecem no portfólio
3. Configure backup automático no Supabase
4. Monitore o uso através do dashboard

## 🆘 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env.local` existe
- Confirme se as variáveis estão corretas

### Erro: "Bucket not found"
- Execute novamente o script SQL
- Verifique se o bucket foi criado em Storage

### Imagens não carregam
- Verifique as políticas de storage
- Confirme se o bucket é público
- Verifique os URLs das imagens

## 📞 Suporte

Para mais informações, consulte a [documentação do Supabase](https://supabase.com/docs).