const bg = 'black';
const table_size = 70;
var player = {
    x: 25,
    y: 60,
    s: 20,
    base_size: 20,
    color: 'green',
    balance: 500,
    count: 0,
    set_balance: (val) => {
        if(val>0 && player.balance < 1000) {
            player.balance += val;
        }
        if(val<0) {
            player.balance += val;
        }
        balance_draw();
        if(player.balance <= 0) {
            game_over();
        }
    }
};

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function draw_table() {
    let table_str = '<table>';
    for(let i=1; i <= table_size; i++) {
        table_str += '<tr>';
        for(let j=1; j <= table_size; j++) {
            //table_str += `<td id='cell_${j}_${i}'>${j},${i}</td>`;
            table_str += `<td id='cell_${j}_${i}'><div class='div_cell' id='div_cell_${j}_${i}'></div></td>`;
            //table_str += `<td id='cell_${j}_${i}'>${i}</td>`;
        }
        table_str += '</tr>';
    }
    table_str += '</table>';
    document.getElementById('field').innerHTML = table_str;

    /*
    for(let i=1; i<=table_size; i++) {
        var shift = 0;
        if(i>=15) {
            shift = i - 15;
        }
        for(let j=table_size - player.base_size + shift + 5; j <= table_size; j++) {
            console.log(`${j}-${i}`);
            let cell = get_cell_el(j, i);
            cell.style.backgroundColor = 'grey';
        }
    }
    */
}
function color_start_cell() {
    board_draw(player.color);
}
function get_cell_el(x, y) {
    return document.getElementById(`cell_${x}_${y}`);
}
function get_div_cell_el(x, y) {
    return document.getElementById(`div_cell_${x}_${y}`);
}
function board_draw(color) {
    for(let i=player.x; i<player.x+player.s; i++) {
        let cell = get_cell_el(i, player.y);
        //console.log(`${color}: ${cell.id}`);
        cell.style.backgroundColor = color;
    }
}

function board_resize() {
    if(player.y < 13) player.s = 5;
    if(player.y >= 13 && player.y < 16) player.s = 6;
    if(player.y >= 16 && player.y < 19) player.s = 7;
    if(player.y >= 19 && player.y < 22) player.s = 8;
    if(player.y >= 22 && player.y < 25) player.s = 9;
    if(player.y >= 28 && player.y < 31) player.s = 10;
    if(player.y >= 31 && player.y < 34) player.s = 11;
    if(player.y >= 34 && player.y < 37) player.s = 12;
    if(player.y >= 37 && player.y < 40) player.s = 13;
    if(player.y >= 40 && player.y < 43) player.s = 14;
    if(player.y >= 43 && player.y < 46) player.s = 15;
    if(player.y >= 46 && player.y < 49) player.s = 16;
    if(player.y >= 49 && player.y < 52) player.s = 17;
    if(player.y >= 52 && player.y < 55) player.s = 18;
    if(player.y >= 55 && player.y < 58) player.s = 19;
    if(player.y >= 58) player.s = 20;
    
}

function move(direction) {
    current_coins.check();
    switch(direction) {
        case 'up':
            if(player.y === 1) {
                break;
            }
            board_draw(bg);
            player.y--;
            board_resize();
            board_draw(player.color);
            break;
        case 'down':
            if(player.y === table_size) {
                break;
            }
            board_draw(bg);
            player.y++;
            board_resize();
            board_draw(player.color);
            break;
        case 'left':
            if(player.x === 1) {
                break;
            }
            board_draw(bg);
            player.x--;
            board_draw(player.color);
            break;
        case 'right':
            if(player.x === table_size - player.s + 1) {
                break;
            }
            if(player.x === table_size - player.base_size + 1) {
                move('down');
                break;
            }
            board_draw(bg);
            player.x++;
            board_draw(player.color);
            break;
    }
}

function balance_draw() {
    var balance_bar = document.getElementById('balance_bar');
    let height = player.balance / 2
    if(height>480) {
        height = 480;
    }
    if(height<0) {
        height = 0;
    }
    let color;
    if(height > 320) {
        color = '#a5ff00';
    }
    else if(height > 160) {
        //color = '#ff9100';
        color = '#ffef00';
    }
    else {
        color = '#ff0000';
    }
    let margin_top = 480 - height;
    balance_bar.style.height = `${height}px`;
    balance_bar.style.marginTop = `${margin_top}px`;
    balance_bar.style.backgroundColor = `${color}`;
    document.getElementById('balance').innerHTML = player.balance;
}

function game_over() {
    current_coins.on_pause();
    document.getElementById('count').innerHTML = player.count;
    document.getElementById('game_over').style.display = 'block';
}

function view_second() {
    document.getElementById('first').style.display = 'none';
    document.getElementById('second').style.display = 'block';
}
function view_game() {
    document.getElementById('first').style.display = 'none';
    document.getElementById('second').style.display = 'none';
}

function key_ctrl(e) {
    switch(e.code) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
        case 'KeyN':
            console.log('nnn');
            view_second();
            break;
        case 'KeyR':
            console.log('rrr');
            document.location.reload();
            break;
        case 'Enter':
            current_coins.on_press_enter();
            break;
        case 'KeyP':
            console.log('ppp');
            current_coins.on_pause()
            break;
    }
}

document.addEventListener('keydown', key_ctrl);
