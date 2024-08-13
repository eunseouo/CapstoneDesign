const saveButton = document.querySelector("#saveForm");
const modifyButton = document.querySelector("#modifyForm");
const deleteButton = document.querySelector("#deleteForm");
// const outputDiv = document.querySelector("#output");
const resumeName = document.querySelector("#resume-name");
const resumeGender = document.querySelectorAll('input[name="gender"]');
const resumeAge = document.querySelector("#resume-age");
const resumeAddress = document.querySelector("#resume-address");
const resumePhoneNum = document.querySelector("#resume-phoneNum");
const resumeIntro = document.querySelector("#resume-intro");

let userData = [{}];
function saveForm() {
  alert("이력서가 저장되었습니다.");

  userData = [{}];
}

function modifyForm() {
  resumeName.focus();
}

deleteButton.addEventListener("click", function () {
  if (confirm("내용을 모두 삭제합니다")) {
		const name = document.querySelector("#resume-name").value;
    const gender = document.querySelector('input[name="gender"]:checked')
      ? document.querySelector('input[name="gender"]:checked').value
      : "";
    const age = document.querySelector("#resume-age").value;
    const address = document.querySelector("#resume-address").value;
    const phoneNum = document.querySelector("#resume-phoneNum").value;
 
    resumeName.value = '';
    resumeAge.value = '';
    resumeAddress.value = '';
    resumePhoneNum.value = '';
		resumeIntro.value = '';

		resumeGender.forEach((radio) => {
      radio.checked = false;
    });
  }
});
