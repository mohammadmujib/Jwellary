(function(){
    var script = {
 "scripts": {
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "registerKey": function(key, value){  window[key] = value; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "existsKey": function(key){  return key in window; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "getKey": function(key){  return window[key]; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "unregisterKey": function(key){  delete window[key]; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } }
 },
 "paddingBottom": 0,
 "borderRadius": 0,
 "backgroundPreloadEnabled": true,
 "id": "rootPlayer",
 "desktopMipmappingEnabled": false,
 "verticalAlign": "top",
 "defaultVRPointer": "laser",
 "width": "100%",
 "paddingLeft": 0,
 "definitions": [{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 155.33,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -0.18,
    "path": "longest",
    "pitchSpeed": 2.07,
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
 "automaticZoomSpeed": 10
},
{
 "idleSequence": "this.sequence_C43E0C98_D678_B286_41CA_A335E89965F7",
 "class": "PanoramaCamera",
 "timeToIdle": 15000,
 "initialPosition": {
  "yaw": 88.48,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C43E2C98_D678_B286_41B3_E003A2DA433D",
 "automaticZoomSpeed": 10,
 "initialSequence": "this.sequence_C43E0C98_D678_B286_41CA_A335E89965F7"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 74.22,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": 1.63,
    "path": "shortest",
    "pitchSpeed": 2.07,
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
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 68.78,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.67,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 52.71,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -6.22,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 35.18,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.02,
    "path": "shortest",
    "pitchSpeed": 2.07,
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
 "automaticZoomSpeed": 10
},
{
 "height": 600,
 "label": "silver women",
 "id": "photo_C133F347_D3F6_B724_41D3_1DD32A57DC9F",
 "width": 627,
 "thumbnailUrl": "media/photo_C133F347_D3F6_B724_41D3_1DD32A57DC9F_t.jpg",
 "duration": 5000,
 "class": "Photo",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/photo_C133F347_D3F6_B724_41D3_1DD32A57DC9F.jpeg",
    "class": "ImageResourceLevel"
   }
  ]
 }
},
{
 "headerBackgroundOpacity": 1,
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_D8054F38_D658_8F86_41B0_50AC9ACBF085",
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
 "paddingLeft": 0,
 "titleFontWeight": "normal",
 "closeButtonIconWidth": 12,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "headerBorderColor": "#000000",
 "closeButtonIconLineWidth": 2,
 "veilColorRatios": [
  0,
  1
 ],
 "modal": true,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "headerBackgroundColorDirection": "vertical",
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "closeButtonIconHeight": 12,
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "title": "",
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "shadowHorizontalLength": 3,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerPaddingBottom": 10,
 "shadowVerticalLength": 0,
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "shadow": true,
 "layout": "vertical",
 "headerPaddingTop": 10,
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "shadowColor": "#000000",
 "closeButtonBackgroundColorRatios": [],
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "contentOpaque": false,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "children": [
  "this.htmlText_D800FF37_D658_8F8A_4188_FF85BCF750DF",
  {
   "paddingBottom": 0,
   "borderRadius": 0,
   "width": "100%",
   "paddingLeft": 0,
   "url": "https://www.vaibhavjewellers.com/blog/best-jewellery-designs-below-50k/",
   "minHeight": 0,
   "class": "WebFrame",
   "backgroundColorDirection": "vertical",
   "backgroundColor": [],
   "scrollEnabled": true,
   "backgroundOpacity": 1,
   "borderSize": 0,
   "paddingTop": 0,
   "minWidth": 0,
   "backgroundColorRatios": [],
   "height": "89%",
   "insetBorder": true,
   "paddingRight": 0,
   "data": {
    "name": "WebFrame4253"
   },
   "shadow": false,
   "propagateClick": false
  }
 ],
 "bodyPaddingRight": 5,
 "titlePaddingTop": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "titleFontColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "paddingTop": 0,
 "minWidth": 20,
 "footerHeight": 5,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "shadowSpread": 1,
 "bodyPaddingLeft": 5,
 "bodyPaddingTop": 5,
 "bodyPaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonBackgroundColor": [],
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "data": {
  "name": "Window3734"
 },
 "titlePaddingBottom": 5,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "shadowOpacity": 0.5,
 "propagateClick": false,
 "titleFontFamily": "Arial",
 "horizontalAlign": "center",
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "gap": 10,
 "titleFontStyle": "normal"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 142.59,
    "hfovSpeed": 1.56,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -0.93,
    "path": "shortest",
    "pitchSpeed": 1.28,
    "targetHfov": 90,
    "yawSpeed": 1.56,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 155.33,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -0.18,
    "path": "longest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 139.43,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C4885B4B_D678_B79A_41D1_F79C4C33967A",
 "automaticZoomSpeed": 10
},
{
 "displayOriginPosition": {
  "stereographicFactor": 1,
  "yaw": -59.56,
  "class": "RotationalCameraDisplayPosition",
  "hfov": 165,
  "pitch": -90
 },
 "class": "PanoramaCamera",
 "displayMovements": [
  {
   "duration": 1000,
   "class": "TargetRotationalCameraDisplayMovement",
   "easing": "linear"
  },
  {
   "targetHfov": 119,
   "class": "TargetRotationalCameraDisplayMovement",
   "targetPitch": -1.41,
   "targetStereographicFactor": 0,
   "duration": 3000,
   "easing": "cubic_in_out"
  }
 ],
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 5.15,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -2.66,
    "path": "shortest",
    "pitchSpeed": 9.56,
    "yawSpeed": 18.2,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 67.26,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -2.91,
    "path": "shortest",
    "pitchSpeed": 2.07,
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
 "automaticZoomSpeed": 10,
 "automaticRotationSpeed": 5
},
{
 "partial": false,
 "hfovMax": 130,
 "label": "5",
 "id": "panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D88580C9_D36A_512C_41CF_B46ED8DC0DD9",
  "this.overlay_D88570C9_D36A_512C_41E8_C578E21797D9",
  "this.overlay_D9EF8EED_D668_8E9F_41BD_8B673579341A",
  "this.overlay_D96BDD52_D669_938A_41D0_AFDD88C4C4F2"
 ],
 "adjacentPanoramas": [
  {
   "yaw": -91.52,
   "backwardYaw": 96.01,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
   "distance": 1
  },
  {
   "yaw": -77.2,
   "backwardYaw": 96.01,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
   "distance": 1
  },
  {
   "yaw": -110.55,
   "backwardYaw": 0.94,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "distance": 1
  },
  {
   "yaw": -68.92,
   "backwardYaw": 44.69,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF",
   "distance": 1
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "height": 249,
 "label": "unnamed",
 "id": "album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_0",
 "width": 249,
 "thumbnailUrl": "media/album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_0_t.png",
 "duration": 5000,
 "class": "Photo",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_0.png",
    "class": "ImageResourceLevel"
   }
  ]
 }
},
{
 "partial": false,
 "hfovMax": 143,
 "label": "1",
 "id": "panorama_D96B9A51_D36B_B13C_41C1_4D0288603419",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D96BBA52_D36B_B13C_41DF_17F6B114A309",
  "this.overlay_D86C4BA0_D628_B686_41DA_D408329A9CE5",
  "this.overlay_C64C5421_D629_9186_41E6_42607F1DF2BC",
  "this.overlay_D94DD533_D658_B389_41D6_3F84F3D6FB89",
  "this.overlay_D81C7F99_D658_8E86_41D1_4A5B7C499506",
  "this.overlay_D9ABE417_D65B_918A_41D9_E1098885F514",
  "this.overlay_D86BA77A_D659_BE7A_41CC_2DF14A3193D9"
 ],
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2"
  },
  {
   "yaw": -40.57,
   "backwardYaw": 10.29,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "headerBackgroundOpacity": 1,
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_D9558EC1_D628_8E86_41E9_6868F2388473",
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
 "paddingLeft": 0,
 "titleFontWeight": "normal",
 "closeButtonIconWidth": 12,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "headerBorderColor": "#000000",
 "closeButtonIconLineWidth": 2,
 "veilColorRatios": [
  0,
  1
 ],
 "modal": true,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "headerBackgroundColorDirection": "vertical",
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "closeButtonIconHeight": 12,
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "title": "",
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "shadowHorizontalLength": 3,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerPaddingBottom": 10,
 "shadowVerticalLength": 0,
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "shadow": true,
 "layout": "vertical",
 "headerPaddingTop": 10,
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "shadowColor": "#000000",
 "closeButtonBackgroundColorRatios": [],
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "contentOpaque": false,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "children": [
  "this.htmlText_D957EEC2_D628_8E8A_41C0_9B523C0DE5C6",
  {
   "paddingBottom": 0,
   "borderRadius": 0,
   "width": "100%",
   "paddingLeft": 0,
   "url": "https://www.vaibhavjewellers.com/blog/best-jewellery-designs-below-50k/",
   "minHeight": 0,
   "class": "WebFrame",
   "backgroundColorDirection": "vertical",
   "backgroundColor": [],
   "scrollEnabled": true,
   "backgroundOpacity": 1,
   "borderSize": 0,
   "paddingTop": 0,
   "minWidth": 0,
   "backgroundColorRatios": [],
   "height": "89%",
   "insetBorder": false,
   "paddingRight": 0,
   "data": {
    "name": "WebFrame6619"
   },
   "shadow": false,
   "propagateClick": false
  }
 ],
 "bodyPaddingRight": 5,
 "titlePaddingTop": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "titleFontColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "paddingTop": 0,
 "minWidth": 20,
 "footerHeight": 5,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "shadowSpread": 1,
 "bodyPaddingLeft": 5,
 "bodyPaddingTop": 5,
 "bodyPaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonBackgroundColor": [],
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "data": {
  "name": "Window6100"
 },
 "titlePaddingBottom": 5,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "shadowOpacity": 0.5,
 "propagateClick": false,
 "titleFontFamily": "Arial",
 "horizontalAlign": "center",
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "gap": 10,
 "titleFontStyle": "normal"
},
{
 "headerBackgroundOpacity": 1,
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
 "paddingLeft": 0,
 "titleFontWeight": "bold",
 "closeButtonIconWidth": 12,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "headerBorderColor": "#000000",
 "closeButtonIconLineWidth": 2,
 "veilColorRatios": [
  0,
  1
 ],
 "modal": true,
 "bodyBorderSize": 0,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "headerBackgroundColorDirection": "vertical",
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "closeButtonIconHeight": 12,
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "title": "Muqsary Trendy Spikes",
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titleFontSize": "3vmin",
 "bodyBackgroundOpacity": 1,
 "shadowHorizontalLength": 3,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerPaddingBottom": 10,
 "shadowVerticalLength": 0,
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "shadow": true,
 "layout": "vertical",
 "headerPaddingTop": 10,
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "shadowColor": "#000000",
 "closeButtonBackgroundColorRatios": [],
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonRollOverIconColor": "#FFFFFF",
 "contentOpaque": false,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "titleTextDecoration": "none",
 "children": [
  "this.htmlText_C168B374_D3FB_B7E4_41DF_FD1B1CF5DD10",
  "this.image_uidC745C8AD_D678_B29E_41D9_443A0B2E5A14_1"
 ],
 "bodyPaddingRight": 5,
 "titlePaddingTop": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "titleFontColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "bodyBorderColor": "#000000",
 "paddingTop": 0,
 "minWidth": 20,
 "footerHeight": 5,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "shadowSpread": 1,
 "bodyPaddingLeft": 5,
 "bodyPaddingTop": 5,
 "bodyPaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonBackgroundColor": [],
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "data": {
  "name": "Window13192"
 },
 "titlePaddingBottom": 5,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "shadowOpacity": 0.5,
 "propagateClick": false,
 "titleFontFamily": "Arial",
 "horizontalAlign": "center",
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "gap": 10,
 "titleFontStyle": "italic"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 123.57,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.56,
    "path": "shortest",
    "pitchSpeed": 6.73,
    "yawSpeed": 12.51,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 68.78,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.67,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 52.71,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -6.22,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 35.18,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.02,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -169.71,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C4A6DB97_D678_B68A_41E8_19F64E26EF4A",
 "automaticZoomSpeed": 10
},
{
 "headerBackgroundOpacity": 1,
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_D930D49D_D658_F2BE_4185_85C5527B57E5",
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
 "paddingLeft": 0,
 "titleFontWeight": "normal",
 "closeButtonIconWidth": 12,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "headerBorderColor": "#000000",
 "closeButtonIconLineWidth": 2,
 "veilColorRatios": [
  0,
  1
 ],
 "modal": true,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "headerBackgroundColorDirection": "vertical",
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "closeButtonIconHeight": 12,
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "title": "",
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "shadowHorizontalLength": 3,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerPaddingBottom": 10,
 "shadowVerticalLength": 0,
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "shadow": true,
 "layout": "vertical",
 "headerPaddingTop": 10,
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "shadowColor": "#000000",
 "closeButtonBackgroundColorRatios": [],
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "contentOpaque": false,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "children": [
  "this.htmlText_D931149E_D658_F2BA_41E5_0812D09F848B",
  {
   "paddingBottom": 0,
   "borderRadius": 0,
   "width": "100%",
   "paddingLeft": 0,
   "url": "https://www.amazon.in/Sukkhi-Glamorous-Plated-Choker-Necklace/dp/B07DFNQD2Z/ref=sr_1_2_sspa?crid=RDYWREMMKQO3&keywords=jewellery&qid=1639985533&sprefix=jwellary%2Caps%2C337&sr=8-2-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExWEk3NzFORzZaNUZOJmVuY3J5cHRlZElkPUEwNjYwOTUwMURPNVcwT1VNUlU1SiZlbmNyeXB0ZWRBZElkPUEwNTA1MzU0TjFMUUNPUlRHVUlZJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==",
   "minHeight": 0,
   "class": "WebFrame",
   "backgroundColorDirection": "vertical",
   "backgroundColor": [],
   "scrollEnabled": true,
   "backgroundOpacity": 1,
   "borderSize": 0,
   "paddingTop": 0,
   "minWidth": 0,
   "backgroundColorRatios": [],
   "height": "89%",
   "insetBorder": false,
   "paddingRight": 0,
   "data": {
    "name": "WebFrame9763"
   },
   "shadow": false,
   "propagateClick": false
  }
 ],
 "bodyPaddingRight": 5,
 "titlePaddingTop": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "titleFontColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "paddingTop": 0,
 "minWidth": 20,
 "footerHeight": 5,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "shadowSpread": 1,
 "bodyPaddingLeft": 5,
 "bodyPaddingTop": 5,
 "bodyPaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonBackgroundColor": [],
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "data": {
  "name": "Window9244"
 },
 "titlePaddingBottom": 5,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "shadowOpacity": 0.5,
 "propagateClick": false,
 "titleFontFamily": "Arial",
 "horizontalAlign": "center",
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "gap": 10,
 "titleFontStyle": "normal"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 123.57,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.56,
    "path": "shortest",
    "pitchSpeed": 3.53,
    "yawSpeed": 6.07,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 68.78,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.67,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 52.71,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -6.22,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 35.18,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.02,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -5.62,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C59ADD1E_D678_B3BA_41E8_E42D991D626C",
 "automaticZoomSpeed": 10
},
{
 "changing": "var event = arguments[0]; this.changePlayListWithSameSpot(event.source, event.data.nextSelectedIndex)",
 "class": "PlayList",
 "items": [
  {
   "media": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF",
   "camera": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
   "camera": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "camera": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "camera": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094",
   "camera": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "mainPlayList"
},
{
 "idleSequence": "this.sequence_C4620C20_D678_B186_41CE_BBDB8999E966",
 "class": "PanoramaCamera",
 "timeToIdle": 15000,
 "initialPosition": {
  "yaw": 111.08,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C4623C20_D678_B186_41DA_1A657379A3BE",
 "automaticZoomSpeed": 10,
 "initialSequence": "this.sequence_C4620C20_D678_B186_41CE_BBDB8999E966"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -59.56,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -1.41,
    "path": "shortest",
    "pitchSpeed": 11.02,
    "yawSpeed": 21.13,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 5.15,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -2.66,
    "path": "shortest",
    "pitchSpeed": 9.56,
    "yawSpeed": 18.2,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 67.26,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -2.91,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -135.31,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C72F7A4D_D678_B19E_41AF_56A44CE35D94",
 "automaticZoomSpeed": 10,
 "automaticRotationSpeed": 5
},
{
 "playList": "this.album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_AlbumPlayList",
 "label": "Photo Album unnamed",
 "id": "album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802",
 "thumbnailUrl": "media/album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_t.png",
 "class": "PhotoAlbum"
},
{
 "idleSequence": "this.sequence_C400DC67_D678_B18A_41B1_219262B7D61E",
 "class": "PanoramaCamera",
 "timeToIdle": 15000,
 "initialPosition": {
  "yaw": 111.08,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C400CC67_D678_B18A_4133_BC75994A8576",
 "automaticZoomSpeed": 10,
 "initialSequence": "this.sequence_C400DC67_D678_B18A_41B1_219262B7D61E"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 123.57,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.56,
    "path": "shortest",
    "pitchSpeed": 6.91,
    "yawSpeed": 12.88,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 68.78,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.67,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 52.71,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -6.22,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 35.18,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -5.02,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -179.06,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C731E9D2_D678_B28A_41DB_5AD03B722E94",
 "automaticZoomSpeed": 10
},
{
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_rotation",
 "class": "PanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "displayPlaybackBar": true,
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer"
},
{
 "headerBackgroundOpacity": 1,
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_D9BF9589_D628_9287_41E4_AB995DBAA4B9",
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
 "paddingLeft": 0,
 "titleFontWeight": "normal",
 "closeButtonIconWidth": 12,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "headerBorderColor": "#000000",
 "closeButtonIconLineWidth": 2,
 "veilColorRatios": [
  0,
  1
 ],
 "modal": true,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "headerBackgroundColorDirection": "vertical",
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "closeButtonIconHeight": 12,
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "title": "",
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "shadowHorizontalLength": 3,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerPaddingBottom": 10,
 "shadowVerticalLength": 0,
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "shadow": true,
 "layout": "vertical",
 "headerPaddingTop": 10,
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "shadowColor": "#000000",
 "closeButtonBackgroundColorRatios": [],
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "contentOpaque": false,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "children": [
  "this.htmlText_D8423581_D628_9287_41DF_E2E1323D5867",
  {
   "paddingBottom": 0,
   "borderRadius": 0,
   "width": "100%",
   "paddingLeft": 0,
   "url": "https://www.vaibhavjewellers.com/blog/best-jewellery-designs-below-50k/",
   "minHeight": 0,
   "class": "WebFrame",
   "backgroundColorDirection": "vertical",
   "backgroundColor": [],
   "scrollEnabled": true,
   "backgroundOpacity": 1,
   "borderSize": 0,
   "paddingTop": 0,
   "minWidth": 0,
   "backgroundColorRatios": [],
   "height": "89%",
   "insetBorder": true,
   "paddingRight": 0,
   "data": {
    "name": "WebFrame4253"
   },
   "shadow": false,
   "propagateClick": false
  }
 ],
 "bodyPaddingRight": 5,
 "titlePaddingTop": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "titleFontColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "paddingTop": 0,
 "minWidth": 20,
 "footerHeight": 5,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "shadowSpread": 1,
 "bodyPaddingLeft": 5,
 "bodyPaddingTop": 5,
 "bodyPaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonBackgroundColor": [],
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "data": {
  "name": "Window3734"
 },
 "titlePaddingBottom": 5,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "shadowOpacity": 0.5,
 "propagateClick": false,
 "titleFontFamily": "Arial",
 "horizontalAlign": "center",
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "gap": 10,
 "titleFontStyle": "normal"
},
{
 "items": [
  {
   "media": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF",
   "camera": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
   "camera": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "camera": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "camera": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094",
   "camera": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419",
   "camera": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist",
 "class": "PlayList"
},
{
 "height": 294,
 "label": "paytmqr",
 "id": "photo_C0BEBAE7_D3EE_56E4_41E6_48BE307C8A50",
 "width": 171,
 "thumbnailUrl": "media/photo_C0BEBAE7_D3EE_56E4_41E6_48BE307C8A50_t.png",
 "duration": 5000,
 "class": "Photo",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/photo_C0BEBAE7_D3EE_56E4_41E6_48BE307C8A50.png",
    "class": "ImageResourceLevel"
   }
  ]
 }
},
{
 "partial": false,
 "hfovMax": 133,
 "label": "6",
 "id": "panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_DA8A1492_D36A_713C_41BD_FF4E6059A7CF",
  "this.overlay_DA8BE493_D36A_713C_41E7_DC448E0497F8",
  "this.overlay_D960D2A6_D66B_768A_41E3_832A1275111C"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 96.01,
   "backwardYaw": -91.52,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "distance": 1
  },
  {
   "yaw": 95.82,
   "backwardYaw": -91.52,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "distance": 1
  },
  {
   "yaw": 13.48,
   "backwardYaw": 42.64,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF",
   "distance": 1
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 111.13,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": 1,
    "path": "shortest",
    "pitchSpeed": 9.05,
    "yawSpeed": 17.17,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 74.22,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": 1.63,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -166.52,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C4440BD6_D678_B68A_41CF_0F47E639D8E4",
 "automaticZoomSpeed": 10
},
{
 "idleSequence": "this.sequence_D6AE7C34_CE43_8626_41E8_3CB15E714A1E",
 "class": "PanoramaCamera",
 "timeToIdle": 15000,
 "initialPosition": {
  "yaw": -118.96,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": -6.76
 },
 "id": "panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_camera",
 "automaticZoomSpeed": 10,
 "initialSequence": "this.sequence_D6AE7C34_CE43_8626_41E8_3CB15E714A1E"
},
{
 "headerBackgroundOpacity": 1,
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
 "paddingLeft": 0,
 "titleFontWeight": "bold",
 "closeButtonIconWidth": 12,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "headerBorderColor": "#000000",
 "closeButtonIconLineWidth": 2,
 "veilColorRatios": [
  0,
  1
 ],
 "modal": true,
 "bodyBorderSize": 0,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "headerBackgroundColorDirection": "vertical",
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "closeButtonIconHeight": 12,
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "title": "Scan To Pay",
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titleFontSize": "3vmin",
 "bodyBackgroundOpacity": 1,
 "shadowHorizontalLength": 3,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerPaddingBottom": 10,
 "shadowVerticalLength": 0,
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "shadow": true,
 "layout": "vertical",
 "headerPaddingTop": 10,
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "shadowColor": "#000000",
 "closeButtonBackgroundColorRatios": [],
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonRollOverIconColor": "#FFFFFF",
 "contentOpaque": false,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "titleTextDecoration": "none",
 "children": [
  "this.htmlText_C066D7AC_D3F5_DF64_41BF_A64735EF271D",
  "this.image_uidC74508B2_D678_B28A_41BA_04BDB1D10590_1"
 ],
 "bodyPaddingRight": 5,
 "titlePaddingTop": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "titleFontColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "bodyBorderColor": "#000000",
 "paddingTop": 0,
 "minWidth": 20,
 "footerHeight": 5,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "shadowSpread": 1,
 "bodyPaddingLeft": 5,
 "bodyPaddingTop": 5,
 "bodyPaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonBackgroundColor": [],
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "data": {
  "name": "Window14321"
 },
 "titlePaddingBottom": 5,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "shadowOpacity": 0.5,
 "propagateClick": false,
 "titleFontFamily": "Arial",
 "horizontalAlign": "center",
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "gap": 10,
 "titleFontStyle": "normal"
},
{
 "partial": false,
 "hfovMax": 130,
 "label": "7",
 "id": "panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_DACF7957_D36A_F324_41E8_BCDCD6065638",
  "this.overlay_C1910C91_D3EE_513C_41D6_5D5BA220D35B",
  "this.overlay_C1ABB331_D3FA_B77C_41DA_684F246D973A",
  "this.overlay_D99A0AC4_D668_968E_41D3_C556B5F9B3C8",
  "this.overlay_C6EB4B66_D668_978A_41D5_4678885D9E06"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 42.64,
   "backwardYaw": 13.48,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C",
   "distance": 1
  },
  {
   "yaw": 44.69,
   "backwardYaw": -68.92,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "distance": 1
  },
  {
   "yaw": 42.07,
   "backwardYaw": -68.92,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "distance": 1
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "partial": false,
 "hfovMax": 130,
 "label": "2",
 "id": "panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D92B91EC_D36B_B2E5_41EA_5976205684F5",
  "this.overlay_D9A9C690_D628_9E85_41D2_0E7F64AF7E06",
  "this.overlay_D8512C98_D629_9285_4197_B42CD034454F"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 18.37,
   "backwardYaw": 174.38,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
   "distance": 1
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -64.87,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -9.1,
    "path": "shortest",
    "pitchSpeed": 2.37,
    "yawSpeed": 3.75,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": -140.69,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -2.61,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -161.63,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C4EA9AFE_D678_B67A_41E0_46B0BC593292",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 111.13,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": 1,
    "path": "shortest",
    "pitchSpeed": 6.66,
    "yawSpeed": 12.36,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 74.22,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": 1.63,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -83.99,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C7174964_D678_B38E_41E8_99AFF3AA4260",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 111.13,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": 1,
    "path": "shortest",
    "pitchSpeed": 6.66,
    "yawSpeed": 12.36,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 74.22,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": 1.63,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -83.99,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C7629908_D678_B386_41C2_03B2B6BB32A8",
 "automaticZoomSpeed": 10
},
{
 "idleSequence": "this.sequence_C4CEFAA2_D678_B68A_41B7_18332B3AD232",
 "class": "PanoramaCamera",
 "timeToIdle": 15000,
 "initialPosition": {
  "yaw": 69.45,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C4CD1A9D_D678_B6B5_41DA_5CF99291162B",
 "automaticZoomSpeed": 10,
 "initialSequence": "this.sequence_C4CEFAA2_D678_B68A_41B7_18332B3AD232"
},
{
 "headerBackgroundOpacity": 1,
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_D9A5E97E_D63B_927A_419B_ED132D343577",
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
 "paddingLeft": 0,
 "titleFontWeight": "normal",
 "closeButtonIconWidth": 12,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "headerBorderColor": "#000000",
 "closeButtonIconLineWidth": 2,
 "veilColorRatios": [
  0,
  1
 ],
 "modal": true,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "headerBackgroundColorDirection": "vertical",
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "closeButtonIconHeight": 12,
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "title": "",
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "shadowHorizontalLength": 3,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerPaddingBottom": 10,
 "shadowVerticalLength": 0,
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "shadow": true,
 "layout": "vertical",
 "headerPaddingTop": 10,
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "shadowColor": "#000000",
 "closeButtonBackgroundColorRatios": [],
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "contentOpaque": false,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "children": [
  "this.htmlText_D9AA397E_D63B_927A_41C0_0C1C64FBF948",
  {
   "paddingBottom": 0,
   "borderRadius": 0,
   "width": "100%",
   "paddingLeft": 0,
   "url": "https://www.vaibhavjewellers.com/blog/best-jewellery-designs-below-50k/",
   "minHeight": 0,
   "class": "WebFrame",
   "backgroundColorDirection": "vertical",
   "backgroundColor": [],
   "scrollEnabled": true,
   "backgroundOpacity": 1,
   "borderSize": 0,
   "paddingTop": 0,
   "minWidth": 0,
   "backgroundColorRatios": [],
   "height": "89%",
   "insetBorder": true,
   "paddingRight": 0,
   "data": {
    "name": "WebFrame4253"
   },
   "shadow": false,
   "propagateClick": false
  }
 ],
 "bodyPaddingRight": 5,
 "titlePaddingTop": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "titleFontColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "paddingTop": 0,
 "minWidth": 20,
 "footerHeight": 5,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "shadowSpread": 1,
 "bodyPaddingLeft": 5,
 "bodyPaddingTop": 5,
 "bodyPaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonBackgroundColor": [],
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "data": {
  "name": "Window3734"
 },
 "titlePaddingBottom": 5,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "shadowOpacity": 0.5,
 "propagateClick": false,
 "titleFontFamily": "Arial",
 "horizontalAlign": "center",
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "gap": 10,
 "titleFontStyle": "normal"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -140.69,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -2.61,
    "path": "shortest",
    "pitchSpeed": 2.07,
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
 "automaticZoomSpeed": 10
},
{
 "id": "MainViewerPhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "viewerArea": "this.MainViewer"
},
{
 "partial": false,
 "hfovMax": 130,
 "label": "4",
 "id": "panorama_D9548936_D36A_5364_41E6_B52D756A56B8",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_t.jpg",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/f/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/u/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/r/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/b/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/d/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0/l/1/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "thumbnailUrl": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_t.jpg",
 "pitch": 0,
 "overlays": [
  "this.overlay_D9546936_D36A_5364_41DF_F5825A802520",
  "this.overlay_D9545936_D36A_5364_41D2_E7D5DFA8AF59",
  "this.overlay_D9544936_D36A_5364_41E5_39D8A13F6EB6",
  "this.overlay_DB55CE99_D628_8E87_41C0_90BEC0A05906",
  "this.overlay_DB4E9AE2_D639_B685_41C0_7441B2848C3C",
  "this.overlay_D86F8ACF_D63B_769A_41C8_2DF21A245598",
  "this.overlay_D84821DD_D628_F2BF_41CD_3FF89E4D9BFE"
 ],
 "adjacentPanoramas": [
  {
   "yaw": 0.94,
   "backwardYaw": -110.55,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2",
   "distance": 1
  },
  {
   "yaw": 174.38,
   "backwardYaw": 18.37,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094",
   "distance": 1
  },
  {
   "yaw": 10.29,
   "backwardYaw": -40.57,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419",
   "distance": 1
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "hfovMin": "120%"
},
{
 "idleSequence": "this.sequence_C5DB0CC4_D678_B28E_41CE_F7DFCBDE3098",
 "class": "PanoramaCamera",
 "timeToIdle": 15000,
 "initialPosition": {
  "yaw": 88.48,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C5DB3CC4_D678_B28E_41D4_F497834A33DE",
 "automaticZoomSpeed": 10,
 "initialSequence": "this.sequence_C5DB0CC4_D678_B28E_41CE_F7DFCBDE3098"
},
{
 "headerBackgroundOpacity": 1,
 "paddingBottom": 0,
 "borderRadius": 5,
 "id": "window_D9AB5494_D658_B28E_41E8_6485322831EE",
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
 "paddingLeft": 0,
 "titleFontWeight": "normal",
 "closeButtonIconWidth": 12,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "headerBorderColor": "#000000",
 "closeButtonIconLineWidth": 2,
 "veilColorRatios": [
  0,
  1
 ],
 "modal": true,
 "showEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "headerBackgroundColorDirection": "vertical",
 "backgroundColorDirection": "vertical",
 "height": 600,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarWidth": 10,
 "closeButtonIconHeight": 12,
 "scrollBarOpacity": 0.5,
 "backgroundColor": [],
 "borderSize": 0,
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "title": "",
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "shadowHorizontalLength": 3,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerPaddingBottom": 10,
 "shadowVerticalLength": 0,
 "titlePaddingRight": 5,
 "veilColorDirection": "horizontal",
 "shadow": true,
 "layout": "vertical",
 "headerPaddingTop": 10,
 "titlePaddingLeft": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "headerBorderSize": 0,
 "veilOpacity": 0.4,
 "shadowColor": "#000000",
 "closeButtonBackgroundColorRatios": [],
 "titleTextDecoration": "none",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "contentOpaque": false,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilHideEffect": {
  "duration": 500,
  "class": "FadeOutEffect",
  "easing": "cubic_in_out"
 },
 "children": [
  "this.htmlText_D9AB9492_D658_B28A_41EA_4CEA4D916779",
  {
   "paddingBottom": 0,
   "borderRadius": 0,
   "width": "100%",
   "paddingLeft": 0,
   "url": "https://www.vaibhavjewellers.com/blog/best-jewellery-designs-below-50k/",
   "minHeight": 0,
   "class": "WebFrame",
   "backgroundColorDirection": "vertical",
   "backgroundColor": [],
   "scrollEnabled": true,
   "backgroundOpacity": 1,
   "borderSize": 0,
   "paddingTop": 0,
   "minWidth": 0,
   "backgroundColorRatios": [],
   "height": "89%",
   "insetBorder": true,
   "paddingRight": 0,
   "data": {
    "name": "WebFrame4253"
   },
   "shadow": false,
   "propagateClick": false
  }
 ],
 "bodyPaddingRight": 5,
 "titlePaddingTop": 5,
 "headerPaddingRight": 10,
 "minHeight": 20,
 "closeButtonIconColor": "#000000",
 "class": "Window",
 "bodyBackgroundColorDirection": "vertical",
 "scrollBarMargin": 2,
 "headerVerticalAlign": "middle",
 "titleFontColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "backgroundOpacity": 1,
 "paddingTop": 0,
 "minWidth": 20,
 "footerHeight": 5,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "shadowSpread": 1,
 "bodyPaddingLeft": 5,
 "bodyPaddingTop": 5,
 "bodyPaddingBottom": 5,
 "overflow": "scroll",
 "closeButtonBackgroundColor": [],
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 6,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "data": {
  "name": "Window3734"
 },
 "titlePaddingBottom": 5,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "shadowOpacity": 0.5,
 "propagateClick": false,
 "titleFontFamily": "Arial",
 "horizontalAlign": "center",
 "veilShowEffect": {
  "duration": 500,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "gap": 10,
 "titleFontStyle": "normal"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -59.56,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -1.41,
    "path": "shortest",
    "pitchSpeed": 11.3,
    "yawSpeed": 21.68,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 5.15,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -2.66,
    "path": "shortest",
    "pitchSpeed": 9.56,
    "yawSpeed": 18.2,
    "easing": "cubic_in_out"
   },
   {
    "targetYaw": 67.26,
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": -2.91,
    "path": "shortest",
    "pitchSpeed": 2.07,
    "yawSpeed": 3.15,
    "easing": "cubic_in_out"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -137.36,
  "class": "PanoramaCameraPosition",
  "hfov": 119,
  "pitch": 0
 },
 "id": "camera_C5FBACEC_D678_B29E_41D2_88B5752C5014",
 "automaticZoomSpeed": 10,
 "automaticRotationSpeed": 5
},
{
 "items": [
  {
   "player": "this.MainViewerPhotoAlbumPlayer",
   "media": "this.album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802",
   "class": "PhotoAlbumPlayListItem"
  }
 ],
 "id": "playList_C74F98CD_D678_B29E_4162_C51D4CAFEF44",
 "class": "PlayList"
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "MainViewer",
 "left": 0,
 "width": "100%",
 "progressOpacity": 1,
 "transitionMode": "blending",
 "toolTipShadowColor": "#333333",
 "playbackBarHeadBorderColor": "#000000",
 "paddingLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarHeadBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 5,
 "toolTipBorderColor": "#767676",
 "playbackBarLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipPaddingBottom": 4,
 "playbackBarHeadShadow": true,
 "playbackBarHeadHeight": 15,
 "vrPointerSelectionTime": 2000,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBorderColor": "#000000",
 "toolTipBorderSize": 3,
 "height": "100.009%",
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarOpacity": 1,
 "firstTransitionDuration": 0,
 "toolTipBackgroundColor": "#FFFF00",
 "progressBottom": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "progressHeight": 10,
 "progressBackgroundOpacity": 1,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowOpacity": 1,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipPaddingRight": 6,
 "toolTipFontFamily": "Arial",
 "progressBorderRadius": 0,
 "progressLeft": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderSize": 0,
 "playbackBarHeadWidth": 6,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeight": 10,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "toolTipOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "minHeight": 50,
 "class": "ViewerArea",
 "bottom": -0.05,
 "toolTipFontColor": "#606060",
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "paddingTop": 0,
 "minWidth": 100,
 "progressBarBorderRadius": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBarBorderSize": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "toolTipFontStyle": "normal",
 "transitionDuration": 500,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipPaddingLeft": 6,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "paddingRight": 0,
 "toolTipShadowVerticalLength": 0,
 "toolTipShadowBlurRadius": 3,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBackgroundColorRatios": [
  0
 ],
 "data": {
  "name": "Main Viewer"
 },
 "propagateClick": true,
 "playbackBarBorderRadius": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "Container_D6FC97F8_CE43_822F_41D7_227D2ACEBC4A",
 "left": "1.96%",
 "shadowColor": "#000000",
 "width": "10.707%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "children": [
  "this.Image_D95B462A_CE42_8222_41D5_EE0777D1295D"
 ],
 "minHeight": 1,
 "class": "Container",
 "contentOpaque": true,
 "scrollBarMargin": 2,
 "gap": 10,
 "top": "3.04%",
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "shadowHorizontalLength": 3,
 "shadowSpread": 1,
 "scrollBarVisible": "rollOver",
 "overflow": "hidden",
 "shadowVerticalLength": 0,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "shadowBlurRadius": 4,
 "shadow": true,
 "childrenInteractionEnabled": false,
 "scrollBarWidth": 10,
 "height": "7.742%",
 "shadowOpacity": 0.66,
 "propagateClick": false,
 "data": {
  "name": "Container28957"
 },
 "horizontalAlign": "left",
 "layout": "absolute"
},
{
 "paddingBottom": 10,
 "borderRadius": 5,
 "id": "ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F",
 "itemThumbnailScaleMode": "fit_outside",
 "width": "47.908%",
 "verticalAlign": "top",
 "itemPaddingLeft": 3,
 "right": "19.91%",
 "paddingLeft": 20,
 "itemThumbnailWidth": 75,
 "itemPaddingTop": 3,
 "itemBackgroundColor": [],
 "itemThumbnailShadowSpread": 1,
 "itemPaddingRight": 3,
 "itemThumbnailOpacity": 1,
 "height": 121.35,
 "selectedItemLabelFontColor": "#FFCC00",
 "scrollBarOpacity": 0.5,
 "itemLabelPosition": "bottom",
 "borderSize": 0,
 "scrollBarWidth": 10,
 "itemThumbnailShadow": true,
 "scrollBarVisible": "rollOver",
 "itemThumbnailShadowColor": "#000000",
 "itemLabelFontColor": "#FFFFFF",
 "itemLabelGap": 9,
 "rollOverItemLabelFontWeight": "normal",
 "itemThumbnailShadowOpacity": 0.54,
 "itemBackgroundColorRatios": [],
 "itemOpacity": 1,
 "layout": "horizontal",
 "itemBackgroundColorDirection": "vertical",
 "shadow": false,
 "playList": "this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist",
 "itemLabelFontWeight": "normal",
 "itemThumbnailShadowHorizontalLength": 3,
 "itemThumbnailBorderRadius": 50,
 "itemHorizontalAlign": "center",
 "selectedItemLabelFontWeight": "bold",
 "itemMode": "normal",
 "itemThumbnailShadowBlurRadius": 8,
 "itemThumbnailHeight": 75,
 "minHeight": 20,
 "class": "ThumbnailList",
 "scrollBarMargin": 2,
 "bottom": "4.57%",
 "rollOverItemBackgroundOpacity": 0,
 "itemBackgroundOpacity": 0,
 "itemLabelFontSize": 14,
 "backgroundOpacity": 0,
 "paddingTop": 10,
 "minWidth": 20,
 "itemPaddingBottom": 3,
 "itemLabelTextDecoration": "none",
 "itemLabelFontFamily": "Arial",
 "itemLabelFontStyle": "normal",
 "scrollBarColor": "#FFFFFF",
 "itemBorderRadius": 0,
 "paddingRight": 20,
 "data": {
  "name": "ThumbnailList35762"
 },
 "horizontalAlign": "left",
 "itemLabelHorizontalAlign": "center",
 "itemThumbnailShadowVerticalLength": 3,
 "propagateClick": false,
 "gap": 10,
 "itemVerticalAlign": "middle"
},
{
 "restartMovementDelay": 15000,
 "movements": [
  {
   "targetYaw": -118.96,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -6.76,
   "path": "shortest",
   "pitchSpeed": 12.81,
   "yawSpeed": 24.71,
   "easing": "quad_in_out"
  },
  {
   "targetYaw": -81.99,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -13.8,
   "path": "shortest",
   "pitchSpeed": 3.14,
   "yawSpeed": 5.3,
   "easing": "cubic_in_out"
  }
 ],
 "id": "sequence_C43E0C98_D678_B286_41CA_A335E89965F7",
 "class": "PanoramaCameraSequence",
 "restartMovementOnUserInteraction": true
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_D800FF37_D658_8F8A_4188_FF85BCF750DF",
 "width": "100%",
 "paddingLeft": 10,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "minHeight": 0,
 "height": "10%",
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "html": "<div style=\"text-align:left; color:#000; \"><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>",
 "paddingRight": 10,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText3735"
 },
 "shadow": false,
 "propagateClick": false
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "6"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0_HS_0_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -91.52,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -29.54,
   "hfov": 7.52
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C, this.camera_C7629908_D678_B386_41C2_03B2B6BB32A8); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74718BA_D678_B2FA_41E5_8D8B1243EF41",
   "yaw": -91.52,
   "pitch": -29.54,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.52
  }
 ],
 "id": "overlay_D88580C9_D36A_512C_41CF_B46ED8DC0DD9",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "4"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0_HS_1_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -110.55,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.76,
   "hfov": 10.58
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8, this.camera_C731E9D2_D678_B28A_41DB_5AD03B722E94); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C748D8BB_D678_B2FA_41EA_1F6267806C57",
   "yaw": -110.55,
   "pitch": -6.76,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.58
  }
 ],
 "id": "overlay_D88570C9_D36A_512C_41E8_C578E21797D9",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "6"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0_HS_2_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -68.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -31.72,
   "hfov": 10.68
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF, this.camera_C72F7A4D_D678_B19E_41AF_56A44CE35D94); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74868BC_D678_B2FE_41DE_0C964C07FA58",
   "yaw": -68.92,
   "pitch": -31.72,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.68
  }
 ],
 "id": "overlay_D9EF8EED_D668_8E9F_41BD_8B673579341A",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "6"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0_HS_3_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -77.2,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -42.18,
   "hfov": 10.22
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C, this.camera_C7174964_D678_B38E_41E8_99AFF3AA4260); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74838BC_D678_B2FE_41D7_7C27BA28DD6F",
   "yaw": -77.2,
   "pitch": -42.18,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.22
  }
 ],
 "id": "overlay_D96BDD52_D669_938A_41D0_AFDD88C4C4F2",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 02c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_0_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -40.57,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -31.81,
   "hfov": 12.25
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8, this.camera_C4A6DB97_D678_B68A_41E8_19F64E26EF4A); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74DE8C7_D678_B28A_41CA_516E23D71D2A",
   "yaw": -40.57,
   "pitch": -31.81,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.25
  }
 ],
 "id": "overlay_D96BBA52_D36B_B13C_41DF_17F6B114A309",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_2_0.png",
      "width": 108,
      "class": "ImageResourceLevel",
      "height": 47
     }
    ]
   },
   "pitch": 26.74,
   "yaw": -124.12,
   "hfov": 16.58
  }
 ],
 "id": "overlay_D86C4BA0_D628_B686_41DA_D408329A9CE5",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_2_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -124.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 26.74,
   "hfov": 16.58
  }
 ]
},
{
 "rollOverDisplay": true,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -98.4,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 3.45,
   "hfov": 52.28
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_D930D49D_D658_F2BE_4185_85C5527B57E5, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_3_0.png",
      "width": 304,
      "class": "ImageResourceLevel",
      "height": 315
     }
    ]
   },
   "pitch": 3.45,
   "yaw": -98.4,
   "hfov": 52.28
  }
 ],
 "id": "overlay_C64C5421_D629_9186_41E6_42607F1DF2BC",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": true,
 "data": {
  "label": "Laxmi"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_4_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 96.3,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.25,
   "hfov": 42.81
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_D9AB5494_D658_B28E_41E8_6485322831EE, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_4_0.png",
      "width": 260,
      "class": "ImageResourceLevel",
      "height": 209
     }
    ]
   },
   "pitch": -17.25,
   "yaw": 96.3,
   "hfov": 42.81
  }
 ],
 "id": "overlay_D94DD533_D658_B389_41D6_3F84F3D6FB89",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": true,
 "data": {
  "label": "Laxmi"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_5_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 96.3,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.25,
   "hfov": 42.81
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_D8054F38_D658_8F86_41B0_50AC9ACBF085, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_5_0.png",
      "width": 260,
      "class": "ImageResourceLevel",
      "height": 209
     }
    ]
   },
   "pitch": -17.25,
   "yaw": 96.3,
   "hfov": 42.81
  }
 ],
 "id": "overlay_D81C7F99_D658_8E86_41D1_4A5B7C499506",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 2"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_6_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -17.42,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.73,
   "hfov": 12.76
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74E28CB_D678_B29A_41D9_79225ABBBBF3",
   "yaw": -17.42,
   "pitch": -27.73,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.76
  }
 ],
 "id": "overlay_D9ABE417_D65B_918A_41D9_E1098885F514",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle  2"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_7_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -34.89,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.28,
   "hfov": 9.24
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74FE8CC_D678_B29E_41A8_02E7CC2789ED",
   "yaw": -34.89,
   "pitch": -12.28,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.24
  }
 ],
 "id": "overlay_D86BA77A_D659_BE7A_41CC_2DF14A3193D9",
 "class": "HotspotPanoramaOverlay"
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_D957EEC2_D628_8E8A_41C0_9B523C0DE5C6",
 "width": "100%",
 "paddingLeft": 10,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "minHeight": 0,
 "height": "10%",
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "html": "",
 "paddingRight": 10,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText6101"
 },
 "shadow": false,
 "propagateClick": false
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_C168B374_D3FB_B7E4_41DF_FD1B1CF5DD10",
 "width": "100%",
 "paddingLeft": 10,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "minHeight": 0,
 "height": "10%",
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:31px;font-family:'Times New Roman', Times, serif;\">Shop their musqara neckalace </SPAN><SPAN STYLE=\"color:#f3a22e;\"><A HREF=\"https://www.prerto.com/products/daisha-set\" TARGET=\"_blank\" STYLE=\"text-decoration:none; color:inherit;\"><SPAN STYLE=\"font-size:31px;font-family:'Times New Roman', Times, serif;\"><I><U>here</U></I></SPAN></A></SPAN></SPAN></DIV></div>",
 "paddingRight": 10,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText13193"
 },
 "shadow": false,
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "image_uidC745C8AD_D678_B29E_41D9_443A0B2E5A14_1",
 "verticalAlign": "middle",
 "width": "100%",
 "paddingLeft": 0,
 "url": "media/photo_C133F347_D3F6_B724_41D3_1DD32A57DC9F.jpeg",
 "minHeight": 0,
 "class": "Image",
 "height": "89%",
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 0,
 "paddingRight": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image14144"
 },
 "horizontalAlign": "center",
 "shadow": false,
 "propagateClick": false
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_D931149E_D658_F2BA_41E5_0812D09F848B",
 "width": "100%",
 "paddingLeft": 10,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "minHeight": 0,
 "height": "10%",
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "html": "",
 "paddingRight": 10,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText9245"
 },
 "shadow": false,
 "propagateClick": false
},
{
 "restartMovementDelay": 15000,
 "movements": [
  {
   "targetYaw": -118.96,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -6.76,
   "path": "shortest",
   "pitchSpeed": 14.09,
   "yawSpeed": 27.29,
   "easing": "quad_in_out"
  },
  {
   "targetYaw": -81.99,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -13.8,
   "path": "shortest",
   "pitchSpeed": 3.14,
   "yawSpeed": 5.3,
   "easing": "cubic_in_out"
  }
 ],
 "id": "sequence_C4620C20_D678_B186_41CE_BBDB8999E966",
 "class": "PanoramaCameraSequence",
 "restartMovementOnUserInteraction": true
},
{
 "items": [
  {
   "media": "this.album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_0",
   "camera": {
    "class": "MovementPhotoCamera",
    "initialPosition": {
     "x": "0.50",
     "class": "PhotoCameraPosition",
     "y": "0.50",
     "zoomFactor": 1
    },
    "scaleMode": "fit_outside",
    "duration": 5000,
    "easing": "linear",
    "targetPosition": {
     "x": "0.69",
     "class": "PhotoCameraPosition",
     "y": "0.39",
     "zoomFactor": 1.1
    }
   },
   "class": "PhotoPlayListItem"
  }
 ],
 "id": "album_C1079E68_D3AF_B1EC_41E1_53CEB23D3802_AlbumPlayList",
 "class": "PhotoPlayList"
},
{
 "restartMovementDelay": 15000,
 "movements": [
  {
   "targetYaw": -118.96,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -6.76,
   "path": "shortest",
   "pitchSpeed": 14.09,
   "yawSpeed": 27.29,
   "easing": "quad_in_out"
  },
  {
   "targetYaw": -81.99,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -13.8,
   "path": "shortest",
   "pitchSpeed": 3.14,
   "yawSpeed": 5.3,
   "easing": "cubic_in_out"
  }
 ],
 "id": "sequence_C400DC67_D678_B18A_41B1_219262B7D61E",
 "class": "PanoramaCameraSequence",
 "restartMovementOnUserInteraction": true
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_D8423581_D628_9287_41DF_E2E1323D5867",
 "width": "100%",
 "paddingLeft": 10,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "minHeight": 0,
 "height": "10%",
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "html": "<div style=\"text-align:left; color:#000; \"><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>",
 "paddingRight": 10,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText3735"
 },
 "shadow": false,
 "propagateClick": false
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "7"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0_HS_0_0_0_map.gif",
      "width": 61,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 13.48,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.37,
   "hfov": 11.96
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF, this.camera_C5FBACEC_D678_B29E_41D2_88B5752C5014); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74618B6_D678_B28A_41E4_007724429340",
   "yaw": 13.48,
   "pitch": -10.37,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.96
  }
 ],
 "id": "overlay_DA8A1492_D36A_713C_41BD_FF4E6059A7CF",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "5"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0_HS_1_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 96.01,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.7,
   "hfov": 19.16
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2, this.camera_C43E2C98_D678_B286_41B3_E003A2DA433D); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C747A8B7_D678_B28A_41D7_CDBF1ADDCCD6",
   "yaw": 96.01,
   "pitch": -18.7,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.16
  }
 ],
 "id": "overlay_DA8BE493_D36A_713C_41E7_DC448E0497F8",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": true,
 "data": {
  "label": "1st Floor"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0_HS_2_0_map.gif",
      "width": 33,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 95.82,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.22,
   "hfov": 24.05
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2, this.camera_C5DB3CC4_D678_B28E_41D4_F497834A33DE); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0_HS_2_0.png",
      "width": 145,
      "class": "ImageResourceLevel",
      "height": 69
     }
    ]
   },
   "pitch": -15.22,
   "yaw": 95.82,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 24.05
  }
 ],
 "id": "overlay_D960D2A6_D66B_768A_41E3_832A1275111C",
 "class": "HotspotPanoramaOverlay"
},
{
 "restartMovementDelay": 15000,
 "movements": [
  {
   "targetYaw": -81.99,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -13.8,
   "path": "shortest",
   "pitchSpeed": 3.14,
   "yawSpeed": 5.3,
   "easing": "cubic_in_out"
  }
 ],
 "id": "sequence_D6AE7C34_CE43_8626_41E8_3CB15E714A1E",
 "class": "PanoramaCameraSequence",
 "restartMovementOnUserInteraction": true
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_C066D7AC_D3F5_DF64_41BF_A64735EF271D",
 "width": "100%",
 "paddingLeft": 10,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "minHeight": 0,
 "height": "10%",
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:38px;\">open your scanner to pay</SPAN></SPAN></DIV></div>",
 "paddingRight": 10,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText14322"
 },
 "shadow": false,
 "propagateClick": false
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "image_uidC74508B2_D678_B28A_41BA_04BDB1D10590_1",
 "verticalAlign": "middle",
 "width": "100%",
 "paddingLeft": 0,
 "url": "media/photo_C0BEBAE7_D3EE_56E4_41E6_48BE307C8A50.png",
 "minHeight": 0,
 "class": "Image",
 "height": "89%",
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 0,
 "paddingRight": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image14145"
 },
 "horizontalAlign": "center",
 "shadow": false,
 "propagateClick": false
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "6"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_0_0_0_map.gif",
      "width": 61,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 42.64,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.3,
   "hfov": 22.84
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C, this.camera_C4440BD6_D678_B68A_41CF_0F47E639D8E4); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74428AC_D678_B29E_41DE_27DD1BA00209",
   "yaw": 42.64,
   "pitch": -19.3,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 22.84
  }
 ],
 "id": "overlay_DACF7957_D36A_F324_41E8_BCDCD6065638",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
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
   "yaw": -15.84,
   "class": "HotspotPanoramaOverlayMap",
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
   "class": "HotspotPanoramaOverlayImage",
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
   "yaw": -15.84,
   "hfov": 20.67
  }
 ],
 "id": "overlay_C1910C91_D3EE_513C_41D6_5D5BA220D35B",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
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
   "yaw": 134.53,
   "class": "HotspotPanoramaOverlayMap",
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
   "class": "HotspotPanoramaOverlayImage",
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
   "yaw": 134.53,
   "hfov": 14.55
  }
 ],
 "id": "overlay_C1ABB331_D3FA_B77C_41DA_684F246D973A",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": true,
 "data": {
  "label": "1st Floor"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_5_0_map.gif",
      "width": 52,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 44.69,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.44,
   "hfov": 13.35
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2, this.camera_C4623C20_D678_B186_41DA_1A657379A3BE); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_5_0.png",
      "width": 78,
      "class": "ImageResourceLevel",
      "height": 24
     }
    ]
   },
   "pitch": -7.44,
   "yaw": 44.69,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.35
  }
 ],
 "id": "overlay_D99A0AC4_D668_968E_41D3_C556B5F9B3C8",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "6"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_6_0_0_map.gif",
      "width": 61,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 42.07,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.3,
   "hfov": 17.9
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2, this.camera_C400CC67_D678_B18A_4133_BC75994A8576); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74698B5_D678_B28E_41E1_B52237B06613",
   "yaw": 42.07,
   "pitch": -10.3,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 17.9
  }
 ],
 "id": "overlay_C6EB4B66_D668_978A_41D5_4678885D9E06",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "4"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0_HS_0_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 18.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.04,
   "hfov": 12.39
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D9548936_D36A_5364_41E6_B52D756A56B8, this.camera_C59ADD1E_D678_B3BA_41E8_E42D991D626C); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74B38C4_D678_B28E_41C5_C4762CB93DD8",
   "yaw": 18.37,
   "pitch": -25.04,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.39
  }
 ],
 "id": "overlay_D92B91EC_D36B_B2E5_41EA_5976205684F5",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": true,
 "data": {
  "label": "Laxmi"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 89.93,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.06,
   "hfov": 34.96
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_D9BF9589_D628_9287_41E4_AB995DBAA4B9, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0_HS_1_0.png",
      "width": 209,
      "class": "ImageResourceLevel",
      "height": 214
     }
    ]
   },
   "pitch": -14.06,
   "yaw": 89.93,
   "hfov": 34.96
  }
 ],
 "id": "overlay_D9A9C690_D628_9E85_41D2_0E7F64AF7E06",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0_HS_2_0.png",
      "width": 53,
      "class": "ImageResourceLevel",
      "height": 56
     }
    ]
   },
   "pitch": -1.19,
   "yaw": 74.55,
   "hfov": 9.14
  }
 ],
 "id": "overlay_D8512C98_D629_9285_4197_B42CD034454F",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 74.55,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.19,
   "hfov": 9.14
  }
 ]
},
{
 "restartMovementDelay": 15000,
 "movements": [
  {
   "targetYaw": -118.96,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -6.76,
   "path": "shortest",
   "pitchSpeed": 11.72,
   "yawSpeed": 22.54,
   "easing": "quad_in_out"
  },
  {
   "targetYaw": -81.99,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -13.8,
   "path": "shortest",
   "pitchSpeed": 3.14,
   "yawSpeed": 5.3,
   "easing": "cubic_in_out"
  }
 ],
 "id": "sequence_C4CEFAA2_D678_B68A_41B7_18332B3AD232",
 "class": "PanoramaCameraSequence",
 "restartMovementOnUserInteraction": true
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_D9AA397E_D63B_927A_41C0_0C1C64FBF948",
 "width": "100%",
 "paddingLeft": 10,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "minHeight": 0,
 "height": "10%",
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "html": "",
 "paddingRight": 10,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText3735"
 },
 "shadow": false,
 "propagateClick": false
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "5"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_0_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 0.94,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.52,
   "hfov": 12.96
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D885A0C9_D36A_512C_41E2_51CE782723B2, this.camera_C4CD1A9D_D678_B6B5_41DA_5CF99291162B); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74968BE_D678_B2FA_41E4_8B1E2CFF8CBB",
   "yaw": 0.94,
   "pitch": -20.52,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.96
  }
 ],
 "id": "overlay_D9546936_D36A_5364_41DF_F5825A802520",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "1"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_1_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 10.29,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.37,
   "hfov": 11.85
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D96B9A51_D36B_B13C_41C1_4D0288603419, this.camera_C4885B4B_D678_B79A_41D1_F79C4C33967A); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74938BE_D678_B2FA_41CC_7638F5FAF3E7",
   "yaw": 10.29,
   "pitch": -14.37,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.85
  }
 ],
 "id": "overlay_D9545936_D36A_5364_41D2_E7D5DFA8AF59",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "2"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_2_0_0_map.gif",
      "width": 72,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 174.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.64,
   "hfov": 8.79
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094, this.camera_C4EA9AFE_D678_B67A_41E0_46B0BC593292); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_C74AC8C0_D678_B286_41C8_7A1C3DF63826",
   "yaw": 174.38,
   "pitch": -20.64,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.79
  }
 ],
 "id": "overlay_D9544936_D36A_5364_41E5_39D8A13F6EB6",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "LaxmiDEvi"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_5_0.png",
      "width": 49,
      "class": "ImageResourceLevel",
      "height": 59
     }
    ]
   },
   "pitch": -3.52,
   "yaw": 79.5,
   "hfov": 8.44
  }
 ],
 "id": "overlay_DB55CE99_D628_8E87_41C0_90BEC0A05906",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_5_0_0_map.gif",
      "width": 15,
      "class": "ImageResourceLevel",
      "height": 19
     }
    ]
   },
   "yaw": 79.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.52,
   "hfov": 8.44
  }
 ]
},
{
 "rollOverDisplay": true,
 "data": {
  "label": "Laxmi"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_6_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 96.3,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.25,
   "hfov": 42.81
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_D9A5E97E_D63B_927A_419B_ED132D343577, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_6_0.png",
      "width": 260,
      "class": "ImageResourceLevel",
      "height": 209
     }
    ]
   },
   "pitch": -17.25,
   "yaw": 96.3,
   "hfov": 42.81
  }
 ],
 "id": "overlay_DB4E9AE2_D639_B685_41C0_7441B2848C3C",
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "artifact"
 },
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_7_0.png",
      "width": 80,
      "class": "ImageResourceLevel",
      "height": 52
     }
    ]
   },
   "pitch": 9.57,
   "yaw": -76.96,
   "hfov": 13.72
  }
 ],
 "id": "overlay_D86F8ACF_D63B_769A_41C8_2DF21A245598",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_7_0_0_map.gif",
      "width": 24,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -76.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 9.57,
   "hfov": 13.72
  }
 ]
},
{
 "rollOverDisplay": true,
 "data": {
  "label": "Articat"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_8_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 17
     }
    ]
   },
   "yaw": -57.2,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.75,
   "hfov": 36.79
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.showWindow(this.window_D9558EC1_D628_8E86_41E9_6868F2388473, null, false)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_8_0.png",
      "width": 216,
      "class": "ImageResourceLevel",
      "height": 234
     }
    ]
   },
   "pitch": -7.75,
   "yaw": -57.2,
   "hfov": 36.79
  }
 ],
 "id": "overlay_D84821DD_D628_F2BF_41CD_3FF89E4D9BFE",
 "class": "HotspotPanoramaOverlay"
},
{
 "restartMovementDelay": 15000,
 "movements": [
  {
   "targetYaw": -118.96,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -6.76,
   "path": "shortest",
   "pitchSpeed": 12.81,
   "yawSpeed": 24.71,
   "easing": "quad_in_out"
  },
  {
   "targetYaw": -81.99,
   "class": "TargetPanoramaCameraMovement",
   "targetPitch": -13.8,
   "path": "shortest",
   "pitchSpeed": 3.14,
   "yawSpeed": 5.3,
   "easing": "cubic_in_out"
  }
 ],
 "id": "sequence_C5DB0CC4_D678_B28E_41CE_F7DFCBDE3098",
 "class": "PanoramaCameraSequence",
 "restartMovementOnUserInteraction": true
},
{
 "paddingBottom": 10,
 "borderRadius": 0,
 "id": "htmlText_D9AB9492_D658_B28A_41EA_4CEA4D916779",
 "width": "100%",
 "paddingLeft": 10,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "minHeight": 0,
 "height": "10%",
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "html": "<div style=\"text-align:left; color:#000; \"><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>",
 "paddingRight": 10,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText3735"
 },
 "shadow": false,
 "propagateClick": false
},
{
 "borderRadius": 0,
 "paddingBottom": 0,
 "id": "Image_D95B462A_CE42_8222_41D5_EE0777D1295D",
 "maxHeight": 717,
 "maxWidth": 1671,
 "verticalAlign": "middle",
 "right": "-7.34%",
 "width": "100%",
 "paddingLeft": 0,
 "url": "skin/Image_D95B462A_CE42_8222_41D5_EE0777D1295D.png",
 "minHeight": 1,
 "class": "Image",
 "top": "0%",
 "backgroundOpacity": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "height": "83.333%",
 "paddingRight": 0,
 "data": {
  "name": "Image28987"
 },
 "horizontalAlign": "center",
 "shadow": false,
 "scaleMode": "fit_inside",
 "propagateClick": false
},
{
 "levels": [
  {
   "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74718BA_D678_B2FA_41E5_8D8B1243EF41",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C748D8BB_D678_B2FA_41EA_1F6267806C57",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0_HS_2_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74868BC_D678_B2FE_41DE_0C964C07FA58",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D885A0C9_D36A_512C_41E2_51CE782723B2_0_HS_3_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74838BC_D678_B2FE_41D7_7C27BA28DD6F",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74DE8C7_D678_B28A_41CA_516E23D71D2A",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_6_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74E28CB_D678_B29A_41D9_79225ABBBBF3",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D96B9A51_D36B_B13C_41C1_4D0288603419_0_HS_7_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74FE8CC_D678_B29E_41A8_02E7CC2789ED",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74618B6_D678_B28A_41E4_007724429340",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_DA8A0492_D36A_713C_41D4_4422B364EE7C_0_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C747A8B7_D678_B28A_41D7_CDBF1ADDCCD6",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74428AC_D678_B29E_41DE_27DD1BA00209",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_DACFF957_D36A_F324_41D9_0A738B6E13AF_0_HS_6_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74698B5_D678_B28E_41E1_B52237B06613",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D92B81EC_D36B_B2E5_41E6_E99228B45094_0_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74B38C4_D678_B28E_41C5_C4762CB93DD8",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74968BE_D678_B2FA_41E4_8B1E2CFF8CBB",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74938BE_D678_B2FA_41CC_7638F5FAF3E7",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_D9548936_D36A_5364_41E6_B52D756A56B8_0_HS_2_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "rowCount": 6,
 "id": "AnimatedImageResource_C74AC8C0_D678_B286_41C8_7A1C3DF63826",
 "colCount": 4
}],
 "start": "this.init(); this.syncPlaylists([this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F_playlist,this.mainPlayList])",
 "children": [
  "this.MainViewer",
  "this.Container_D6FC97F8_CE43_822F_41D7_227D2ACEBC4A",
  "this.ThumbnailList_D6421F38_CE43_822E_41DC_ECA8A0E5419F"
 ],
 "minHeight": 20,
 "class": "Player",
 "vrPolyfillScale": 0.5,
 "scrollBarMargin": 2,
 "mobileMipmappingEnabled": false,
 "scrollBarOpacity": 0.5,
 "contentOpaque": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 20,
 "scrollBarVisible": "rollOver",
 "scrollBarWidth": 10,
 "overflow": "visible",
 "downloadEnabled": false,
 "paddingRight": 0,
 "mouseWheelEnabled": true,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Player456"
 },
 "horizontalAlign": "left",
 "height": "100%",
 "shadow": false,
 "layout": "absolute",
 "propagateClick": false,
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
