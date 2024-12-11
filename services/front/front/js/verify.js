import { urlLocationHandler } from "./url-router.js";
import fun_sign from "./signin.js";

const getErrHtml = () => {
  return new Promise((resolve, reject) => {
    fetch(`/templates/error/error_signup/error_signup.html`).then((res) => {
      return resolve(res.text());
    });
  });
};

const getSeccHtml = () => {
  return new Promise((resolve, reject) => {
    fetch(`/templates/sucess/signin_sucess.html`).then((res) => {
      return resolve(res.text());
    });
  });
};

const initVerifying = async () => {
  const errHtml = await getErrHtml();
  const succHtml = await getSeccHtml();
  const url = new URLSearchParams(window.location.search);
  const uid = url.get("uid");
  const token = url.get("token");
  console.log(uid, token);
  if (!token || !uid) {
    alert("Missing informations");
    return;
  }
  fetch(`https://${window.location.host}/api/verify_account/${uid}/${token}`, {
    method: "GET",
    credentials: "include",
  }).then((res) => {
    console.log(res);
    if (res.status != 200) {
      document.getElementById("verifyContainer").innerHTML = errHtml;
      return;
    }
    res.json().then((res) => {
      document.getElementById("verifyContainer").innerHTML = succHtml;
    });
  });
};

// const handleResetPassConfirm = async (e) => {
//   e.preventDefault();
//   const errHtml = await getErrHtml();
//   console.log(errHtml);
//   const succHtml = await getSeccHtml();
//   const data = {
//     new_password: document.getElementById("new_password_reset").value,
//     confirm_password: document.getElementById("confirm_password_reset").value,
//   };
//   if (!data.new_password || !data.confirm_password) {
//     fun_sign.alert_message("Missing value", "Enter All fields");
//     return;
//   }
//   const url = new URLSearchParams(window.location.search);
//   const uid = url.get("uid");
//   const token = url.get("token");
//   console.log(uid, token);
//   if (!token || !uid) {
//     alert("Missing informations");
//     return;
//   }
//   fetch(`/api/reset-password/${uid}/${token}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//     credentials: "include",
//   }).then((res) => {
//     if (res.status != 200) {
//       // document.getElementById("verifyContainer").innerHTML = errHtml;
//       return;
//     }
//     res.json().then((res) => {
//       fun_sign.alert_message("Sucess", "1337");
//       wait(2000);
//       history.pushState(null, "", "/signin");
//       urlLocationHandler();
//     });
//   });
// };

// Fonction pour gérer l'attente (wait) en utilisant une promesse.
// function wait(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // const handleResetPassConfirm = async (e) => {
// //   e.preventDefault();
// //   const data = {
// //     new_password: document.getElementById("new_password_reset").value,
// //     confirm_password: document.getElementById("confirm_password_reset").value,
// //   };
// //   if (!data.new_password || !data.confirm_password) {
// //     fun_sign.alert_message("Missing value", "Enter All fields");
// //     return;
// //   }

// //   const url = new URLSearchParams(window.location.search);
// //   const uid = url.get("uid");
// //   const token = url.get("token");
// //   console.log(uid, token);
// //   if (!token || !uid) {
// //     alert("Missing informations");
// //     return;
// //   }
// //   fetch(`/api/reset-password/${uid}/${token}`, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify(data),
// //     credentials: "include",
// //   }).then((res) => {
// //     if (res.status != 200) {
// //       fun_sign.alert_message("ERROR", "Password reset successfully!");
// //       return;
// //     }
// //     res.json().then(async (res) => {
// //       fun_sign.alert_message("Success", "Password reset successfully!");
// //       await wait(1000);
// //       history.pushState(null, "", "/signin");
// //       urlLocationHandler();
// //     });
// //   });
// // };

// function wait(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// const handleResetPassConfirm = async (e) => {
//   e.preventDefault();
//   const data = {
//     new_password: document.getElementById("new_password_reset").value,
//     confirm_password: document.getElementById("confirm_password_reset").value,
//   };

//   if (!data.new_password || !data.confirm_password) {
//     fun_sign.alert_message("Missing value", "Enter All fields");
//     return;
//   }

//   const url = new URLSearchParams(window.location.search);
//   const uid = url.get("uid");
//   const token = url.get("token");

//   if (!token || !uid) {
//     fun_sign.alert_message("ERROR", "Missing informations");
//     return;
//   }

//   try {
//     const res = await fetch(
//       `/api/reset-password/${uid}/${token}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         credentials: "include",
//       }
//     );

//     if (res.status !== 200) {
//       fun_sign.alert_message("ERROR", "Failed to reset password.");
//       return;
//     }

//     const responseData = await res.json();

//     if (responseData && responseData.success) {
//       fun_sign.alert_message("Success", "Password reset successfully!");
//       await wait(1000);
//       history.pushState(null, "", "/signin");
//       urlLocationHandler();
//     } else {
//       fun_sign.alert_message(
//         "ERROR",
//         "Password reset failed. Please try again."
//       );
//     }
//   } catch (error) {
//     console.error("Error during password reset:", error);
//     fun_sign.alert_message(
//       "ERROR",
//       "An error occurred. Please try again later."
//     );
//   }
// };

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const handleResetPassConfirm = async (e) => {
  e.preventDefault();
  const data = {
    new_password: document.getElementById("new_password_reset").value,
    confirm_password: document.getElementById("confirm_password_reset").value,
  };

  if (!data.new_password || !data.confirm_password) {
    fun_sign.alert_message("Missing value", "Please enter all fields.");
    return;
  }
  const url = new URLSearchParams(window.location.search);
  const uid = url.get("uid");
  const token = url.get("token");
  if (!token || !uid) {
    fun_sign.alert_message(
      "ERROR",
      "Missing information. Please provide a valid token and uid."
    );
    await wait(1000);
    history.pushState(null, "", "/password_reset");
    urlLocationHandler();
    return;
  }
  try {
    const res = await fetch(
      `https://${window.location.host}/api/reset-password/${uid}/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );
    const responseData = await res.json();
    if (!res.ok) {
      console.log(responseData.error);
      if (responseData.error === "Token has expired.") {
        fun_sign.alert_message("ERROR", responseData.error);
        await wait(1000);
        history.pushState(null, "", "/password_reset");
        urlLocationHandler();
      }
      console.error("Error response:", responseData);
      fun_sign.alert_message("ERROR", responseData.error);
      return;
    } else {
      fun_sign.alert_message("Success", "Password reset successfully!");
      await wait(1000);
      history.pushState(null, "", "/signin");
      urlLocationHandler();
    }
  } catch (error) {
    alert(responseData.error.error);
    fun_sign.alert_message("ERROR", responseData.error);
  }
};

const initResetPassConfirm = () => {
  fun_sign.initFeedBack();
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  resetPasswordForm.addEventListener("submit", handleResetPassConfirm);
};

export default { initVerifying, initResetPassConfirm };
