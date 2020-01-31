
const postController = {
    GetPosts: async (req, res, next) => {
        if (req.params.id == 1) {
            const error = new Error("omg its ahad");
            res.statusCode = 418;
            next(error);
        } else {
            res.send("kobi");
        }
    }
};

module.exports = postController;
