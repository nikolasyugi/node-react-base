module.exports = () => {
    return {

        throwError: (err, res) => {
            console.log(err)
            let msgCustomized;

            //Mongoose errors
            switch (err.name) {
                case ("DocumentNotFoundError"):
                    err.status = 404;
                    msgCustomized = "Não encontrado";
                    break;
                case ("ValidationError"):
                    msgCustomized = `Campo ${Object.keys(err.errors)[0]} inválido`;
                    break;
            }
            res.status(err.status || 500);
            if (process.env.NODE_ENV !== "production") return res.json({ message: msgCustomized || err.message });
            else {
                if (err.status === 500) return res.json({ message: "Internal server error" });
                else if (err.status === 400) return res.json({ message: "Bad request" });
                else if (err.status === 404) return res.json({ message: "Not found" });
                else return res.json({ message: `Error ${err.status}` });
            }
        },

        routeNotFound: (next) => {
            const err = new Error("Rota não encontrada");
            err.status = 404;
            next(err);
        },

        handle: (promise) => {
            return promise
                .then(data => ([data, undefined]))
                .catch(error => Promise.resolve([undefined, error]));
        },

    }
}