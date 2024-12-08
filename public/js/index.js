// const configs = require("../../src/configENV");

var swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
  },
});

const showBadModal = document.querySelectorAll(".show-more-modal");
showBadModal.forEach((showBadModal) => {
  showBadModal.addEventListener("click", (event) => {
    showBadModal.parentNode.parentNode
      .querySelector(".bad-toggle")
      .classList.toggle("d-none");
  });
});

let modal = document.querySelector(".comment-modal");
let comentContainer = document.querySelector(".comment-container");
let postSetId = document.querySelector(".hidden-input-post");
let btns = document.querySelectorAll(".open-comment-modal");
let span = document.querySelector(".close-comment-modal");
let postComments = document.querySelector(".comment-container");
btns.forEach((btn) => {
  btn.addEventListener("click", async function (event) {
    postComments.innerHTML = "";
    modal.classList.add("d-flex");
    modal.classList.remove("d-none");

    const postID = event.srcElement.dataset.postid;
    postSetId.value = postID;

    if (event.target.classList.contains("open-comment-modal")) {
      const res = await fetch(`${window.location.origin}/comment/${postID}`);
      const comments = await res.json();
      comments.forEach((comment) => {
        comentContainer.insertAdjacentHTML(
          "beforeend",
          `
            <div class="w-100 bh-secendary" style="height: 5rem;font-size: 1rem;border-bottom: 0.1rem solid var(--black-40);">
              <p style="font-weight: bold;">@${comment.user.username}</p>
              <p>${comment.body}</p>
            </div>
          `
        );
      });
    }
  });
});
span.addEventListener("click", function () {
  modal.classList.add("d-none");
  modal.classList.remove("d-flex");
});
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.classList.add("d-none");
    modal.classList.remove("d-flex");
  }
});

var dropUpVisible = false;
function toggleDropUpOptions() {
  var dropUpOptions = document.getElementById("dropUpOptions");
  dropUpVisible = !dropUpVisible; // Toggle the drop-up visibility state
  if (dropUpVisible) {
    dropUpOptions.classList.add("show-drop-up");
  } else {
    dropUpOptions.classList.remove("show-drop-up");
  }
}

var Searchbox = false;
function openSearchBox() {
  var upsearchbox = document.getElementById("find");
  Searchbox = !Searchbox;
  if (Searchbox) {
    upsearchbox.classList.add("show-search");
  } else {
    upsearchbox.classList.remove("show-search");
  }
}

var Notibox = false;
function openNotibox() {
  var upnotibox = document.getElementById("notification-box");
  Notibox = !Notibox;
  if (Notibox) {
    upnotibox.classList.add("show-notificaion");
  } else {
    upnotibox.classList.remove("show-notificaion");
  }
}

var postbox = false;
function opencreatebox() {
  var upbox = document.getElementById("create-post");
  postbox = !postbox;
  if (postbox) {
    upbox.classList.add("show-createbox");
  } else {
    upbox.classList.remove("show-createbox");
  }
}
function closecreate() {
  var upbox = document.getElementById("create-post");
  upbox.classList.remove("show-createbox");
}

const usersPosts = document.querySelector(".users-posts");
const allcatchup = document.querySelector(".allcatchup");
let page = 0;
let isEnd = false;
window.addEventListener("scroll", startShow);
window.addEventListener("load", startShow);

