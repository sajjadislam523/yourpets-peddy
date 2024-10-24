
const getCategory = async () => {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/peddy/categories');
        const data = await res.json();
        displayCategories(data.categories);
    }
    catch (error) {
        console.log(error);
    }
}

const loadCategoryPets = async (category) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`);
    const data = await res.json();
    displayPets(data.data);
}

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('categories');

    // console.log(categories);
    categories.forEach((item) => {

        const button = document.createElement('button');
        button.classList = 'border border-[#0E7A811A] px-10 py-3 flex items-center gap-4 text-[#131313] font-inter text-2xl rounded-xl text-black font-inter text-lg font-bold hover:bg-[#0E7A811A] transition-all duration-150 ease-in focus:rounded-full focus:bg-[#0E7A811A] focus:outline focus:outline-2 outline-[#0E7A81]';
        button.innerHTML = `<img class="w-8" src="${item.category_icon}" alt="" /> ${item.category}`;


        button.onclick = () => {
            const loadingScreen = document.getElementById('loading');

            loadingScreen.classList.remove('hidden');

            setTimeout(() => {
                loadingScreen.classList.add('hidden');

                loadCategoryPets(item.category);
            }, 2000);
        }

        categoryContainer.append(button);
    });
}


// Get Pets
const getPets = async () => {
    const loadingScreen = document.getElementById('loading');

    try {
        loadingScreen.classList.remove('hidden');

        const res = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        const data = await res.json();

        setTimeout(() => {
            loadingScreen.classList.add('hidden');

            displayPets(data.pets);
        }, 2000);


    }
    catch (error) {
        console.log(error);

        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 2000);
    }
}

// Load pets details
const loadDetail = async (petId) => {
    // console.log(petId);
    const res = await fetch(` https://openapi.programming-hero.com/api/peddy/pet/${petId}`);
    const data = await res.json();
    displayPetDetails(data.petData);
}

// Display pet details
const displayPetDetails = (pet) => {
    const detailContainer = document.getElementById('petDetail');

    detailContainer.innerHTML = `
        <div class="p-4 bg-white rounded-lg">
            <img class="w-full rounded-md" src="${pet.image}" alt="" />
            <div class="p-4 space-y-2">
                <h3 class="mb-2 text-xl font-extrabold font-inter">${pet.pet_name}</h3>
                <div class="flex items-center justify-between">
                    <div>
                        <div class="flex gap-2">
                            <img src="assets/icons/breed.png" alt="breed">
                            <p class="mb-1 text-sm text-[#131313B2]">Breed: ${pet.breed || 'N/A'}</p>
                        </div>
                        <div class="flex gap-2">
                            <img src="assets/icons/gender.png" alt="gender">
                            <p class="mb-1 text-sm text-[#131313B2]">Gender: ${pet.gender || 'N/A'}</p>
                        </div>
                        <div class="flex gap-2">
                            <img src="assets/icons/gender.png" alt="gender">
                            <p class="mb-1 text-sm text-[#131313B2]">Vaccinated Status: ${pet.vaccinated_status || 'N/A'}</p>
                        </div>
                    </div>
                    <div>
                        <div class="flex gap-2">
                            <img src="assets/icons/date.png" alt="birth">
                            <p class="mb-1 text-sm text-[#131313B2]">Birth: ${pet.date_of_birth ? pet.date_of_birth : 'N/A'}</p>
                        </div>
                        <div class="flex gap-2">
                            <img src="assets/icons/price.png" alt="price">
                            <p class="text-sm text-[#131313B2]">Price: ${pet.price ? pet.price : 'N/A'}$</p>
                        </div>
                    </div>
                </div>
                <hr>
                <p class="text-sm text-[#131313B2]">${pet.pet_details}</p>
            </div>
        </div>
            `

    document.getElementById('detailModal').showModal();
}

