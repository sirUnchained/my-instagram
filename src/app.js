const express = require("express");
const path = require("node:path");
const app = express();

// require needed packages
const cookies = require("cookie-parser");
const session = require("cookie-session");
const flash = require("express-flash");
const helmet = require("helmet");
const cors = require("./middlewares/CORS");
const configs = require("./configENV");

// seting dependencies
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cookies());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cors);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:", configs.bucketFullURL],
        mediaSrc: ["'self'", configs.bucketFullURL],
        objectSrc: ["'none'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.0/socket.io.js",
        ],
        scriptSrcAttr: [
          "'self",
          "https:",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.0/socket.io.js",
        ],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      },
    },
  })
);

// set ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(
  session({
    secret: "some secret things",
    resave: false,
    saveUninitialized: false,
  })
);

// require routes
const homeRoutes = require("./modules/home/home.routes");
const authRoutes = require("./modules/auth/auth.routes");
const postRoutes = require("./modules/posts/posts.routes");
const storyRoutes = require("./modules/stories/stories.routes");
const profileRoutes = require("./modules/profiles/profiles.routes");
const likeRoutes = require("./modules/likes/likes.routes");
const saveRoutes = require("./modules/saves/saves.routes");
const commentRoutes = require("./modules/comments/comments.routes");
const exploreRoutes = require("./modules/explore/explore.routes");
const reportRotes = require("./modules/report/report.routes");
const notificationRoutes = require("./modules/notifications/notifications.routes");
const searchRoutes = require("./modules/search/search.routes");
const usersRoutes = require("./modules/user/user.routes");
const chatRoutes = require("./modules/chat/chat.routes");

// routes
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/story", storyRoutes);
app.use("/profile", profileRoutes);
app.use("/favorite", likeRoutes);
app.use("/bookmark", saveRoutes);
app.use("/comment", commentRoutes);
app.use("/explore", exploreRoutes);
app.use("/report", reportRotes);
app.use("/notification", notificationRoutes);
app.use("/search", searchRoutes);
app.use("/user", usersRoutes);
app.use("/message", chatRoutes);

// app.get("/message", (req, res) => {
//   return res.send("<h1>قابلیت چت اضافه خواهد شد.</h1>");
// });

app.use((req, res) => {
  return res.render("404/404");
});

// error handler
app.use((err, req, res, next) => {
  if (err.errors) {
    return res.status(400).json({ validation_errors: err.errors });
  }
  console.log(err);
  return res.status(500).send(err);
});

module.exports = app;
