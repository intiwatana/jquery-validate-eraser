/*!
 * Support for jQuery Validation Plugin v1.17.0
 * And add silentRemover on keypress, keyup with Validation check
 *
 * created 2017 by HyunByn.jang
 */
(function($){
	$.fn.txtBaliBot = function(validO, opts){
		return this.each(function(){
			var options = $.extend({}, $.fn.txtBaliBot.reg_exp_chr, opts || {});
			var $el = $(this);
			var chrExpStr = "";
			var chrExp, chrNegExp, senExp;
			var UserAgent = navigator.userAgent;
			var isMobile = false;

			if (	(UserAgent.match(/iPhone|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null	)
				|| 	(UserAgent.match(/LG|SAMSUNG|Samsung/) != null	)	){
				isMobile = true;
			}

			for(chk in validO){
				if(chk == 'maxlength'){
					$el.attr(chk, validO[chk]);
				}else if(validO[chk]&& options[chk]) {

					chrExpStr+= options[chk].toString().substring( 2, options[chk].toString().length-2 );

				}else{
					if(validO[chk] && options[chk]){
						chrExpStr += options[chk].toString().substring( 2, options[chk].toString().length-2 );
					}
				}

				//key입력 이후 사용할 벨류
				if(validO[chk] && $.fn.txtBaliBot.reg_exp_sen[chk]){
					senExp = $.fn.txtBaliBot.reg_exp_sen[chk];
				}

			}

			if(chrExpStr){
				chrExp = new RegExp(  "["+chrExpStr+"]", "gm");
				chrNegExp = new RegExp(  "[^"+chrExpStr+"]", "gm");
			}

			// 문자 입력시 한단위씩 밸리데이션하는거 추가.(모바일이 아닐 경우)
			// 모바일에서는 이벤트가 없음.(input으로 하면 가능. 그러나 그경우에는 keyCode가 없음)
			if(!isMobile){
				$el.on('keypress.baliBot',function(e){
					var chrTyped, chrCode=0, evt=e?e:event;
					chrCode = (event.which) ? event.which : event.keyCode;

					// 한글일 경우(아스키코드를 벗어나는 값들) keyup, blur에서 체크
					if(chrCode > 222){return true}

					chrTyped = String.fromCharCode(chrCode);

					if (evt.altKey || evt.ctrlKey ) return true;

					if ( chrTyped.match(chrExp)){
						return true;
					}

					if(evt.preventDefault){
						evt.preventDefault();
					}
					evt.returnValue=false;
					return false;
				});
			}

			// 문자 입력후에 표현식에 맞지 않으면 삭제 하는 로직
			$el.on('change.baliBot keyup.baliBot',function(e){
				//e.preventDefault();
				//e.stopPropagation();
				var lastChr = (e.target.value).slice((e.target.value).length-1);
				var areA = new RegExp(/[\ㆍ\ᆢ]/,"" );
				if(isMobile){
					if(!areA.test(lastChr) ){
						$(e.target).val(e.target.value.replace(chrNegExp, ''));
					}
				}else{
					$(e.target).val(e.target.value.replace(chrNegExp, ''));
				}


			});
			// 모바일의 경우를 위해 분기
			$el.on('blur.baliBot',function(e){
				$(e.target).val(e.target.value.replace(chrNegExp, ''));
			});

			// 문자 입력후에 표현식에 맞지 않으면 삭제 하는 로직
			$el.on('paste.baliBot',function(e){

				var content;
				e.preventDefault();

				if( e.clipboardData ){
					content = e.clipboardData.getData('text/plain');

					if(chrNegExp.test(content)){
						alert(" 적절하지 않은 형식입니다. \n 다시 한번 확인해 주세요.");
						content = "";
						return false;
					}else{
						if(senExp && !senExp.test(content)){
							alert(" 적절하지 않은 형식입니다. \n 다시 한번 확인해 주세요.");
							content = "";
							return false;
						}
						if($(e.target).attr('maxlength') && content.length > $(e.target).attr('maxlength')){
							alert(" 최대길이 ["+$(e.target).attr('maxlength') +"]자를 초과하였습니다.");
							content = "";
							return false;
						}
					}
					document.execCommand('insertText', false, content);
					return;
				}else if( window.clipboardData ){
					content = window.clipboardData.getData('Text');

					if(chrNegExp.test(content)){
						alert(" 적절하지 않은 형식입니다. \n 다시 한번 확인해 주세요.");
						content = "";
						return false;
					}else{
						if(senExp && !senExp.test(content)){
							alert(" 적절하지 않은 형식입니다. \n 다시 한번 확인해 주세요.");
							content = "";
							return false;
						}

						if($(e.target).attr('maxlength') && content.length > $(e.target).attr('maxlength')){
							alert(" 최대길이 ["+$(e.target).attr('maxlength') +"]자를 초과하였습니다.");
							content = "";
							return false;
						}
					}

					if (window.getSelection){
						window.getSelection().getRangeAt(0).insertNode( document.createTextNode(content) );
					}
					return;
				}else if( e.originalEvent.clipboardData ){
					content = e.originalEvent.clipboardData.getData('text/plain');
					if(chrNegExp.test(content)){
						alert(" 적절하지 않은 형식입니다. \n 다시 한번 확인해 주세요.");
						content = "";
						return false;
					}else{

						if(senExp && !senExp.test(content)){
							alert(" 적절하지 않은 형식입니다. \n 다시 한번 확인해 주세요.");
							content = "";
							return false;
						}

						if($(e.target).attr('maxlength') && content.length > $(e.target).attr('maxlength')){
							alert(" 최대길이 ["+$(e.target).attr('maxlength') +"]자를 초과하였습니다.");
							content = "";
							return false;
						}
					}
					document.execCommand('insertText', false, content);
					return;
				}

			});

		});
	};

	$.fn.txtBaliBot.reg_exp_chr = {
				hangul : new RegExp(/[ㄱ-ㅎㅏ-ㅣ가-힣]/,"") ,
				ENGLISH : new RegExp(/[A-Z]/ , ""),
				english : new RegExp(/[a-z]/ , ""),
				digits  : new RegExp(/[\d]/ , ""),
				space   : new RegExp(/[\s]/ , ""),
				special : new RegExp(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/,"" )
	}
	$.fn.txtBaliBot.reg_exp_sen = {
				email		: new RegExp(/^[\w]([-_\.]?[\w])*@[\w]([-_\.]?[\w])*\.[\w]{2,3}$/i,"gm") ,
				appURL		: new RegExp(/^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/,"gmi") ,
				phoneNum_kr	: new RegExp(/^01[\d]{1}[\d]{4}[\d]{4}$/,"g")

	}

})(jQuery);
