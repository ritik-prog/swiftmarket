const hierarchyTree = {
    "admin": ["seller", "user"],
    "superadmin": ["admin", "seller", "user"],
    "root": ["superadmin", "admin", "seller", "user"]
};

const authorizeChangeMiddleware = (userRole) => { // userRole is the role of the user being changed
    return (req, res, next) => {
        const { role } = req.user; // role of the user making the request
        
        if (!hierarchyTree[role].includes(userRole)) {
            return res.status(403).json({ message: `You are not authorized to perform this action on a ${userRole}` });
        }

        next();
    };
};

module.exports = authorizeChangeMiddleware;
