var container = document.getElementById("map");
var options = {
  center: new kakao.maps.LatLng(37.62410009545093, 127.06064303127741),
  level: 8,
};

// 지도 생성
var map = new kakao.maps.Map(container, options);
// var marker = new kakao.maps.Marker({
//     position: map.getCenter()
// });
// marker.setMap(map);
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

var geocoder = new kakao.maps.services.Geocoder();

let infowindowArray = [];
let markerArray = [];
let distanceArr = [];

var presentAddressBtn = document.querySelector("#presentAddressBtn");
var mapSearchBtn = document.querySelector("#mapSearchBtn");

const dataSet = [
  {
    workName: "할머니냉면",
    workAddress: "서울 동대문구 왕산로37길 53",
    distance: "",
    startDate: "2024-07-14",
    finishDate: "2024-11-21",
  },
  {
    workName: "세븐일레븐",
    workAddress: "서울 동대문구 망우로 77",
    distance: "",
    startDate: "2024-04-15",
    finishDate: "2024-10-17",
  },
  {
    workName: "피자파스토",
    workAddress: "서울 동대문구 망우로12가길 33 1층",
    distance: "",
    startDate: "2024-02-11",
    finishDate: "2024-08-31",
  },
  {
    workName: "미스터피자",
    workAddress: "서울 노원구 석계로1길 22",
    distance: "",
    startDate: "2023-07-14",
    finishDate: "2024-10-17",
  },
  {
    workName: "스타벅스",
    workAddress: "서울 노원구 석계로 104",
    distance: "",
    startDate: "2024-07-24 ",
    finishDate: "2024-08-17",
  },
];

let userCoords;

// 주소를 좌표로 변환하는 함수
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

// 마커 생성 함수
function createMarker(coords, data, index) {
  var marker = new kakao.maps.Marker({
    map: map,
    position: coords,
  });

  var infowindow = new kakao.maps.InfoWindow({
    content: getContent(data),
  });

  markerArray.push(marker);
  infowindowArray.push(infowindow);

  kakao.maps.event.addListener(
    marker,
    "click",
    makeOverListener(map, marker, infowindow, coords, index)
  );
  return marker;
}

// 정보창 내용 생성 함수
function getContent(data) {
  return `
    <div class="infowindow">
        <p class="infowindow-name">${data.workName}</p>
        <p class="infowindow-address">${data.workAddress}</p>
        <p class="infowindow-distance">${data.distance}</p>
    </div>`;
}

// 지도에 마커 및 정보창 설정 함수
async function setMap(dataSet) {
  for (let i = 0; i < dataSet.length; i++) {
    try {
      let coords = await getCoordsByAddress(dataSet[i].workAddress);
      createMarker(coords, dataSet[i], i);
    } catch (error) {
      console.error(error);
    }
  }
}

// 마커 클릭 이벤트 리스너 생성 함수
function makeOverListener(map, marker, infowindow, coords, index) {
  return function () {
    closeInfoWindow();
    infowindow.open(map, marker);
    map.panTo(coords);
  };
}

// 정보창 닫기 함수
function closeInfoWindow() {
  infowindowArray.forEach((infowindow) => infowindow.close());
}

// 지도 클릭 시 모든 정보창 닫기
kakao.maps.event.addListener(map, "click", function () {
  closeInfoWindow();
});

var ps = new kakao.maps.services.Places();

// 키워드로 장소 검색
function searchPlaces() {
  var mapSearch = document.querySelector("#mapSearch").value.trim();

  if (!mapSearch) {
    alert("장소를 입력해주세요!");
    return false;
  }

  ps.keywordSearch(mapSearch, placesSearchCB);
}

// 장소 검색 콜백 함수
function placesSearchCB(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    var bounds = new kakao.maps.LatLngBounds();

    data.forEach((place) => {
      bounds.extend(new kakao.maps.LatLng(place.y, place.x));
    });

    map.setBounds(bounds);
    map.panTo(bounds.getCenter());
  }
}

// 현위치 주소 저장 및 거리 계산 함수
async function savePresentAddress() {
  const address = document.getElementById("presentAddress").value;
  if (!address) {
    alert("주소를 입력해주세요!");
    return;
  }

  try {
    userCoords = await getCoordsByAddress(address);
    alert("현위치가 저장되었습니다.");

    for (let i = 0; i < dataSet.length; i++) {
      let coords = await getCoordsByAddress(dataSet[i].workAddress);
      const distance = calculateDistance(userCoords, coords);
      dataSet[i].distance = `${distance.toFixed(2)}m`;
    }

    updateWpList();
  } catch (error) {
    console.error(error);
    alert("유효한 주소를 입력해주세요.");
  }
}


// 버튼 클릭 이벤트 리스너
presentAddressBtn.addEventListener("click", function () {
  savePresentAddress();
  // 필터링 이벤트 리스너
  document
    .getElementById("howToShowFilter")
    .addEventListener("change", function () {
      const selectedValue = this.value;

      if (selectedValue === "closeFilter") {
        closeFiltering();
      } else if (selectedValue === "recentFilter") {
        recentFiltering();
      }
    });
});

