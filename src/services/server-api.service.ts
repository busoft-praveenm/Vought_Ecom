import { cookies } from "next/headers";
type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'

interface ApiOptions {
  method?: HttpMethod,
  body?: any;
  params?: Record<string, any>;
  headers?: HeadersInit;
}

class ServerApiService {

  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  private buildUrl( endpoint: string, params?: Record<string, any> ){
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if(params){
      Object.entries(params,).forEach(([key, value])=>{
        if(value !== undefined && value !== null){
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}):Promise<T>{
    try{
      const { method = 'GET', body, params, headers = {} } = options;
      const url = this.buildUrl(endpoint, params);
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type':'application/json', Cookie: cookieHeader, ...headers },
        body: body ? JSON.stringify(body) : undefined
      });
      console.log('response: ', response)
      const data = await response.json();
      if(!response.ok){
        return {
          success: false,
          error:
            data?.message ||
            'API request failed',
        } as T;
      }
      return data;
    }catch(error:any){
      return { success: false, error: error.message || 'Something went wrong' } as T;
    }
    
  }

  get<T>(endpoint: string, params?: Record<string, any>){
    return this.request<T>(
      endpoint,
      {
        method: 'GET',
        params
      },
    );
  }

  post<T>(endpoint: string, body?: any, params?: Record<string, any>){
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body,
        params
      }
    );
  }

  put<T>(endpoint: string, body?: any){
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body
      }
    );
  }

  patch<T>(endpoint: string, body?: any){
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body
      }
    );
  }

  delete<T>(endpoint: string){
    return this.request<T>(
      endpoint,
      {
        method: 'DELETE'
      }
    );
  }


}

export const serverApiService = new ServerApiService();