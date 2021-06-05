const formButton = document.querySelector(".form__button");

function captureValues() {
  event.preventDefault();

  const commentContainer = document.querySelector(".comment__container");
  const firstChildContainer = commentContainer.firstChild;
  const userPicture = document.querySelector(".user__picture").src;
  const formName = document.querySelector(".form__name").value;
  const formComment = document.querySelector(".form__comment").value;

  const commentBox = document.createElement("div");
  const userForm = document.createElement("div");
  const userInfo = document.createElement("div");
  const userName = document.createElement("h3");
  const userDate = document.createElement("p");
  const comment = document.createElement("p");
  const commentLine = document.createElement("hr");

  userName.innerText = formName;
  const date = new Date();
  userDate.innerText = date.toLocaleDateString();
  comment.innerText = formComment;

  if (userPicture != "") {
    const userImg = document.createElement("img");
    userImg.setAttribute("src", userPicture);
    userImg.className = "user__picture";
    commentBox.appendChild(userImg);
  } else {
    const userImg = document.createElement("p");
    userImg.className = "user__picture";
    commentBox.appendChild(userImg);
  }

  commentBox.className = "comment__box";
  userForm.className = "user__form";
  userInfo.className = "user__info";
  userName.className = "user__name";
  userDate.className = "user__date";
  comment.className = "user__comment";
  commentLine.className = "line";

  commentContainer.insertBefore(commentBox, firstChildContainer);
  commentBox.appendChild(userForm);
  userForm.appendChild(userInfo);
  userInfo.appendChild(userName);
  userInfo.appendChild(userDate);
  userForm.appendChild(comment);
  commentContainer.appendChild(commentLine);

  const form = document.querySelector(".form");
  form.reset();
}




//Sprint 3

console.log ("Still alive");
const apiUrl = 'https://project-1-api.herokuapp.com';

const newcomments = document.getElementById('commentList');
const commentForm = document.getElementById('form');

//add an event listener to the form submission
commentForm.addEventListener("submit", handleSubmit);

//function to get apikey
const apiKey = () => {
axios
.get(`${apiUrl}/register`)
.then((response)=> {
  const apiKey =  response.data.api_key
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

      console.log(response);

      commentsArray.forEach((record) => {
        // create new elements
        const listEl = document.createElement('li');
        const userCommentEl = document.createElement('p');
        const userNameEl = document.createElement('h3');
        const userLikeEl = document.createElement('p');

        //attach the data to the elements
        userNameEl.innerText = record.name;
        userCommentEl.innerText = record.comment;
        userLikeEl.innerText = record.likes;
        //append the elements to their respective parents
        listEl.appendChild(userNameEl);
        listEl.appendChild(userCommentEl);
        listEl.appendChild(userLikeEl);
      
        commentList.appendChild(listEl);
      });
    })
    .catch((error) => console.log('error getting data comments'));
};

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
  commentForm .reset();
}








//initial call to get comments  when first loaded.
getComments();
