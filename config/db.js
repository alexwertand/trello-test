module.exports = {
    db: {
        uri: "mongodb://localhost:27017/myapp",
        connect: {
            config: {
                autoIndex: false
            },
            useNewUrlParser: true
        }
    }
};