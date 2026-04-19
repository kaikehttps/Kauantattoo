import { supabase, STORAGE_BUCKET, TABLES } from '../lib/supabase'

export class TattooService {
  // Check if Supabase is configured
  static isConfigured() {
    return supabase !== null && process.env.REACT_APP_SUPABASE_URL !== 'https://placeholder.supabase.co'
  }

  // Upload image to Supabase Storage
  static async uploadImage(file, category, metadata = {}) {
    if (!this.isConfigured()) {
      throw new Error('Supabase não está configurado. Configure suas credenciais primeiro.')
    }

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${category}/${fileName}`

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath)

      return {
        url: publicUrl,
        path: filePath,
        ...metadata
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  // Save tattoo data to database
  static async saveTattoo(tattooData) {
    if (!this.isConfigured()) {
      throw new Error('Supabase não está configurado. Configure suas credenciais primeiro.')
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.TATTOOS)
        .insert([tattooData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error saving tattoo:', error)
      throw error
    }
  }

  // Get all tattoos
  static async getTattoos(category = null) {
    if (!this.isConfigured()) {
      // Return empty data if not configured
      return []
    }

    try {
      let query = supabase
        .from(TABLES.TATTOOS)
        .select('*')
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching tattoos:', error)
      throw error
    }
  }

  // Get tattoos by category
  static async getTattoosByCategory() {
    if (!this.isConfigured()) {
      // Return empty categories if not configured
      return {
        realismo: [],
        arteSacra: [],
        blackwork: [],
        outros: []
      }
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.TATTOOS)
        .select('category, image_url, alt, price, created_at, id, image_path')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group by category
      const categories = {
        realismo: [],
        arteSacra: [],
        blackwork: [],
        outros: []
      }

      data.forEach(tattoo => {
        const category = tattoo.category
        if (categories[category]) {
          categories[category].push({
            id: tattoo.id,
            image: tattoo.image_url,
            image_path: tattoo.image_path,
            alt: tattoo.alt || 'Tattoo',
            price: tattoo.price,
            category: category
          })
        }
      })

      return categories
    } catch (error) {
      console.error('Error fetching tattoos by category:', error)
      throw error
    }
  }

  // Delete tattoo
  static async deleteTattoo(id, imagePath) {
    if (!this.isConfigured()) {
      throw new Error('Supabase não está configurado. Configure suas credenciais primeiro.')
    }

    try {
      // Delete from storage
      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([imagePath])

        if (storageError) {
          console.warn('Error deleting from storage:', storageError)
        }
      }

      // Delete from database
      const { error } = await supabase
        .from(TABLES.TATTOOS)
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting tattoo:', error)
      throw error
    }
  }

  // Update tattoo
  static async updateTattoo(id, updates) {
    if (!this.isConfigured()) {
      throw new Error('Supabase não está configurado. Configure suas credenciais primeiro.')
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.TATTOOS)
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating tattoo:', error)
      throw error
    }
  }

  // Delete tattoo
  static async deleteTattoo(id, imagePath) {
    if (!this.isConfigured()) {
      throw new Error('Supabase não está configurado. Configure suas credenciais primeiro.')
    }

    try {
      // Delete from storage
      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([imagePath])

        if (storageError) {
          console.warn('Error deleting from storage:', storageError)
        }
      }

      // Delete from database
      const { error } = await supabase
        .from(TABLES.TATTOOS)
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting tattoo:', error)
      throw error
    }
  }
}