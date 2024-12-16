import { urlLocationHandler } from "./url-router.js";

async function fetchAndRenderProfile(friendId) {
  const container = document.querySelector(".page-content");
  try {
    // Fetch the friend's data using the friendId query parameter
    let num = parseInt(friendId, 10);
    const response = await fetch(
      `https://${window.location.host}/api/search_friend/?id=${num}`,
      {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      }
    );

    if (!response.ok) {
      history.pushState(null, "", "/404");
      urlLocationHandler();
      return;
    }

    // Parse the response JSON
    const data = await response.json();
    const { username, avatar, status_friendship } = data.list_data_user;

    // Generate the profile HTML
    const profileHTML = `
		<div class="row">
		  <div class="col-lg-12">
			<div class="main-profile">
			  <div class="row">
				<div class="col-lg-4">
				  <img
					src="${avatar}"
					alt="Profile Picture"
					style="border-radius: 23px"
				  />
				</div>
				<div class="col-lg-4 align-self-center">
				  <div class="main-info header-text">
					<h4>${username}</h4>
					<p>Friendship Status: ${status_friendship}</p>
					<div class="main-border-button">
					  <a href="/chat?friend_id=${friendId}">Send Message</a>
					</div>
				  </div>
				</div>
				<div class="col-lg-4 align-self-center">
				  <ul>
					<li>Games Played <span>290</span></li>
					<li>Winned <span>36</span></li>
					<li>Losed <span>13</span></li>
					<li>Rate <span>87%</span></li>
				  </ul>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  `;

    // Render the profile in the container
    container.innerHTML = profileHTML;
  } catch (error) {
    // // Handle unexpected errors
    container.innerHTML = `<p>Error fetching profile data. Please try again later.</p>`;
  }
}

// Export the function
export default fetchAndRenderProfile;
