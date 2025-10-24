import NextAuth from "next-auth";
import NeonAdapter from "@auth/neon-adapter";
import Twitter from "next-auth/providers/twitter";
import Google from "next-auth/providers/google";
import { Pool } from "@neondatabase/serverless";
import { db } from "@/app/db";
import { eq } from "drizzle-orm";
import { users } from "@/app/db/schema";

const tempProfiles = new Map<string, any>();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

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
 
    async signIn({ account, profile }) {
      if (account && profile) {
        tempProfiles.set(account.providerAccountId, profile);
        console.log(`Stored profile temporarily for ${account.provider}`);
      }
      return true;
    },


    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
        session.user.level = user.level || 1;
        session.user.exp = user.exp || 0;
      }
      return session;
    },
  },

  events: {
    async linkAccount({ user, account }) {
      try {
        const storedProfile = tempProfiles.get(account.providerAccountId);
        if (!storedProfile) {
          console.log(` No stored profile found for ${account.provider}`);
          return;
        }

        if (account.provider === "twitter") {
          const twitterData = (storedProfile as any).data;
        
          const currentUser = await db
            .select()
            .from(users)
            .where(eq(users.id, user.id))
            .limit(1);

          const currentPlatforms = currentUser[0]?.connectedPlatforms || [];
          const updatedPlatforms = currentPlatforms.includes("twitter")
            ? currentPlatforms
            : [...currentPlatforms, "twitter"];

          await db
            .update(users)
            .set({
              username: twitterData.username,
              connectedPlatforms: updatedPlatforms,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

        }

        if (account.provider === "google") {
          const googleData = storedProfile as {
            email: string;
          };

          const currentUser = await db
            .select()
            .from(users)
            .where(eq(users.id, user.id))
            .limit(1);

          const currentPlatforms = currentUser[0]?.connectedPlatforms || [];
          const updatedPlatforms = currentPlatforms.includes("google")
            ? currentPlatforms
            : [...currentPlatforms, "google"];

          await db
            .update(users)
            .set({
              email: googleData.email,
              connectedPlatforms: updatedPlatforms,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

        }

        tempProfiles.delete(account.providerAccountId);
      } catch (error) {
        console.error("❌ Error updating user after linkAccount:", error);
      }
    },
  },

  session: { strategy: "database" },
  debug: true,
});
