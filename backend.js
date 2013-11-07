var song_name = '';
var artist_name = '';

console.log("Into program...");

$('title').timer({
	delay: 1000,
	repeat: true,
	callback: function() {
		var current_song_name = $('title').html().split(' - ')[0];
		
		if (current_song_name != song_name)
		{	
			doscript = document.createElement('script');
			doscript.type = 'text/javascript';
			doscript.innerHTML = "$('body').attr({'song': FM.getCurrentSongInfo().songName, 'artist': FM.getCurrentSongInfo().artistName})";
			document.head.appendChild(doscript);
			document.head.removeChild(doscript);

			song_name = $('body').attr('song');
			artist_name = $('body').attr('artist');

			save_song_info(song_name, artist_name);
		}
	}
});

function save_song_info(song, artist)
{
	var translated_data = "";
	var uri = "http://translate.google.com.tw/translate_a/t?client=t&hl=zh-TW&sl=zh-CN&tl=zh-TW&ie=UTF-8&oe=UTF-8&multires=1&otf=1&pc=1&ssel=3&tsel=3&sc=1&q=";
	$.get(uri + song + ';' + artist, function(response){
		translated_data = response.split('[[["')[1].split('"')[0].split(';');

		var preprocessed_song = preprocessed(translated_data[0]);
		var preprocessed_artist = preprocessed(translated_data[1]);

		chrome.storage.sync.set({'lyric_box': JSON.stringify({'song_name': preprocessed_song, 'artist_name': preprocessed_artist})}, function(){
			console.log('saved : ' + preprocessed_song + ' and ' + preprocessed_artist);
		});
	});
}

function preprocessed(data)
{
	var result = data;
	if (data.match('[(]'))
		result = data.split('(')[0].trim();

	return result;
}