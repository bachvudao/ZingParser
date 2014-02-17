function ZingReaderViewModel($scope) {
  var regEx = /param.*xmlURL=(.*)&amp/g;
  var yql_url = 'https://query.yahooapis.com/v1/public/yql';
  var test;
  $scope.submitUrl = function () {
    $.ajax({
      'url': yql_url,
      'data': {
        'q': 'SELECT * FROM html WHERE url="' + $scope.zingUrl + '" and xpath="//div/script"',
        'format': 'json',
        'jsonCompat': 'new',
      },
      'dataType': 'jsonp',
      'success': function (response) {
        var match = null;

        if (response == null || response.query == null || response.query.results == null || response.query.results.script == null) {
          return;
        }


        var data = response.query.results.script;
        for (var i = 0; i < data.length; i++) {
          match = regEx.exec(data[i].content);
          if (match) {
            break;
          }
        }


        // retrieve the song list
        $.ajax({
          'url': yql_url,
          'data': {
            'q': 'select * from xml where url="' + match[1] + '" and itemPath="data.item"',
            'format': 'json',
            'jsonCompat': 'new',
          },
          'dataType': 'jsonp',
          'success': function (response) {
            if (response == null || response.query == null || response.query.results == null || response.query.results.item == null) {
              return;
            }

            var myPlaylist = [];

            var cssSelector = {
              jPlayer: "#jquery_jplayer_1",
              cssSelectorAncestor: "#jp_container_1"
            };
            var options = {
              swfPath: "/",
              supplied: "mp3",
              playlistOptions: {
                autoPlay: true,
                enableRemoveControls: true
              }
            };

            var myPlaylistControl = new jPlayerPlaylist(cssSelector, myPlaylist, options);

            var data = response.query.results.item;
            for (var i = 0; i < data.length; i++) {
              myPlaylistControl.add({
                title: data[i].title,
                mp3: data[i].source,
                artist: data[i].performer,
              });
            }

          },
        });
      }
    });
  };
}



function ZingReaderViewModel($scope) {
  var regEx = /param.*xmlURL=(.*)&amp/g;
  var yql_url = 'https://query.yahooapis.com/v1/public/yql';

  $scope.submitUrl = function () {
    $.ajax({
      'url': yql_url,
      'data': {
        'q': 'SELECT * FROM html WHERE url="' + $scope.zingUrl + '" and xpath="//div/script"',
        'format': 'json',
        'jsonCompat': 'new',
      },
      'dataType': 'jsonp',
      'success': function (response) {
        var match = null;

        if (response == null || response.query == null || response.query.results == null || response.query.results.script == null) {
          return;
        }


        var data = response.query.results.script;
        for (var i = 0; i < data.length; i++) {
          match = regEx.exec(data[i].content);
          if (match) {
            break;
          }
        }


        // retrieve the song list
        $.ajax({
          'url': yql_url,
          'data': {
            'q': 'select * from xml where url="' + match[1] + '" and itemPath="data.item"',
            'format': 'json',
            'jsonCompat': 'new',
          },
          'dataType': 'jsonp',
          'success': function (response) {
            if (response == null || response.query == null || response.query.results == null || response.query.results.item == null) {
              return;
            }

            var myPlaylist = [];

            var cssSelector = {
              jPlayer: "#jquery_jplayer_1",
              cssSelectorAncestor: "#jp_container_1"
            };
            var options = {
              swfPath: "/",
              supplied: "mp3",
              loop: true,
              playlistOptions: {
                autoPlay: true,
                loopOnPrevious: false,
                shuffleOnLoop: true,
                enableRemoveControls: false,
                displayTime: 'slow',
                addTime: 'fast',
                removeTime: 'fast',
                shuffleTime: 'slow'
              }
            };

            var myPlaylistControl = new jPlayerPlaylist(cssSelector, myPlaylist, options);

            $("#jquery_jplayer_1").bind($.jPlayer.event.play, function () {
              var current = myPlaylistControl.current,
                playlist = myPlaylistControl.playlist;
              jQuery.each(playlist, function (index, song) {
                if (index == current) {
                  //$("#jp-current-song-text").html(obj.title);
                  var displayText = song.title;
                  if(displayText.length > 21){
                    displayText = displayText.substring(0,21) + "...";
                  }
                  
                  $("#jp-current-song-text").html(displayText);
                } // if condition end
              });
            });

            var data = response.query.results.item;
            for (var i = 0; i < data.length; i++) {
              myPlaylistControl.add({
                title: data[i].title,
                mp3: data[i].source,
                artist: data[i].performer,
              });
            }

          },
        });
      }
    });
  };
}
