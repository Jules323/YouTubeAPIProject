const youtube_API_URL = 'https://www.googleapis.com/youtube/v3/search';
let searchItem = "" ;
let pageNumber = null;

//query set up
function getApiData(nextToken, searchString, callback) {
	const query = {
		part: 'snippet' ,
		key: 'AIzaSyABPS32s7BpTLp9xC8HekSwt1sjxm41fq8' ,
		q: `${searchString}` ,
		maxResults: 5 ,
		videoSyndicated: "true" ,
		type: "video" ,
		pageToken: `${nextToken}` ,
	};
	$.getJSON(youtube_API_URL, query, callback);
}

//html filler information
function generateResultStrings(result) {
	console.log(result);
	return`
		<a class="js-thumbnail" href="https://www.youtube.com/watch?v=${result.id.videoId}" data-lity>${result.snippet.title}
			<img src="${result.snippet.thumbnails.medium.url}" class="js-result-thumbnail">
		</a>
		<br/><br/>`
}

//maps results to html
function displayData(data) {
	const results = data.items.map((item) => generateResultStrings(item));
		if (pageNumber >=2) {
		results.push(`<a class="js-page js-prev-page" href="${data.prevPageToken}">PREV PAGE</a>`);
	}
		results.push(`<span class="js-page js-page-number">page ${pageNumber}</span>`);
		results.push(`<a class="js-page js-next-page" href="${data.nextPageToken}">NEXT PAGE</a>`);
	$('.js-search-results').html(results);
}

//listens for search term to be submitted
function handleSubmit() {
	$(".js-search-form").submit( function(event) {
		event.preventDefault();
		console.log('handleSubmit ran')
		pageNumber = 1;
		const searchTarget = $(event.currentTarget).find('.js-query');
		searchItem = searchTarget.val();
		console.log(searchItem);
		searchTarget.val(" ");
		getApiData("", searchItem, displayData);
	});
}

function nextPage() {
	$("#results").on("click", ".js-next-page", function(event) {
		event.preventDefault();
		pageNumber++;
		const nextToken = $(event.currentTarget).attr("href");
		getApiData(nextToken, searchItem, displayData);
	});
}

function prevPage() {
	$("#results").on("click", ".js-prev-page", function(event) {
		event.preventDefault();
		pageNumber--;
		const prevToken = $(event.currentTarget).attr("href");
		console.log(prevToken);
		getApiData(prevToken, searchItem, displayData);
	});
}

function appAPI() {
	handleSubmit();
	nextPage();
  	prevPage();
}


$(appAPI);


