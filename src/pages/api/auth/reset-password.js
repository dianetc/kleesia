import prisma from '@/lib/prisma';
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  const { email, newPassword } = req.body;


  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { account: true }
    });


    if (!user || !user.account) {
      console.log('User or account not found');
      return res.status(400).json({ msg: "Invalid reset attempt" });
    }

    const hashedPassword = CryptoJS.SHA3(newPassword).toString(CryptoJS.enc.Hex);


    const updatedAccount = await prisma.account.update({
      where: { id: user.account.id },
      data: { password: hashedPassword }
    });

    // Verify the password was actually updated
    const verifyUpdate = await prisma.account.findUnique({
      where: { id: user.account.id }
    });

    // Delete all recovery records for this user
    await prisma.recovery.deleteMany({
      where: { user_id: user.id }
    });

    if (verifyUpdate.password !== hashedPassword) {
      return res.status(500).json({ msg: "Failed to update password" });
    }


    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error('Error in reset-password:', error);
    return res.status(500).json({ msg: "Server error" });
  }
}
