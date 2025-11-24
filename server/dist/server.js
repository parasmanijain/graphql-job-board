import express from "express";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@as-integrations/express5";
import cors from "cors";
import { readFile } from "node:fs/promises";
import { createCompanyLoader } from "./db/companies.js";
import { resolvers } from "./resolvers.js";
import { authMiddleware, handleLogin } from "./auth.js";
const PORT = 9000;
const app = express();
app.use(cors(), express.json(), authMiddleware);
app.post("/login", handleLogin);
const typeDefs = await readFile(path.resolve("./src/schema.graphql"), // point to the source file
"utf8");
/**
 * Apollo context provider
 */
async function getContext({ req }) {
    const companyLoader = createCompanyLoader();
    const context = { companyLoader };
    // auth is already correctly typed via module augmentation
    if (req.auth?.sub && req.auth.email) {
        context.user = {
            id: req.auth.sub,
            email: req.auth.email,
            companyId: "", // <-- You need to fetch this from DB if needed
        };
        // Optionally, fetch full user from DB
        // const dbUser = await getUser(req.auth.sub);
        // context.user = dbUser ? { ...dbUser } : undefined;
    }
    return context;
}
const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use("/graphql", apolloMiddleware(apolloServer, { context: getContext }));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
