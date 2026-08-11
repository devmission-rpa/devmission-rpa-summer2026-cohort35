const baseID = 'apphqAXizGk5FjuTB';
const tableID = 'tblLwi3a8IiEDHhXZ';
const token = 'patwOFoI7aldvphWN.1cb9caa02971f8916e6a96b1b7f87e392b564abdfd060df4f44d020d96a51149';

async function getData() {
    const response = await fetch(
        `https://api.airtable.com/v0/${baseID}/${tableID}`,
        {
           headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        }
    );
    const data = await response.json();
    return data.records;
}

getData().then(records => {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    let newHTML = '';
    records.forEach(record => {
    console.log(record);
    console.log(record.fields[0]);
    const projectName = record.fields['Event Name'];
    const projectDescription = record.fields['Description'];
    const projectImage1 = record.fields['Photo 1'][0].url;
    const projectImage2 = record.fields['Photo 2'][0].url;
    const projectImage3 = record.fields['Photo 3'][0].url;

        newHTML += `
            <div class="flip-card project">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="project-images">
                        <img src="${projectImage1}" alt="${projectName}">
                        <img src="${projectImage2}" alt="${projectName}">
                        <img src="${projectImage3}" alt="${projectName}">
                    </div>
                    <h3>${projectName}</h3>
                </div>
                <div class="flip-card-back">
                    <p>${projectDescription}</p>
                </div>
            </div>
            </div>
        `;
    });

    container.innerHTML = newHTML;
});
