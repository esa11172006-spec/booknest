export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`https://openlibrary.org${endpoint}`, options);
    
    if (!response.ok) {
      throw new ApiError(`HTTP Error: ${response.status}`, response.status);
    }
    
    return await response.json() as T;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Ошибка сети', 0);
  }
}