// const configs = require("../../src/configENV");

const modalElem = document.querySelector(".modal");
async function openShowModal(postID) {
  const res = await fetch(
    `${window.location.origin}/post/get-single/${postID}`
  );
  const post = await res.json();

  let swiperWrapper = "";
  post.medias.forEach((item) => {
    swiperWrapper += `
              <div class="swiper-slide">
                ${
                  item.path.includes(".mp4")
                    ? `<video controls src="${item.path}" class="post-img" alt="iaf" />`
                    : `<img src="${item.path}" class="post-img" alt="iaf" />`
                }
              </div>
            `;
  });

  const postElem = `
            <div class="show-post-modal">
              <div class="close-post-modal" onclick="closeShowModal(event)">
                <span class="fa fa-x"></span>
              </div>
              <div class="posrt-content">
                <div class="swiper mySwiper">
                  <div class="user-post-profile">
                    <a href="/profile/${post.user?.username}">
                      <img class="${
                        post.stories?.length > 0 ? "hasStory" : ""
                      }" src="${
    post.user?.avatar ? `${post.user?.avatar}` : "/profiles/no_profile.png"
  }" alt="avatar" />
                    </a>
                    <a href="/profile/${post.user?.username}">${
    post.user?.username
  }</a>
                  </div>
                  <div class="swiper-wrapper">
                    ${swiperWrapper}
                  </div>
                  <div class="swiper-pagination"></div>
                  <div class="buttons">
                        <form style="display: flex;align-items: center;justify-content: center;margin-bottom: 0.7rem;"
                            action="/favorite/${
                              post.isLiked ? "dislike" : "like"
                            }/${post._id}"
                            method="post">
                            <button  type="submit">
                              <span class="${
                                post.isLiked
                                  ? "fa fa-heart liked"
                                  : "far fa-heart"
                              }"></span>
                            </button>
                        </form>

                    <!-- <span class="like fa fa-heart liked"></span> -->
                    <span class="far fa-message open-comment-modal" data-postid="${
                      post._id
                    }"
                    ></span>

                          <form
                            style="display: flex;align-items: center;justify-content: center;margin-bottom: 0.7rem;"
                            action="/bookmark/${
                              post.isSaved ? "unsave" : "save"
                            }/${post._id}"
                            method="post">
                          
                            <button type="submit">
                              <span class="${
                                post.isSaved
                                  ? "fas fa-bookmark"
                                  : "far fa-bookmark"
                              }"></span>
                            </button>
                          </form>
                    <span class="far fa-paper-plane"></span>
                  </div>
                  <div class="descrip">
                    <span style="font-weight: bold;font-size: 0.9rem;">@${
                      post.user.username
                    }</span>
                    ${post.description ? post.description : "no description"}
                    <br />
                    <br />
                    ${
                      post.hashtags
                        ? post.hashtags.map((hash) => "#" + hash)
                        : ""
                    }
                  </div>
                </div>
              </div>
            </div>
        `;

  modalElem.insertAdjacentHTML("afterend", postElem);

  var swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
    },
  });

  let modal = document.querySelector(".comment-modal");
  let comentContainer = document.querySelector(".comment-container");
  let postSetId = document.querySelector(".hidden-input-post");
  let btns = document.querySelectorAll(".open-comment-modal");
  let span = document.querySelector(".close-comment-modal");
  let postComments = document.querySelector(".post-comments");
  btns.forEach((btn) => {
    btn.addEventListener("click", async function (event) {
      modal.classList.add("d-flex");
      modal.classList.remove("d-none");

      const postID = event.srcElement.dataset.postid;
      postSetId.value = postID;

      if (event.target.classList.contains("open-comment-modal")) {
        const res = await fetch(`/comment/${postID}`);
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
    postComments.innerHTML = "";
    modal.classList.add("d-none");
    modal.classList.remove("d-flex");
  });
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.classList.add("d-none");
      modal.classList.remove("d-flex");
    }
  });
}

function likeToggle(event) {
  if (event.target.classList.contains("like")) {
    event.target.classList.toggle("liked");
  } else if (event.target.parentNode.classList.contains("like")) {
    event.target.parentNode.classList.toggle("liked");
  }
}

function closeShowModal(event) {
  if (
    event.target.parentNode.parentNode.classList.contains("show-post-modal")
  ) {
    event.target.parentNode.parentNode.remove();
  } else if (event.target.parentNode.classList.contains("show-post-modal")) {
    event.target.parentNode.remove();
  }
}

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

const usersPosts = document.querySelector(".main");
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
          <div class="item" onclick="openShowModal('${post._id}')">
            <div class="img_container">
              ${
                post.medias[0].path.includes(".mp4")
                  ? `
              <video
                src="${post.medias[0].path}"
                alt="post1"
                class="imgs"
              />
                `
                  : `
              <img src="${post.medias[0].path}" alt="post1" class="imgs" />
                `
              }

              <div class="after">
                <div class="likes">
                  <p>
                  ${
                    post.isLiked
                      ? `<span class="fa fa-heart"></span>`
                      : `<span class="far fa-heart"></span>`
                  }
                    <span class="liketext"><b>${post.totalLikes}</b></span>
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
