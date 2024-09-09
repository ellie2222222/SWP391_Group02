const mongoose = require("mongoose");
const Session = require("../models/sessionModel");

const createSession = async (data) => {
    try {
        const session = new Session(data);
        await session.save();
    } catch (error) {
        throw new Error('Failed to create session');
    }
};

const invalidateSession = async (userId, accessToken) => {
    try {
        const session = await Session.findOne({ user_id: userId, access_token: accessToken });

        let isDeleted = false
        if (session) {
            await Session.deleteOne({ _id: session._id });
            isDeleted = true
        }

        return isDeleted;
    } catch (error) {
        throw new Error(`Failed to invalidate session: ${error.message}`);
    }
};

const invalidateAllSessions = async (userId) => {
    try {
        const session = await Session.deleteMany({ user_id: userId });
    } catch (error) {
        throw new Error(`Failed to invalidate all sessions: ${error.message}`);
    }
};

const findSessionByRefreshTokenAndUpdate = async (refreshToken, newAccessToken) => {
    try {
        const session = await Session.findOneAndUpdate(
            { refresh_token: refreshToken },
            { access_token: newAccessToken },
            { new: true }
        );

        if (!session) {
            throw new Error('Session not found with the provided refresh token');
        }

        return session;
    } catch (error) {
        throw new Error(`Failed to update the session: ${error.message}`);
    }
};

const detectAndHandleSuspiciousActivity = async (user) => {
    try {
        const recentSessions = await Session.find({ user_id: user._id }).sort({ createdAt: -1 }).limit(2);
        if (recentSessions.length > 1 && recentSessions[0].ip_address !== recentSessions[1].ip_address) {
            await Session.deleteMany({ user_id: user._id });
        }
    } catch (error) {
        throw new Error('Failed to invalidate sessions')
    }
};

module.exports = {
    createSession,
    invalidateSession,
    invalidateAllSessions,
    findSessionByRefreshTokenAndUpdate,
}