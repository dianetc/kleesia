import prisma from '@/lib/prisma';
import { generateTempPassword, sendEmail } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(200).json({ msg: "If the email address is valid, you will receive a one-time password." });
    }

    // Delete existing recovery records for this user
    await prisma.recovery.deleteMany({
      where: { user_id: user.id }
    });

    const tempPassword = generateTempPassword(); // We're still using the OTP function, but calling it tempPassword
    console.log('Generated Temporary Password:', tempPassword);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await prisma.recovery.create({
      data: {
        token: tempPassword,
        expiry: expiresAt,
        user: { connect: { id: user.id } }
      }
    });

    console.log('Recovery record created:', { userId: user.id, tempPassword, expiresAt });

    await sendEmail(
      email, 
      "Password Reset - Temporary Password", 
      `Your temporary password for password reset is: ${tempPassword}\n\nThis temporary password will expire in 15 minutes.`
    );

    return res.status(200).json({ msg: "If the email address is valid, you will receive a temporary password via email." });
  } catch (error) {
    console.error('Error in forget-password:', error);
    if (error.message === 'Failed to send email') {
      return res.status(500).json({ msg: "Failed to send temporary password. Please try again later." });
    }
    return res.status(500).json({ msg: "Server error" });
  }
}
