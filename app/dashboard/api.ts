// api.js
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getUserDetailsById = async (userId) => {
  if (!userId) throw new Error('User ID is required');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/details/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }
  );

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

// main.js
import { getUserDetailsById } from './api.js';

async function fetchUser() {
  const userId = '12345'; // აქ ჩაწერე საჭირო მომხმარებლის ID

  try {
    const data = await getUserDetailsById(userId);
    console.log('User data:', data);

    // თუ გინდა მხოლოდ კონკრეტული ველის ჩვენება:
    console.log('User name:', data.name);
    console.log('User email:', data.email);
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

// ფუნქციის გამოძახება
fetchUser();
