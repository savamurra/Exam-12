import path from "path";

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, "public"),
  db: "mongodb://localhost:27017/exam-12",
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secretId: process.env.GOOGLE_SECRET,
  },
};

export default config;
