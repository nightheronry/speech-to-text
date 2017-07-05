  var XMLHttpRequestObject = false;

  if (window.XMLHttpRequest) {
      XMLHttpRequestObject = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
      XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHttp");
  }

  var audio_context;
  var recorder;
  var isRecording = false;
  var isDevice = false;
  var analyser;
  var dataArray = new Uint8Array();

  function startUserMedia(stream) {
      var input = audio_context.createMediaStreamSource(stream);

      recorder = new Recorder(input);

      if(recorder!=undefined){
        isDevice=true;
      }
      console.log(isDevice);
      analyser = audio_context.createAnalyser();
      input.connect(analyser);

      analyser.fftSize = 2048;
      var bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(analyser.fftSize);
      analyser.getByteFrequencyData(dataArray);
  }

  var uploading = false;
  var time = 1;
  var dot = 0;
  var myVar;
  var timeout;
  var showVar;
  var uploading_timer;

  function myTimer(timeDiv) {
      document.getElementById(timeDiv).innerHTML = time++;
  }

  function startRecording(btnDiv, timeDiv, recordingslistDiv, recodRadioDiv, for_record_outputDiv, backstatus2Div, outputword2Div) {
      recorder && recorder.record();
      myVar = setInterval(myTimer, 1000, timeDiv);
      time = 1;

      console.log(recorder);

      var d = document.getElementById(recordingslistDiv);
      d.innerHTML = "";
      for (var i = 0; i < 256; i++) {
          d.innerHTML += '<div></div>';
      }
      var dd = document.querySelectorAll('#' + recordingslistDiv + ' div');

      if(analyser){
      showVar = setInterval(function() {
          analyser.getByteFrequencyData(dataArray);
          for (var j = 0; j < 256; j++) {
              //dd[j].style.height = 1+'px';
              dd[j].style.height = (dataArray[j] == 0) ? 1 + 'px' : Math.round(dataArray[j] * 1.45 / 3) + 'px';
              dd[j].style.background = 'rgba(' + (255 - j) + ',' + j + ',0,1)';
              dd[j].style.background = '-webkit-linear-gradient(bottom ,rgba(0,0,0,0.5),rgba(' + (255 - j) + ',' + j + ',0,1),rgba(' + (255 - j) + ',' + j + ',0,1),rgba(255,255,255,1))';
              dd[j].style.background = '-o-linear-gradient(bottom ,rgba(0,0,0,0.5),rgba(' + (255 - j) + ',' + j + ',0,1),rgba(' + (255 - j) + ',' + j + ',0,1),rgba(255,255,255,1))';
              dd[j].style.background = '-moz-linear-gradient(bottom ,rgba(0,0,0,0.5),rgba(' + (255 - j) + ',' + j + ',0,1),rgba(' + (255 - j) + ',' + j + ',0,1),rgba(255,255,255,1))';
              dd[j].style.background = 'linear-gradientt(bottom ,rgba(0,0,0,0.5),rgba(' + (255 - j) + ',' + j + ',0,1),rgba(' + (255 - j) + ',' + j + ',0,1),rgba(255,255,255,1))';
          }
      }, 50);
      }
      timeout =window.setTimeout(function() {
          if (isRecording) {
              rec_btn(btnDiv, timeDiv, recordingslistDiv, recodRadioDiv, for_record_outputDiv, backstatus2Div, outputword2Div);
          } else {

          }
      }, 1000 * 3);
  }



  function stopRecording(recordingslistDiv, recodRadioDiv, for_record_outputDiv, backstatus2Div, outputword2Div) {
      recorder && recorder.stop();
      window.clearInterval(myVar);
      window.clearInterval(showVar);

      uploading = true;
      uploading_timer = setInterval(show_loading, 500, outputword2Div);
      // create WAV download link using audio data blob
      createDownloadLink(recordingslistDiv, recodRadioDiv, for_record_outputDiv, backstatus2Div, outputword2Div);

      clearTimeout(timeout);
      recorder.clear();
  }

  function show_loading(outputword2Div) {
      var outputwordDiv = document.getElementById(outputword2Div);
      if (uploading) {
          switch (dot) {
              case 0:
                  outputwordDiv.innerHTML = "Please wait ,now uploading .";
                  dot = 1;
                  break;
              case 1:
                  outputwordDiv.innerHTML = "Please wait ,now uploading ..";
                  dot = 2;
                  break;
              case 2:
                  outputwordDiv.innerHTML = "Please wait ,now uploading ...";
                  dot = 0;
                  break;
              default:
                  outputwordDiv.innerHTML = "-";
                  break;
          }
      } else {
          clearInterval(uploading_timer);
      }
  }

  function rec_btn(btnDiv, timeDiv, recordingslistDiv, recodRadioDiv, for_record_outputDiv, backstatus2Div, outputword2Div) {

      var obj = document.getElementById(btnDiv);
      if(isDevice){
        if (!isRecording) {
            isRecording = true;
            startRecording(btnDiv, timeDiv, recordingslistDiv, recodRadioDiv, for_record_outputDiv, backstatus2Div, outputword2Div);
            obj.src = "mic-animate.gif";
        } else {
            isRecording = false;
            stopRecording(recordingslistDiv, recodRadioDiv, for_record_outputDiv, backstatus2Div, outputword2Div);
            obj.src = "mic.gif"
        }
      }else{
        obj.src = "mic-slash.gif"
        alert("偵測不到錄音設備，\n請確認後重整頁面。");
      }
  }

  function recognizing(blod, XMLHttpRequestObject){

  var req = XMLHttpRequestObject;
  req.open("POST", "http://stt.itri.org.tw/STTService/v1/stt/useSTT", true);
  req.setRequestHeader("Authorization", "a9d43ae7061ee72aaa23bc8c0244b578");
  req.setRequestHeader("rate", "16000");
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.onreadystatechange = function() {
    if (XMLHttpRequestObject.readyState == 4 &&
        XMLHttpRequestObject.status == 200) {
            uploading = false;
            console.log("getRequest1");
            console.log(XMLHttpRequestObject.responseText);
            output_json = JSON.parse(XMLHttpRequestObject.responseText);

            div_temp.innerHTML = JSON.stringify(output_json, null, 4);

            if (output_json.status == 0) {
                backstatusDiv.innerHTML = "<img src='./js/icon_check.png'>";
                var outputword = "";
                for (x in output_json.sents) {
                    if (x > 0) {
                        outputword += " , ";
                    }
                    outputword += output_json.sents[x].sent;
                }
                outputwordDiv.innerHTML = outputword;
            } else {

                backstatusDiv.innerHTML = "<img src='./js/icon_fail.png'>err: " + output_json.status;
                outputwordDiv.innerHTML = "<img src='./js/icon_fail.png'>" + output_json.message;
            }

        }

  };
  req.send(blod);

  }

  function createDownloadLink(recordingslistDiv, recodRadioDiv, for_record_outputDiv, backstatus2Div, outputword2Div) {
      recorder && recorder.exportWAV(function(blob) {
          var url = URL.createObjectURL(blob);
          var li = document.createElement('li');
          var au = document.createElement('audio');
          var hf = document.createElement('a');
          var d = document.getElementById(recordingslistDiv);
          d.style.height = '115px';

          au.controls = true;
          au.src = url;
          hf.href = url;
          hf.download = new Date().toISOString() + '.wav';
          hf.innerHTML = "Download .wav file : " + hf.download;
          li.appendChild(au);
          li.appendChild(hf);
          recordingslist.innerHTML = "";
          var taskName = "Restaurant";
          console.log(taskName);

          var formData = new FormData();
          var uploadblob = blob.slice(44, blob.size, 'text/plain');

          var a = document.createElement("a");
          a.href = window.URL.createObjectURL(uploadblob);
          a.download = new Date().toISOString() + '.pcm';
          a.innerHTML = "<br>Download .pcm file : " + a.download;
          li.appendChild(a);
          recordingslist.appendChild(li);

          var div_temp = document.getElementById(for_record_outputDiv);
          var backstatusDiv = document.getElementById(backstatus2Div);
          var outputwordDiv = document.getElementById(outputword2Div);
            /*
          if (XMLHttpRequestObject) {

          var req = XMLHttpRequestObject;
          req.open("POST", "https://stt.itri.org.tw/STTService/v1/stt/useSTT", true);
          req.setRequestHeader("Authorization", "a9d43ae7061ee72aaa23bc8c0244b578");
          req.setRequestHeader("rate", "16000");
          req.setRequestHeader("Accept", "application/json");
          req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
          req.onreadystatechange = function() {
            if (XMLHttpRequestObject.readyState == 4 &&
                XMLHttpRequestObject.status == 200) {
                    uploading = false;
                    console.log("getRequest1");
                    console.log(XMLHttpRequestObject.responseText);
                    output_json = JSON.parse(XMLHttpRequestObject.responseText);

                    div_temp.innerHTML = JSON.stringify(output_json, null, 4);

                    if (output_json.status == 0) {
                        backstatusDiv.innerHTML = "<img src='./js/icon_check.png'>";
                        var outputword = "";
                        for (x in output_json.sents) {
                            if (x > 0) {
                                outputword += " , ";
                            }
                            outputword += output_json.sents[x].sent;
                        }
                        outputwordDiv.innerHTML = outputword;
                    } else {

                        backstatusDiv.innerHTML = "<img src='./js/icon_fail.png'>err: " + output_json.status;
                        outputwordDiv.innerHTML = "<img src='./js/icon_fail.png'>" + output_json.message;
                    }

                }

          };
          req.send(uploadblob);
        }*/

          if (XMLHttpRequestObject) {
            console.log("POST1");
              var url = "./passfile.php";



              //bas64blod = btoa(uploadblob);
              var file = new File([uploadblob], "test.pcm", {
                type: 'audio/pcm'
              });
              formData.append("taskName", taskName);
              formData.append("upload", file);
              console.log("blod:"+file);
              //XMLHttpRequestObject.setRequestHeader("Content-Type", "multipart/form-data");
              //XMLHttpRequestObject.overrideMimeType("text/plain; charset=x-user-defined");
              XMLHttpRequestObject.onreadystatechange = function() {
                  if (XMLHttpRequestObject.readyState == 4 &&
                      XMLHttpRequestObject.status == 200) {
                        uploading = false;
                        //console.log(XMLHttpRequestObject.responseText);
                        output_json = JSON.parse(XMLHttpRequestObject.responseText);

                        //backstatusDiv.src="../images/icon_check.png";
                        //div_temp.innerHTML=XMLHttpRequestObject.responseText;
                        div_temp.innerHTML = JSON.stringify(output_json, null, 4);

                        if (output_json.status == 0) {
                            backstatusDiv.innerHTML = "<img src='./js/icon_check.png'>";
                            var outputword = "";
                            for (x in output_json.sents) {
                                if (x > 0) {
                                    outputword += " , ";
                                }
                                outputword += output_json.sents[x].sent;
                            }
                            outputwordDiv.innerHTML = outputword;
                        } else {

                            backstatusDiv.innerHTML = "<img src='../images/icon_fail.png'>err: " + output_json.status;
                            outputwordDiv.innerHTML = "<img src='../images/icon_fail.png'>" + output_json.message;
                        }


                  }
              }
              XMLHttpRequestObject.open("POST", url);
              XMLHttpRequestObject.send(formData);
          }

      });
      /*
      formData.append("taskName", taskName);
      //bas64blod = btoa(uploadblob);
      formData.append("upload", uploadblob, "test.pcm");
      //console.log("blod:"+bas64blod);
      $.ajax({
    type: 'POST',
    url: './passfile.php',
    data: formData,
    processData: false,
    contentType: false
}).done(function(data) {
  uploading = false;
  console.log("getRequest1");
  console.log(data);
  output_json = JSON.parse(data);

  //backstatusDiv.src="../images/icon_check.png";
  //div_temp.innerHTML=XMLHttpRequestObject.responseText;
  div_temp.innerHTML = JSON.stringify(output_json, null, 4);

  if (output_json.status == 0) {
      backstatusDiv.innerHTML = "<img src='./js/icon_check.png'>";
      var outputword = "";
      for (x in output_json.sents) {
          if (x > 0) {
              outputword += " , ";
          }
          outputword += output_json.sents[x].sent;
      }
      outputwordDiv.innerHTML = outputword;
  } else {

      backstatusDiv.innerHTML = "<img src='./js/icon_fail.png'>err: " + output_json.status;
      outputwordDiv.innerHTML = "<img src='./js/icon_fail.png'>" + output_json.message;
  }
});

});
*/
}
  window.onload = function init() {

      try {
          // webkit shim
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||navigator.mediaDevices.getUserMedia;
          window.URL = window.URL || window.webkitURL;

          audio_context = new AudioContext;
      } catch (e) {
          alert('No web audio support in this browser!');
      }

      navigator.getUserMedia({
          audio: true
      }, startUserMedia, function(e) {
        (e.name=="DevicesNotFoundError")&&alert("偵測不到錄音設備，將無法使用線上錄音之功能");
        isDevice=false;
      });


  };

  function show_filename(uploadDiv, filenameDiv) {
      var obj_upload = document.getElementById(uploadDiv);
      var obj = document.getElementById(filenameDiv);
      if (obj_upload.files[0]) {
          obj.value = obj_upload.files[0].name;
      }
  }

  function check(uploadDiv, backstatusDivT, outputwordDivT, radioDiv) {
      var filename = document.getElementById(uploadDiv);

      var backstatusDiv = document.getElementById(backstatusDivT);
      var outputwordDiv = document.getElementById(outputwordDivT);
      var taskName = "Restaurant";

      var file_ext = filename.value.split('.').pop().toLowerCase();
      if (filename.value != "") {
          if (file_ext == "pcm") {
              if (taskName != "") {
                  if (true) {
                      uploading = true;
                      uploading_timer = setInterval(function() {
                          if (uploading) {
                              switch (dot) {
                                  case 0:
                                      outputwordDiv.innerHTML = "Please wait ,now uploading .";
                                      dot = 1;
                                      break;
                                  case 1:
                                      outputwordDiv.innerHTML = "Please wait ,now uploading ..";
                                      dot = 2;
                                      break;
                                  case 2:
                                      outputwordDiv.innerHTML = "Please wait ,now uploading ...";
                                      dot = 0;
                                      break;
                                  default:
                                      outputwordDiv.innerHTML = "-";
                                      break;
                              }
                          } else {
                              clearInterval(uploading_timer);
                          }
                      }, 500);
                      return true;
                  } else {
                      backstatusDiv.innerHTML = "-";
                      outputwordDiv.innerHTML = "-";

                      return false;
                  }
              } else {
                  alert("尚未選擇應用!");
                  return false;
              }
          } else {
              alert("檔案格式錯誤!");
              backstatusDiv.innerHTML = "-";
              outputwordDiv.innerHTML = "-";
              return false;
          }
      } else {
          alert("尚未選擇檔案!");
          backstatusDiv.innerHTML = "-";
          outputwordDiv.innerHTML = "-";
          return false;
      }
      return false;
  }

  function getDate(div, passFormDiv, buttonDiv, uploadDiv, backstatusDivT, outputwordDivT, radioDiv) {
      //alert(taskName.value+"  "+filename);
      var output_json = "";
      var div_temp = document.getElementById(div);
      var formDiv = document.getElementById(passFormDiv);
      var fileDiv = document.getElementById(uploadDiv);
      var buttonDiv = document.getElementById(buttonDiv);
      var backstatusDiv = document.getElementById(backstatusDivT);
      var outputwordDiv = document.getElementById(outputwordDivT);

      var taskName = "";

          taskName = "Restaurant";



      if (fileDiv.value != "") {
          var file = fileDiv.files[0];
          var formData = new FormData();
          formData.append('taskName', taskName);
          formData.append('upload', file, file.name);
          console.log('append uploading file1');
      }
      if (XMLHttpRequestObject) {
          var url = "./passfile.php";
          XMLHttpRequestObject.open("POST", url, true);
          console.log('post uploading file');
          XMLHttpRequestObject.onreadystatechange = function() {
              if (XMLHttpRequestObject.readyState == 4 &&
                  XMLHttpRequestObject.status == 200) {
                    console.log('got req');
                  uploading = false;
                  output_json = JSON.parse(XMLHttpRequestObject.responseText);
                  //backstatusDiv.src="../images/icon_check.png";
                  //div_temp.innerHTML=XMLHttpRequestObject.responseText;
                  div_temp.innerHTML = JSON.stringify(output_json, null, 4);

                  if (output_json.status == 0) {
                      backstatusDiv.innerHTML = "<img src='./js/icon_check.png'>";
                      var outputword = "";
                      for (x in output_json.sents) {
                          if (x > 0) {
                              outputword += " , ";
                          }
                          outputword += output_json.sents[x].sent;
                      }
                      outputwordDiv.innerHTML = outputword;
                  } else {
                      backstatusDiv.innerHTML = "<img src='./js/icon_fail.png'>err: " + output_json.status;
                      outputwordDiv.innerHTML = "<img src='./js/icon_fail.png'>" + output_json.message;
                  }

              } else {
                  backstatusDiv.innerHTML = "Loading ...";
                  outputwordDiv.innerHTML = "Loading ...";
              }
          }
          if (check(uploadDiv, backstatusDivT, outputwordDivT, radioDiv)) {
              XMLHttpRequestObject.send(formData);
          }
      }

  }
