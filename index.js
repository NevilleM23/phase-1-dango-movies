document.addEventListener('DOMContentLoaded', function () {
    const filmsList = document.getElementById('films');
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('available-tickets');
    const description = document.getElementById('description');
    const buyTicketButton = document.getElementById('buy-ticket');


    fetch('http://localhost:3000/films')
        .then(resp=> resp.json()) 
        .then(movies => {
            
            filmsList.innerHTML = '';

            movies.forEach(movie => {
                const listItem = document.createElement('li');
                listItem.textContent = movie.title;

                if (movie.capacity - movie.tickets_sold === 0) {
                    listItem.classList.add('sold-out');
                }

                
                listItem.addEventListener('click', () => showMovieDetails(movie));

             
                filmsList.appendChild(listItem);
            });

            if (movies.length > 0) {
                showMovieDetails(movies[0]);
            }
        })
        

    function showMovieDetails(movie) {
        currentMovie = movie;

        poster.src = movie.poster;
        title.textContent = movie.title;
        runtime.textContent = `${movie.runtime}`;
        showtime.textContent = `${movie.showtime}`;
        description.textContent = movie.description;

        const available = movie.capacity - movie.tickets_sold;
        availableTickets.textContent = `${available} tickets available`;

        if (available === 0) {
            buyTicketButton.disabled = true;
            buyTicketButton.textContent = 'Sold Out';
        } else {
            buyTicketButton.disabled = false;
            buyTicketButton.textContent = 'Buy Ticket';
        }
    }

    buyTicketButton.addEventListener('click', function () {
        if (currentMovie) {
    
            const newTicketsSold = currentMovie.tickets_sold + 1;

            fetch(`http://localhost:3000/films/${currentMovie.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tickets_sold: newTicketsSold
                })
            })
                .then(response => response.json())
                .then(updatedMovie => {
                    currentMovie.tickets_sold = updatedMovie.tickets_sold;

                
                    showMovieDetails(updatedMovie);

        
                    const movieItem = Array.from(filmsList.children).find(item => item.textContent === updatedMovie.title);
                    if (updatedMovie.capacity - updatedMovie.tickets_sold === 0) {
                        movieItem.classList.add('sold-out');
                    }
                })
        }
    });
});