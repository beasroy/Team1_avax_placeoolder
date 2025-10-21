import NextAuth from 'next-auth';
import  NeonAdapter  from "@auth/neon-adapter";
import Twitter from "next-auth/providers/twitter";
import { Pool } from '@neondatabase/serverless';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';
import { users } from '@/app/db/schema';


const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: NeonAdapter(pool),
  secret: process.env.AUTH_SECRET,
  providers: [
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter" && profile) {
        try {
          // Extract Twitter data
          const twitterData = profile.data as {
            id: string;
            username: string;
            name: string;
            profile_image_url: string;
          };

          // Update user with Twitter username and ID
          await db.update(users)
            .set({
              username: twitterData.username, // Twitter handle like "0xSarnavo"
              twitterId: twitterData.id,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

          console.log("✅ Updated user with Twitter data:", {
            name: twitterData.name,
            username: twitterData.username,
          });
        } catch (error) {
          console.error("❌ Error updating user:", error);
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-ignore
        session.user.username = user.username;
        // @ts-ignore
        session.user.level = user.level || 1;
        // @ts-ignore
        session.user.exp = user.exp || 0;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
  debug: true,
});