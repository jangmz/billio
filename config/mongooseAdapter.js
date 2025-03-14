import { ObjectId } from 'mongodb';
import User from '@/models/userModel';
import Session from '@/models/sessionModel';
import Account from '@/models/accountModel';

export default function MongooseAdapter() {
    return {
        async createUser(userData) {
            // remove undefined fields
            const cleanUserData = Object.keys(userData).reduce((acc, key) => {
                if (userData[key] !== undefined) {
                    acc[key] = userData[key];
                }
                return acc;
            }, {});

            const user = await User.create(cleanUserData);
            return user.toObject();
        },
        async getUser(id) {
            const user = await User.findById(id);
            return user?.toObject() ?? null;
        },
        async getUserByEmail(email) {
            const user = await User.findOne({ email });
            return user?.toObject() ?? null;
        },
        async createSession({ sessionToken, userId, expires }) {
            const session = await Session.create({
                sessionToken, 
                userId: new ObjectId(userId), 
                expires 
            });
            return session.toObject();
        },
        async getSessionAndUser(sessionToken) {
            const session = await Session.findOne({ sessionToken }).lean();
            if (!session) return null;

            const user = await User.findById(session.userId).lean();
            if (!user) return null;

            return { session, user };
        },
        async updateSession(session) {
            const updatedSession = await Session.findOneAndUpdate(
                { sessionToken: session.sessionToken },
                { ...session },
                { new: true }
            );

            return updatedSession?.toObject() ?? null;
        },
        async deleteSession(sessionToken) {
            await Session.findOneAndDelete({ sessionToken });
        },
        async getUserByAccount({ provider, providerAccountId }) {
            const account = await Account.findOne({ provider, providerAccountId });
            if (!account) return null;

            const user = await User.findById(account.userId);
            return user?.toObject() ?? null;
        },
        async updateUser(user) {
            const updated = await User.findByIdAndUpdate(
                user._id,
                { ...user },
                { new: true }
            );
            return updated?.toObject() ?? null;
        },
        async linkAccount(account) {
            const newAccount = await Account.create({
                ...account,
                userId: new ObjectId(account.userId)
            });
            return newAccount.toObject();
        }
    };
}