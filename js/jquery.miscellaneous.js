$(document).ready(function() {	

		//table odd/even color
		//$("table.v_list_01").colorize();

		//toTop						
		$(window).scroll(function() {
		if($(this).scrollTop() != 0) {
			$('#toTop').fadeIn();	
		} else {
			$('#toTop').fadeOut();
		}
		});
		
		$('#toTop').click(function() {
		$('body,html').animate({scrollTop:0},700);
		});	
		

	// 判斷連結的內容，並依內容在連結後加上相對應的圖片
	$('.sec .content a[href$=".pdf"]').after('&nbsp;<img src="../images/icon_pdf.png" alt="pdf檔小圖" />');
	$('.sec .content a[href$=".doc"]').after('&nbsp;<img src="../images/icon_word.png" alt="word小圖" />');
	$('.sec .content a[href$=".docx"]').after('&nbsp;<img src="../images/icon_word.png" alt="word小圖" />');
	$('.sec .content a[href$=".xls"]').after('&nbsp;<img src="../images/icon_xls.png" alt="excel小圖" />');
	$('.sec .content a[href$=".xlsx"]').after('&nbsp;<img src="../images/icon_xls.png" alt="excel小圖" />');
	$('.sec .content a[href$=".xlsm"]').after('&nbsp;<img src="../images/icon_xls.png" alt="excel小圖" />');
	$('.sec .content a[href$=".ppt"]').after('&nbsp;<img src="../images/icon_ppt.png" alt="ppt小圖" />');
	$('.sec .content a[href$=".pptx"]').after('&nbsp;<img src="../images/icon_ppt.png" alt="ppt小圖" />');	
	$('.sec .content a[href$=".jsp"]').after('&nbsp;<img src="../images/icon_link.png" alt="連外小圖" />');
	$('.sec .content a[href$=".jpg"]').after('&nbsp;<img src="../images/icon_jpg.png" alt="圖像小圖" />');		
	$('.sec .content a[href$=".zip"]').after('&nbsp;<img src="../images/icon_zip.png" alt="壓縮小圖" />');
 	$('.sec .content a[href$=".7z"]').after('&nbsp;<img src="../images/icon_zip.png" alt="壓縮小圖" />');					

	$(".qa dt").click(function (e) {
			e.stopPropagation();
			$(".qa dd").not($(this).next()).hide();
			$(this).next().toggle();	
		});
	
	$(".qa dd").find(".close").click(function(e){
		e.stopPropagation();
		alert($(this).text());
	});
	
	$(document).click(function(e){	  
	$(".qa dd").hide();
	});
				
});// end doc.ready
  

