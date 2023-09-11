// x,y 좌표 parsing
let v_ajax = new XMLHttpRequest();
v_ajax.open("GET", "xycoord.csv");

v_ajax.onload = ()=>{
let v_coord={};
//console.log(v_ajax.response);

let v_response = v_ajax.response;

let v_rows = v_response.split("\n");
//console.log(v_rows);

let v_headers = v_rows[0].split(",");
//console.log(v_headers[3]);
v_headers[3]=v_headers[3].replace("\r","");//y좌표 옆 여백 제거

//console.log(v_headers); //1단계(시) 2단계(구) X Y(\r)

for(let i=0; i<v_headers.length; i++){
    v_coord[v_headers[i]] = []; //키 값 할당
}

//console.log(v_coord);

for(let i=0; i<v_rows.length-1; i++){
    let v_cols = v_rows[i].split(","); //전체 길이 만큼 분할.
    for(let k=0; k<v_headers.length; k++){
        v_coord[v_headers[k]].push(v_cols[k].replace("\r", "")); //키값에 대한 값 할당.
    }
}
console.log(v_coord);
localStorage.setItem("cityData" , JSON.stringify(v_coord));
}

v_ajax.send();

  // 날짜 포맷 변환 20230904
  let today = new Date();
  let year = today.getFullYear();
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let day = ("0" + today.getDate()).slice(-2);
  let todayFormat = year + month + day;

  //시간 포맷 변환 0700
  var hours = ("0" + today.getHours()).slice(-2);
  var minutes;
  if (today.getMinutes() <= 30) {
    minutes = "00";
    hours = "0"+(hours - 1);
  } else {
    minutes = "30";
  }
  var timeString = hours + minutes;
  console.log(timeString);

  //select 에서 값 + input에서 값 가져오기
  let slectCity;
  let city = document.getElementById("city");
  let v_city = JSON.parse(localStorage.getItem("cityData"));
  let selectX = 0;
  let selectY = 0;
  let v_category = {};
  let v_weatherCategory = {};

  
  function f_change() {
    slectCity = city.options[city.selectedIndex].value;
  }

  const searchBox = document.querySelector(".search input");
  const searchBtn = document.querySelector(".search button");
  const weatherIcon = document.querySelector(".weather-icon");

 
  searchBtn.addEventListener("click", () => {
    for (let i = 1; i < v_city["1단계"].length; i++) {
    if (
      slectCity == v_city["1단계"][i] &&
      searchBox.value == v_city["2단계"][i]
    ) {
      selectX = v_city["격자X"][i];
      selectY = v_city["격자Y"][i];

    } else if( slectCity != v_city["1단계"][i] ||
      searchBox.value != v_city["2단계"][i]){
      document.querySelector(".error").style.display = "block";
    }
  }

    const apiKey =
      "V86rgBzVXeKu7NAnsbaCDHCQBDBhwTvSuuHuo6%2FmlB7BXdZ%2BfaYm5Utu9cZ9uEG5lXuDN8jjBac2QMyozEg5Iw%3D%3D";
    let v_weather = [];
    let v_weatherResult = [];

    var xhr = new XMLHttpRequest();
    var url =
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst"; /*URL*/
    var queryParams =
      "?" + encodeURIComponent("serviceKey") + "=" + apiKey; /*Service Key*/
    queryParams +=
      "&" +
      encodeURIComponent("pageNo") +
      "=" +
      encodeURIComponent("1"); /**/
    queryParams +=
      "&" +
      encodeURIComponent("numOfRows") +
      "=" +
      encodeURIComponent("300"); /**/
    queryParams +=
      "&" +
      encodeURIComponent("dataType") +
      "=" +
      encodeURIComponent("JSON"); /**/
    queryParams +=
      "&" +
      encodeURIComponent("base_date") +
      "=" +
      encodeURIComponent(todayFormat); /**/
    queryParams +=
      "&" +
      encodeURIComponent("base_time") +
      "=" +
      encodeURIComponent(timeString); /**/
    queryParams +=
      "&" +
      encodeURIComponent("nx") +
      "=" +
      encodeURIComponent(selectX); /**/
    queryParams +=
      "&" +
      encodeURIComponent("ny") +
      "=" +
      encodeURIComponent(selectY); /**/
    xhr.open("GET", url + queryParams);

    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        let v_result = JSON.parse(this.responseText);
        let v_items = v_result["response"]["body"]["items"]["item"];

        let category_arr = ["PTY", "SKY", "T1H", "REH", "WSD"];
        let list = [];
        category_arr.forEach((cat) => {
          let item = v_items.filter((it) => {
            return it.category == cat;
          });
          list.push(item[0].fcstValue);
        });

        console.log(list);

        document.querySelector(".city").innerHTML =
          slectCity + " " + searchBox.value;
        document.querySelector(".wind").innerHTML = list[4] + "km/h";
        document.querySelector(".temp").innerHTML = list[2] + "°c";
        document.querySelector(".humidity").innerHTML = list[3] + "%";
        
        if (list[1] == 1) {
          weatherIcon.src = "./resources/images/clear.png";
        } else if (list[1] == 3) {
          weatherIcon.src = "./resources/images/mist.png";
        } else if (list[1] == 4) {
          weatherIcon.src = "./resources/images/clouds.png";
        } else if (list[1]==0 && list[0]==1 || list[0]==5){
            weatherIcon.src = "./resources/images/rain.png";
        }else if (list[1]==0 && list[0]==3 || list[0]==6 ){
            weatherIcon.src = "./resources/images/snow.png";
        }
          document.querySelector(".weather").style.display = "block";
          document.querySelector(".error").style.display = "none";
      }
    };
    xhr.send("");
  });
