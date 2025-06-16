// scripts/seedAdmin.ts

// This script is used to seed the database with an admin user
// how to run it ==> node --loader ts-node/esm scripts/seedAdmin.ts
// result ==> ✅ Admin created: admin@example.com / StrongPassword123
import "dotenv/config"; // if you use a .env for MONGODB_URI
import connectDB from "../utils/db.js"; // note .js extension
import UserModel from "../models/UserModel.js"; // note .js extension
import bcrypt from "bcrypt";

async function seedAdmin() {
  await connectDB();

  const existing = await UserModel.findOne({ email: "admin@example.com" });
  if (existing) {
    console.log("Admin user already exists");
    return process.exit(0);
  }

  const passwordHash = await bcrypt.hash("StrongPassword123", 10);
  await UserModel.create({
    name: "Admin",
    email: "admin@example.com",
    passwordHash,
    role: "admin",
  });
  console.log("✅ Admin created: admin@example.com / StrongPassword123");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
