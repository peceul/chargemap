# chargemap
제주도의 전기자동차 충전소 위치 정보를 표시하였습니다.
기본 화면에서 클러스터링한 충전소 갯수가 표시가 되어 있으며
확대시 하나하나 마커로 표시되어 있으며 마커 하나를 클릭시
해당 위치의 장소명과 충전소 정보가 출력됩니다. 
검색을 통해서 장소명에 특정 키워드가 들어간 장소만 나오게끔 출력할 수 있습니다.
(검색어로 공백 입력시 전체 출력)

--------------------------------------------------------------------------

지도는 카카오맵 API를 사용하였으며
데이터는 제주 데이터허브의 '전기자동차 충전소 정보' API를 활용하였습니다.
(Ajax로 해당 데이터를 JSON 형태로 전달받음)

*** 요청 한번에 최대 100개까지의 데이터를 불러올 수 있어 다음과 같은 방법을 사용하였음

1. 맨 처음에 Ajax로 요청된 데이터 객체에 totalcnt 변수가 데이터의 총 갯수가 됩니다.
   이를 100으로 나누어 총 페이지수를 산출하였습니다.

2. 총 페이지 수 만큼 Ajax를 for문을 통해 반복 요청을 수행하고
    이때 응답 받은 데이터를 concat함수로 배열을 붙였습니다.

3. 총 데이터의 수는 3850개 이나 3850개 전체를 불러올 경우 Ajax 요청 반복으로 인한
   페이지 로딩이 느려 요청변수 parkingFeeFlag=false를 설정하였으며
   주차비가 무료인 충전소 데이터만을 보여줄 떄 총 509개가 되면서
   적절한 반응속도를 보였습니다.

4. 이렇게 해서 받은 데이터를 카카오맵 API와 연동하여 클러스터화와 동시에
    상세 정보를 표시하였습니다.

5. 상세 표시 내용 : 장소명, 주소, 충전기 종류(설명 있는 경우만 표시), 완속 충전 여부, 급속 충전 여부

링크 : https://www.jejudatahub.net/data/view/data/862

------------------------------------------------------------------------------

간헐적으로 데이터 요청에 에러가 발생하는 문제가 있습니다.
원인은 명확하게 알 수 없었으나 제주데이터허브의 데이터를 Ajax로 여러번 반복호출을
하는 문제로 인하여 발생한 것으로 추측하고 있습니다.

