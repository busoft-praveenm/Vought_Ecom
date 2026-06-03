import Cookies from 'js-cookie';
import { apiService } from './api.service';

export async function fireBaseLogin ( firebaseToken: string ){
  console.log('login entered: ', firebaseToken)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }
  );

  const data = await response.json();
  console.log('data firebaseLogin: ', data)
  if(!response.ok){
    throw new Error(
      data.message || 'Login failed'
    );
  }

  return data;

}

export async function fireBaseLogout () {
  return apiService.post('/auth/logout');
}