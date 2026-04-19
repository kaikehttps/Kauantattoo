import React, { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Upload, X, Loader2 } from 'lucide-react'
import { useTattoos } from '../hooks/useTattoos'
import { useToast } from '../hooks/use-toast'

const TattooUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [category, setCategory] = useState('')
  const [alt, setAlt] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const { uploadTattoo } = useTattoos()
  const { toast } = useToast()

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedFile || !category) {
      toast({
        title: "Erro",
        description: "Selecione uma imagem e categoria.",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    try {
      await uploadTattoo(selectedFile, category, {
        alt: alt || 'Nova tattoo',
        price: price ? parseFloat(price) : null,
        description: description || null
      })

      toast({
        title: "Sucesso!",
        description: "Tattoo adicionada com sucesso.",
      })

      // Reset form
      clearSelection()
      setCategory('')
      setAlt('')
      setPrice('')
      setDescription('')

    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da tattoo.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Adicionar Nova Tattoo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label htmlFor="image">Imagem da Tattoo</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearSelection()
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">
                    Clique para selecionar ou arraste uma imagem aqui
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG até 10MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Selecione uma categoria</option>
              <option value="realismo">Realismo</option>
              <option value="arteSacra">Arte Sacra</option>
              <option value="blackwork">Blackwork</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <Label htmlFor="alt">Texto Alternativo (Alt)</Label>
            <Input
              id="alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Descrição da tattoo para acessibilidade"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Preço (opcional)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais sobre a tattoo"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={uploading || !selectedFile || !category}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fazendo upload...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Adicionar Tattoo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default TattooUpload