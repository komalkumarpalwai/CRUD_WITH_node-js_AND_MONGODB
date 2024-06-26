const loadProducts = async () => {
    try {
        const response = await axios.get('/products');
        const products = response.data;

       
        const productSection = document.getElementById('productSection');
        productSection.innerHTML = '';
        products.slice(0, 6).forEach(product => {
            const productCard = document.createElement('div');
            productCard.innerHTML = `
                
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src="${product.images[0]}" alt="${product.name}" class="w-full h-56 object-cover">
                    <div class="p-4">
                        <h2 class="text-xl font-semibold text-gray-800 mb-2">${product.name}</h2>
                        <p class="text-gray-600 mb-2">${product.description}</p>
                        <p class="text-gray-700 font-semibold mb-2">$${product.price.toFixed(2)}</p>
                        <a href="#" class="block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300">View Details</a>
                    </div>
                </div>
            `;
            productSection.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
};


document.getElementById('loadPremiumWatches').addEventListener('click', loadProducts);


window.addEventListener('load', loadProducts);