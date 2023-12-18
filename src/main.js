document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('url-input');
    const submitButton = document.getElementById('submit-button');
    const shortenedLinkContainer = document.getElementById('shortened-link');
    const shortUrl = document.getElementById('short-url');

    submitButton.addEventListener('click', shortenLink);

    urlInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            shortenLink();
        }
    });

    function shortenLink() {
        let longUrl = urlInput.value.trim();

        if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://') && longUrl.startsWith('www.')) {
            longUrl = 'http://' + longUrl;
        }

        if (isValidUrl(longUrl)) {
            shortenUrl(longUrl);
        } else {
            shortenedLinkContainer.style.display = 'none';
            shortUrl.textContent = '';
            notie.alert({
                type: 'error',
                text: 'Wprowadź poprawny URL.',
                time: 3
            });
        }
    }

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    function shortenUrl(longUrl) {
        const apiUrl = 'http://localhost:8080/link/short?url=';
    
        fetch(apiUrl + encodeURIComponent(longUrl))
            .then(response => response.json())
            .then(data => {
                if (data.url) {
                    shortenedLinkContainer.style.display = 'block';
                    shortUrl.textContent = data.url;
                    urlInput.value = '';
                    
                    shortUrl.addEventListener('click', function () {
                        const tempInput = document.createElement('input');
                        tempInput.value = data.url;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        notie.alert({
                            type: 'success',
                            text: 'Link został skopiowany!',
                            time: 3
                        });
                    });
                } else {
                    shortenedLinkContainer.style.display = 'none';
                    shortUrl.textContent = '';
                    notie.alert({
                        type: 'error',
                        text: 'Wystąpił problem podczas skracania linku.',
                        time: 3
                    });
                }
            })
            .catch(error => {
                shortenedLinkContainer.style.display = 'none';
                shortUrl.textContent = '';
                notie.alert({
                    type: 'error',
                    text: 'Wystąpił problem z serwerem. Spróbuj ponownie za chwilę.',
                    time: 3
                });
            });
    }
});