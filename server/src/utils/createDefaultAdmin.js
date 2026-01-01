import bcrypt from "bcrypt";

export const createDefaultAdmin = async (AdminModel) => {
  const email = process.env.ADMIN_DEFAULT_EMAIL;
  const password = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!email || !password) {
    console.warn("Default admin not created: missing ADMIN_DEFAULT_EMAIL or ADMIN_DEFAULT_PASSWORD");
    return;
  }
  const existing = await AdminModel.findOne({ email });
  if (existing) return;
  const passwordHash = await bcrypt.hash(password, 10);
  await AdminModel.create({ email, passwordHash });
  console.log(`Default admin created: ${email}`);
};
