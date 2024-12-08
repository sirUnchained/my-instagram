const ChatModel = require("../../models/chat.model");
const userModel = require("./../../models/user.model");

exports.showChatsView = async (req, res, next) => {
  try {
    const user = req.user;
    return res.render("chat/chat.ejs", {
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.searchForChat = async (req, res, next) => {
  try {
    const { username } = req.query;
    const user = req.user;

    if (username?.trim().length == 0) {
      return res.status(200).json(null);
    }

    const result = await ChatModel.findOne({
      $or: [
        { creators: `${user.username}_${username}` },
        { creators: `${username}_${user.username}` },
      ],
    })
      .populate({
        path: "messages.sender",
        model: "users",
      })
      .lean();
    // console.log(result);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.createChat = async (req, res, next) => {
  try {
    const user = req.user;
    const { username } = req.params;

    const reciver = await userModel.findOne({ username });
    if (!reciver) {
      return res.status(404).json({ msg: "reciver not found." });
    }
    if (reciver._id.toString() === user._id.toString()) {
      return res.status(400).json({ msg: "you cannot message yourself." });
    }

    const creators = `${user.username}_${reciver.username}`;
    const checkChatDuplication = await ChatModel.findOne({ creators });
    if (checkChatDuplication) {
      return res.status(400).json({ msg: "chat already exist." });
    }

    const newChat = await ChatModel.create({
      creators,
      href: `${Date.now()}-${Math.floor(Math.random() * 10e9)}`,
    });
    return res.status(201).json(newChat);
  } catch (error) {
    next(error);
  }
};
