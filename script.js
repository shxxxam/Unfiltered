const API_KEY = "pub_444360c7233ecf1861ba1edd99bf70d2147bd";
const url = "https://newsdata.io/api/1/latest?apikey=";

window.addEventListener("load", ()=> fetchNews("trending"));

function reload(){
    window.location.reload();
}

function truncateDescription(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }

async function fetchNews(query){
    const res = await fetch(`${url}${API_KEY}&q=${query}&language=en,hi`);
    const data = await res.json();
    console.log(data);
    bindData(data.results);
}

function bindData(results) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = ""; // Clear container before adding new cards
  
    results.forEach((result) => {
      // Only process results with image and description
      if (result.image_url && result.description) {
        result.description = truncateDescription(result.description, 150);
        const cardClone = document.getElementById("template-news-card").content.cloneNode(true);
        fillDataInCard(cardClone, result);
        cardsContainer.appendChild(cardClone);
      }
    });
  }

function fillDataInCard(cardClone,result){
    const newsImg = cardClone.querySelector("#news-img")
    const newsTitle = cardClone.querySelector("#news-title")
    const newsSource = cardClone.querySelector("#news-source")
    const newsDesc = cardClone.querySelector("#news-desc")

    newsImg.src = result.image_url;
    newsTitle.innerHTML = result.title;
    newsDesc.innerHTML = result.description;

    const date = new Date(result.pubDate).toLocaleString("en-US",{ timeZone: "Asia/Jakarta"})

    newsSource.innerHTML = `${result.source_id} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () =>{
        window.open(result.link,"_blank");
    })
}

let currSelectedNav = null;

function onNavItemClick(id){
    fetchNews(id);
    const navItem = document.getElementById(id);
    currSelectedNav?.classList.remove('active');
    currSelectedNav = navItem;
    currSelectedNav.classList.add('active');
}

const searchButton = document.getElementById('search-btn');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () =>{
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    currSelectedNav?.classList.remove('active');
    currSelectedNav = null;
})