// Load liked pets
const loadLikedPets = async (petId) => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`);
        const data = await res.json();
        addToLiked(data.petData);
    } catch (error) {
        console.error("Error loading liked pet:", error);
    }
}

// Add the pets to liked part
const addToLiked = (pet) => {
    const likedContainer = document.getElementById('liked');

    const div = document.createElement('div');
    div.classList.add('p-2', 'bg-white', 'rounded-lg', 'border', 'w-full', 'h-32');
    div.innerHTML = `
        <img class="w-32 h-full object-cover rounded-md" src="${pet.image}" alt=""/>
    `;

    likedContainer.appendChild(div);
    // console.log(pet);
}

// Sorting the card by price in ascending order
const getSortedData = async () => {
    const loadingScreen = document.getElementById('loading');

    try {
        loadingScreen.classList.remove('hidden');

        const res = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        const data = await res.json();
        const pets = data.pets;

        const sortedPets = pets.sort((a, b) => {
            const priceA = a.price || Infinity;
            const priceB = b.price || Infinity;

            return priceB - priceA;
        })

        setTimeout(() => {
            loadingScreen.classList.add('hidden');

        }, 2000);

        return sortedPets;

    }
    catch (error) {
        console.log(error);
    }
}

document.getElementById('sortByPrice').addEventListener('click', async () => {
    const sortedPets = await getSortedData();
    displayPets(sortedPets);
})


// Display pets
const displayPets = (pets) => {
    const petsContainer = document.getElementById('pets');

    petsContainer.innerHTML = '';

    if (pets.length === 0) {

        petsContainer.classList.remove('grid');
        petsContainer.innerHTML =
            `
        <div  class="min-h-screen flex flex-col gap-5 justify-center items-center">
            <img src="assets/images/error.webp" alt="empty"/>
            <h1 class="text-[#131313] font-inter font-extrabold text-3xl text-center">No Information Available</h1>
            <p class="text-[#131313B2] font-lato text-lg text-center">Sorry we don't have that category of pets right now, please try again later</p>
        </div>
        `;
    }

    pets.forEach((pet) => {
        const card = document.createElement('div');
        card.innerHTML = `
        <div class="p-4 bg-white rounded-lg border">
            <img src="${pet.image}" alt="pet image" class="object-cover w-full h-40 rounded-t-lg">
            <div class="p-4 space-y-2">
                <h3 class="mb-2 text-xl font-extrabold font-inter">${pet.pet_name}</h3>
                <div class="flex gap-2">
                    <img src="assets/icons/breed.png" alt="breed">
                    <p class="mb-1 text-sm text-[#131313B2]">Breed: ${pet.breed || 'N/A'}</p>
                </div>
                <div class="flex gap-2">
                    <img src="assets/icons/date.png" alt="birth">
                    <p class="mb-1 text-sm text-[#131313B2]">Birth: ${pet.date_of_birth ? new Date(pet.date_of_birth).getFullYear() : 'N/A'}</p>
                </div>
                <div class="flex gap-2">
                    <img src="assets/icons/gender.png" alt="gender">
                    <p class="mb-1 text-sm text-[#131313B2]">Gender: ${pet.gender || 'N/A'}</p>
                </div>
                <div class="flex gap-2">
                    <img src="assets/icons/price.png" alt="price">
                    <p class="text-sm text-[#131313B2]">Price: ${pet.price ? pet.price : 'N/A'}$</p>
                </div>
            </div>
            <div class="flex justify-between gap-2 p-4">
                <button onclick="loadLikedPets('${pet.petId}')" class="border border-[#0E7A8126] p-1 rounded-lg hover:outline outline-2 outline-[#0E7A81]"><img src="assets/icons/icons8-like-24.png"/></button>


                <button onclick="adoptPet('${pet.petId}')" id="adoptBtn-${pet.petId}" class="border border-[#0E7A8126] p-2 rounded-lg hover:bg-[#0E7A81] hover:text-white transition-all duration-150 ease-in-out text-[#0E7A81] font-lato font-bold text-sm lg:text-lg">Adopt</button>


                <button onclick="loadDetail('${pet.petId}')" class="border border-[#0E7A8126] p-2 rounded-lg hover:bg-[#0E7A81] hover:text-white transition-all duration-150 ease-in-out text-[#0E7A81] font-lato font-bold text-sm lg:text-lg">Detail</button>
            </div>
        </div>
        `;
        petsContainer.append(card);
    });
}

// Adoption of pets
const adoptPet = async (petId) => {
    const adoptionModal = document.getElementById('adoptionModal');
    const countdownElement = document.getElementById('countdown');
    const adoptBtn = document.getElementById(`adoptBtn-${petId}`);

    let timeLeft = 3;

    countdownElement.textContent = timeLeft;

    adoptionModal.showModal();

    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(countdownInterval);
            adoptionModal.close();

            adoptBtn.innerText = 'Adopted';
            adoptBtn.disabled = true;
        }
    }, 1000);
}


getCategory()

getPets()