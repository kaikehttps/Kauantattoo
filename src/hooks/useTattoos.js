import { useState, useEffect } from 'react'
import { TattooService } from '../services/tattooService'

export const useTattoos = () => {
  const [tattoos, setTattoos] = useState({
    realismo: [],
    arteSacra: [],
    blackwork: [],
    outros: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load tattoos from Supabase
  const loadTattoos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TattooService.getTattoosByCategory()
      setTattoos(data)
    } catch (err) {
      setError(err.message)
      console.error('Error loading tattoos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Upload new tattoo
  const uploadTattoo = async (file, category, metadata = {}) => {
    try {
      setError(null)

      // Upload image to storage
      const uploadResult = await TattooService.uploadImage(file, category, metadata)

      // Save tattoo data to database
      const tattooData = {
        image_url: uploadResult.url,
        image_path: uploadResult.path,
        category: category,
        alt: metadata.alt || 'Nova tattoo',
        price: metadata.price || null,
        description: metadata.description || null
      }

      const savedTattoo = await TattooService.saveTattoo(tattooData)

      // Reload tattoos to update the UI
      await loadTattoos()

      return savedTattoo
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Delete tattoo
  const deleteTattoo = async (id, imagePath) => {
    try {
      setError(null)
      await TattooService.deleteTattoo(id, imagePath)
      await loadTattoos()
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Update tattoo
  const updateTattoo = async (id, updates) => {
    try {
      setError(null)
      const updatedTattoo = await TattooService.updateTattoo(id, updates)
      await loadTattoos()
      return updatedTattoo
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Load tattoos on mount
  useEffect(() => {
    loadTattoos()
  }, [])

  return {
    tattoos,
    loading,
    error,
    uploadTattoo,
    deleteTattoo,
    updateTattoo,
    reloadTattoos: loadTattoos
  }
}