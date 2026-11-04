const identifyUser = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const userEmail = req.headers['x-user-email'];
    const userName = req.headers['x-user-name'];

    if (userId) {
        req.user = {
            sub: userId,
            email: userEmail || '',
            name: userName || 'Learner',
        };
    }

    next();
};

const requireAuth = (req, res, next) => {
    if (!req.user || !req.user.sub) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required. Please sign in to perform this action.',
        });
    }
    next();
}

module.exports = {
    identifyUser,
    requireAuth
}