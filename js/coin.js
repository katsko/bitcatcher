var base_delay = 400;
var coin_counter = 0;
var div_cell_bg = 'transparent';

class Coin {
    constructor(){
        coin_counter++;
        this.id = coin_counter;
        this.s = 3;
        this.x = get_random_int(2, table_size - this.s);
        this.y = 1;
        this.timer = null;
        //this.delay = base_delay - get_random_int(0, 300);
        this.delay = base_delay;
        this.type = get_random_int(1, 5);
        if(this.type===1) this.color = 'white'; else this.color = 'yellow';
        if(this.type===1) this.text = '$'; else this.text = '₿';
        this.val = 20;
        this.coin_start();
    }

    coin_draw(color) {
        let div_cell = get_div_cell_el(this.x, this.y);
        div_cell.style.backgroundColor = color;
        if(color === div_cell_bg) {
            div_cell.innerHTML = '';
        }
        else {
            div_cell.innerHTML = this.text;
        }
        /*
        else if(this.type!=1) {
            this.val = 100 - this.y;
            div_cell.innerHTML = this.val;
        }
        let cell = get_cell_el(this.x, this.y);
        cell.style.backgroundColor = color;

        for(let i=this.x; i<this.x+this.s; i++) {
            for(let j=this.y; j<this.y+this.s; j++) {
                let cell = get_cell_el(i, j);
                cell.style.backgroundColor = color;
            }
        }
        */
    }

    coin_move() {
        this.coin_draw(div_cell_bg);
        this.y++;
        if(this.y >= table_size - 1) {
            this.coin_lose();
        }
        else {
            this.coin_draw(this.color);
            this.coin_check();
        }
    }

    coin_check() {
        if(this.x + this.s >= player.x && this.x <= player.x + player.s &&
                this.y + this.s >= player.y && this.y <= player.y + 1) {
            this.coin_catch();
        }
    }

    coin_catch() {
        if(this.type===1){
            player.set_balance(-100);
        }
        else {
            //player.set_balance(100-this.y);
            player.count++;
            player.set_balance(this.val);
        }
        clearTimeout(this.timer);
        this.coin_draw(div_cell_bg);
        current_coins.del(this);
    }

    coin_lose() {
        console.log('lose');
        if(this.type!=1) {
            player.set_balance(-100);
        }
        current_coins.del(this);
        clearTimeout(this.timer);
    }

    coin_start() {
        this.timer = setInterval(
            (function(self) {
                return function() {
                    self.coin_move();
                }
             }
            )(this),
            this.delay
        ); 
    }

    coin_stop() {
        clearTimeout(this.timer);
    }
}

class CurrentCoins {
    constructor() {
        this.dict = {};
        this.timer = null;
        this.is_creating = false;
        this.create_delay = 1700;
        this.coin_delay = 5000;
        this.timer_coin_update = null;
        this.is_pause = false;
    }

    add(coin) {
        this.dict[coin.id] = coin;
    }

    del(coin) {
        delete this.dict[coin.id];
    }

    new_coin() {
        let coin = new Coin();
        this.add(coin);
    }

    check() {
        for(let key in this.dict) {
            this.dict[key].coin_check();
        }
    }

    on_press_enter() {
        view_game();
        if(!this.is_creating) {
            this.start_create_coins();
            this.start_update_delay();
        }
    }

    on_pause() {
        // If press "p"
        console.log('on_p');
        this.is_pause = true;
        clearTimeout(this.timer);
        clearTimeout(this.timer_coin_update);
        for(let key in this.dict) {
            let coin = this.dict[key];
            coin.coin_stop();
        }
    }

    start_create_coins() {
        this.timer = setInterval(
            (function(self) {
                return function() {
                    self.new_coin();
                }
             }
            )(this),
            this.create_delay
        ); 
        this.is_creating = true;
    }

    start_update_delay() {
        console.log('start_update_delay');
        this.timer_coin_update = setInterval(
            (function(self) {
                return function() {
                    self.update_coin_delay();
                }
             }
            )(this),
            this.coin_delay
        ); 
        this.is_creating = true;
    }

    update_coin_delay() {
        console.log(base_delay);
        console.log(this.create_delay);
        if(base_delay > 40){
            for(let key in this.dict) {
                let coin = this.dict[key];
                coin.coin_stop();
                base_delay -= 10;
                coin.delay = base_delay;
                coin.coin_start();
            }
        }
        if(this.create_delay > 600){
            clearTimeout(this.timer);
            if(!this.is_pause) {
                this.create_delay -= 100;
                this.start_create_coins();
            }
        }
    }
}

var current_coins = new CurrentCoins();
