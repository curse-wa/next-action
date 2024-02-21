fetch("https://nether.wowhead.com/tooltip/item/19019?dataEnv=4&locale=0")
        .then((response) => response.json())
  .then((data) => {
          console.log(data)
  })
