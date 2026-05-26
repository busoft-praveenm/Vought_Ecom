import Cookies from 'js-cookie';

export async function fireBaseLogin ( firebaseToken: string ){

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/firebase-login`,
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
  if(!response.ok){
    throw new Error(
      data.message || 'Login failed'
    );
  }

  Cookies.set(
    'firebase_token',
    firebaseToken,
    {
      expires: 1,
      secure: true,
      sameSite: 'strict'
    }
  );

  return data;

}