function startShow() {
  if (
    window.scrollY + window.innerHeight >=
    document.body.offsetHeight - 1000
  ) {
    if (!isEnd) {
      page++;
      getInsertPosts(page);
      allcatchup.innerHTML = `
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      `;
    } else {
      allcatchup.innerHTML = `
                <div >
                  <p style="font-size: 25px; margin-top: 8px">
                    You're all caught up
                  </p>
                  <p style="color: gray; margin-top: 8px">
                    You've seen all posts.
                  </p>
                </div>
      `;
    }
  }
}
async function getInsertPosts(page = 1) {
  const res = await fetch(`http://localhost:4000/post/posts/${page}`);
  const result = await res.json();
  isEnd = result.isEnd;

  result?.posts.forEach((post) => {
    usersPosts.insertAdjacentHTML(
      "beforeend",
      `
                <div class="user-post">
                  <div class="card">
                    <div class="card-title">

                      <a style="height: 3.5rem; width: 4rem" href="/profile/${
                        post.user.username
                      }">
                        <img src="${
                          post.user.avatar || "/profiles/no_profile.png"
                        }" class="profile-img ${
        post.hasStory ? "hasStory" : ""
      }" alt="userprofile">
                      </a>

                      <a href="/profile/${post.user.username}">
                        <p style="margin-top: 0">
                          ${post.user.username}
                        </p></a
                      >
                      <div class="position-relative">
                        <button class="show-more-modal" type="button">
                          <span class="fa fa-align-right"> </span>
                        </button>

                        <div
                          class="alert alert-danger position-absolute d-flex flex-column end-0 d-none bad-toggle"
                          style="width: 8rem; z-index: 10"
                        >
                          ${
                            result.currentUser?.role === "BOSS"
                              ? `
                          <form
                              method="post"
                              action="/post/remove/${post._id}"
                              style="cursor: pointer"
                            >
                              <button type="submit" class="d-block">
                                remove post
                              </button>
                            </form>
                            <form
                              method="post"
                              action="/user/ban/${post.user._id}"
                              style="cursor: pointer"
                            >
                              <button type="submit" class="d-block mt-4">
                                ban user
                              </button>
                          </form>

                          `
                              : `
                          <form
                              method="post"
                              action="/post/report/${post._id}"
                              style="cursor: pointer"
                            >
                              <button type="submit" class="d-block">
                                report
                              </button>
                          </form>
                          `
                          }
                        </div>
                      </div>
                    </div>
                    <div class="card-content">
                      <div class="swiper mySwiper">
                        <div class="swiper-wrapper">
                        ${post.medias
                          ?.map(
                            (media) => `
                          
                          <div class="swiper-slide" style="height: 300px">
                            ${
                              media.filename.includes(".mp4")
                                ? `
                            <video
                              style="height: 300px"
                              src="${media.path}"
                              class="post-img"
                              alt="iaf"
                              controls
                            />
                            `
                                : `
                            <img
                              style="height: 300px"
                              src="${media.path}"
                              class="post-img"
                              alt="iaf"
                            />
                            `
                            }
                          </div>

                          `
                          )
                          .join("")}
                        </div>
                        <div class="swiper-pagination"></div>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="likesharebutton">
                        <div class="likesharebutton-left">
                          ${
                            result.currentUser
                              ? `
                            ${
                              post.isLiked
                                ? `
                            <form
                              style="display: inline"
                              action="/favorite/dislike/${post._id}"
                              method="post"
                            >
                              <button type="submit">
                                <span class="fa fa-heart liked"></span>
                              </button>
                            </form>
                            `
                                : `
                            <form
                              style="display: inline"
                              action="/favorite/like/${post._id}"
                              method="post"
                            >
                              <button type="submit">
                                <span class="far fa-heart"></span>
                              </button>
                            </form>
                            `
                            }
                            `
                              : `
                            <a href="/auth/login">
                              <span class="far fa-heart"></span>
                            </a>
                            `
                          }
                          <div
                            data-postid="${post._id}"
                            class="open-comment-modal"
                            style="display: inline; cursor: pointer"
                          >
                            <span
                              class="far fa-message open-comment-modal"
                              data-postid="${post._id}"
                              class="open-comment-modal"
                            ></span>
                          </div>
                          <span class="far fa-paper-plane"></span>
                        </div>
                        <div class="likesharebutton-right">

                        ${
                          result.currentUser
                            ? `${
                                post.isSaved
                                  ? `
                            <form
                              style="display: inline"
                              action="/bookmark/unsave/${post._id}"
                              method="post"
                            >
                              <button type="submit">
                                <span class="fas fa-bookmark"></span>
                              </button>
                            </form>
                            `
                                  : `
                            <form
                              style="display: inline"
                              action="/bookmark/save/${post._id}"
                              method="post"
                            >
                              <button type="submit">
                                <span class="far fa-bookmark"></span>
                              </button>
                            </form>
                             `
                              }`
                            : `
                          <a href="/auth/login">
                            <span class="far fa-bookmark"></span>
                          </a>
                          `
                        }
                        </div>
                      </div>
                      <div class="">
                        <p class="like">${post.totalLikes} likes</p>
                        <p class="like">
                          <strong class="bold"
                            >${post.user.username}</strong
                          >
                          ${
                            post.description
                              ? post.description
                              : "no description."
                          }
                        </p>
                        <p
                          style="
                            font-size: 12px;
                            margin-left: 7px;
                            margin-top: 8px;
                            color: gray;
                          "
                        >
                          ${post.createdAt?.toString().slice(0, 15)}
                        </p>

                        <p
                          style="
                            font-size: 12px;
                            margin-left: 7px;
                            margin-top: 8px;
                            color: gray;
                          "
                        >
                          #${post.hashtags?.join(" #")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
      `
    );
  });

  new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
    },
  });
}
