import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { recovery: true }
    });


    if (!user || !user.recovery || user.recovery.length === 0) {
      return res.status(400).json({ msg: "Invalid or expired Temporary Password" });
    }

    // Sort recovery records by creation date, descending
    const sortedRecovery = user.recovery.sort((a, b) => b.created_at - a.created_at);

    // Find the most recent valid OTP
    const validRecovery = sortedRecovery.find(rec => 
      rec.token === otp && rec.expiry > new Date()
    );

    if (!validRecovery) {
      return res.status(400).json({ msg: "Invalid or expired Temporary Password" });
    }
    
    // Delete all recovery records for this user
    await prisma.recovery.deleteMany({
      where: { user_id: user.id }
    });

    return res.status(200).json({ msg: "Verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
}
