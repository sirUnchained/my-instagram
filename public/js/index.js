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
      const res = await fetch(
        `${window.location.origin}/comment/${postID}`
      );
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