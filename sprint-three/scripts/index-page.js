//Sprint 3

console.log("Still alive");
const apiUrl = 'https://project-1-api.herokuapp.com';

const newcomments = document.getElementById('commentList');
const commentForm = document.getElementById('form');

//add an event listener to the form submission
commentForm.addEventListener("submit", handleSubmit);

//function to get apikey
const apiKey = () => {
  axios
    .get(`${apiUrl}/register`)
    .then((response) => {
      const apiKey = response.data.api_key
      console.log(apiKey);
    })
    .catch((error) => console.log('error getting apikey'));
};

//function to get comments
const getComments = () => {
  axios
    .get(`${apiUrl}/comments?api_key=${apiKey}`)
    .then((response) => {
      const commentsArray = response.data;
      commentsArray.forEach((comment) => {
        addComment(comment);
      });
    })
    .catch((error) => console.log('error getting data comments:' + error));
};

//function to create each comment
function addComment(comment) {
  // create new elements
  const container = document.createElement('div');
  container.className = "section4__comments__box";

  const image = document.createElement('p');
  image.className = "section4__user__picture section4__user__picture--2";

  const userForm = document.createElement('div');
  userForm.className = "section4__user__form";

  const userInfo = document.createElement('div');
  userInfo.className = "section4__user__info";

  const userName = document.createElement('h3');
  userName.className = "section4__user__name";
  userName.innerText = comment.name;

  const date = new Date(comment.timestamp);
  const userDates = document.createElement('p');
  userDates.className = "section4__user__date";
  userDates.innerText = date.toLocaleDateString();

  userInfo.appendChild(userName);
  userInfo.appendChild(userDates);
  userForm.appendChild(userInfo);

  const userComment = document.createElement('p');
  userComment.className = "section4__user__comment";
  userComment.innerText = comment.comment;

  userForm.appendChild(userComment);

  container.appendChild(image);
  container.appendChild(userForm);

  const commentWrapper = document.createElement('div');
  commentWrapper.className = "section4__comments__sub-container";
  commentWrapper.id = comment.id;

  const commentWrapper2 = document.createElement('div');
  commentWrapper2.className = "section4__comments__mini-container";

  const commentLike = document.createElement('img');
  commentLike.className = "section4__user__likes";
  commentLike.setAttribute("src", "assets/Icons/SVG/icon-like.svg");

  const likeCounter = document.createElement("p");
  likeCounter.className = "section4__user__likes--counter";
  likeCounter.innerText = `${comment.likes} Likes`;

  const commentDelete = document.createElement('button');
  commentDelete.innerText = "Remove";
  commentDelete.className = "section4__button--remove";
  commentDelete.addEventListener("click", (event) => {
    removeComment(event.target.parentNode.parentNode.id);
  });

  commentLike.addEventListener("click", (event) => {
    likeComment(event.target.parentNode.parentNode.id);
  });

  const divider = document.createElement('hr');
  divider.className = "line";
  commentWrapper.appendChild(container);
  commentWrapper.appendChild(commentWrapper2);
  commentWrapper2.appendChild(commentDelete);
  commentWrapper2.appendChild(commentLike);
  commentWrapper2.appendChild(likeCounter);
  commentWrapper.appendChild(divider);

  newcomments.insertBefore(commentWrapper, newcomments.firstChild);
}

//submit the form and add the comment to the list
function handleSubmit(event) {
  event.preventDefault();
  const user = event.target.user.value;
  const commentText = event.target.commentText.value;

  const newComment = {
    name: user, // => name: user
    comment: commentText // => commentText: commentText
  };
  axios
    .post(`${apiUrl}/comments?api_key=${apiKey}`, newComment, {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    )
    .then((response) => {
      console.log('HTTP STATUS CODE: ', response.status);

      //after comment has posted, getComments again.
      getComments();
    })
    .catch((error) => console.log(error));

  //reset the form
  commentForm.reset();
}

//Like implementation for comments.
function likeComment(id) {
  if (id === undefined || id === "") {
    console.log("comment id to like not defined");
    return;
  }
  axios
      .put(`${apiUrl}/comments/${id}/like?api_key=${apiKey}`)
      .then((response) => {
        if (response.status === 200) {
          document.getElementById(id).querySelector(".section4__user__likes--counter").innerText = response.data.likes + " Likes";
        } else {
          console.log(`Error trying to like commentId: ${id} status:${response.status} - ${response}`);
        }
      })
      .catch((error) => console.log(`error for like comment ${id}:` + error));
}

//Remove comment.
function removeComment(id) {
  if (id === undefined || id === "") {
    console.log("comment id to remove not defined");
    return;
  }
  axios
    .delete(`${apiUrl}/comments/${id}?api_key=${apiKey}`)
    .then((response) => {
      if (response.status === 200) {
        document.getElementById(id).remove();
      } else {
        console.log(`Error removing commentId: ${id} status:${response.status} - ${response}`);
      }
    })
    .catch((error) => console.log(`error for like comment ${id}:` + error));
}

//initial call to get comments  when first loaded.
getComments();