const gameArea = document.querySelector('.gameArea');
const btn = document.createElement('button');
const output = document.createElement('div');
const inWord = document.createElement('input');
const scoreBoard = document.createElement('div');
const selWordList = document.createElement('select'); // gives users option to choose word list

scoreBoard.style.color = 'white';
scoreBoard.style.backgroundColor = 'black';
scoreBoard.style.padding = '25px';
inWord.setAttribute('type', 'text');
inWord.classList.add('myInput');
output.style.textAlign = 'center';
btn.textContent = "START GAME!";
output.textContent = "Words Loading..... ";
output.style.letterSpacing = '0';
output.style.fontSize = "1.3em";

/// Add to HTML page
gameArea.append(output);
gameArea.append(inWord);
gameArea.append(scoreBoard);
gameArea.append(selWordList);
gameArea.append(btn);


// hide non-needed
scoreBoard.style.display = 'none';
inWord.style.display = 'none';
btn.style.display = 'none';
selWordList.style.display = 'none';

// https://docs.google.com/spreadsheets/d/1j73pDPxGyVnL_W0fV8WyKsp_AKo2xX4D4YZwRptRgh0/edit?usp=sharing

///game start values
let theWords = [];
let myWords = [];
const game = { sel: '', scramble: '', score: 0, incorrect: 0, wordsLeft: 0, played: myWords.length, inplay: false };
let tempWord = "";
let url = 'https://docs.google.com/spreadsheets/d/1j73pDPxGyVnL_W0fV8WyKsp_AKo2xX4D4YZwRptRgh0/gviz/tq?';

fetch(url)
    .then(res => res.text())
    .then(rep => {
        const data = JSON.parse(rep.substring(47).slice(0, -2));
        //console.log(data);        
        data.table.rows.forEach((row, index) => {
            let holder = [];
            let opt = document.createElement('option');
            opt.appendChild(document.createTextNode(`${row.c[0].v}`));
            opt.value = index;
            selWordList.append(opt);
            row.c.forEach((item) => {
                //console.log(item.v);
                holder.push(item.v);
            });
            holder.shift();
            theWords.push(holder);
            
        });
        btn.style.display = 'block';
        output.textContent = "Please Select your animal word list";
        selWordList.style.display = 'block';
        //console.log(theWords);
})

/// event listeners
btn.addEventListener('click', (e) => {    
    if (!game.inplay) {
        selWordList.style.display = 'none';
        myWords = theWords[selWordList.value].join(' ').split(' ');
        //myWords = ["wow", "testing"];
        game.played = myWords.length;
        game.inplay = true;
    }
    ////console.log(myWords);
    if (myWords.length <= 0) {
        game.inplay = false;
        scoreBoard.style.display = 'none';
        output.style.fontSize = '1.2em';
        output.style.letterSpacing = '0';
        output.innerHTML = `<div>GAME OVER</div>`;
        output.innerHTML = `<div>You got ${game.score} correct vs ${game.incorrect} incorrect out of ${game.played} words total.</div><br>`;
        btn.style.display = 'block';
        output.innerHTML += "Please Select your word list";
        selWordList.style.display = 'block';
        btn.textContent = 'Start New Game';
        inWord.value = '';
        game.score = 0;
        game.incorrect = 0;
    } else {
        inWord.disabled = false;
        inWord.value = '';
        inWord.style.borderWidth = '1px';
        inWord.style.borderColor = '#eee';
        scoreBoard.style.display = 'block';
        inWord.style.display = 'inline';
        btn.style.display = 'none';
        myWords.sort(() => { return 0.5 - Math.random(); });
        game.sel = myWords.shift();
        tempWord = game.sel;
        game.wordsLeft = myWords.length;
        game.scramble = sorter(game.sel);
        if (game.score <= 0 && game.incorrect <= 0) {
            scoreBoard.style.display = 'none';
        }
        addScore();
        output.style.fontSize = '3em';
        output.style.letterSpacing = '0.4em';
        inWord.setAttribute('max_length', game.sel.length);
        inWord.focus();
        output.textContent = `${game.scramble}`;        
    }
});

inWord.addEventListener('keyup', (e) => {
    inWord.style.borderColor = '#eee';
    inWord.style.borderWidth = '1px';
    if (inWord.value.length === game.sel.length || e.code === 'Enter') {
        winChecker();
    }
});

function addScore() {
    let tempOutput = `Score: <b>${game.score}</b> vs incorrect <i>${game.incorrect}</i> <small>${game.wordsLeft}  words left</small>`;
    scoreBoard.innerHTML = tempOutput;    
}

function winChecker() {
    inWord.style.borderWidth = '5px';
    if (inWord.value === game.sel) {
        inWord.style.borderColor = 'green';
        game.score++;
        inWord.disabled = true;
        btn.style.display = 'block';
        if (myWords.length > 0) {
            btn.textContent = 'Click for next word';
        } else {
            btn.textContent = 'Click for final score';
        }        
    } else {
        inWord.style.borderColor = 'red';
        inWord.focus();
        game.incorrect++;
        output.innerHTML = `The correct answer is: ${tempWord}`;
        inWord.disabled = true;
        btn.style.display ='block';
        if (myWords.length > 0) {
            btn.textContent = 'Click for next word';
        } else {
            btn.textContent = 'Click for final score';
        }
        tempWord = "";
    }
    addScore();
}

function sorter(val) {
   let temp = val.split('');    
   temp.sort(()=>{ return 0.5 - Math.random(); });
   temp = temp.join('');   
    if(val === temp) {       
       return sorter(val);
    }
    return temp;
}