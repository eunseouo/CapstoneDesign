function checkConditions(containerId) {
  const container = document.getElementById(containerId);
  const alertBox = container.querySelector(".alert");

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
  ];

  const radioButtons = container.querySelectorAll('input[type="radio"]');

  let startDate = "";
  let endDate = "";
  let programName = "";

  if (containerId === "appliedJobContainer") {
    startDate = document.getElementById("start-date").value;
    endDate = document.getElementById("end-date").value;
    programName = document.getElementById("program-name").value;
  } else if (containerId === "appliedProContainer") {
    startDate = document.getElementById("start-date-2").value;
    endDate = document.getElementById("end-date-2").value;
    programName = document.getElementById("program-name-2").value;
  }

  let isRadioChecked = false;
  radioButtons.forEach((radio) => {
    if (radio.checked) {
      isRadioChecked = true;
    }
  });

  if (isRadioChecked && (startDate || endDate)) {
    alert("기간선택과 직접 기간 지정 중 한 가지만 입력하여주십시오");
    return;
  } else if (isRadioChecked || (startDate && endDate)) {
    // 조건에 맞는 데이터 필터링
    const filteredData = dataSet.filter((item) => {
      const itemStartDate = new Date(item.startDate);
      const itemFinishDate = new Date(item.finishDate);
      const userStartDate = new Date(startDate);
      const userEndDate = new Date(endDate);

      const isDateInRange =
        (!startDate || itemStartDate >= userStartDate) &&
        (!endDate || itemFinishDate <= userEndDate);
      const isNameMatch = !programName || item.workName.includes(programName);

      return isDateInRange && isNameMatch;
    });

    // 테이블 업데이트
    const tbody = container.querySelector("tbody");
    tbody.innerHTML = ""; // 기존 내용을 지움

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

    if (filteredData.length === 0) {
      alertBox.style.display = "block";
      alertBox.textContent = "조건에 맞는 결과가 없습니다.";
    } else {
      alertBox.style.display = "none";
    }
  } else {
    alert("조건을 입력해주십시오");
  }
}

function resetForm(type) {
  let className = "";

  if (type === "Job") {
    className = "input-Job";
  } else if (type === "Program") {
    className = "input-Pro";
  }

  const inputs = document.querySelectorAll(`.${className}`);
  inputs.forEach((input) => {
    if (input.type === "radio") {
      input.checked = false;
    } else if (input.type === "date" || input.type === "text") {
      input.value = "";
    }
  });

  // 숨겨진 알림창 초기화
  const alertBox = document.querySelector(`#alert-${type.toLowerCase()}`);
  if (alertBox) {
    alertBox.style.display = "none";
  }

  // 테이블 초기화
  const tbody = document.querySelector(`#${type.toLowerCase()}Container tbody`);
  if (tbody) {
    tbody.innerHTML = "";
  }
}
