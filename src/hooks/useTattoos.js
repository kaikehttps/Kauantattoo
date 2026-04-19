import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { TattooService } from '../services/tattooService'

const TattooContext = createContext(null)

export const TattooProvider = ({ children }) => {
  const [tattoos, setTattoos] = useState({
    realismo: [],
    arteSacra: [],
    blackwork: [],
    outros: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTattoos = useCallback(async () => {
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
  }, [])

  const uploadTattoo = useCallback(async (file, category, metadata = {}) => {
    try {
      setError(null)
      const uploadResult = await TattooService.uploadImage(file, category, metadata)
      const tattooData = {
        image_url: uploadResult.url,
        image_path: uploadResult.path,
        category,
        alt: metadata.alt || 'Nova tattoo',
        price: metadata.price || null,
        description: metadata.description || null
      }
      const savedTattoo = await TattooService.saveTattoo(tattooData)
      await loadTattoos()
      return savedTattoo
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [loadTattoos])

  const deleteTattoo = useCallback(async (id, imagePath) => {
    try {
      setError(null)
      await TattooService.deleteTattoo(id, imagePath)
      await loadTattoos()
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [loadTattoos])

  const updateTattoo = useCallback(async (id, updates) => {
    try {
      setError(null)
      const updatedTattoo = await TattooService.updateTattoo(id, updates)
      await loadTattoos()
      return updatedTattoo
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [loadTattoos])

  useEffect(() => {
    loadTattoos()
  }, [loadTattoos])

  const value = useMemo(() => ({
    tattoos,
    loading,
    error,
    uploadTattoo,
    deleteTattoo,
    updateTattoo,
    reloadTattoos: loadTattoos
  }), [tattoos, loading, error, uploadTattoo, deleteTattoo, updateTattoo, loadTattoos])

  return (
    <TattooContext.Provider value={value}>
      {children}
    </TattooContext.Provider>
  )
}

export const useTattoos = () => {
  const context = useContext(TattooContext)
  if (!context) {
    throw new Error('useTattoos must be used inside a TattooProvider')
  }
  return context
}
