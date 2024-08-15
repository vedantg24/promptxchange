import nextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@utils/database";
import User from "@models/user";

const handler = nextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async session({ session }) {
			const sessionUser = await User.findOne({ email: session.user.email });

			session.user.id = sessionUser._id.toString();

			return session;
		},
		async signIn({ profile }) {
			try {
				await connectDB();

				//Check if user exists
				const userExists = await User.findOne({ email: profile.email });

				// if not, create a new user
				if (!userExists) {
					await User.create({
						email: profile.email,
						userName: profile.name.replace(" ", "").toLowerCase(),
						image: profile.picture,
					});
				}

				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
	},
});

export { handler as GET, handler as POST };
