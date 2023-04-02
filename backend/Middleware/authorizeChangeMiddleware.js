const hierarchyTree = {
    "admin": ["seller", "user"],
    "superadmin": ["admin", "seller", "user"],
    "root": ["superadmin", "admin", "seller", "user"]
};

const authorizeChangeMiddleware = (userRole) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (!hierarchyTree[role].includes(userRole)) {
            return res.status(403).json({ message: `You are not authorized to perform this action on a ${userRole}` });
        }

        next();
    };
};

module.exports = authorizeChangeMiddleware;
