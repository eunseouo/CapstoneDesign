    var container = document.getElementById('map');
    var options = {
        center: new kakao.maps.LatLng(37.62410009545093, 127.06064303127741),
        level: 8
    };

    var map = new kakao.maps.Map(container, options);
    var marker = new kakao.maps.Marker({ 
        position: map.getCenter() 
    });
    marker.setMap(map);
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    var geocoder = new kakao.maps.services.Geocoder();

    let infowindowArray = [];
    let markerArray = [];

    const dataSet = [
        { name: "할머니냉면", address: "서울 동대문구 왕산로37길 53", distance: "" },
        { name: "세븐일레븐", address: "서울 동대문구 망우로 77", distance: "" },
        { name: "피자파스토", address: "서울 동대문구 망우로12가길 33 1층", distance: "" },
        { name: "미스터피자", address: "서울 노원구 석계로1길 22", distance: "" },
        { name: "스타벅스", address: "서울 노원구 석계로 104", distance: "" },
    ];

    let userCoords;

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

        kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow, coords, index));
        return marker;
    }

    function getContent(data) {
        return `
        <div class="infowindow">
            <p class="infowindow-name">${data.name}</p>
            <p class="infowindow-address">${data.address}</p>
            <p class="infowindow-distance">${data.distance}</p>
        </div>`;
    }

    async function setMap(dataSet) {
        for (let i = 0; i < dataSet.length; i++) {
            try {
                let coords = await getCoordsByAddress(dataSet[i].address);
                createMarker(coords, dataSet[i], i);
            } catch (error) {
                console.error(error);
            }
        }
    }

    function makeOverListener(map, marker, infowindow, coords, index) {
        return function () {
            closeInfoWindow();
            infowindow.open(map, marker);
            map.panTo(coords);
        };
    }

    function closeInfoWindow() {
        infowindowArray.forEach(infowindow => infowindow.close());
    }

    kakao.maps.event.addListener(map, 'click', function() {
        closeInfoWindow();
    });

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
                bounds.extend(new kakao.maps.LatLng(place.y, place.x));
            });

            map.setBounds(bounds);
            map.panTo(bounds.getCenter()); // 지도 중심을 검색 결과의 중심으로 이동
        }
    }

    async function savePresentAddress() {
        const address = document.getElementById('presentAddress').value;
        if (!address) {
            alert('주소를 입력해주세요!');
            return;
        }

        try {
            userCoords = await getCoordsByAddress(address);
            alert('현위치가 저장되었습니다.');

            // 현위치 저장 후 모든 거리 계산 및 리스트 업데이트
            for (let i = 0; i < dataSet.length; i++) {
                let coords = await getCoordsByAddress(dataSet[i].address);
                const distance = calculateDistance(userCoords, coords);
                dataSet[i].distance = `${distance.toFixed(2)}m`;
            }

            updateWpList();
        } catch (error) {
            console.error(error);
            alert('유효한 주소를 입력해주세요.');
        }
    }

    function calculateDistance(coords1, coords2) {
        const R = 6371; // 지구의 반지름 (km)
        const dLat = (coords2.getLat() - coords1.getLat()) * Math.PI / 180;
        const dLng = (coords2.getLng() - coords1.getLng()) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(coords1.getLat() * Math.PI / 180) * Math.cos(coords2.getLat() * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c * 1000; // km를 미터로 변환
        return distance;
    }

    setMap(dataSet);

    function updateWpList() {
        var wpList = document.querySelector('.wpList');
        wpList.innerHTML = '';

        for (let i = 0; i < dataSet.length; i++) {
            var wpListDiv = document.createElement('div');
            wpListDiv.className = 'wpList';

            var wpName = document.createElement('p');
            wpName.className = 'wpName';
            wpName.innerHTML = dataSet[i].name;

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

            wpListDiv.appendChild(wpName);
            wpListDiv.appendChild(wpDistance);
            wpListDiv.appendChild(wpAddress);
            wpListDiv.appendChild(br);
            wpListDiv.appendChild(wpCall);
            wpListDiv.appendChild(wpFindRoad);

            wpList.appendChild(wpListDiv);
        }
    }

    // 초기화 시 wpList 업데이트
    updateWpList();
