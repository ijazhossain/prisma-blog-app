import { prisma } from "../lib/prisma";
import { UserRole } from "../middilewares/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Ijaz Hossain",
      email: "ijaz.hossain1@gmail.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };
    const existUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existUser) {
      throw new Error("User already exists!");
    }
    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
}
seedAdmin();
