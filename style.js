let homeData;
fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product')
.then(resp => resp.json())
.then(data => {
    homeData = data;
    checkHome();
});

let checkHome = function() {
    let url = window.location.pathname, fileName;
    fileName = url.substring(url.lastIndexOf('/')+1);
    if(fileName === 'index.html') {
        createElemHome();
    }
    else if(fileName === 'singleproduct.html') {
        createElemSIngleProd();
    }
    else if(fileName === 'checkout.html') {
        createElemCheckout();
    }
    else if(fileName === 'order-confirmation-page.html') {
        localStorage.clear();
        document.querySelector('.cart-count').innerHTML = 0; 
    }
}

let createElemHome = function() {
    let homeDivCloth = document.querySelectorAll('.prodclothing');
    let homeDivAcc = document.querySelectorAll('.prodaccessories');
    for(let i=0; i<homeData.length; i++) {
        if(homeData[i].isAccessory === false) {
            createElem(homeDivCloth[i], i);
        }
        if(homeData[i].isAccessory === true) {
            createElem(homeDivAcc[i-homeData.length/2], i);
        }
    }
}

let createElem = function(elem, i) {
    elem.querySelector('div > img').src = homeData[i].preview;
    elem.querySelector('h4').textContent = homeData[i].name;
    elem.querySelector('h5').textContent = homeData[i].brand;
    elem.querySelector('p > span').textContent = homeData[i].price;
    elem.setAttribute('data-prod', homeData[i].id);
}

let createElemSIngleProd = function() {
    let prodShow = JSON.parse(localStorage.productList);

    let mainImgDiv = document.querySelector('.mainimg');
    mainImgDiv.children[0].src = prodShow.preview;

    let prodDesc = document.querySelector('.single-prod-desc');
    prodDesc.querySelector('h1').textContent = prodShow.name;
    prodDesc.querySelector('h3').textContent = prodShow.brand;
    prodDesc.querySelector('.price > span').textContent = prodShow.price;
    prodDesc.querySelector('.description').textContent = prodShow.description;
    
    let otherImgDiv = document.querySelector('.otherimg'), emptyDiv='';
    for(let i=0; i<prodShow.photos.length; i++) {
        emptyDiv += `<div ${(i===0) ? 'class="active"' : 'class=""'} onclick="changeImg(this)">
                        <img src="${prodShow.photos[i]}" alt="product image">
                    </div>`
    }
    otherImgDiv.innerHTML = emptyDiv;
}

let createElemCheckout = function(e) {
    let str='', prodcnt, prodammountind=0, ttlcnt=0, itemcnt=0;
    for(let i=1; i<=homeData.length; i++) {
        if(localStorage['prodDetail'+i]) {
            prodcnt = JSON.parse(localStorage['prodDetail'+i]).prodCount;
            str += `<div class="item-ind-chk dropshdw">
                        <div class="ind-chk-img">
                            <img src="${homeData[i-1].preview}">
                        </div>
                        <div class="ind-chk-cnt">
                            <h5>${homeData[i-1].name}</h5> 
                            <h6>Rs ${homeData[i-1].price}</h6>
                            <p>x <span class="ind-item-count">${prodcnt}</span></p>
                            <p>Amount: Rs <span class="ind-item-total-count">${prodcnt*homeData[i-1].price}</span></p>
                        </div>
                    </div>`;
            itemcnt++;
            prodammountind = prodcnt*homeData[i-1].price;
            ttlcnt += prodammountind;
        }
    }
    document.querySelector('.checkout-item').innerHTML = str;
    document.querySelector('.item-count').innerHTML = itemcnt;
    document.querySelector('.total-ammount').innerHTML = ttlcnt;
}

let changeImg = function(e) {
    let activeImg = document.querySelector('.otherimg').children, imgSrc;
    for(let i=0; i<activeImg.length; i++) {
        activeImg[i].classList.remove('active');
    }
    e.classList.add('active');
    imgSrc = e.children[0].src;
    document.querySelector('.mainimg').children[0].src = imgSrc;
}

let changeUrl = function(e) {
    fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product/1')
        .then(resp => resp.json())
        .then(data => {
            if(data) {
               let prodId = e.children[0].getAttribute('data-prod');
                for(let i=0; i<homeData.length; i++) {
                    if(homeData[i].id === prodId) {  
                        localStorage.productList = JSON.stringify(homeData[i]);
                    }
                }
                location.href = 'file:///C:/Users/NTC/Desktop/study/edyoda-assignment/javascript/final%20project/singleproduct.html'; 
            }
    });
}

// let changeUrl = function(e) {
//     let prodId = e.children[0].getAttribute('data-prod');
//     for(let i=0; i<homeData.length; i++) {
//         if(homeData[i].id === prodId) {  
//             localStorage.productList = JSON.stringify(homeData[i]);
//         }
//     }
//     location.href = 'file:///C:/Users/NTC/Desktop/study/edyoda-assignment/javascript/final%20project/singleproduct.html';
// }

let checkoutUrl = function(e) {
    fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/order')
        .then(resp => resp.json())
        .then(data => {
            if(data) {
                location.href = 'file:///C:/Users/NTC/Desktop/study/edyoda-assignment/javascript/final%20project/checkout.html'; 
            }
    });
}

// let checkoutUrl = function(e) {
//     location.href = 'file:///C:/Users/NTC/Desktop/study/edyoda-assignment/javascript/final%20project/checkout.html';
// }

let orderCnfrm = function() {
    location.href = 'file:///C:/Users/NTC/Desktop/study/edyoda-assignment/javascript/final%20project/order-confirmation-page.html';
}

let addcart = function() {
    let prodShow = JSON.parse(localStorage.productList);
    if(localStorage['prodDetail'+prodShow.id]) {
        let count = JSON.parse(localStorage['prodDetail'+prodShow.id]).prodCount + 1;
        window['prodDetail'+prodShow.id] = {
            'prodId':prodShow.id,
            'prodCount': count
        }
        localStorage['prodDetail'+prodShow.id] = JSON.stringify(window['prodDetail'+prodShow.id]);
    }
    else {
        window['prodDetail'+prodShow.id] = {
            'prodId':prodShow.id,
            'prodCount': 1
        }
        localStorage['prodDetail'+prodShow.id] = JSON.stringify(window['prodDetail'+prodShow.id]);
    }
    if(localStorage.cartItemCount) {
        localStorage.cartItemCount = Number(localStorage.cartItemCount)+1;
    }
    else {
       localStorage.cartItemCount = 1; 
    }
    document.querySelector('.cart-count').innerHTML = localStorage.cartItemCount;
}

if(localStorage.cartItemCount) {
   document.querySelector('.cart-count').innerHTML = localStorage.cartItemCount; 
}