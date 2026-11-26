// Approx. nutrition per 100 g (raw/edible). Source basis: ICMR-NIN / IFCT typical values.
const GRAINS = {
  ragi:  {name:"Ragi (finger millet)", kcal:328, protein:7.3,  fibre:11.5, iron:3.9, calcium:344, note:"Richest plant source of calcium"},
  jowar: {name:"Jowar (sorghum)",      kcal:349, protein:10.4, fibre:10.2, iron:4.1, calcium:25,  note:"Light, gluten-free, easy to digest"},
  bajra: {name:"Bajra (pearl millet)", kcal:361, protein:11.6, fibre:11.3, iron:8.0, calcium:42,  note:"High in iron and warming"}
};
const PULSES = {
  moong: {name:"Moong dal",         kcal:348, protein:24.0, fibre:4.1, iron:4.4, calcium:75},
  toor:  {name:"Toor dal",          kcal:335, protein:22.3, fibre:1.5, iron:2.7, calcium:73},
  chana: {name:"Chana dal",         kcal:372, protein:21.0, fibre:5.0, iron:5.3, calcium:56},
  horse: {name:"Horse gram (kulthi)",kcal:321, protein:22.0, fibre:5.3, iron:6.8, calcium:287}
};
const VEG = {
  summer:  {cooling:"Summer: ragi and jowar keep the body cool. Add curd or buttermilk.",
    items:{"Bottle gourd":{kcal:14,protein:.6,fibre:.5,iron:.5,calcium:26},"Ridge gourd":{kcal:20,protein:.5,fibre:.5,iron:.4,calcium:18},
    "Cucumber":{kcal:13,protein:.4,fibre:.5,iron:.6,calcium:10},"Pumpkin":{kcal:25,protein:1.4,fibre:.7,iron:.7,calcium:10},"Raw mango":{kcal:44,protein:.7,fibre:1.2,iron:.5,calcium:10}}},
  monsoon: {cooling:"Monsoon: eat warm, freshly cooked meals. Bajra and jowar suit damp weather.",
    items:{"Drumstick":{kcal:26,protein:2.5,fibre:4.8,iron:.4,calcium:30},"Ivy gourd":{kcal:18,protein:1.2,fibre:1.6,iron:1.4,calcium:40},
    "Snake gourd":{kcal:18,protein:.5,fibre:.8,iron:.4,calcium:26},"Corn":{kcal:86,protein:3.2,fibre:2.7,iron:.5,calcium:2},"Beans":{kcal:26,protein:1.7,fibre:1.6,iron:1.0,calcium:50}}},
  winter:  {cooling:"Winter: bajra and ragi are warming. Pair them with leafy greens and a little ghee.",
    items:{"Spinach (palak)":{kcal:26,protein:2.0,fibre:.6,iron:1.1,calcium:73},"Fenugreek (methi)":{kcal:49,protein:4.4,fibre:1.1,iron:1.9,calcium:395},
    "Carrot":{kcal:48,protein:.9,fibre:1.2,iron:1.0,calcium:80},"Radish":{kcal:17,protein:.6,fibre:.8,iron:.5,calcium:35},"Mustard greens":{kcal:34,protein:4.0,fibre:.9,iron:16.3,calcium:155}}}
};
// {g}=grain, {p}=pulse, {v}=vegetable. Grain-specific dishes for each meal slot.
const DISHES = {
  ragi:  {Breakfast:["Ragi dosa with {p} chutney and {v} palya","Ragi idli with {p} sambar and {v}"],
          Lunch:["Ragi mudde with {p} saaru and {v} curry","Ragi roti with {p} dal and {v} sabzi"],
          Dinner:["Ragi porridge-style khichdi with {p} and {v}","Ragi chapati with {p} kootu and {v}"]},
  jowar: {Breakfast:["Jowar upma with {p} and {v}","Jowar dosa with {p} chutney and {v}"],
          Lunch:["Jowar bhakri with {p} usal and {v} bhaji","Jowar roti with {p} dal and {v} fry"],
          Dinner:["Jowar and {p} khichdi with {v}","Jowar dhebra with {v} and {p} curry"]},
  bajra: {Breakfast:["Bajra thalipeeth with {p} and {v}","Bajra cheela with {p} filling and {v}"],
          Lunch:["Bajra rotla with {p} dal and {v} shaak","Bajra roti with {p} curry and {v}"],
          Dinner:["Bajra khichdi with {p} and {v}","Bajra and {p} soup-porridge with {v}"]}
};
// Approx. dry portions per meal (g) and daily reference values (adult, ICMR-style).
const PORTION = {grain:60, pulse:30, veg:120};
const DAILY = {kcal:2000, protein:55, fibre:30, iron:17, calcium:1000};
const MEAL_SHARE = 0.6; // three millet meals aim to cover ~60% of the day
