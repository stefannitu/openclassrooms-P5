// get data from api
// create card for each object in array
const apiUri = 'http://127.0.0.1:3000/api/products/';
const items = document.querySelector('#items');


async function makeRequest() {
  const response = await fetch(apiUri);
  const data = await response.json();
  return data;
}

async function createDOM() {
  let createHTML = '';
  try {
    const dataArray = await makeRequest();
    dataArray.forEach(element => {
      createHTML += `
        <a href="./product.html?id=${element._id}">
            <article>
              <img src="${element.imageUrl}" alt="${element.alt}">
              <h3 class="productName">${element.name}</h3>
              <p class="productDescription">${element.description}</p>
            </article>
          </a> `;
    });

  } catch (error) {
    items.innerHTML = `<article> <h3 class="productName">Something went wrong.</h3><p> We are investigating. Thank you for your understanding</p></article>`;
  }
  items.innerHTML += createHTML;
}

createDOM();