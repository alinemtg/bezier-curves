setHeaderImg()

function setHeaderImg() {
    var headerImg = document.querySelector(".header-img")
    headerImg.src = getRandomImage()
}

function getRandomImage() {
    var images = ['./assets/1.png', './assets/2.png', './assets/3.png', './assets/4.png']
    var image = images[Math.floor(Math.random()*images.length)]
     
    return image
    }
     
