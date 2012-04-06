var oDoc, init, format, showSource, saveToFile, slides, slideNo, readfile, slide, createDiv, closeDiv, divNo=0, tekst = 'Tu wpisz swój tekst', divClick, divBlur;
init = function() {
  oDoc = document.getElementById("textBox");
  if (document.formularz.switchMode.checked) { showSource(true); }
}

format = function(sCmd, sValue) {
	document.execCommand(sCmd, false, sValue);
	oDoc.focus();
}
closeDiv = function(obj) {
	$("#" + obj.id).parent().remove();
}
createDiv = function() {
	$("#textBox").append("<div class=\"draggg\" id=\"" + divNo + "p\"><div tabindex=\"0\" id=\"" + divNo + "\" onblur=\"divBlur();\" class=\"tekst\">" + tekst +"</div><div class=\"ui-icon ui-icon-arrow-4 ui-drag\" id=\"handle\"></div><div onclick=\"closeDiv(this);\" class=\"ui-close ui-icon ui-icon-close\" id=\"close\"></div></div>");
	$("#" + divNo).attr('contentEditable',true);
	$("#" + divNo + "p").resizable().draggable({ handle: "#handle" }).removeClass("ui-draggable");
	document.getElementById(divNo).addEventListener('click', divClick, true);
	//document.getElementById(divNo).addEventListener('blur', divBlur ,true);
	divNo++;
}
divClick = function(evt) {
	if($(this).html() === tekst)
	{
		$(this).html('');
		$(this).focus();
	}
	
}

divBlur = function(evt) {
	$(".tekst").each(function () {
		if($(this).text() === "") {
			$(this).text(tekst);
		}
	});
}

showSource = function(bol) {
  var oContent;
  if (bol) {
    oContent = document.createTextNode(oDoc.innerHTML);
    oDoc.innerHTML = "";
    var oPre = document.createElement("pre");
    oDoc.contentEditable = false;
    oPre.id = "src";
    oPre.contentEditable = true;
    oPre.appendChild(oContent);
    oDoc.appendChild(oPre);
  } else {
    if (document.all) {
      oDoc.innerHTML = oDoc.innerText;
    } else {
      oContent = document.createRange();
      oContent.selectNodeContents(oDoc.firstChild);
      oDoc.innerHTML = oContent.toString();
    }
    oDoc.contentEditable = true;
  }
  oDoc.focus();
}
saveToFile = function () {
	var content, i;
	slides[slideNo] = $('#textBox').html();
	content = '<!doctype html><html><head><title>Print<\/title><script type="text\/javascript" src="http:\/\/code.jquery.com\/jquery-1.7.1.min.js"><\/script><script type="text\/javascript" src="http:\/\/github.com\/markdalgleish\/fathom\/raw\/master\/fathom.min.js"><\/script><script type="text\/javascript">$(document).ready(function(){ $(\'#presentation\').fathom(); });<\/script><style type="text\/css">.slide{ -webkit-box-shadow: 0 0 50px #c0c0c0;-moz-box-shadow: 0 0 50px #c0c0c0;box-shadow: 0 0 50px #c0c0c0;-moz-border-radius: 20px;-webkit-border-radius: 20px;border-radius: 20px;-moz-background-clip: padding;-webkit-background-clip: padding-box;background-clip: padding-box;display: inline-block;height: 500px;padding: 20px;position: relative;vertical-align: top;width: 700px;text-align:left;max-height:500px;overflow:hidden;}<\/style><\/head><body><div id="presentation">';
	for(i = 1; i < slides.length; i++)
	{
		content += '<div class="slide">' + slides[i] +'<\/div>';
	}
	content += '<\/div><\/body><\/html>';
	uriContent = "data:application/octet-stream," + encodeURIComponent(content);
	newWindow=window.open(uriContent, 'filename.txt');
	//location.href = uriContent;
}
slides = [];
slideNo = 1;
slide = function (which) {
	if(which=='next') {
		slides[slideNo] = $('#textBox').html();
		$('#textBox').html('');
		$('#textBox').html(slides[++slideNo]);
		$('#slideNumber').html(slideNo);
	}
	if(which=='previous' && slideNo>=2) {
		slides[slideNo] = $('#textBox').html();
		$('#textBox').html(slides[--slideNo]);
		$('#slideNumber').html(slideNo);
		
	}
}
readfile = function (evt) {
	var file = evt.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file);
	reader.onload = function (evt) {
		var i;
		var text = evt.target.result;
		//$('#textBox').html(evt.target.result);
		var pattern = /<div class="slide">(.*?)<\/div>/gim;
		var slicedText = text.match(pattern);
		$('#textBox').html(slicedText[0]);
		slideNo = 1;
		$('#slideNumber').html(slideNo);
		for(i = 1; i <= slicedText.length; i = i + 1)
		{
			slides[i] = slicedText[i - 1];
		}
	}
}
$(document).ready(function() {
	document.getElementById('plik').addEventListener('change', readfile, false);
	
	//createDiv();
});