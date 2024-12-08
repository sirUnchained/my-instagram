let socket = null;
let joinedChat = null;
let currentChats = [];
let lastChat = null;
let currentUser = {};
const discussions = document.querySelector(".chats-list");
const searchUserElem = document.querySelector(".search-users");
const chatBarElem = document.querySelector(".chat");
const msgSideElem = document.querySelector(".messages-chat");
const inputMsgElem = document.querySelector(".write-message");

window.addEventListener("load", async () => {
  const getUserRes = await fetch("http://localhost:4000/user/me");
  if (getUserRes.status != 200) {
    return location.href("/");
  }
  const userData = await getUserRes.json();
  currentUser = userData;

  socket = io("http://localhost:4000", {
    // query: {
    //   username: userData.user.username,
    // },
    transportOptions: {
      polling: {
        extraHeaders: {
          "Content-Type": "application/json",
          Authorization: userData.token,
        },
      },
    },
  });

  socket.on("connect", () => {
    socket.on("chats", (chats) => {
      currentChats = chats;
      insertChatsToChatList(chats);
    });
    socket.on("error", (err) => {
      console.log(err);
    });
    socket.on("sendMsg", (data) => {
      console.log("we have a message =>", data);
    });
  });
});

searchUserElem.addEventListener("input", async () => {
  const res = await fetch(
    `http://localhost:4000/user/find/?username=${searchUserElem.value}`
  );
  const users = await res.json();
  insertChatsToChatList(users);
});

function insertChatsToChatList(chats = []) {
  if (chats.length == 0) {
    if (currentChats.length == 0) {
      discussions.innerHTML =
        '<div class="alert alert-primary mt-3">no chat found.</div>';
    } else {
      discussions.innerHTML = "";
      currentChats.forEach((chat) => {
        discussions.insertAdjacentHTML(
          "beforeend",
          `
                <div class="discussion">
                  <div
                    class="photo"
                    style="
                      background-image: url(${
                        chat.avatar ? chat.avatar : "/profiles/no_profile.png"
                      });
                    "
                  >
                    <div class="online"></div>
                  </div>
                  <div class="desc-contact">
                    <p class="name">${
                      chat.creators
                        ? chat.creators
                            ?.replace(currentUser.user.username, "")
                            .replace("_", "")
                        : chat.username
                    }</p>
                    <p class="message">
                    ${chat.bio ? chat.bio : "start chat with me !"}
                    </p>
                  </div>
                  <div class="btn btn-danger" onClick="startChatWith('${
                    chat.creators
                      ? chat.creators
                          ?.replace(currentUser.user.username, "")
                          .replace("_", "")
                      : chat.username
                  }')">Chat</div>
                </div>
          `
        );
      });
    }
  } else {
    discussions.innerHTML = "";
    chats.forEach((chat) => {
      discussions.insertAdjacentHTML(
        "beforeend",
        `
              <div class="discussion">
                <div
                  class="photo"
                  style="
                    background-image: url(${
                      chat.avatar ? chat.avatar : "/profiles/no_profile.png"
                    });
                  "
                >
                  <div class="online"></div>
                </div>
                <div class="desc-contact">
                  <p class="name">${
                    chat.creators
                      ? chat.creators
                          ?.replace(currentUser.user.username, "")
                          .replace("_", "")
                      : chat.username
                  }</p>
                  <p class="message">
                    ${chat.bio ? chat.bio : "start chat with me !"}
                  </p>
                </div>
                <div class="btn btn-danger" onClick="startChatWith('${
                  chat.creators
                    ? chat.creators
                        ?.replace(currentUser.user.username, "")
                        .replace("_", "")
                    : chat.username
                }')">chat</div>
              </div>
        `
      );
    });
  }
}

