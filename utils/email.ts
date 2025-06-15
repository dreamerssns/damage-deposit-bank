// -----------------------------
// utils/email.ts
// -----------------------------
// Stub for sending emails—replace with your provider integration
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  console.log(`Send email to ${email} with link: ${resetLink}`);
  // TODO: integrate SendGrid, Mailgun, etc.
}
