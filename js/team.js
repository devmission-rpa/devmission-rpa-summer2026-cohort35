async function retrieveData(token, dataAttribute){
  let person = document.querySelectorAll('[data-' + dataAttribute + ']');

  await fetch(
    `https://api.airtable.com/v0/apphqAXizGk5FjuTB/` + token,
    {
      headers: {
        Authorization: `Bearer pat7t95zxMmQHUzsh.5eb26aaa36c99f3d55b8c0482a98849df96c4a9c3ca6de3920dadf5ebcd1e168`,
      },
      method: "GET",
    },
  )
    .then((response) => response.json())
    .then((data) => {

    // Create "Key-Value" Map, which enables finding a specific img URL through the "Name" key
    const photoMap = new Map(data.records.map(record => [record.fields["Name"], record.fields["Photo"]?.[0]?.url]));
      person.forEach(element => {
        let key;
        if(dataAttribute == 'staff'){
          key = element.dataset.staff;
        } else if(dataAttribute == 'intern'){
          key = element.dataset.intern;
        } else {
          key = null;
        }

        if(!key) return;

        element.src = photoMap.get(key) ?? "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original";
      });
    });
}

function startLoading(){
  const progressBar = document.getElementById("loading-bar");
  let width = 0;

  // Clear any existing text or width if restarted
  progressBar.style.width = "0%";
  progressBar.innerHTML = "0%";

  // Update the progress every 20 milliseconds
  const intervalId = setInterval(function() {
    if (width >= 100) {
      clearInterval(intervalId);
      progressBar.innerHTML = "Complete!";
    } else {
      width++;
      progressBar.style.width = width + "%";
      progressBar.innerHTML = width + "%";
    }
  }, 20);
}