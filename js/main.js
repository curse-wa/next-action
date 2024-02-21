fetch("https://www.wowhead.com/classic/item=19019&xml")
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => console.log(data));
