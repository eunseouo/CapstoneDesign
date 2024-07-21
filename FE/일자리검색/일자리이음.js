var container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
var options = { // 지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(37.62410009545093, 127.06064303127741), // 지도의 중심좌표.
  level: 8 // 지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

// 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 인포윈도우와 마커를 관리할 배열
let infowindowArray = [];
let markerArray = [];

// 더미데이터 준비하기 (제목, 주소, 거리)
const dataSet = [
  { name: "할머니냉면", address: "서울 동대문구 왕산로37길 53", distance: "556m" },
  { name: "세븐일레븐", address: "서울 동대문구 망우로 77", distance: "654m" },
  { name: "피자파스토", address: "서울 동대문구 망우로12가길 33 1층", distance: "588m" },
	{ name: "미스터피자", address: "서울 노원구 석계로1길 22", distance: "700m" },
  { name: "스타벅스", address: "서울 노원구 석계로 104", distance: "300m" },
];

function getCoordsByAddress(address) {
  return new Promise((resolve, reject) => {
    geocoder.addressSearch(address, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        resolve(new kakao.maps.LatLng(result[0].y, result[0].x));
      } else {
        reject(new Error("getCoordsByAddress Error: not Valid Address"));
      }
    });
  });
}

function createMarker(coords, data) {
  var marker = new kakao.maps.Marker({
    map: map,
    position: coords,
  });

  var infowindow = new kakao.maps.InfoWindow({
    content: getContent(data),
  });

  markerArray.push(marker);
  infowindowArray.push(infowindow);

  // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
  kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow, coords));
  return marker;
}

function getContent(data) {
  return `
  <div class="infowindow">
    <p class="infowindow-name">${data.name}</p>
    <p class="infowindow-address">${data.address}</p>
  </div>`;
}

async function setMap(dataSet) {
  for (let data of dataSet) {
    try {
      let coords = await getCoordsByAddress(data.address);
      createMarker(coords, data);
    } catch (error) {
      console.error(error);
    }
  }
}

// 클릭했을때 실행할 이벤트
function makeOverListener(map, marker, infowindow, coords) {
  return function () {
    closeInfoWindow();
    infowindow.open(map, marker);
    // 클릭한 곳으로 마커이동
    map.panTo(coords);
  };
}

function closeInfoWindow() {
  infowindowArray.forEach(infowindow => infowindow.close());
}

// 지도 클릭 이벤트를 추가합니다
kakao.maps.event.addListener(map, 'click', function() {
  closeInfoWindow();
});

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

function searchPlaces() {
  var keyword = document.querySelector('#keyword').value.trim();

  if (!keyword) {
    alert('장소를 입력해주세요!');
    return false;
  }

  ps.keywordSearch(keyword, placesSearchCB);
}

function placesSearchCB(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    var bounds = new kakao.maps.LatLngBounds();

    data.forEach(place => {
      //검색 시 카카오맵에서 다른 장소들 불러오기
      //displayMarker(place);
      bounds.extend(new kakao.maps.LatLng(place.y, place.x));
    });

    map.setBounds(bounds);
  }
}

setMap(dataSet);


//⭐데이터를 받아와서 html 에 넣어주기
// 컨테이너 요소를 선택합니다.
var wpList = document.querySelector('.wpList');

// dataSet을 사용하여 wpList 요소를 생성합니다.
for (let i = 0; i < dataSet.length; i++) {
  var wpListDiv = document.createElement('div');
  wpListDiv.className = 'wpList';

  var wpName = document.createElement('p');
  wpName.className = 'wpName';
  wpName.innerHTML = dataSet[i].name;
  wpName.addEventListener('click', function() {
    var d_wpListFilter = document.querySelector('#wpListFilter');
    var d_wpList = document.querySelector('#wpList');
        //d_wpListFilter.style.display = 'none';
        var dataSet_name = JSON.stringify(dataSet.name);
        d_wpListFilter.innerHTML = `${dataSet_name} 직원 구합니다` ;
        d_wpListFilter.createElement = `<button>신청하기</button>`;
    });

  var wpDistance = document.createElement('p');
  wpDistance.className = 'wpDistance';
  wpDistance.innerHTML = dataSet[i].distance;

  var wpAddress = document.createElement('p');
  wpAddress.className = 'wpAddress';
  wpAddress.innerHTML = dataSet[i].address;

  var br = document.createElement('br');

  var wpCall = document.createElement('button');
  wpCall.className = 'wpCall';
  wpCall.innerHTML = '전화';

  var wpFindRoad = document.createElement('button');
  wpFindRoad.className = 'wpFindRoad';
  wpFindRoad.innerHTML = '길찾기';

  // wpList에 요소들을 추가합니다.
  wpListDiv.appendChild(wpName);
  wpListDiv.appendChild(wpDistance);
  wpListDiv.appendChild(wpAddress);
  wpListDiv.appendChild(br);
  wpListDiv.appendChild(wpCall);
  wpListDiv.appendChild(wpFindRoad);

  // 컨테이너에 wpList를 추가합니다.
  wpList.appendChild(wpListDiv);
}
