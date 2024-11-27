let dataFollowing;
let dataFollowers;
let notFollowBack = [];

function checkResult(){
  const followingFile = $("#following").prop("files")[0];
  const followersFile = $("#followers").prop("files")[0];

  function readFileAsJson(file, callback) {
      const reader = new FileReader();
      reader.onload = function(event) {
          try {
              const jsonData = JSON.parse(event.target.result);
              callback(null, jsonData);
          } catch (error) {
              callback(error, null);
          }
      };
      reader.onerror = function(event) {
          callback(event.target.error, null);
      };
      reader.readAsText(file);
  }

  function fetchData() {
      return new Promise((resolve, reject) => {
          if (followingFile && followersFile) {
              let dataFollowing, dataFollowers;

              readFileAsJson(followingFile, (error, jsonData) => {
                  if (error) {
                      reject(error);
                      return;
                  }
                  dataFollowing = jsonData;

                  readFileAsJson(followersFile, (error, jsonData) => {
                      if (error) {
                          reject(error);
                          return;
                      }
                      dataFollowers = jsonData;
                      resolve({ dataFollowing, dataFollowers });
                  });
              });
          } else {
              reject(new Error("Files not selected"));
              // use swal fire
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select both files!',
              })
          }
      });
  }

  fetchData()
  .then(({ dataFollowing, dataFollowers }) => {
    let followingNames = new Set(
      dataFollowing.relationships_following.map(
        (item) => item.string_list_data[0].value
      )
    );
    let followerNames = new Set(
      dataFollowers.map((item) => item.string_list_data[0].value)
    );

    let notFollowBack = [...followingNames].filter(
      (name) => !followerNames.has(name)
    );

    $('#result').removeClass('hidden');
    $('#followingCount').text(followingNames.size);
    $('#followersCount').text(followerNames.size);
    $('#notFollowBackCount').text(notFollowBack.length);
    
    //append all name inside div and use comma as separator
    $('#notFollowBackList').empty();
    $('#notFollowBackList').append(notFollowBack.join(', '));
    
  })
  .catch((error) => {
    console.error("Error:", error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    });
  });

}