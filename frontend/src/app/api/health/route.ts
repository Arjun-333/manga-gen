import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('http://localhost:8000/health', {
      timeout: 10000, // 10 second timeout
    });
    return Response.json(response.data);
  } catch (error) {
    console.error('Health check error:', error);
    return Response.json({ status: 'error', message: 'Backend not reachable' }, { status: 500 });
  }
}
