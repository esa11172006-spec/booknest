const BASE_URL = 'https://openlibrary.org';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchJson(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new ApiError(`HTTP Error: ${response.status}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error; // Отмена — не ошибка интерфейса
    if (error instanceof ApiError) throw error;
    
    // Если fetch упал (нет интернета)
    throw new ApiError('Ошибка сети', 0);
  }
}