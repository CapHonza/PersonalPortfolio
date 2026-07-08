let buttonFetch = document.querySelectorAll('aside button'); // Sáhnutí na vechna tlačítka
const contentBox = document.getElementById('content-box'); // Sáhnutí na boxík (selection)

buttonFetch.forEach(btn => { // Projede všechna tlačítka
    btn.addEventListener('click', async function() { // Hodí na ně listener
        const filePath = `Content/${btn.dataset.soubor}.html` //* Proměnná s cestou k souborům (využití datasetu -> rychlé, ideální pro tento případ) ->
        //* Prostě si jen sáhnu na dataset v html a vytáhnu jeho hodnotu (data- se odmazává, tudíž zbyde "soubor")

            let response = await fetch(filePath); //* Asynchronní fetch z cesty k souboru
            if (!response.ok) { // Error handling
                throw new Error("Něco se pokazilo");
            }
            let data = await response.text(); // Vyčkání na odpověď
            contentBox.innerHTML = data; //* Vstříknutí odpovědi do HTML sectionu

            // Nastovování class
            buttonFetch.forEach(btnClass => { //* Musím znovu projet každé tlačítko + změna proměnné z btn na btnClass pro lepší přehlednost
                btnClass.classList.remove('active'); //* Každé zhasnout
            }); //* Změna proměnné -> Vyhýbám se stínování proměnných

        btn.classList.add("active"); //* Mimo vnořený cyklus rosvítím to, na které se kliklo
    });
});