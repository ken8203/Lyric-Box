
function get_lyric() {
	var song_name = "",
		artist_name = "",
		lyric_url = "",
		lyric = "";

	chrome.storage.sync.get('lyric_box', function(result){
		var value = JSON.parse(result.lyric_box);
		song_name = value.song_name.toLowerCase();
		artist_name = value.artist_name.toLowerCase();
	
		var uri = "http://mojim.com/" + song_name + ".html?t3";
		$.get(uri, function(response){
			$.each(response.toLowerCase().split('<td class="ia"><a href="'), function(index, element){
				//console.log(element);
				if (index != 0)
				{
					if (element.toLowerCase().match(song_name) && element.toLowerCase().match(artist_name))
					{
						lyric_url = element.split('"')[0];
						return false;
					}
				}

				if (lyric_url != "")
					return false;
			});

			//console.log(song_name + '_' + artist_name + '+' + lyric_url);
			if (lyric_url != "")
			{
				$.get("http://mojim.com" + lyric_url, function(content){
					lyric = content.split("</dt><dd><br />")[1].split('</dl>')[0];
					$('#lyric_box').append(lyric);
				});
			}
			else
				$('#error_msg').append('We cannot find this song\'s lyric from mojim.com<br />無法從mojim.com找到這首歌的歌詞');

		});
	});
}

document.addEventListener('DOMContentLoaded', function () {
	$('#lyric_box').empty();
	get_lyric();
});