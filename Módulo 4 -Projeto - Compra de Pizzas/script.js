let cart = [];
let modalQt = 1;
let modalKey = 0;
let valorPizza = 0;
let valorAcDm = 0;

const doc = sl => document.querySelector(sl);
const docs = sl => document.querySelectorAll(sl);

// Listagem de pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = doc('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    pizzaItem.querySelector('a').addEventListener('click', e => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        valorPizza = pizzaJson[key].price;
        valorAcDm = valorPizza;

        doc('.pizzaBig img').src = pizzaJson[key].img;
        doc('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        doc('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorPizza.toFixed(2)}`;

        doc('.pizzaInfo--size.selected').classList.remove('selected');
        

        docs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2){
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        doc(".pizzaInfo--qt").innerHTML = `0${modalQt}`;

        doc('.pizzaWindowArea').style.opacity = '0';
        doc('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            doc('.pizzaWindowArea').style.opacity = '1';
        });
    });

    doc('.pizza-area').append(pizzaItem);
});

// Eventos do MODAL
function closeModal(){
    doc('.pizzaWindowArea').style.opacity = '0';
    setTimeout(() => {
        doc('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

docs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(item => {
    item.addEventListener('click', closeModal);
});

doc(".pizzaInfo--qtmenos").addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        if(modalQt < 10){
            doc(".pizzaInfo--qt").innerHTML = `0${modalQt}`;
        }else{
            doc(".pizzaInfo--qt").innerHTML = modalQt;
        }
        valorPizza = valorPizza-valorAcDm;
        doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorPizza.toFixed(2)}`;
    }
    
    
});
doc(".pizzaInfo--qtmais").addEventListener('click', ()=>{
    modalQt++;
    if(modalQt < 10){
        doc(".pizzaInfo--qt").innerHTML = `0${modalQt}`;
    }else{
        doc(".pizzaInfo--qt").innerHTML = modalQt;
    }
    valorPizza = valorPizza+valorAcDm;
        doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorPizza.toFixed(2)}`;

});
        

docs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () =>{
        doc('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});

doc('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(doc('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex(item => item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

doc('.menu-openner').addEventListener('click', () =>{
    if(cart.length > 0){
        doc('aside').style.left = '0';
    }
});
doc('.menu-closer').addEventListener('click', () =>{
    doc('aside').style.left = '100vw';
});

function updateCart(){
    if(cart.length < 10){
        doc('.menu-openner span').innerHTML = `0${cart.length}`;
    }else{
        doc('.menu-openner span').innerHTML = cart.length;
    }
    if(cart.length < 1){
        doc('.menu-openner span').innerHTML = cart.length;
    }

    if(cart.length > 0){
        doc('aside').classList.add('show');
        doc('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto  = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);
            subtotal += pizzaItem.price*cart[i].qt;

            let cartItem = doc(".models .cart--item").cloneNode(true);

            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            let Qt = cart[i].qt;
            if (Qt < 10){
                Qt = `0${Qt}`;
            }

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector(".cart--item--qt").innerHTML = Qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart()
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qt++;
                updateCart();
            });

            doc(".cart").append(cartItem);
        }

        desconto = subtotal*0.1;
        total = subtotal - desconto;

        doc('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        doc('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        doc('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else{
        doc('aside').classList.remove('show');
        doc('aside').style.left = '100vw';
    }

}