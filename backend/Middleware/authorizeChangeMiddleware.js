const hierarchyTree = "../data/hierarchyTree.js"

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
