async function retrieveData(){
    let element = document.getElementById("data_analyst");

await fetch(
      `https://api.airtable.com/v0/apphqAXizGk5FjuTB/tblM4DETlvHnLZX4h`,
      {
        headers: {
          Authorization: `Bearer pat7t95zxMmQHUzsh.5eb26aaa36c99f3d55b8c0482a98849df96c4a9c3ca6de3920dadf5ebcd1e168`,
        },
        method: "GET",
      },
    )
      .then((response) => response.json())
      .then((data) => {

        // How 2 do this without having to access each and every record ID individually???
        console.log(data);
        let test = data.records[2].fields["Name"];
        let image = data.records[2].fields["Photo"][0].url;
        console.log(test);
        console.log(image);
      });
}