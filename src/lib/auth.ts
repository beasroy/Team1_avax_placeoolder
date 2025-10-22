import NextAuth from 'next-auth';
import  NeonAdapter  from "@auth/neon-adapter";
import Twitter from "next-auth/providers/twitter";
import Google from "next-auth/providers/google";
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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

          // Get current user to update connectedPlatforms array
          const currentUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
          const currentPlatforms = currentUser[0]?.connectedPlatforms || [];
          const updatedPlatforms = currentPlatforms.includes('twitter') 
            ? currentPlatforms 
            : [...currentPlatforms, 'twitter'];

          // Update user with Twitter username and ID
          await db.update(users)
            .set({
              username: twitterData.username, // Twitter handle like "0xSarnavo"
              twitterId: twitterData.id,
              connectedPlatforms: updatedPlatforms,
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
        } else if (account?.provider === "google" && profile) {
        try {
          // Extract Google data - only need email
          const googleData = profile as {
            email: string;
          };

          // Get current user to update connectedPlatforms array
          const currentUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
          const currentPlatforms = currentUser[0]?.connectedPlatforms || [];
          const updatedPlatforms = currentPlatforms.includes('google') 
            ? currentPlatforms 
            : [...currentPlatforms, 'google'];

          // Update user with only email and connected platforms
          await db.update(users)
            .set({
              email: googleData.email,
              connectedPlatforms: updatedPlatforms,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

          console.log("✅ Updated user with Google data:", {
            email: googleData.email,
          });
        } catch (error) {
          console.error("❌ Error updating user with Google:", error);
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