import { getSession } from "next-auth/react"

export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:3001'
  }

  private async getAuthHeaders() {
    const session = await getSession()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`
    }
    
    return headers
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: Record<string, unknown>) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  // User endpoints
  async getProfile() {
    return this.request('/user/profile')
  }

  async updateProfile(userData: Record<string, unknown>) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // User sync endpoint
  async syncUser(userData: Record<string, unknown>) {
    return this.request('/user-sync', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Add more API methods as needed
  async getUsers() {
    return this.request('/users')
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`)
  }
}

// Create a singleton instance
export const apiClient = new ApiClient() 