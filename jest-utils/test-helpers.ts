export const mockSuccessfulFetch = (data: any) => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => data,
      text: async () => JSON.stringify(data),
    })
  }
  
  export const mockFailedFetch = (error: string = 'Network error') => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error(error))
  }
  
  export const mockApiErrorFetch = (status: number = 500, statusText: string = 'Internal Server Error') => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status,
      statusText,
      json: async () => ({}),
    })
  }