/**
 *  A gamble game, if a row of symbols are the same, you can win money
 */

// 1. deposit some money
// 2. Determine the number of lines the user want to bet on
// 3. collect a bet amount
// 4. spin the slot machine
// 5. check if the user won
// 6. give the user money
// 7. play gain
const prompt = require("prompt-sync")();

const ROWS=3;
const COLS=3;

const SYMBOLS_COUNT = {
    "A":2,
    "B":3,
    "C":4,
    "D":5
}

const SYMBOLS_VALUES= {
    "A":5,
    "B":4,
    "C":3,
    "D":2
}

const spin = () =>{
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i =0; i<count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i =0; i<COLS; i ++){
        reels.push([]);
        const pickArray = [...symbols];
        for (let j=0; j< ROWS; j++){ 
            let randomIndex = Math.floor(Math.random()*pickArray.length);  // why can use const to delare here?  every time loop is different block? 
                                                                         // or run one loop and the variable is discarded
            let selectedSymbol = pickArray[randomIndex];                
                                                             // EXPLANATION FOUND!!! Each iteration of the for of loop creates a new scope 
                                                            //  and declares a new variable within that scope.
            pickArray.splice(randomIndex,1);
            reels[i].push(selectedSymbol);
        }
    }
    // console.log(reels);
    return reels;
    
}

const transpose = (reels) => {
    const newArray=[];
    let oldRow = reels.length;
    let oldCol = reels[0].length;
    let newRow = oldCol;
    let newCol = oldRow;
    for (let i =0; i <newRow; i ++){
        newArray.push([]);
        for (let j = 0; j<newCol; j++){
            newArray[i][j]=reels[j][i];
        }
    }
    // console.log(newArray);
    return newArray;
}

const printRows = (rows) => {
    for (let row of rows){
        let rowString = "";
        for (let [i,sym] of row.entries()){
            rowString += sym;
            if (i!=row.length-1){
                rowString+=" | ";
            }
        }
        console.log(rowString);
    }
}


const depo = ()=>{
    while(true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <=0){
            console.log("Invalid deposit amount, please enter again");
        } else{
            return numberDepositAmount;
        }
    }       
}

const getNumberOfLines = ()=>{
    while(true){
        const StringLines = prompt("Enter a line beween (1~3): ");
        const numberLines = parseFloat(StringLines);

        if (isNaN(numberLines) || numberLines <1 || numberLines>3){
            console.log("Invalid line number, please enter again");
        } else{
            return numberLines;
        }
    }     
}

const getBet = (balance,line) =>{
    while(true){
        const Stringbet = prompt("Enter the bet per line: ");
        const numberBetAmount = parseFloat(Stringbet);

        if (isNaN(numberBetAmount) || numberBetAmount <=0 || numberBetAmount*line>balance){
            console.log("Invalid line number, please enter again");
        } else{
            return numberBetAmount;
        }
    }     
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row<lines; row++){
        const symbols = rows[row];
        let allSame= true;
        for (let letter of symbols){
            if (letter!=symbols[0]){
                allSame=false;
                break;
            }
        }
        if (allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings;
}
const game = () =>{
    let balance = depo();
    while (true){
        console.log("you have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const numberBetAmount = getBet(balance,numberOfLines);

        balance -= numberOfLines*numberBetAmount;
        const spinResult = spin();
        const transposeResult = transpose(spinResult);
        const printResult = printRows(transposeResult);
        // console.log("numberOfLines "+ numberOfLines);
        // console.log("transposeResult " +transposeResult);
        // console.log("numberBetAmount "+ numberBetAmount);
        // experimentRows= [["D","D","D"],["A","A","A"],["B","A","C"]];
        const winnings = getWinnings(transposeResult,numberBetAmount,numberOfLines);
        console.log("you win, $"+ winnings.toString());
        balance += winnings;
        if(balance<=0){
            console.log("you ran out of money");
            break;
        }
        const playAgain =prompt("Do you want to play again (y/n)? ");
        if(playAgain != "y") break;
    }
    
};

game();


