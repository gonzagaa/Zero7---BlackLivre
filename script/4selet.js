
  
    document.querySelectorAll('a[href^="https://membros.zero7.com.br/fast-checkout/"]').forEach(link => {
        link.classList.add('link4selet');
    });
    
	document.querySelectorAll('a[href^="https://app.zero7.com.br/checkout/"]').forEach(link => {
        link.classList.add('link4selet');
    });

	document.querySelectorAll('a[href^="https://app.4st.com.br/checkout/"]').forEach(link => {
        link.classList.add('link4selet');
    });

	document.querySelectorAll('a[href^="https://app.4selet.com.br/checkout/"]').forEach(link => {
        link.classList.add('link4selet');
    });

    jQuery(document).ready(function($){
    	var sPageURL = window.location.search.substring(1), sURLVariables = sPageURL.split('&');
    	var parametrosGet = sURLVariables.join('&');
		var linkAtribuido = '';
        
        if($(".link4selet").length) {
        	$.each($(".link4selet"), function (i, o) {
				if($(this).prop("tagName") == 'DIV') {
					var link = $(this).find("a").attr("href");
					if(link.toLowerCase().indexOf("origem") >= 0) {
						linkAtribuido = link + '&' + parametrosGet;
					} else {
						linkAtribuido = link + '?' + parametrosGet;
					}
					
					$(this).find('a').attr("href", linkAtribuido);
				} else if($(this).prop("tagName") == 'A') {
					var link = $(this).attr("href");
					if(link.toLowerCase().indexOf("origem") >= 0) {
						linkAtribuido = link + '&' + parametrosGet;
					} else {
						linkAtribuido = link + '?' + parametrosGet;
					}
					$(this).attr("href", linkAtribuido);
				}
	        });
        }
 	});
