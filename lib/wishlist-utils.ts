// Utility function to add product to wishlist
export const addToWishlist = async (productId: string, token?: string): Promise<boolean> => {
  try {
    const authToken = token || localStorage.getItem('token')
    if (!authToken) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`https://hoe-be.onrender.com/api/wishlist/${productId}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to add to wishlist: ${response.status}`)
    }

    const data = await response.json()
    console.log('Added to wishlist:', data)
    return true
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw error
  }
}

// Utility function to remove product from wishlist
export const removeFromWishlist = async (productId: string, token?: string): Promise<boolean> => {
  try {
    const authToken = token || localStorage.getItem('token')
    if (!authToken) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`https://hoe-be.onrender.com/api/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${authToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to remove from wishlist: ${response.status}`)
    }

    console.log('Removed from wishlist:', productId)
    return true
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw error
  }
}

// Utility function to check if product is in wishlist
export const checkWishlistStatus = async (productId: string, token?: string): Promise<boolean> => {
  try {
    const authToken = token || localStorage.getItem('token')
    if (!authToken) {
      return false
    }

    const response = await fetch('https://hoe-be.onrender.com/api/wishlist', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })

    if (!response.ok) {
      return false
    }

    const wishlistItems = await response.json()
    return wishlistItems.some((item: any) => item.product._id === productId)
  } catch (error) {
    console.error('Error checking wishlist status:', error)
    return false
  }
}
