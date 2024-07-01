import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const { id } = req.query;
  const baseURL = 'http://localhost:3333'; // URL do seu backend
  
  try {
    if (req.method === 'DELETE') {
      await axios.delete(`${baseURL}/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      res.status(204).end();
    } else if (req.method === 'PUT') {
      const response = await axios.put(`${baseURL}/activities/${id}`, req.body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      res.status(200).json(response.data);
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to handle activity' });
  }
}
