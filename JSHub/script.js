let buttonFetch = document.querySelectorAll('aside button'); // Sáhnutí na vechna tlačítka
const contentBox = document.getElementById('content-box'); // Sáhnutí na boxík (selection)
const container = document.getElementById('closeup-img'); // Sáhnutí na spodní div pro přibližování obrázků

//* --- CENTRÁLNÍ LIGHTBOX BUILD (Generický) ---
function genericLightboxActivation() {
    // Zjednodušení selektoru -> budu hledat všechny obrázky v Contentboxu
    const closeupImages = document.querySelectorAll('#content-box img'); // Sáhnutí na obrázky v contentboxu

    closeupImages.forEach(image => { // Projetí každého obrázku, který se tam fetchne
        image.addEventListener('click', function() {
            let pathToImage = image.dataset.src; // Uložení cesty k obrázku přes dataset
            container.innerHTML = `<img src="${pathToImage}" alt="Přiblížený obrázek" />` // Vložení celého tagu se správnou cestou do kontejneru
            container.classList.remove("closeup-img"); // Odebrání neviditelnosti
            container.classList.add("show"); // Přidání stylů a umístění
        });
    });
}

container.addEventListener('click', function() {
    container.classList.remove('show'); // Odebrání stylů a umístění
    container.classList.add('closeup-img'); // Přidání neviditelnosti
});

//* --- CENTRÁLNÍ FETCH BUILD (Generický) ---
buttonFetch.forEach(btn => { // Projede všechny buttony
    btn.addEventListener('click', async function() { // Asynchronní fetch
        const filePath = `Content/${btn.dataset.soubor}.html`; // Cesta k souborům přes data-set

        //* Úprava fetchingu přes try/catch bloky
        try {
            let response = await fetch(filePath); // Počká se na provedení fetche
            if (!response.ok) { // Error handling
                throw new Error("Server error");
            }
            let data = await response.text(); // Převedení odpovědi na text, protože nedostavám JSON, jako z API
            contentBox.innerHTML = data; // Vložení fetche do content-boxu

            genericLightboxActivation(); //* Až teď volám funkci na projetí obrázků ->
                                        //* protože až teď má co projíždět

            // Nastovování class
            buttonFetch.forEach(btnClass => { //* Musím znovu projet každé tlačítko + změna proměnné z btn na btnClass pro lepší přehlednost
                btnClass.classList.remove('active'); //* Každé zhasnout
            }); //* Změna proměnné -> Vyhýbám se stínování proměnných

            btn.classList.add("active"); //* Mimo vnořený cyklus rosvítím to, na které se kliklo

        } catch (error) {
            contentBox.innerHTML = ("Omlouvám se, cvičení se nepodařilo načíst"); // Když nastane error, hodím zprávu do content-boxu
        }
    });
});

