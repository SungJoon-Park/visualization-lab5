
let cafe;

d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
    console.log('Cafe' , data);
    cafe = data;
});