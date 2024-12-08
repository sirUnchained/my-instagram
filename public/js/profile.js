const togglePost = document.querySelector(".toggle-post");
      const toggleSave = document.querySelector(".toggle-save");
      const post = document.querySelector(".posts");
      const save = document.querySelector(".saves");

      toggleSave?.addEventListener("click", () => {
        toggleSave.classList.add("border-top");
        togglePost.classList.remove("border-top");
        post.classList.add("d-none");
        save.classList.remove("d-none");
      });
      togglePost?.addEventListener("click", () => {
        togglePost.classList.add("border-top");
        toggleSave.classList.remove("border-top");
        save.classList.add("d-none");
        post.classList.remove("d-none");
      });

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
          post.user?.avatar
            ? `${post.user?.avatar}`
            : `${window.location.origin}/profiles/no_profile.png`
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
                    <span class="far fa-message"></span>

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
          event.target.parentNode.parentNode.classList.contains(
            "show-post-modal"
          )
        ) {
          event.target.parentNode.parentNode.remove();
        } else if (
          event.target.parentNode.classList.contains("show-post-modal")
        ) {
          event.target.parentNode.remove();
        }
      }

      async function shoStoryModal(userID) {
        const res = await fetch(`${window.location.origin}/story/${userID}`);
        const story = await res.json();

        let swiperWrapper = `
          <div class="swiper-slide">
          <img src="${story.media.path}" class="post-img" alt="iaf" />
          </div>
        `;

        const postElem = `
            <div class="show-post-modal">
              <div class="close-post-modal" onclick="closeShowModal(event)">
                <span class="fa fa-x"></span>
              </div>
              <div class="posrt-content">
                <div class="swiper mySwiper">
                  <div class="swiper-wrapper">
                    ${swiperWrapper}
                  </div>
                  <div class="swiper-pagination"></div>
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
      }

      const newStoryBtn = document.querySelector(".new-story-btn");
      const newStoryUploadElem = document.querySelector("#create-story");
      newStoryBtn?.addEventListener("click", (event) => {
        newStoryUploadElem.classList.add("show-createbox");
      });
      function closeCreateStory(event) {
        newStoryUploadElem.classList.remove("show-createbox");
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