(function(){
    var script = {
 "scripts": {
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "unregisterKey": function(key){  delete window[key]; },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "existsKey": function(key){  return key in window; },
  "registerKey": function(key, value){  window[key] = value; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "getKey": function(key){  return window[key]; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } }
 },
 "paddingBottom": 0,
 "borderRadius": 0,
 "backgroundPreloadEnabled": true,
 "id": "rootPlayer",
 "desktopMipmappingEnabled": false,
 "contentOpaque": false,
 "verticalAlign": "top",
 "defaultVRPointer": "laser",
 "width": "100%",
 "paddingLeft": 0,
 "definitions": [{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 111.13,
    "targetPitch": 1,
    "path": "shortest",
    "pitchSpeed": 6.69,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 12.43,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 74.22,
    "targetPitch": 1.63,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -85.12,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C7665C30_D3B6_717C_41E5_B9440B4EE62A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "items": [
  {
   "media": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF",
   "camera": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
   "camera": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "camera": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "camera": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094",
   "camera": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419",
   "camera": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist",
 "class": "PlayList"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 74.22,
    "targetPitch": 1.63,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 111.13,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 1
 },
 "id": "panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "headerBackgroundOpacity": 1,
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_C71E3F1B_D395_CF23_41DA_C1D9810510B5",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "width": 400,
 "hideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "paddingLeft": 0,
 "titleFontWeight": "normal",
 "closeButtonIconWidth": 12,
 "headerBorderColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "shadowVerticalLength": 0,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "modal": true,
 "bodyBorderSize": 0,
 "closeButtonIconLineWidth": 2,
 "closeButtonBorderRadius": 11,
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "headerBackgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonIconHeight": 12,
 "title": "Ancient Firaun Artifact",
 "closeButtonPressedIconColor": "#FFFFFF",
 "class": "Window",
 "scrollBarVisible": "rollOver",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "backgroundColorRatios": [],
 "titleFontSize": "3vmin",
 "bodyBackgroundOpacity": 1,
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "headerPaddingBottom": 10,
 "headerPaddingTop": 10,
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "layout": "vertical",
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "contentOpaque": false,
 "shadowColor": "#000000",
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "children": [
  "this.htmlText_C71FDF1B_D395_CF23_41BA_D571D1A07F31",
  "this.image_uidC5DF3997_D3B6_7324_41BC_37F3283C8DF9_1"
 ],
 "footerHeight": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "closeButtonBackgroundColorRatios": [],
 "titlePaddingTop": 5,
 "paddingRight": 0,
 "bodyPaddingRight": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "titleFontColor": "#000000",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "shadowHorizontalLength": 3,
 "bodyBorderColor": "#000000",
 "headerPaddingLeft": 10,
 "shadow": true,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "shadowSpread": 1,
 "minWidth": 20,
 "bodyPaddingBottom": 5,
 "scrollBarColor": "#000000",
 "closeButtonBackgroundColor": [],
 "bodyPaddingTop": 5,
 "overflow": "scroll",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titleFontFamily": "Arial",
 "data": {
  "name": "Window17829"
 },
 "horizontalAlign": "center",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "propagateClick": false,
 "titleFontStyle": "normal",
 "titlePaddingBottom": 5,
 "shadowOpacity": 0.5,
 "gap": 10
},
{
 "idleSequence": "this.sequence_D6AE7C34_CE43_8626_41E8_3CB15E714A1E",
 "timeToIdle": 15000,
 "initialPosition": {
  "yaw": -118.96,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": -6.76
 },
 "id": "panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialSequence": "this.sequence_D6AE7C34_CE43_8626_41E8_3CB15E714A1E"
},
{
 "hfovMax": 130,
 "label": "7",
 "id": "panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF",
 "vfov": 180,
 "partial": false,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "overlays": [
  "this.overlay_DACF7957_D36A_F324_41E8_BCDCD6065638",
  "this.overlay_C1910C91_D3EE_513C_41D6_5D5BA220D35B",
  "this.overlay_C1ABB331_D3FA_B77C_41DA_684F246D973A"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 40.41,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
   "backwardYaw": 11.95,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "headerBackgroundOpacity": 1,
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_C066E7AB_D3F5_DF6C_41E7_9148C91BCE30",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "width": 400,
 "hideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "paddingLeft": 0,
 "titleFontWeight": "bold",
 "closeButtonIconWidth": 12,
 "headerBorderColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "shadowVerticalLength": 0,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "modal": true,
 "bodyBorderSize": 0,
 "closeButtonIconLineWidth": 2,
 "closeButtonBorderRadius": 11,
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "headerBackgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonIconHeight": 12,
 "title": "Scan To Pay",
 "closeButtonPressedIconColor": "#FFFFFF",
 "class": "Window",
 "scrollBarVisible": "rollOver",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "backgroundColorRatios": [],
 "titleFontSize": "3vmin",
 "bodyBackgroundOpacity": 1,
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "headerPaddingBottom": 10,
 "headerPaddingTop": 10,
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "layout": "vertical",
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "contentOpaque": false,
 "shadowColor": "#000000",
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "children": [
  "this.htmlText_C066D7AC_D3F5_DF64_41BF_A64735EF271D",
  "this.image_uidC5DAD98E_D3B6_7324_41E9_6C9BFE367EFF_1"
 ],
 "footerHeight": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "closeButtonBackgroundColorRatios": [],
 "titlePaddingTop": 5,
 "paddingRight": 0,
 "bodyPaddingRight": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "titleFontColor": "#000000",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "shadowHorizontalLength": 3,
 "bodyBorderColor": "#000000",
 "headerPaddingLeft": 10,
 "shadow": true,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "shadowSpread": 1,
 "minWidth": 20,
 "bodyPaddingBottom": 5,
 "scrollBarColor": "#000000",
 "closeButtonBackgroundColor": [],
 "bodyPaddingTop": 5,
 "overflow": "scroll",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titleFontFamily": "Arial",
 "data": {
  "name": "Window14321"
 },
 "horizontalAlign": "center",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "propagateClick": false,
 "titleFontStyle": "normal",
 "titlePaddingBottom": 5,
 "shadowOpacity": 0.5,
 "gap": 10
},
{
 "duration": 5000,
 "label": "paytmqr",
 "id": "photo_C0BEBAE7_D3EE_56E4_41E6_48BE307C8A50",
 "width": 171,
 "thumbnailUrl": "media/photo_C0BEBAE7_D3EE_56E4_41E6_48BE307C8A50_t.png",
 "class": "Photo",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_C0BEBAE7_D3EE_56E4_41E6_48BE307C8A50.png"
   }
  ]
 },
 "height": 294
},
{
 "headerBackgroundOpacity": 1,
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_C1690374_D3FB_B7E4_41D1_28DAFCD8D458",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "width": 400,
 "hideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "paddingLeft": 0,
 "titleFontWeight": "bold",
 "closeButtonIconWidth": 12,
 "headerBorderColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "shadowVerticalLength": 0,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "modal": true,
 "bodyBorderSize": 0,
 "closeButtonIconLineWidth": 2,
 "closeButtonBorderRadius": 11,
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "headerBackgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonIconHeight": 12,
 "title": "Muqsary Trendy Spikes",
 "closeButtonPressedIconColor": "#FFFFFF",
 "class": "Window",
 "scrollBarVisible": "rollOver",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "backgroundColorRatios": [],
 "titleFontSize": "3vmin",
 "bodyBackgroundOpacity": 1,
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "headerPaddingBottom": 10,
 "headerPaddingTop": 10,
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "layout": "vertical",
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "contentOpaque": false,
 "shadowColor": "#000000",
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "children": [
  "this.htmlText_C168B374_D3FB_B7E4_41DF_FD1B1CF5DD10",
  "this.image_uidC5DB898D_D3B6_7324_41D6_D2576945DD86_1"
 ],
 "footerHeight": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "closeButtonBackgroundColorRatios": [],
 "titlePaddingTop": 5,
 "paddingRight": 0,
 "bodyPaddingRight": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "titleFontColor": "#000000",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "shadowHorizontalLength": 3,
 "bodyBorderColor": "#000000",
 "headerPaddingLeft": 10,
 "shadow": true,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "shadowSpread": 1,
 "minWidth": 20,
 "bodyPaddingBottom": 5,
 "scrollBarColor": "#000000",
 "closeButtonBackgroundColor": [],
 "bodyPaddingTop": 5,
 "overflow": "scroll",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titleFontFamily": "Arial",
 "data": {
  "name": "Window13192"
 },
 "horizontalAlign": "center",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "propagateClick": false,
 "titleFontStyle": "italic",
 "titlePaddingBottom": 5,
 "shadowOpacity": 0.5,
 "gap": 10
},
{
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_rotation",
 "touchControlMode": "drag_rotation",
 "displayPlaybackBar": true,
 "id": "MainViewerPanoramaPlayer",
 "class": "PanoramaPlayer",
 "viewerArea": "this.MainViewer"
},
{
 "hfovMax": 130,
 "label": "2",
 "id": "panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094",
 "vfov": 180,
 "partial": false,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "overlays": [
  "this.overlay_D92B91EC_D36B_B2E5_41EA_5976205684F5"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 18.76,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "backwardYaw": 172.66,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "duration": 5000,
 "label": "laxmi devi",
 "id": "photo_C0F08738_D39A_5F6C_415A_8DC071680678",
 "width": 331,
 "thumbnailUrl": "media/photo_C0F08738_D39A_5F6C_415A_8DC071680678_t.jpg",
 "class": "Photo",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_C0F08738_D39A_5F6C_415A_8DC071680678.jpg"
   }
  ]
 },
 "height": 500
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 111.13,
    "targetPitch": 1,
    "path": "shortest",
    "pitchSpeed": 9.1,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 17.26,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 74.22,
    "targetPitch": 1.63,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -168.05,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C74F0BB8_D3B6_776C_41A8_E45F7FF8D442",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -64.87,
    "targetPitch": -9.1,
    "path": "shortest",
    "pitchSpeed": 2.36,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.74,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": -140.69,
    "targetPitch": -2.61,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -161.24,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C5545AEC_D3B6_76E4_41E6_733D8DF394E6",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -140.69,
    "targetPitch": -2.61,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -64.87,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": -9.1
 },
 "id": "panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "changing": "var event = arguments[0]; this.changePlayListWithSameSpot(event.source, event.data.nextSelectedIndex)",
 "items": [
  {
   "media": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF",
   "camera": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
   "camera": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "camera": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "camera": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094",
   "camera": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "hfovMax": 130,
 "label": "4",
 "id": "panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
 "vfov": 180,
 "partial": false,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "overlays": [
  "this.overlay_D9546936_D36A_5364_41DF_F5825A802520",
  "this.overlay_D9545936_D36A_5364_41D2_E7D5DFA8AF59",
  "this.overlay_D9544936_D36A_5364_41E5_39D8A13F6EB6",
  "this.overlay_C17A6790_D396_FF3C_41E8_AE527C56A394",
  "this.overlay_C754BD42_D39A_B31C_41CB_8D83A9D9DD08"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 0.15,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "backwardYaw": -112.89,
   "distance": 1
  },
  {
   "yaw": 10.9,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419",
   "backwardYaw": -44.8,
   "distance": 1
  },
  {
   "yaw": 172.66,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094",
   "backwardYaw": 18.76,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "hfovMax": 143,
 "label": "1",
 "id": "panorama_D96B9A51_D36B_B13C_41C1_4D0288603419",
 "vfov": 180,
 "partial": false,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "overlays": [
  "this.overlay_D96BBA52_D36B_B13C_41DF_17F6B114A309",
  "this.overlay_C09F26AD_D395_D164_4194_AD8E5A3BEE2D"
 ],
 "adjacentPanoramas": [
  {
   "yaw": -44.8,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "backwardYaw": 10.9,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "idleSequence": "this.sequence_C59A3A66_D3B6_71E4_41E1_74CA906E415F",
 "timeToIdle": 15000,
 "initialPosition": {
  "yaw": 67.11,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C59A2A65_D3B6_71E4_41D4_BFB4245068B3",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialSequence": "this.sequence_C59A3A66_D3B6_71E4_41E1_74CA906E415F"
},
{
 "displayOriginPosition": {
  "stereographicFactor": 1,
  "yaw": -59.56,
  "class": "RotationalCameraDisplayPosition",
  "hfov": 165,
  "pitch": -90
 },
 "displayMovements": [
  {
   "duration": 1000,
   "class": "TargetRotationalCameraDisplayMovement",
   "easing": "linear"
  },
  {
   "duration": 3000,
   "targetHfov": 119,
   "targetPitch": -1.41,
   "targetStereographicFactor": 0,
   "class": "TargetRotationalCameraDisplayMovement",
   "easing": "cubic_in_out"
  }
 ],
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 5.15,
    "targetPitch": -2.66,
    "path": "shortest",
    "pitchSpeed": 9.56,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 18.2,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 67.26,
    "targetPitch": -2.91,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -59.56,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": -1.41
 },
 "id": "panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "automaticRotationSpeed": 5
},
{
 "label": "Photo Album unnamed",
 "id": "album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802",
 "thumbnailUrl": "media/album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_t.png",
 "class": "PhotoAlbum",
 "playList": "this.album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_AlbumPlayList"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 142.59,
    "hfovSpeed": 2.26,
    "targetHfov": 90,
    "targetPitch": -0.93,
    "path": "shortest",
    "pitchSpeed": 1.62,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 2.26,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 155.33,
    "targetPitch": -0.18,
    "path": "longest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 135.2,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C5B88AA7_D3B6_7164_41E0_210AFDBB06F4",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "headerBackgroundOpacity": 1,
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_C1062051_D395_D13C_41B7_A2D5C96F695D",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "width": 400,
 "hideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "paddingLeft": 0,
 "titleFontWeight": "normal",
 "closeButtonIconWidth": 12,
 "headerBorderColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "shadowVerticalLength": 0,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "modal": true,
 "bodyBorderSize": 0,
 "closeButtonIconLineWidth": 2,
 "closeButtonBorderRadius": 11,
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "headerBackgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonIconHeight": 12,
 "title": "Laxmi Devi Murti",
 "closeButtonPressedIconColor": "#FFFFFF",
 "class": "Window",
 "scrollBarVisible": "rollOver",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "backgroundColorRatios": [],
 "titleFontSize": "3vmin",
 "bodyBackgroundOpacity": 1,
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "headerPaddingBottom": 10,
 "headerPaddingTop": 10,
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "layout": "vertical",
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "contentOpaque": false,
 "shadowColor": "#000000",
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "children": [
  "this.htmlText_C107E052_D395_D13C_41C2_65BCC98DDD41",
  "this.image_uidC5DFD991_D3B6_733C_41E4_EADF0A506F1E_1"
 ],
 "footerHeight": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "closeButtonBackgroundColorRatios": [],
 "titlePaddingTop": 5,
 "paddingRight": 0,
 "bodyPaddingRight": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "titleFontColor": "#000000",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "shadowHorizontalLength": 3,
 "bodyBorderColor": "#000000",
 "headerPaddingLeft": 10,
 "shadow": true,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "shadowSpread": 1,
 "minWidth": 20,
 "bodyPaddingBottom": 5,
 "scrollBarColor": "#000000",
 "closeButtonBackgroundColor": [],
 "bodyPaddingTop": 5,
 "overflow": "scroll",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titleFontFamily": "Arial",
 "data": {
  "name": "Window15823"
 },
 "horizontalAlign": "center",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "propagateClick": false,
 "titleFontStyle": "normal",
 "titlePaddingBottom": 5,
 "shadowOpacity": 0.5,
 "gap": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 123.57,
    "targetPitch": -5.56,
    "path": "shortest",
    "pitchSpeed": 6.72,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 12.49,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 68.78,
    "targetPitch": -5.67,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 52.71,
    "targetPitch": -6.22,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 35.18,
    "targetPitch": -5.02,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -169.1,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C747DB84_D3B6_7724_41B1_00894BEE4414",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 68.78,
    "targetPitch": -5.67,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 52.71,
    "targetPitch": -6.22,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 35.18,
    "targetPitch": -5.02,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 123.57,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": -5.56
 },
 "id": "panorama_D9548936_D36A_5364_41E6_B52D756A56B8_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "label": "5",
 "id": "panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
 "vfov": 180,
 "partial": false,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "overlays": [
  "this.overlay_D88580C9_D36A_512C_41CF_B46ED8DC0DD9",
  "this.overlay_D88570C9_D36A_512C_41E8_C578E21797D9"
 ],
 "adjacentPanoramas": [
  {
   "yaw": -112.89,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "backwardYaw": 0.15,
   "distance": 1
  },
  {
   "yaw": -81.11,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
   "backwardYaw": 94.88,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "duration": 5000,
 "label": "unnamed",
 "id": "album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_0",
 "width": 249,
 "thumbnailUrl": "media/album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_0_t.png",
 "class": "Photo",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_0.png"
   }
  ]
 },
 "height": 249
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -59.56,
    "targetPitch": -1.41,
    "path": "shortest",
    "pitchSpeed": 11.59,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 22.27,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 5.15,
    "targetPitch": -2.66,
    "path": "shortest",
    "pitchSpeed": 9.56,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 18.2,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 67.26,
    "targetPitch": -2.91,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -139.59,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C5E51A22_D3B6_711C_41DE_4DAEE817FC15",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "automaticRotationSpeed": 5
},
{
 "duration": 5000,
 "label": "firaun",
 "id": "photo_C7B61B20_D397_B71C_41D8_BCDF982D5C87",
 "width": 512,
 "thumbnailUrl": "media/photo_C7B61B20_D397_B71C_41D8_BCDF982D5C87_t.jpg",
 "class": "Photo",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_C7B61B20_D397_B71C_41D8_BCDF982D5C87.jpg"
   }
  ]
 },
 "height": 683
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 155.33,
    "targetPitch": -0.18,
    "path": "longest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 142.59,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": -0.93
 },
 "id": "panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 123.57,
    "targetPitch": -5.56,
    "path": "shortest",
    "pitchSpeed": 3.56,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 6.14,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 68.78,
    "targetPitch": -5.67,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 52.71,
    "targetPitch": -6.22,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 35.18,
    "targetPitch": -5.02,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -7.34,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C71B4C65_D3B6_71E4_41C2_FB35742CF7DB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "idleSequence": "this.sequence_C5F229D9_D3B6_732C_41D1_9C24623DC1DE",
 "timeToIdle": 15000,
 "initialPosition": {
  "yaw": 98.89,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C5F259D9_D3B6_732C_41A7_3193B5D28B6C",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialSequence": "this.sequence_C5F229D9_D3B6_732C_41D1_9C24623DC1DE"
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 123.57,
    "targetPitch": -5.56,
    "path": "shortest",
    "pitchSpeed": 6.93,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 12.91,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 68.78,
    "targetPitch": -5.67,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 52.71,
    "targetPitch": -6.22,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 35.18,
    "targetPitch": -5.02,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "class": "TargetPanoramaCameraMovement",
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -179.85,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C7786BF3_D3B6_76FC_415B_AF0612854C90",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "MainViewerPhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "viewerArea": "this.MainViewer"
},
{
 "hfovMax": 133,
 "label": "6",
 "id": "panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
 "vfov": 180,
 "partial": false,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "overlays": [
  "this.overlay_DA8A1492_D36A_713C_41BD_FF4E6059A7CF",
  "this.overlay_DA8BE493_D36A_713C_41E7_DC448E0497F8"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 94.88,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "backwardYaw": -81.11,
   "distance": 1
  },
  {
   "yaw": 11.95,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF",
   "backwardYaw": 40.41,
   "distance": 1
  }
 ],
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "headerBackgroundOpacity": 1,
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_C0825645_D395_D124_41D5_E5862E02DAE9",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "width": 400,
 "hideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "verticalAlign": "middle",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "paddingLeft": 0,
 "titleFontWeight": "normal",
 "closeButtonIconWidth": 12,
 "headerBorderColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "shadowVerticalLength": 0,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "modal": true,
 "bodyBorderSize": 0,
 "closeButtonIconLineWidth": 2,
 "closeButtonBorderRadius": 11,
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "headerBackgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonIconHeight": 12,
 "title": "Ancient Firaun Artifact",
 "closeButtonPressedIconColor": "#FFFFFF",
 "class": "Window",
 "scrollBarVisible": "rollOver",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "backgroundColorRatios": [],
 "titleFontSize": "2.87vmin",
 "bodyBackgroundOpacity": 1,
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "headerPaddingBottom": 10,
 "headerPaddingTop": 10,
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "layout": "vertical",
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "contentOpaque": false,
 "shadowColor": "#000000",
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "children": [
  "this.htmlText_C08F9643_D395_D11C_41D3_6FD94ABBD5C5",
  "this.image_uidC5C1B999_D3B6_732C_41C9_330A8C2F93A4_1"
 ],
 "footerHeight": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "closeButtonBackgroundColorRatios": [],
 "titlePaddingTop": 5,
 "paddingRight": 0,
 "bodyPaddingRight": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "titleFontColor": "#000000",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "shadowHorizontalLength": 3,
 "bodyBorderColor": "#000000",
 "headerPaddingLeft": 10,
 "shadow": true,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "shadowSpread": 1,
 "minWidth": 20,
 "bodyPaddingBottom": 5,
 "scrollBarColor": "#000000",
 "closeButtonBackgroundColor": [],
 "bodyPaddingTop": 5,
 "overflow": "scroll",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titleFontFamily": "Arial",
 "data": {
  "name": "Window17829"
 },
 "horizontalAlign": "center",
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "propagateClick": false,
 "titleFontStyle": "normal",
 "titlePaddingBottom": 5,
 "shadowOpacity": 0.5,
 "gap": 10
},
{
 "items": [
  {
   "media": "this.album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802",
   "player": "this.MainViewerPhotoAlbumPlayer",
   "class": "PhotoAlbumPlayListItem"
  }
 ],
 "id": "playList_C5C1399A_D3B6_732C_41E4_584943A47EAF",
 "class": "PlayList"
},
{
 "duration": 5000,
 "label": "silver women",
 "id": "photo_C133F347_D3F6_B724_41D3_1DD32A57DC9F",
 "width": 627,
 "thumbnailUrl": "media/photo_C133F347_D3F6_B724_41D3_1DD32A57DC9F_t.jpg",
 "class": "Photo",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_C133F347_D3F6_B724_41D3_1DD32A57DC9F.jpeg"
   }
  ]
 },
 "height": 600
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "MainViewer",
 "left": 0,
 "toolTipShadowColor": "#333333",
 "progressOpacity": 1,
 "transitionMode": "blending",
 "width": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "paddingLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarHeadBorderRadius": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 5,
 "toolTipFontWeight": "normal",
 "playbackBarLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "toolTipPaddingBottom": 4,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressBorderColor": "#000000",
 "toolTipBorderSize": 3,
 "height": "100.009%",
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "playbackBarHeadShadow": true,
 "class": "ViewerArea",
 "playbackBarOpacity": 1,
 "firstTransitionDuration": 0,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#FFFF00",
 "progressHeight": 10,
 "progressBackgroundOpacity": 1,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Arial",
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowOpacity": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingRight": 6,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "progressLeft": 0,
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColorDirection": "vertical",
 "paddingRight": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "toolTipOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "minHeight": 50,
 "displayTooltipInTouchScreens": true,
 "bottom": -0.05,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarHeadOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "shadow": false,
 "toolTipFontColor": "#606060",
 "paddingTop": 0,
 "progressBarBorderRadius": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipShadowSpread": 0,
 "minWidth": 100,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderSize": 0,
 "toolTipFontStyle": "normal",
 "toolTipPaddingLeft": 6,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowBlurRadius": 3,
 "toolTipShadowVerticalLength": 0,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "propagateClick": true,
 "data": {
  "name": "Main Viewer"
 },
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0
},
{
 "scrollBarColor": "#000000",
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "Container_D6FC97F8_CE43_822F_41D7_227D2ACEBC4A",
 "left": "1.96%",
 "contentOpaque": true,
 "shadowColor": "#000000",
 "width": "10.707%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "shadowVerticalLength": 0,
 "paddingRight": 0,
 "children": [
  "this.Image_D95B462A_CE42_8222_41D5_EE0777D1295D"
 ],
 "minHeight": 1,
 "top": "3.04%",
 "scrollBarMargin": 2,
 "height": "7.742%",
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "shadow": true,
 "borderSize": 0,
 "shadowSpread": 1,
 "backgroundOpacity": 0,
 "class": "Container",
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "minWidth": 1,
 "shadowHorizontalLength": 3,
 "overflow": "hidden",
 "shadowBlurRadius": 4,
 "childrenInteractionEnabled": false,
 "horizontalAlign": "left",
 "propagateClick": false,
 "layout": "absolute",
 "shadowOpacity": 0.66,
 "gap": 10,
 "data": {
  "name": "Container28957"
 }
},
{
 "paddingBottom": 10,
 "borderRadius": 5,
 "id": "ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F",
 "itemThumbnailScaleMode": "fit_outside",
 "itemThumbnailShadowHorizontalLength": 3,
 "verticalAlign": "top",
 "itemPaddingLeft": 3,
 "right": "19.91%",
 "width": "47.908%",
 "paddingLeft": 20,
 "itemThumbnailWidth": 75,
 "itemBackgroundColor": [],
 "itemPaddingRight": 3,
 "itemThumbnailShadowSpread": 1,
 "height": 121.35,
 "selectedItemLabelFontColor": "#FFCC00",
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "itemLabelPosition": "bottom",
 "borderSize": 0,
 "itemPaddingTop": 3,
 "class": "ThumbnailList",
 "itemThumbnailShadow": true,
 "scrollBarVisible": "rollOver",
 "itemThumbnailShadowColor": "#000000",
 "itemLabelFontColor": "#FFFFFF",
 "itemThumbnailOpacity": 1,
 "itemThumbnailShadowOpacity": 0.54,
 "rollOverItemLabelFontWeight": "normal",
 "itemLabelGap": 9,
 "itemOpacity": 1,
 "itemBackgroundColorRatios": [],
 "playList": "this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist",
 "layout": "horizontal",
 "itemBackgroundColorDirection": "vertical",
 "itemLabelFontWeight": "normal",
 "itemHorizontalAlign": "center",
 "itemMode": "normal",
 "itemThumbnailHeight": 75,
 "itemThumbnailBorderRadius": 50,
 "selectedItemLabelFontWeight": "bold",
 "paddingRight": 20,
 "itemThumbnailShadowBlurRadius": 8,
 "minHeight": 20,
 "scrollBarMargin": 2,
 "bottom": "4.57%",
 "rollOverItemBackgroundOpacity": 0,
 "itemBackgroundOpacity": 0,
 "itemLabelFontSize": 14,
 "shadow": false,
 "paddingTop": 10,
 "backgroundOpacity": 0,
 "itemPaddingBottom": 3,
 "itemLabelTextDecoration": "none",
 "minWidth": 20,
 "itemThumbnailShadowVerticalLength": 3,
 "itemLabelFontFamily": "Arial",
 "itemLabelFontStyle": "normal",
 "scrollBarColor": "#FFFFFF",
 "itemBorderRadius": 0,
 "data": {
  "name": "ThumbnailList35762"
 },
 "horizontalAlign": "left",
 "propagateClick": false,
 "itemLabelHorizontalAlign": "center",
 "gap": 10,
 "itemVerticalAlign": "middle"
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_C71FDF1B_D395_CF23_41BA_D571D1A07F31",
 "width": "100%",
 "paddingLeft": 10,
 "paddingRight": 10,
 "scrollBarMargin": 2,
 "minHeight": 0,
 "height": "10%",
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 10,
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "scrollBarVisible": "rollOver",
 "minWidth": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#f3a22e;\"><A HREF=\"https://www.amazon.in/Artistic-Religious-Goddess-Finishing-BH00036/dp/B01G77CHKU\" TARGET=\"_blank\" STYLE=\"text-decoration:none; color:inherit;\"><U>Click</U></A></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText17830"
 },
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "image_uidC5DF3997_D3B6_7324_41BC_37F3283C8DF9_1",
 "verticalAlign": "middle",
 "width": "100%",
 "paddingLeft": 0,
 "url": "media/photo_C7B61B20_D397_B71C_41D8_BCDF982D5C87.jpg",
 "paddingRight": 0,
 "minHeight": 0,
 "height": "89%",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "class": "Image",
 "minWidth": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image22505"
 },
 "horizontalAlign": "center",
 "propagateClick": false
},
{
 "restartMovementDelay": 15000,
 "movements": [
  {
   "targetYaw": -81.99,
   "targetPitch": -13.8,
   "path": "shortest",
   "pitchSpeed": 3.14,
   "class": "TargetPanoramaCameraMovement",
   "yawSpeed": 5.3,
   "easing": "cubic_in_out"
  }
 ],
 "id": "sequence_D6AE7C34_CE43_8626_41E8_3CB15E714A1E",
 "class": "PanoramaCameraSequence",
 "restartMovementOnUserInteraction": true
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": 40.41,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_1_HS_0_0_0_map.gif",
      "width": 61,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.85,
   "hfov": 22.94
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C, this.camera_C74F0BB8_D3B6_776C_41A8_E45F7FF8D442); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1E67B9B_D39E_D72C_41E3_0BCEBA07B031",
   "yaw": 40.41,
   "pitch": -19.85,
   "distance": 100,
   "hfov": 22.94
  }
 ],
 "id": "overlay_DACF7957_D36A_F324_41E8_BCDCD6065638",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "6"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": -15.84,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_3_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": 7.58,
   "hfov": 20.67
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_C1690374_D3FB_B7E4_41D1_28DAFCD8D458, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "yaw": -15.84,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_3_0.png",
      "width": 121,
      "class": "ImageResourceLevel",
      "height": 60
     }
    ]
   },
   "pitch": 7.58,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 20.67
  }
 ],
 "id": "overlay_C1910C91_D3EE_513C_41D6_5D5BA220D35B",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Image"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": 134.53,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_4_0_0_map.gif",
      "width": 22,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -18.16,
   "hfov": 14.55
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_C066E7AB_D3F5_DF6C_41E7_9148C91BCE30, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "yaw": 134.53,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_4_0.png",
      "width": 89,
      "class": "ImageResourceLevel",
      "height": 62
     }
    ]
   },
   "pitch": -18.16,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.55
  }
 ],
 "id": "overlay_C1ABB331_D3FA_B77C_41DA_684F246D973A",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Image"
 }
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_C066D7AC_D3F5_DF64_41BF_A64735EF271D",
 "width": "100%",
 "paddingLeft": 10,
 "paddingRight": 10,
 "scrollBarMargin": 2,
 "minHeight": 0,
 "height": "10%",
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 10,
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "scrollBarVisible": "rollOver",
 "minWidth": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:38px;\">open your scanner to pay</SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText14322"
 },
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "image_uidC5DAD98E_D3B6_7324_41E9_6C9BFE367EFF_1",
 "verticalAlign": "middle",
 "width": "100%",
 "paddingLeft": 0,
 "url": "media/photo_C0BEBAE7_D3EE_56E4_41E6_48BE307C8A50.png",
 "paddingRight": 0,
 "minHeight": 0,
 "height": "89%",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "class": "Image",
 "minWidth": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image22503"
 },
 "horizontalAlign": "center",
 "propagateClick": false
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_C168B374_D3FB_B7E4_41DF_FD1B1CF5DD10",
 "width": "100%",
 "paddingLeft": 10,
 "paddingRight": 10,
 "scrollBarMargin": 2,
 "minHeight": 0,
 "height": "10%",
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 10,
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "scrollBarVisible": "rollOver",
 "minWidth": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:31px;font-family:'Times New Roman', Times, serif;\">Shop their musqara neckalace </SPAN><SPAN STYLE=\"color:#f3a22e;\"><A HREF=\"https://www.prerto.com/products/daisha-set\" TARGET=\"_blank\" STYLE=\"text-decoration:none; color:inherit;\"><SPAN STYLE=\"font-size:31px;font-family:'Times New Roman', Times, serif;\"><I><U>here</U></I></SPAN></A></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText13193"
 },
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "image_uidC5DB898D_D3B6_7324_41D6_D2576945DD86_1",
 "verticalAlign": "middle",
 "width": "100%",
 "paddingLeft": 0,
 "url": "media/photo_C133F347_D3F6_B724_41D3_1DD32A57DC9F.jpeg",
 "paddingRight": 0,
 "minHeight": 0,
 "height": "89%",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "class": "Image",
 "minWidth": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image22502"
 },
 "horizontalAlign": "center",
 "propagateClick": false
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": 18.76,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_1_HS_0_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -26.52,
   "hfov": 13.67
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8, this.camera_C71B4C65_D3B6_71E4_41C2_FB35742CF7DB); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1ECCBA5_D39E_D764_41C7_6A8363F937BA",
   "yaw": 18.76,
   "pitch": -26.52,
   "distance": 100,
   "hfov": 13.67
  }
 ],
 "id": "overlay_D92B91EC_D36B_B2E5_41EA_5976205684F5",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "4"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": 0.15,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_1_HS_0_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -21.53,
   "hfov": 14.21
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2, this.camera_C59A2A65_D3B6_71E4_41D4_BFB4245068B3); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1E3DBA5_D39E_D764_41E5_09C02E4BC475",
   "yaw": 0.15,
   "pitch": -21.53,
   "distance": 100,
   "hfov": 14.21
  }
 ],
 "id": "overlay_D9546936_D36A_5364_41DF_F5825A802520",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "5"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": 10.9,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_1_HS_1_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -14.72,
   "hfov": 12.73
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419, this.camera_C5B88AA7_D3B6_7164_41E0_210AFDBB06F4); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1E31BA5_D39E_D764_41E5_8BADFBC1B32F",
   "yaw": 10.9,
   "pitch": -14.72,
   "distance": 100,
   "hfov": 12.73
  }
 ],
 "id": "overlay_D9545936_D36A_5364_41D2_E7D5DFA8AF59",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "1"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": 172.66,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_1_HS_2_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -20.17,
   "hfov": 14.34
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094, this.camera_C5545AEC_D3B6_76E4_41E6_733D8DF394E6); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1E36BA5_D39E_D764_41E3_3F4517ACE904",
   "yaw": 172.66,
   "pitch": -20.17,
   "distance": 100,
   "hfov": 14.34
  }
 ],
 "id": "overlay_D9544936_D36A_5364_41E5_39D8A13F6EB6",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "2"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": 93.94,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_3_0_0_map.gif",
      "width": 31,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -0.75,
   "hfov": 29.75
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_C1062051_D395_D13C_41B7_A2D5C96F695D, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "yaw": 93.94,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_3_0.png",
      "width": 173,
      "class": "ImageResourceLevel",
      "height": 87
     }
    ]
   },
   "pitch": -0.75,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 29.75
  }
 ],
 "id": "overlay_C17A6790_D396_FF3C_41E8_AE527C56A394",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Image"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": -64.18,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_4_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": 1.42,
   "hfov": 30.06
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_C71E3F1B_D395_CF23_41DA_C1D9810510B5, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "yaw": -64.18,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_4_0.png",
      "width": 175,
      "class": "ImageResourceLevel",
      "height": 86
     }
    ]
   },
   "pitch": 1.42,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 30.06
  }
 ],
 "id": "overlay_C754BD42_D39A_B31C_41CB_8D83A9D9DD08",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Image"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": -44.8,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_1_HS_0_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -30.16,
   "hfov": 13.21
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8, this.camera_C747DB84_D3B6_7724_41B1_00894BEE4414); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1ED9BA5_D39E_D764_41DC_9470FCBCEDCF",
   "yaw": -44.8,
   "pitch": -30.16,
   "distance": 100,
   "hfov": 13.21
  }
 ],
 "id": "overlay_D96BBA52_D36B_B13C_41DF_17F6B114A309",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle 02c"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": -130.46,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": 21.39,
   "hfov": 28
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_C0825645_D395_D124_41D5_E5862E02DAE9, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "yaw": -130.46,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_1_0.png",
      "width": 175,
      "class": "ImageResourceLevel",
      "height": 86
     }
    ]
   },
   "pitch": 21.39,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 28
  }
 ],
 "id": "overlay_C09F26AD_D395_D164_4194_AD8E5A3BEE2D",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Image"
 }
},
{
 "restartMovementDelay": 15000,
 "movements": [
  {
   "targetYaw": -118.96,
   "targetPitch": -6.76,
   "path": "shortest",
   "pitchSpeed": 11.59,
   "class": "TargetPanoramaCameraMovement",
   "yawSpeed": 22.27,
   "easing": "quad_in_out"
  },
  {
   "targetYaw": -81.99,
   "targetPitch": -13.8,
   "path": "shortest",
   "pitchSpeed": 3.14,
   "class": "TargetPanoramaCameraMovement",
   "yawSpeed": 5.3,
   "easing": "cubic_in_out"
  }
 ],
 "id": "sequence_C59A3A66_D3B6_71E4_41E1_74CA906E415F",
 "class": "PanoramaCameraSequence",
 "restartMovementOnUserInteraction": true
},
{
 "items": [
  {
   "media": "this.album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_0",
   "class": "PhotoPlayListItem",
   "camera": {
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.69",
     "class": "PhotoCameraPosition",
     "y": "0.39",
     "zoomFactor": 1.1
    }
   }
  }
 ],
 "id": "album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_AlbumPlayList",
 "class": "PhotoPlayList"
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_C107E052_D395_D13C_41C2_65BCC98DDD41",
 "width": "100%",
 "paddingLeft": 10,
 "paddingRight": 10,
 "scrollBarMargin": 2,
 "minHeight": 0,
 "height": "10%",
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 10,
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "scrollBarVisible": "rollOver",
 "minWidth": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#f3a22e;\"><A HREF=\"https://www.amazon.in/Artistic-Religious-Goddess-Finishing-BH00036/dp/B01G77CHKU\" TARGET=\"_blank\" STYLE=\"text-decoration:none; color:inherit;\"><U>click </U></A></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText15824"
 },
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "image_uidC5DFD991_D3B6_733C_41E4_EADF0A506F1E_1",
 "verticalAlign": "middle",
 "width": "100%",
 "paddingLeft": 0,
 "url": "media/photo_C0F08738_D39A_5F6C_415A_8DC071680678.jpg",
 "paddingRight": 0,
 "minHeight": 0,
 "height": "89%",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "class": "Image",
 "minWidth": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image22504"
 },
 "horizontalAlign": "center",
 "propagateClick": false
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": -81.11,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_1_HS_0_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -41.8,
   "hfov": 11.39
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C, this.camera_C7665C30_D3B6_717C_41E5_B9440B4EE62A); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1E2CBA4_D39E_D764_41D3_0A97330D7D58",
   "yaw": -81.11,
   "pitch": -41.8,
   "distance": 100,
   "hfov": 11.39
  }
 ],
 "id": "overlay_D88580C9_D36A_512C_41CF_B46ED8DC0DD9",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "6"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": -112.89,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_1_HS_1_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -5.48,
   "hfov": 15.21
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8, this.camera_C7786BF3_D3B6_76FC_415B_AF0612854C90); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1E20BA4_D39E_D764_41C1_A7A1D027E2CF",
   "yaw": -112.89,
   "pitch": -5.48,
   "distance": 100,
   "hfov": 15.21
  }
 ],
 "id": "overlay_D88570C9_D36A_512C_41E8_C578E21797D9",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "4"
 }
},
{
 "restartMovementDelay": 15000,
 "movements": [
  {
   "targetYaw": -118.96,
   "targetPitch": -6.76,
   "path": "shortest",
   "pitchSpeed": 13.4,
   "class": "TargetPanoramaCameraMovement",
   "yawSpeed": 25.9,
   "easing": "quad_in_out"
  },
  {
   "targetYaw": -81.99,
   "targetPitch": -13.8,
   "path": "shortest",
   "pitchSpeed": 3.14,
   "class": "TargetPanoramaCameraMovement",
   "yawSpeed": 5.3,
   "easing": "cubic_in_out"
  }
 ],
 "id": "sequence_C5F229D9_D3B6_732C_41D1_9C24623DC1DE",
 "class": "PanoramaCameraSequence",
 "restartMovementOnUserInteraction": true
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": 11.95,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_1_HS_0_0_0_map.gif",
      "width": 61,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -11.38,
   "hfov": 13.51
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF, this.camera_C5E51A22_D3B6_711C_41DE_4DAEE817FC15); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1E11B9E_D39E_D724_41DA_8993F3A6C547",
   "yaw": 11.95,
   "pitch": -11.38,
   "distance": 100,
   "hfov": 13.51
  }
 ],
 "id": "overlay_DA8A1492_D36A_713C_41BD_FF4E6059A7CF",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "7"
 }
},
{
 "rollOverDisplay": false,
 "maps": [
  {
   "yaw": 94.88,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_1_HS_1_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -18.18,
   "hfov": 10.78
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2, this.camera_C5F259D9_D3B6_732C_41A7_3193B5D28B6C); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_C1E15B9F_D39E_D724_41DF_8F6EE5D019B7",
   "yaw": 94.88,
   "pitch": -18.18,
   "distance": 100,
   "hfov": 10.78
  }
 ],
 "id": "overlay_DA8BE493_D36A_713C_41E7_DC448E0497F8",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "5"
 }
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_C08F9643_D395_D11C_41D3_6FD94ABBD5C5",
 "width": "100%",
 "paddingLeft": 10,
 "paddingRight": 10,
 "scrollBarMargin": 2,
 "minHeight": 0,
 "height": "10%",
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 10,
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "scrollBarVisible": "rollOver",
 "minWidth": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#f3a22e;\"><A HREF=\"https://www.amazon.in/Artistic-Religious-Goddess-Finishing-BH00036/dp/B01G77CHKU\" TARGET=\"_blank\" STYLE=\"text-decoration:none; color:inherit;\"><U>Click</U></A></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText17830"
 },
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "image_uidC5C1B999_D3B6_732C_41C9_330A8C2F93A4_1",
 "verticalAlign": "middle",
 "width": "100%",
 "paddingLeft": 0,
 "url": "media/photo_C7B61B20_D397_B71C_41D8_BCDF982D5C87.jpg",
 "paddingRight": 0,
 "minHeight": 0,
 "height": "89%",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "class": "Image",
 "minWidth": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image22506"
 },
 "horizontalAlign": "center",
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "maxWidth": 1671,
 "maxHeight": 717,
 "borderRadius": 0,
 "id": "Image_D95B462A_CE42_8222_41D5_EE0777D1295D",
 "right": "-7.34%",
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "url": "skin/Image_D95B462A_CE42_8222_41D5_EE0777D1295D.png",
 "width": "100%",
 "paddingRight": 0,
 "minHeight": 1,
 "top": "0%",
 "height": "83.333%",
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "class": "Image",
 "minWidth": 1,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image28987"
 },
 "horizontalAlign": "center",
 "propagateClick": false
},
{
 "levels": [
  {
   "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1E67B9B_D39E_D72C_41E3_0BCEBA07B031",
 "class": "AnimatedImageResource",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1ECCBA5_D39E_D764_41C7_6A8363F937BA",
 "class": "AnimatedImageResource",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1E3DBA5_D39E_D764_41E5_09C02E4BC475",
 "class": "AnimatedImageResource",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_1_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1E31BA5_D39E_D764_41E5_8BADFBC1B32F",
 "class": "AnimatedImageResource",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_1_HS_2_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1E36BA5_D39E_D764_41E3_3F4517ACE904",
 "class": "AnimatedImageResource",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1ED9BA5_D39E_D764_41DC_9470FCBCEDCF",
 "class": "AnimatedImageResource",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1E2CBA4_D39E_D764_41D3_0A97330D7D58",
 "class": "AnimatedImageResource",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_1_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1E20BA4_D39E_D764_41C1_A7A1D027E2CF",
 "class": "AnimatedImageResource",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1E11B9E_D39E_D724_41DA_8993F3A6C547",
 "class": "AnimatedImageResource",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_1_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C1E15B9F_D39E_D724_41DF_8F6EE5D019B7",
 "class": "AnimatedImageResource",
 "colCount": 4
}],
 "paddingRight": 0,
 "children": [
  "this.MainViewer",
  "this.Container_D6FC97F8_CE43_822F_41D7_227D2ACEBC4A",
  "this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F"
 ],
 "start": "this.init(); this.syncPlaylists([this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist,this.mainPlayList])",
 "minHeight": 20,
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "vrPolyfillScale": 0.5,
 "mobileMipmappingEnabled": false,
 "scrollBarOpacity": 0.5,
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "class": "Player",
 "scrollBarVisible": "rollOver",
 "minWidth": 20,
 "height": "100%",
 "downloadEnabled": false,
 "overflow": "visible",
 "scrollBarColor": "#000000",
 "data": {
  "name": "Player456"
 },
 "horizontalAlign": "left",
 "propagateClick": false,
 "mouseWheelEnabled": true,
 "layout": "absolute",
 "gap": 10
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
