import sendClusterSpot from '../../../utils/sendClusterSpot';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { myCall, dxCall, freq, info } = req.body;
  try {
    const response = await sendClusterSpot({ myCall, dxCall, freq, info });
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
} 