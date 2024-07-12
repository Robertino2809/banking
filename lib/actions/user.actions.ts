'use server';

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { parse } from "path";

export const SignIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient(); // Corrected line
    const response = await account.createEmailPasswordSession(email, password); // Corrected typo: "passowrd" to "password"
    // Further code here
  } catch (error) {
    // Error handling here
  }
};


export const SignUp = async (userData: SignUpParams) => {

  const {email, password, firstName, lastName} = userData;

  try {
    const { account } = createAdminClient();

    // Create the session using the client
    const newUserAccount: any = await account.create(
      ID.unique(), 
      email, 
      password, 
      `${firstName} ${lastName}`
    );

    const session = await account.createEmailPasswordSession(email, password);

    // Set the session cookie with the secret
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    console.log('Error', error);
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    
    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');

    await account.deleteSession
  } catch (error) {
    return null;
  }
}