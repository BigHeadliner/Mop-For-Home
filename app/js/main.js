$(function () {   
     
    
// GraphQL запит для отримання товарів
const query = `
{
  products(first: 8) {
    edges {
      node {
        id
        title
        description
        images(first: 2) {
          edges {
            node {
              originalSrc
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`;

// Функція для виконання API запиту
async function fetchProducts() {
  const response = await fetch('https://tsodykteststore.myshopify.com/api/2023-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '7e174585a317d187255660745da44cc7', // Токен для авторизації
    },
    body: JSON.stringify({ query }) // Передаємо запит в тілі POST запиту
  });

  const result = await response.json(); // Очікуємо відповідь у форматі JSON
  return result.data.products.edges; // Повертаємо масив продуктів
}

// Функція для рендерингу товарів на сторінці
async function renderProducts() {
  const products = await fetchProducts(); // Отримуємо список товарів з API
  const container = document.querySelector('.featured-products__cards'); // Знаходимо контейнер для карток товарів

  // Для кожного товару створюємо картку
  products.forEach(product => {
    const { node: { title, description, images, priceRange } } = product;

    // Використовуємо ваше зображення як зображення за замовчуванням
    const defaultImageSrc = 'images/mop.png'; // Локальне зображення
    const secondImageSrc = images.edges.length > 1 ? images.edges[1].node.originalSrc : null;

    // Створюємо елемент для картки товару
    const productCard = document.createElement('div');
    productCard.classList.add('featured-products__card');

    // HTML для картки товару
    const productCardHTML = `
      <div class="featured-products__card-top">
        <img class="featured-products__card-img" src="${defaultImageSrc}" alt="${title}">
      </div>
      <p class="featured-products__card-title">${title}</p>
      <p class="featured-products__card-text">${description || 'No description available'}</p>
      <div class="featured-products__price">
        <p class="featured-products__price-was">${priceRange.minVariantPrice.amount}</p>
        <p class="featured-products__price-now">${priceRange.minVariantPrice.amount}</p>
      </div>
    `;

    // Вставляємо HTML в картку товару
    productCard.innerHTML = productCardHTML;
    container.appendChild(productCard); // Додаємо картку в контейнер

    // Додаємо функціонал для hover, щоб змінювати зображення на друге з API, якщо воно є
    productCard.querySelector('.featured-products__card-img').addEventListener('mouseover', () => {
      if (secondImageSrc) { // Якщо є друге зображення, міняємо на нього
        productCard.querySelector('.featured-products__card-img').src = secondImageSrc;
      }
    });

    productCard.querySelector('.featured-products__card-img').addEventListener('mouseout', () => {
      // Повертаємо зображення за замовчуванням при виході миші
      productCard.querySelector('.featured-products__card-img').src = defaultImageSrc;
    });
  });
}

// Викликаємо функцію рендерингу товарів
renderProducts();









  
 
  
 
  
  
  
  
     

 



  


  
  
   
});