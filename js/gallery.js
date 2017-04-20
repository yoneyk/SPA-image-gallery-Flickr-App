window.onload = function () {
  document.getElementById("show_button").style.display = 'none';
  document.getElementById("detail_button").style.display = 'none';
}

function clearSearchField() {
  document.getElementById("search_text").value = "";
  document.getElementById("search_text").focus();
}

function backToSearch(){

  document.getElementById("show_button").style.display = 'none';
  document.getElementById("gallery-detail").style.display = 'block';
  document.getElementById("detail_button").style.display = 'none';
  document.getElementById("gallery-photo").style.display = 'none';
  //document.getElementById("pager").style.display = 'none';
  document.getElementById("selectedImageSection").style.display = 'block';
  document.getElementById("detail").style.display = 'block';
  document.getElementById("selected-photo").style.display = 'none';
  document.getElementById("zoom-photo").style.display = 'none';
  clearSearchField();
}

function backToSelectedImage(){
  document.getElementById("zoom-photo").style.display = 'none';
  document.getElementById("detail").style.display = 'none';
  document.getElementById("selected-photo").style.display = 'block';
  document.getElementById("selectedImageSection").style.display = 'block';
}

function backToImageList(){
  document.getElementById("gallery-photo").style.display = 'block';
  document.getElementById("detail").style.display = 'block';
  document.getElementById("selected-photo").style.display = 'none';
  document.getElementById("selectedImageSection").style.display = 'none';
}

function selectImage(){
  document.getElementById("select_image").style.display = 'none';
  document.getElementById("detail_button").style.display = 'block';
}

/*function selectAllImages(images) {
  //console.log(images.media.m);
  var allImages = images.media.m;
  console.log(allImages);
  $(this).addClass("selected");
}*/

function viewGallery(images) {
  var imageArray = [];
  document.getElementById("detail").style.display = 'none';
  document.getElementById("selectedImageSection").style.display = 'block';
  document.getElementById("selectedlist").innerHTML = '';
  document.getElementById("selected-photo").style.display = 'block';
  document.getElementById("selected-photo").style.cursor = 'pointer';
  for(var i = 0;i<images.length;i++){
    var list = document.createElement("li");//function that takes classname, source, width, height
    var img = document.createElement("img");
    img.src = images[i];
    img.width = '180';
    img.height = '180';
    list.appendChild(img);
    document.getElementById('selectedlist').appendChild(list);
    imageArray.push(images[i]);
  }

  var selectedListElement = document.getElementById("selectedlist").getElementsByTagName('li');
  for(var i = 0; i<selectedListElement.length; i++){
    var imgElement = selectedListElement[i];
    imgElement.onclick = function(object){
      var clickedImage = object.target.src;
      for (var j = 0; j < imageArray.length; j++) {
        if(imageArray[j] === clickedImage){
          document.getElementById("zoom-photo1").innerHTML = '';
          document.getElementById("zoom-photo").style.display = 'block';
          document.getElementById("zoom-photo1").style.display = 'block';
          document.getElementById("selected-photo").style.display = 'none';
          var img = document.createElement("img");
          img.src = clickedImage;
          img.width = '600';
          img.height = '600';
          document.getElementById('zoom-photo1').appendChild(img);
        }
      }
    };
  }
}

function searchFromFlickr() {
  var search_value = document.getElementById("search_text").value;
  var apiKey = '8324b174b812559cebfb9bd986ab2a4b';
  var xmlhttp, jsonResponse;
  document.getElementById("photolist").innerHTML = '';
  var imagesSelected = 0;
  var selectedImages = [];

  /*** Initialize the AJAX */
  if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
  }

  if(!search_value){
    alert('please provide a text to search for');/*handle it in a good way*/
    clearSearchField();
  }else{
    var requestURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey + '&text=' + search_value + '&safe_search=1&per_page=20&format=json&nojsoncallback=?';
    xmlhttp.open("GET", requestURL, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var actualResponse = JSON.parse(xmlhttp.responseText);
            jsonResponse = actualResponse.photos;
            for (var i = 0; i < jsonResponse.photo.length; i++) {
                var item = jsonResponse.photo[i];
                var src = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";
                document.getElementById("gallery-photo").style.display = 'block';
                document.getElementById("gallery-photo").style.cursor = 'pointer';
                //document.getElementById("pager").style.display = 'block';
                var list = document.createElement("li");
                var img = document.createElement("img");
                img.src = src;
                img.width = '180';
                img.height = '180';
                list.appendChild(img);
                document.getElementById('photolist').appendChild(list);
            }

            var photoListElement = document.getElementById("photolist").getElementsByTagName('li');
            for(var i = 0; i<photoListElement.length; i++){
              var imgElement = photoListElement[i];
              imgElement.onclick = function(object){
                //console.log(object);
                //console.log('chrome check');
                console.log(object.target.src);
                var clickedImage = object.target.src;
                var imgList = document.getElementById("photolist").getElementsByTagName('li');
                for (var j = 0; j < imgList.length; j++) {
                  var imgListSrc = imgList[j].getElementsByTagName('img')[0].src;
                  if(imgListSrc === clickedImage){
                    var selected = imgList[j].classList.contains("selected");
                    if(!selected){
                      imgList[j].setAttribute('class', 'selected');
                      selectedImages.push(clickedImage);
                      imagesSelected++;
                      if(imagesSelected > 0){
                        document.getElementById("detail_button").style.display = 'block'
                      }
                    }else{
                      imgList[j].setAttribute('class', 'notSelected');
                      var index = selectedImages.indexOf(clickedImage);
                      if (index > -1) {
                        selectedImages.splice(index, 1);
                        imagesSelected--;
                      }
                      if(imagesSelected === 0){
                        document.getElementById("detail_button").style.display = 'none';
                      }
                    }
                  }
                  //console.log(selectedImages);
                  //console.log(imagesSelected);
                  var viewGal = document.getElementById("view_gallery");
                  viewGal.onclick = function(){
                    viewGallery(selectedImages);
                  };
                }
              };
            }
        }
    };
    clearSearchField();
    document.getElementById("selectedlist").innerHTML = '';
    document.getElementById("gallery-detail").style.display = 'none';
    document.getElementById("show_button").style.display = 'block';
    document.getElementById("back_button").style.display = 'block';
    document.getElementById("detail").style.display = 'block';
  }
}