// 두 좌표 사이의 거리 계산 함수
function calculateDistance(coords1, coords2) {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = ((coords2.getLat() - coords1.getLat()) * Math.PI) / 180;
  const dLng = ((coords2.getLng() - coords1.getLng()) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.getLat() * Math.PI) / 180) *
      Math.cos((coords2.getLat() * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // km를 미터로 변환
  return distance;
}

setMap(dataSet);

// 필터링 바 생성 함수
function filterBar() {
  var d_wpListFilter = document.querySelector("#wpListFilter");
  d_wpListFilter.innerHTML = "";
  d_wpListFilter.innerHTML = `<p id="sorting">정렬</p>`;
  d_wpListFilter.innerHTML += `<select id="howToShowFilter">
                <option value="none">필터선택</option>
                <option value="closeFilter">가까운 순</option>
            </select>`;
  d_wpListFilter.innerHTML += `<br>`;
  d_wpListFilter.innerHTML += `<p id="wpListFilterDescription">아래 리스트에서 파란 상호명을 누르면 상세설명이 나옵니다!</p>`;
}

// 일자리 리스트 업데이트 함수
async function updateWpList() {
  var wpList = document.querySelector(".wpList");
  wpList.innerHTML = ""; // 중복을 방지하기 위해 기존 리스트를 초기화합니다.

  // 현재 지도 범위 가져오기
  var bounds = map.getBounds();

  for (let i = 0; i < dataSet.length; i++) {
    let coords = await getCoordsByAddress(dataSet[i].workAddress);

    if (bounds.contain(coords)) {  //범위안에 주소가 포함되어 있다면
      var wpListDiv = document.createElement("div");
      wpListDiv.className = "wpList";

      var wpName = document.createElement("p");
      wpName.className = "wpName";
      wpName.innerHTML = dataSet[i].workName;
      wpName.addEventListener("click", function (e) {
        var d_wpListFilter = document.querySelector("#wpListFilter");
        var d_wpList = document.querySelector(".wpList");
        var wpNameText = e.target.innerHTML;
        var wpStartDate = dataSet[i].startDate;
        var wpFinishDate = dataSet[i].finishDate;
        d_wpListFilter.innerHTML = `${wpNameText} 직원 구합니다`;

        var applyButton = document.createElement("button");
        applyButton.innerHTML = "신청하기";
        applyButton.setAttribute("id","applyButton");
        d_wpListFilter.appendChild(applyButton);

        d_wpList.innerHTML = `
        >담당직무: <br>
        1)음식제조 및 재료준비 <br><br>
        >근무 기간 :<br>
        ${wpStartDate} ~ ${wpFinishDate} <br><br>
        >자격요건: <br>
        1)인사성 밝으신 분<br>
        2)요리에 관심 있으신 분<br><br>
         ${wpNameText}에서는
                 현재 일을 잘하는 사람을 구하고 있습니다. `;

        applyButton.addEventListener("click", function () {
          const enrollCheck = confirm("일자리를 신청하시겠습니까?");
          if (enrollCheck == true) {
            alert("신청되었습니다!");
            applyButton.innerHTML='신청완료';
            applyButton.style.background='red';
            applyButton.style.color='white';
            applyButton.disabled = true;
            // !!서버로 일자리 신청한 가게명,가게주소, 업무종류, 업무시간, 업무 설명 보내는 코드
            
            
          } else {
            alert("신청을 취소하였습니다.");
          }
        });

        var backBtn = document.createElement("button");
        backBtn.innerHTML = "돌아가기";
        backBtn.addEventListener("click", function () {
          updateWpList();
          filterBar();
        });
        d_wpList.appendChild(backBtn);
      });

      var wpDistance = document.createElement("p");
      wpDistance.className = "wpDistance";
      wpDistance.innerHTML = dataSet[i].distance;

      var br = document.createElement("br");

      var wpAddress = document.createElement("p");
      wpAddress.className = "wpAddress";
      wpAddress.innerHTML = dataSet[i].workAddress;

      var br2 = document.createElement("br");

      var wpCall = document.createElement("button");
      wpCall.className = "wpCall";
      wpCall.innerHTML = "전화";

      var wpFindRoad = document.createElement("button");
      wpFindRoad.className = "wpFindRoad";
      wpFindRoad.innerHTML = "길찾기";

      wpListDiv.appendChild(wpName);
      wpListDiv.appendChild(wpDistance);
      wpListDiv.appendChild(br);
      wpListDiv.appendChild(wpAddress);
      wpListDiv.appendChild(br2);
      wpListDiv.appendChild(wpCall);
      wpListDiv.appendChild(wpFindRoad);

      wpList.appendChild(wpListDiv);
    }
  }
}


// 거리 순으로 정렬 함수
function closeFiltering() {
  dataSet.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  updateWpList();
}

// // 최신순 정렬 함수 (구현 필요)
// function recentFiltering() {
//   // 최신순 정렬 로직 추가
// }

// 초기화 시 일자리 리스트 업데이트
updateWpList();

// 지도 변경 시 일자리 리스트 업데이트
kakao.maps.event.addListener(map, "bounds_changed", function () {
  updateWpList();
});