async function startChatWith(username) {
  document.querySelector(".footer-chat")?.remove();
  msgSideElem.innerHTML = "";
  chatBarElem.insertAdjacentHTML(
    "beforeend",
    `
          <div class="footer-chat position-absolute" style="width:95%;">
            <button class="emoji-select">
              <i class="fa-regular fa-face-smile"></i>
            </button>
            <input
              type="text"
              class="write-message"
              placeholder="Type your message here"
            />
            <i
              class="icon send fa-regular fa-paper-plane clickable"
              onclick="sendmsg('${username}')"
              aria-hidden="true"
            ></i>
          </div>
    `
  );
  const res = await fetch(
    `http://localhost:4000/message/find/?username=${username}`
  );
  let chat = await res.json();

  if (chat) {
    chat.messages.forEach((msg) => {
      msgSideElem.insertAdjacentHTML(
        "beforeend",
        `
        <div style="width:100%" data-set-msgid="${
          msg._id
        }" class="position-relative mt-2">
          <div style="width:50%; ${
            msg.sender?._id.toString() === currentUser.user?._id.toString()
              ? ""
              : "margin-left: 22rem;"
          }" class="${
          msg.sender?._id.toString() === currentUser.user?._id.toString()
            ? "bg-danger p-2 text-white rounded"
            : "bg-primary p-2 text-white rounded "
        }">
<h1 style="font-size: 20px;display: flex;justify-content: space-between;">
            <div style="
    width: 10rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
">
                        ${
                          msg.sender?._id.toString() ===
                          currentUser.user?._id.toString()
                            ? "You"
                            : msg.sender.username
                        }
            </div>
            ${
              msg.sender?._id.toString() === currentUser.user?._id.toString()
                ? `<span onClick="removeMsg(event)"data-set-msgid="${msg._id}" style="margin-left: rem; cursor:pointer;">del</span>`
                : ""
            }
            </h1>
            <h2 class="pt-2 ps-2">${msg.body}</h2>
          </div>
        </div>
        `
      );
    });

    if (lastChat !== chat.href) {
      joinedChat = io(`http://localhost:4000/chat`, {
        auth: {
          chatHref: chat.href,
        },
      });
      lastChat = chat.href;
    }

    joinedChat.on("connect", () => {
      joinedChat.emit("joining", chat.href);

      joinedChat.on("sendMsg", (msg) => {
        msgSideElem.insertAdjacentHTML(
          "beforeend",
          `
            <div style="width:100%" class="position-relative mt-2">
              <div style="width:50%; ${
                msg.sender?._id.toString() === currentUser.user?._id.toString()
                  ? ""
                  : "margin-left: 22rem;"
              }" class="${
            msg.sender?._id.toString() === currentUser.user?._id.toString()
              ? "bg-danger p-2 text-white rounded"
              : "bg-primary p-2 text-white rounded "
          }">
              <h1 style="font-size: 20px;display: flex;justify-content: space-between;">
                          <div style="
                  width: 10rem;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
              ">
                          ${
                            msg.sender?._id.toString() ===
                            currentUser.user?._id.toString()
                              ? "You"
                              : msg.sender.username
                          }
              </div>
  
              ${
                msg.sender?._id.toString() === currentUser.user?._id.toString()
                  ? `<span onClick='removeMsg(event)'data-set-msgid='${msg._id}' style='margin-left: rem; cursor:pointer;'>del</span>`
                  : ""
              }
              </h1>
                <h2 class="pt-2 ps-2">${msg.body}</h2>
              </div>
            </div>
            `
        );
      });
    });
  } else {
    const res = await fetch(`http://localhost:4000/message/new/${username}`);
    chat = await res.json();

    joinedChat = io(`http://localhost:4000/chat`, {
      auth: {
        chatHref: chat.href,
      },
    });
    joinedChat.on("connect", () => {
      joinedChat.emit("joining", chat.href);

      joinedChat.on("sendMsg", (msg) => {
        msgSideElem.insertAdjacentHTML(
          "beforeend",
          `
          <div style="width:100%" class="position-relative mt-2">
            <div style="width:50%; ${
              msg.sender?._id.toString() === currentUser.user?._id.toString()
                ? ""
                : "margin-left: 22rem;"
            }" class="${
            msg.sender?._id.toString() === currentUser.user?._id.toString()
              ? "bg-danger p-2 text-white rounded"
              : "bg-primary p-2 text-white rounded "
          }">
<h1 style="font-size: 20px;display: flex;justify-content: space-between;">
            <div style="
    width: 10rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
">
                        ${
                          msg.sender?._id.toString() ===
                          currentUser.user?._id.toString()
                            ? "You"
                            : msg.sender.username
                        }
            </div>

            ${
              msg.sender?._id.toString() === currentUser.user?._id.toString()
                ? `<span onClick='removeMsg(event)'data-set-msgid='${msg._id}' style='margin-left: rem; cursor:pointer;'>del</span>`
                : ""
            }
            </h1>
              <h2 class="pt-2 ps-2">${msg.body}</h2>
            </div>
          </div>
          `
        );
      });
    });
  }
}

async function sendmsg(username) {
  const res = await fetch(
    `http://localhost:4000/message/find/?username=${username}`
  );
  let chat = await res.json();

  joinedChat.emit("newMsg", {
    sender: currentUser.user._id,
    href: chat.href,
    body: document.querySelector(".write-message").value,
  });
  document.querySelector(".write-message").value = "";
}

async function removeMsg(event) {
  const msgID = event.target.dataset.setMsgid;
  joinedChat.emit("removeMsg", {
    msgID,
    _id: currentUser.user._id,
    token: currentUser.token,
  });

  event.target.parentNode.parentNode.remove();
}
