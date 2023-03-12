let url = "https://open.jejudatahub.net/api/proxy/atDab6t8218btaa122b26DDtbatD86t1/oroeoe16t18t7__19ej1cbbr91t9bper";

$(document).ready(function() { //문서 실행 시 바로 나오게 끔
    let msg = prompt("검색하실 장소를 입력해 주세요.");
    $.ajax({
        type: "GET", 
        url: url, //API 주소
        data: {
            chargingPlace : msg, //검색어
            parkingFeeFlag : false, //주차비 여부
            limit : 100 //1페이지당 검색될 데이터 갯수
        },
        success : function(context) { //context는 요청 성공시 에 받아오는 데이터 Object
            let count = parseInt(context['totCnt'] / 100) + (context['totCnt'] % 100 > 0 ? 1 : 0); //데이터 페이지 수
            //console.log("데이터 수 : " + context['totCnt']); //데이터 수
            //console.log("페이지 수 : " + count); //페이지 수
            let datas = getData(count, msg); //데이터를 Ajax를 통해 가져옴
            let mapobj = setMap(datas); //지도 API를 호출하고 데이터를 지도에 표시
            setMarkers(mapobj, datas); //각 마커에 상세정보 표시
        },
        error : function() {
          alert('충전소 데이터를 로딩하는 중 문제가 발생하였습니다.');         
       }
    })
});

function getData(count, msg) { //데이터를 불러오는 함수
    let datas = [];
    for (let i = 1; i <= count; i++) {
        $.ajax({
            type: "GET",
            url: url, //API 주소
            async : false, //동기 방식으로 데이터를 받음
            data: {
                number : i, //페이지 수
                limit : 100, //1페이지당 검색될 데이터 갯수
                chargingPlace : msg, //검색어
                parkingFeeFlag : false //주차비 여부
            },
            success : function(data) { //context는 요청 성공시 에 받아오는 데이터 Object  
                datas = datas.concat(data['data']); //데이터를 기차식으로 붙이기
            },
            error : function() {
              alert('충전소 데이터를 로딩하는 중 문제가 발생하였습니다.');
              return null;       
           }
        })
    }
    return datas;
}

function setMap(datas) {
    let mapobj = {}; //return으로 2개의 객체를 묶어서 전달해야 되므로 두 객체를 묶어서 담을 객체를 선언한다. 
    // 초기 설정값
    let map = new kakao.maps.Map(document.getElementById('map'), { // 지도를 표시할 div
        center : new kakao.maps.LatLng(33.377, 126.538), // 제주도의 중심좌표 
        level : 11 // 지도의 확대 레벨 
    });
    //map.setZoomable(false);
    map.addControl(new kakao.maps.MapTypeControl(), kakao.maps.ControlPosition.TOPLEFT);
    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.LEFT);
    // 초기 설정값 끝
    //마커 이미지 설정
    /*
    var imgSrc= imagelnk;
    console.log(imagelnk); //마커 이미지 경로
    imgSize = new kakao.maps.Size(44,49),
    imgOption = {offset: new kakao.maps.Point(15, 43)};
    var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption);
    */
    // 마커 클러스터러를 생성
    var clusterer = new kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        minLevel: 7 // 클러스터 할 최소 지도 레벨 
    });
    // 데이터에서 좌표 값을 가지고 마커 표시
    var markers = $(datas).map(function(i, position) {
        return new kakao.maps.Marker({
            position : new kakao.maps.LatLng(position.latitude, position.longitude)
        });
    });
    // 클러스터에 마커들을 추가
    clusterer.addMarkers(markers);
    mapobj = { //map 객체와 markers 객체를 묶어서 mapobj 객체에 넣음
        'map' : map,
        'markers' : markers
    };
    return mapobj;
}

function setMarkers(mapobj, datas) {
    //맵 객체 전달받기
    let map = mapobj['map']; //setMap 함수에서 받은 객체에서 map 객체 추출
    let markers = mapobj['markers']; //setMap 함수에서 받은 객체에서 markers 객체 추출
    //좌표정보
    let iwRemoveable = true;
    let iwContent = null; // 위치 정보를 텍스트로 전달함
    let infowindow = null;
    /* 데이터 return 값 설명
        chargingPlace : 장소명
        addressJibun : 도로명 주소
        quickChargingType : 급속 충전 타입
        chargingFlag : 완속 충전 가능 여부 (T/F)
        quickChargingFlag : 급속 충전 가능 여부 (T/F)
    */
    let chargingPlace = null; //장소명
    let addressJibun = null; //주소
    let quickChargingType = null; //급속 충전 타입
    let chargingFlag = null; // 완속 충전 가능 여부 (T/F) -> 문자로 변경
    let quickChargingFlag = null; // 급속 충전 가능 여부 (T/F) -> 문자로 변경
    let info = null; // 순차적으로 데이터를 꺼내기 위해 선언
    for (let i = 0; i < datas.length; i++) {
        info = datas[i];
        if (info != null) { // Null 발생시 통과            
            //각 항목의 값을 변수로 받음
            chargingPlace = info['chargingPlace']; //장소명
            addressJibun = info['addressJibun']; //도로명 주소
            quickChargingType = info['quickChargingType']; //급속 충전 타입
            //완속 충전 가능 여부 T/F를 가능/불가능으로 변환
            chargingFlag = info['chargingFlag'] == true ? "가능" : info['chargingFlag'] == false ? "불가능" : "";
            quickChargingFlag = info['quickChargingFlag'] == true ? "가능" : info['quickChargingFlag'] == false ? "불가능" : "";
            //위치정보를 텍스트로 입력받음
            if (quickChargingType == "") {
                iwContent = '<div style="margin : 10px; width:200px; height:175px;">';
            } else {
                iwContent = '<div style="margin : 10px; width:200px; height:200px;">';
            }
            iwContent += '<div style="margin : 10px; width:200px; height:200px;">' +
                         '<div style="font-weight:bold; font-size:14px;">장소</div>' +
                         '<div style="font-size:14px;">' + chargingPlace + '</div>' +
                         '<div style="font-weight:bold; font-size:14px;">주소</div>' +
                         '<div style="font-size:14px;">' + addressJibun.replace('제주특별자치도', '') + '</div>';
            if (quickChargingType != "") {
                iwContent += '<div style="font-weight:bold; font-size:14px;">충전 방식</div>' +
                             '<div style="font-size:14px;">' + quickChargingType + '</div>';
            }
            iwContent += '<div style="font-weight:bold; font-size:14px;">완속 충전 여부</div>' +
                         '<div style="font-size:14px;">' + chargingFlag + '</div>' +
                         '<div style="font-weight:bold; font-size:14px;">급속 충전 여부</div>' +
                         '<div style="font-size:14px;">' + quickChargingFlag + '</div>' +
                         '</div>';
            infowindow = new kakao.maps.InfoWindow({
                content: iwContent,
                removable: iwRemoveable
            });
            //마우스 클릭시 상세 주소 및 정보를 출력
            (function(markers, infowindow) {
                // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시
                kakao.maps.event.addListener(markers, 'click', function() {
                    infowindow.open(map, markers);
                });
            })(markers[i], infowindow);
            //위치정보 설정 끝
        }
    }
}