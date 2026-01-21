"use server";

import { cookies } from "next/headers";

export const setUserIdCookie = async (user_id: string) => {
  const cookieStore = await cookies();
  cookieStore.set("user_id", user_id);
};
