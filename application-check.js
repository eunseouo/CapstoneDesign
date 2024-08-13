function checkConditions(containerId) {
  const container = document.getElementById(containerId);
  const alertBox = container.querySelector(".alert");
  const table = container.querySelector("#table");

  // 예시 데이터
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
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
    {
      workName: "스타벅스",
      workAddress: "서울 노원구 석계로 104",
      distance: "",
      startDate: "2024-07-24",
      finishDate: "2024-08-17",
    },
  ];

  let startDate = "";
  let endDate = "";
  let programName = "";

  if (containerId === "appliedJobContainer") {
    programName = document.getElementById("program-name").value;
    startDate = document.getElementById("start-date").value;
    endDate = document.getElementById("end-date").value;
  } else if (containerId === "appliedProContainer") {
    programName = document.getElementById("program-name-2").value;
    startDate = document.getElementById("start-date-2").value;
    endDate = document.getElementById("end-date-2").value;
    console.log("2");
  }

  // 프로그램명, 시작일, 종료일 중 하나라도 입력되지 않으면 경고
  if (!programName && (!startDate || !endDate)) {
    alert("프로그램명 또는 날짜를 입력해주십시오.");
    return;
  }

  // 조건에 맞는 데이터 필터링
  const filteredData = dataSet.filter((item) => {
    const itemStartDate = new Date(item.startDate);
    const itemFinishDate = new Date(item.finishDate);
    const userStartDate = startDate ? new Date(startDate) : null;
    const userEndDate = endDate ? new Date(endDate) : null;

    const isDateInRange =
      (!userStartDate || itemStartDate >= userStartDate) &&
      (!userEndDate || itemFinishDate <= userEndDate);
    const isNameMatch = !programName || item.workName.includes(programName);

    return isDateInRange && isNameMatch;
  });

  // 테이블 업데이트
  const tbody = container.querySelector("tbody");
  tbody.innerHTML = ""; // 기존 내용을 지움

  if (filteredData.length > 0) {
      filteredData.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${item.workName}</td>
        <td>${item.workAddress}</td>
        <td>${item.startDate}</td>
        <td>${item.finishDate}</td>
      `;
        tbody.appendChild(row);
      });
     
        table.style.display = "block"; // 테이블 표시
      
  } else {
    alert("조건에 맞는 결과가 없습니다.");
    table.style.display = "none"; // 결과가 없으면 테이블 숨김
  }
}

function resetForm(type) {
  let className = "";

  if (type === "Job") {
    className = "input-Job";
  } else if (type === "Program") {
    className = "input-Pro";
  }

  // input 초기화
  const inputs = document.querySelectorAll(`.${className}`);
  inputs.forEach((input) => {
    if (input.type === "radio") {
      input.checked = false;
    } else if (input.type === "date" || input.type === "text") {
      input.value = "";
    }
  });

  // 테이블 초기화
  document.querySelector("#table").style.display = "none";
}

// 페이지 로드 시 테이블 숨김 처리
window.onload = function () {
  const jobTable = document.querySelector("#appliedJobContainer table");
  const proTable = document.querySelector("#appliedProContainer table");

  if (jobTable) {
    jobTable.style.display = "none";
  }
  if (proTable) {
    proTable.style.display = "none";
  }
};
