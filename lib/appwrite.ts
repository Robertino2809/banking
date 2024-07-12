"use server";

import { Client, Account, Databases, Users } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.PUBLIC_APPWRITE_PROJECT!);

    // Extract our custom domain's session cookie from the request
    const session = cookies().get("appwrite-session");
    if (!session || !session.value) {
        throw new Error("No session");
    }

    client.setSession(session.value);

    // Return the services we want to use.
    return {
        get account() {
            return new Account(client);
        }
    };
}

export async function createAdminClient() {
  const client = new Client()
      .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.PUBLIC_APPWRITE_PROJECT!)
      .setKey(process.env.APPWRITE_KEY!); // Set the Appwrite API key!

  // Return the services we want to use.
  return {
      get account() {
          return new Account(client);
      },
      get database() {
        return new Databases(client);
      },
      get user() {
        return new Users(client);
      }
  };
}
