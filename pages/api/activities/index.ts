import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const baseURL = 'http://localhost:3333'; // URL do seu backend
  
  try {
    if (req.method === 'GET') {
      const response = await axios.get(`${baseURL}/user/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      res.status(200).json(response.data);
    } else if (req.method === 'POST') {
      const response = await axios.post(`${baseURL}/activities`, req.body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      res.status(200).json(response.data);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to handle activity' });
  }
}
