/*
whe whole program is in main function 
*/
(function main(){
/*
variables we need and we should access them globally we set them here 
*/
    var starships_list = document.getElementById('movies_starships')
    let starship_list_name = document.getElementById('starship_header')
    let starship_detail_list = document.getElementById('links_details')
    let current_page_pointer = document.getElementById('currentPage')
    let previous_page_pointer = document.getElementById('previous_page_button')
    let next_page_pointer = document.getElementById('next_page_button')
    let movies_get_back_name = document.getElementById('get_back_to_movies');
    let cachedFilms = []
    var current_page = 1;
    var page_limit = 0;
    var global_starship = 0;
    var objs = [];
    var urls = ["https://swapi.dev/api/films/4", "https://swapi.dev/api/films/5", "https://swapi.dev/api/films/6", "https://swapi.dev/api/films/1", "https://swapi.dev/api/films/2", "https://swapi.dev/api/films/3"];
/*
the first things that happens when page is loading and fetch all movies and their links
*/
    window.onload = async () => {
        document.getElementById("previous_page_button").style.visibility="hidden";
        document.getElementById("currentPage").style.visibility="hidden";
        document.getElementById("next_page_button").style.visibility="hidden";
        document.getElementById("get_back").style.visibility="hidden";
        movies_get_back_name.innerHTML = "Movies";
        starship_list_name.textContent = ""
        starship_detail_list.innerHTML = []
        var section = document.getElementById('movies_starships');
        section.innerHTML = "";
        // Promise.all(urls.map(url => fetch(url)
        // .then(response => response.json())
        // .then(responseBody => responseBody)))
        // .then(titles => {titles.forEach(title => insert_function_ships(title,section))
        //  })
        (async() => {
            for(let i = 0; i < urls.length; i++){
                let obj = await load(urls[i]);
                insert_function_starships(obj, section);
                objs.push(obj);
            }
          })();
        // .catch(err => {
        // console.error('Failed to fetch one or more of these URLs:');
        // console.log(urls);
        // console.error(err);
        // });
    };
/*
this function load a url for us using fetch
*/
    async function load(url) {
        var obj = null;
        try {
            obj = await (await fetch(url)).json();
        } catch(e) {
            console.log('error');
        }
        return obj;
    }
/*
this function insert movies name and starships links to the lists
*/
    function insert_function_starships(input, section){
        detail_section = document.getElementById("links_details");
        let starships_links = document.getElementById("starship_header");
        starships_links.innerHTML = "Links";
        li = document.createElement("li");
        li.classList.add('item')
        li.innerHTML = input.title + " ------ " + input.episode_id + " ------ " + input.release_date;
        links_li = document.createElement("li");
        let a = document.createElement('a');
        a.setAttribute('href', '#');
        a.setAttribute('data-index', input.starships);
        a.classList.add('link');
        a.textContent = "Starships";
        a.addEventListener('click', e => {
            e.preventDefault()
            section = document.getElementById("movies_starships");
            section.innerHTML = '';
            starships_links.innerHTML = '';
            detail_section.innerHTML = '';
            document.getElementById("previous_page_button").style.visibility="visible";
            document.getElementById("currentPage").style.visibility="visible";
            document.getElementById("next_page_button").style.visibility="visible";
            document.getElementById("get_back").style.visibility="visible";
            page_limit = Math.ceil(input.starships.length / 5);
            global_starship = input.starships;
            show_starship_list();
            console.log(e);
        })
        section.append(li);
        links_li.append(a);
        detail_section.append(links_li);
    }
/*
this function insert starships names and their details by click
*/
    function insert_function_starship_detail(input){
        section = document.getElementById("movies_starships");
        li = document.createElement("li");
        li.classList.add('item')
        // li.innerHTML = input.title + "------" + input.episode_id + "------" + input.release_date;
        let a = document.createElement('a')
        a.setAttribute('href', '#')
        a.setAttribute('data-index', input.films)
        a.classList.add('link')
        a.textContent = input.name
        a.addEventListener('click', e => {
            e.preventDefault()
            // section = document.getElementById("starships");
            // section.innerHTML = '';
            show_starship_details(input)
            console.log(e)
        })
        li.append(a)
        section.append(li);
    }
/*
this function get movies that have not been fetched
*/
    function generate_urls_unfetched(check_url) {
        const uncached = []
        for(const url of check_url) {
            if(!cachedFilms.find(cfilm => cfilm.url === url)) {
                uncached.push(url)
            }
        }
        return uncached
    }
/*
this function replace window onload and cause much faster loading when we want to get back to the movies
*/
    function go_to_main_window(){
        document.getElementById("previous_page_button").style.visibility="hidden";
        document.getElementById("currentPage").style.visibility="hidden";
        document.getElementById("next_page_button").style.visibility="hidden";
        document.getElementById("get_back").style.visibility="hidden";
        movies_get_back_name.innerHTML = "Movies";
        starship_list_name.textContent = ""
        starship_detail_list.innerHTML = []
        var section = document.getElementById('movies_starships');
        section.innerHTML = "";
        // Promise.all(urls.map(url => fetch(url)
        // .then(response => response.json())
        // .then(responseBody => responseBody)))
        // .then(titles => {titles.forEach(title => insert_function_ships(title,section))
        //  })

        for(let i = 0; i < 6; i++){
            insert_function_starships(objs[i], section);
        }
    }
/*
this function make list of starships and is aware of clicking next or privious page
*/
    async function show_starship_list() {
        // let movies = document.getElementById('get_back_to_movies');
        movies_get_back_name.innerHTML = "Starships";
        document.getElementById("get_back").addEventListener('click', e => {
            current_page = 1;
            current_page_pointer.textContent = `Current Page: ${current_page}`
            starships_list.innerHTML = "";
            go_to_main_window();
        })
        let new_urls = global_starship.slice(5 * (current_page - 1), current_page * 5);
        Promise.all(new_urls.map(url => fetch(url)
        .then(response => response.json())
        .then(responseBody => responseBody)))
        .then(titles => {titles.forEach(title => insert_function_starship_detail(title))
         })
        .catch(err => {
            console.error('Failed to fetch one or more of these URLs:');
            console.log(new_urls);
            console.error(err);
        });
        next_page_pointer.addEventListener('click', go_to_next_page)
        previous_page_pointer.addEventListener('click', go_to_previous_page)
    }
/*
this function makes starship detail list when we click on them
*/
    async function show_starship_details(starship) {
        const uncachedUrlFilms = generate_urls_unfetched(starship.films)
        let starshipFilms;
        if(uncachedUrlFilms.length > 0) {
            starshipFilms = await get_films(uncachedUrlFilms)
            cachedFilms = cachedFilms.concat(starshipFilms)
        }
        filmNames = cachedFilms.filter(film => starship.films.includes(film.url)).map(film => film.title)
        starship_list_name.textContent = starship.name
        starship_detail_list.innerHTML = []
        Object.entries(starship).forEach(([key, value]) => {
            if(key != 'created' && key != 'edited' && key != 'films' && key != 'pilots' && key != 'url') {
                const readableKey = key.replaceAll('_', ' ').split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
                let li = document.createElement('li')
                li.classList.add('item')
                li.textContent = `${readableKey}: ${value}`
                starship_detail_list.append(li);        
            }
        })
        let li = document.createElement('li')
        li.classList.add('item')
        li.textContent = `${'Film(s)'}: ${filmNames}`
        starship_detail_list.append(li);
        // nextPageButton.addEventListener('click', getNextPage)
        // prevPageButton.addEventListener('click', getPrevPage)
    }
/*
this function get all movies 
*/   
    function get_films(url_of_film) {
        return Promise.all(url_of_film.map(get_film))
    }
/*
this function is used in previous function for getting movies
*/
    async function get_film(url) {
        try {
            let response = await fetch(url)
            if(response.status >= 400) {
                showError(`Request failed with error ${response.status}`)
                return Promise.reject(`Request failed with error ${response.status}`)
            }
            return await response.json()
        } catch(e) {
            console.log(e)
        }
    } 
/*
this function get avtivated when we press next page button and adjust pagination
*/   
    async function go_to_next_page() {
        if(current_page < page_limit) {
            current_page += 1;
            section = document.getElementById("movies_starships");
            section.innerHTML = '';
            current_page_pointer.textContent = `Current Page: ${current_page}`
            starship_list_name.textContent = ""
            starship_detail_list.innerHTML = []
            show_starship_list();
        }
    }
/*
this function get avtivated when we press previous page button and adjust pagination
*/     
    async function go_to_previous_page() {
        if(current_page > 1) {
            current_page -= 1;
            section = document.getElementById("movies_starships");
            section.innerHTML = '';
            current_page_pointer.textContent = `Current Page: ${current_page}`
            starship_list_name.textContent = ""
            starship_detail_list.innerHTML = []
            show_starship_list();   
        }
    }
})()